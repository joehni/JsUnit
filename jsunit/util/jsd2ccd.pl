#! /bin/perl
#
# jsd2ccd.pl
#
# usage:
#   perl jsd2ccd.pl <in>.js '>'<out>
# 
# Translate js.doc to cc.doc.
#
# Author: Achim Kraus
# Date  : 2000-09-03       version 1.0
#
# Date  : 2000-15-03       version 1.1
#            Add changes for attributes and return types
# 
# Date  : 2000-23-03       version 1.2
#            Add <!-- #include file=<name> --> conversion
#
# Date  : 2000-05-04       version 1.3
#            Add @@var tag
#
# Date  : 2000-05-05       version 1.4
#            Add @@struct tag
#
# This program scan a javascript source file
# for special the metatag "@@" within a 
# document-comment. Finding such metatag,
# it starts copying the document-comment 
# until it ends.
# 
# Depending on the kind of the tag,
# it continues to analyses on of the following
# expression
#
#    'function' <name> '(' <parameter_list> ')'
#
# (for @@function, @@class, @@struct and @@method)
#
#    'this' '.' <name> '='
#
# (for @@attrib)
#
#    'var' <name> ('=' <value>)? ';'
#
# (for @@var)
#
# and translate it to the corresponding C++ stuff.
# Also the "<!-- #include file =<name>-->" 
# expression is converted to "#include \"<name>\"".
#
# Valid metatags are:
#
# @@file
# @@function [return-type]
# @@class
# @@struct
# @@ctor
# @@method [return-type]
# @@attrib type
# @@var type
#
# They are translated as following:
#
# 1. @@file
# Copy the document-comment to the output translating
# the tag "@@file" to "\file".
#
# 2. @@function [return-type] 
# Makes
#
# <return-type> <name> ( <parameter_list> );
#
# if the <return-type> is omitted, "void" is used as
# default.
#
# 3. @@class 
# Makes
#
# class <name>
# {
# public:
#   ...
# }
#
# 4. @@struct
# Makes
#
# struct <name>
# {
# public:
#   ...
# }
#
# Such structs are treated as a class, which
# means, that they can have attributes, methodes 
# etc.
# 
# 5. @@ctor
# if you use "@@ctor" within a document-comment of 
# a @@class, the following document-comment will be 
# used for building a c++-constructor like.
#
# <name> ( <parameter_list> )
# 
# While scanning a clas, the following expression
# will be interpreted for super-class recognition 
#
# 'this' '.' '_super' '=' <name> ';'
#
# For such classes, which inherit form other classes,
# the declaration is expanded to
#
# class <name> : public <superclass> (, public <superclass >)*
# {
# public:
#
# };
#
# 6. @@method [return-type] 
# Makes
#
# <return-type> <name> ( <parameter_list> );
#
# but only within the scope of a class.
# if the <return-type> is omitted, "void" is used as
# default.
#
# 7. @@attrib type 
# Makes
#
# <type> <name>;
#
# but also only within the scope of a class.
#
# 8. @@var type 
# Makes
#
# <type> <name>;
#
# or 
#
# <type> <name> = <value>;
# 
# if the value is spezified.
# This also ends a class declaration like @@func or @@file
#

# general scanner modes
@mode_names=("IN_CODE", "IN_COMMENT", "IN_DOC_COMMENT", 
			 "IN_LINE_COMMENT", "IN_STRING" );

$IN_CODE=0;
$IN_COMMENT=1;
$IN_DOC_COMMENT=2;
$IN_LINE_COMMENT=3;
$IN_STRING=4;

$mode=$IN_CODE;
$string_mode="";
$string_len=0;
$string_start=-1;

# current context
# context modes
@context_mode_names=("CM_READY", "CM_IN", "CM_SEARCH_FUNCTION", "CM_SEARCH_ATTRIB", "CM_SEARCH_VAR");

$CM_READY=0;
$CM_IN=1;
$CM_SEARCH_FUNCTION=2;
$CM_SEARCH_ATTRIB=3;
$CM_SEARCH_VAR=4;

$context = { MODE => $CM_READY,
			 TYPE => "",             # "file", "class", "method", "attrib", 
			                         # "var", or "function"
			 NAME => "",             # the name of the java-script function
			 PARAM => "",            # the parameterlist of the java-script function 
			                         # or initial value of variables and attributes.
			 DATA_TYPE => "",        # the return type of the java-script function or 
			                         # method. Type of the attribute or variable.
			 IN_CLASS => 0,          # 0 := outer scope; 1 := class scope
			 CLASS_NAME => "",       # the name of the class 
			 CTOR => 0,              # build a c++ constructor
			 CLASS_BODY => [],       # the stuff within the current class
			 SUPER_CLASSES => []     # the list of super-classes
		   };

# print out a error message, the status and exit the program.
sub parserErrorOut
  {
	my ($loc, $mes)=@_;
	my (@stack)=caller;
	print STDERR ("#### $ARGV at line $. ########\n");
	print STDERR ("@stack[1],@stack[2] [$loc] $mes");
	printf STDERR ("In Mode     : %d=>%s\n", $mode, $mode_names[$mode]);
	printf STDERR ("String Mode : %s\n", $string_mode);
	if ($mode == $IN_STRING)
	  {
		printf STDERR ("String Len=%d starting at line %d\n", 
					   $string_len, $string_start);
	  }
	printf STDERR ("Cont. Mode  : %d=>%s\n", $$context{MODE}, 
				   $context_mode_names[$$context{MODE}]);
	printf STDERR ("IN_CLASS    : %s\n", $$context{IN_CLASS});
	printf STDERR ("TYPE        : %s\n", $$context{TYPE});
	printf STDERR ("NAME        : %s\n", $$context{NAME});
	printf STDERR ("PARAM       : %s\n", $$context{PARAM});
	printf STDERR ("DATA_TYPE   : %s\n", $$context{DATA_TYPE});
	printf STDERR ("IN_CLASS    : %s\n", $$context{IN_CLASS});
	printf STDERR ("CLASS_NAME  : %s\n", $$context{CLASS_NAME});
	printf STDERR ("CTOR        : %s\n", $$context{CTOR});

	if ($$context{IN_CLASS})
	  {
		my ($super_classes)=$$context{SUPER_CLASSES};
		if (@$super_classes)
		  {
			print STDERR "Super Classes :";
			my ($sc);
			foreach $sc (@$super_classes)
			  {
				print STDERR "$sc, ";
			  }
			print STDERR "\n";			
		  }
		my ($class_body)=$$context{CLASS_BODY};
		if (@$class_body)
		  {
			print STDERR "Class body:";
			my ($cb);
			foreach $cb (@$class_body)
			  {
				print STDERR "$cb, ";
			  }
			print STDERR "\n";			
		  }
	  }

	exit(1);
  }

# print the generated stuff either directly to stdout
# or to the CLASS_BODY buffer depending on $out_mode.
# 0 : stdout
# 1 : CLASS_BODY buffer
# usage:
#
#   out ( mes [,mode]);
# 
# out("class") print "class" corresponding to $out_mode
#
# out("class", 0) print "class" to stdout (0 overrides $out_mode)
 
$out_mode=0;	
sub out 
{
  my ($mes, $x)=(@_, $out_mode);
  
  if ($x)
	{
	  push (@{$$context{"CLASS_BODY"}}, $mes);			  
	}
  else
	{
	  print $mes;
	}
}

# print the CLASS_BODY buffer via out, after setting 
# $out_mode to 0
# Add superclass list, class-start "{\npublic:" and
# class-end "};" 
sub flushClassBody
  {
	if ($$context{IN_CLASS})
	  {
		if (!$out_mode)
		{
		  parserErrorOut(0, "parser corrupted 1 \"flushClassBody\"!\n");		
		}
		$out_mode=0;
		my ($super_classes)=$$context{SUPER_CLASSES};
		if (@$super_classes)
		  {
			my ($sc)=shift @$super_classes;
			out (" : public $sc");

			foreach $sc (@$super_classes)
			  {
				out (", public $sc");
			  }
		  }

		out ("\n{\npublic:\n");
		my ($class_body)=$$context{CLASS_BODY};
		if (@$class_body)
		  {
			my ($cb);
			foreach $cb (@$class_body)
			  {
				out ($cb);
			  }
		  }
		out ("};\n\n");
		if ($out_mode)
		{
		  parserErrorOut(1, "parser corrupted 2 \"flushClassBody\"!\n");		
		}
	  }
	else
	  {
		parserErrorOut(2, "parser corrupted 3 \"flushClassBody\"!\n");		
	  }
  }

# prepares the context for new metatag
# flushClassBody, if class has ended.
sub resetContext 
  {
	my ($type)=@_;

	if ($$context{MODE}==$CM_READY)
	  {
		if (($type eq "class") || ($type eq "struct") 
			|| ($type eq "function") || ($type eq "file") 
			|| ($type eq "var"))
		  {
			if ($$context{IN_CLASS})
			  {
				flushClassBody;
			  }
			$$context{IN_CLASS}=($type eq "class")||($type eq "struct");
			$$context{CLASS_NAME}="";
			$$context{CLASS_BODY}=[];
			$$context{SUPER_CLASSES}=[];
		  }
		elsif (($type eq "method") || ($type eq "attrib"))
		  {
			if (!$$context{IN_CLASS})	
			  {
				my($spec)=($type eq "method")?"Methods":"Attributes";
				parserErrorOut (4, "$spec are only allowed within classes!\n");
			  }
		  }

		$$context{TYPE}=$type;
		$$context{NAME}="";
		$$context{PARAM}="";
		$$context{DATA_TYPE}="";

		$$context{MODE}=$CM_IN;
		$$context{CTOR}=0;
	  }
	else
	  {
		parserErrorOut (5, "not ready!\n");
	  }
  }
 
# scanner 
$cur_line="";
# recognized tokens
@token_patterns=
  (
    quotemeta("/**"),
    quotemeta("*/"),
    quotemeta("/*"),
    quotemeta("//"),
    "@@",
    "\\d+",
    "[_a-zA-Z]\\w+",
    "\\s+",
    "\\\\.",
    "<!--",
    "-->",
    ".",
  );

$newline_pattern="[\\n\\r\\f]";

# handle $mode properly
# recognize comments and strings
sub switchMode
  {
	my ($token)=@_;

	if ($token ne "")
	  {
# recognize the mode endings
		if (($mode == $IN_COMMENT) || ($mode == $IN_DOC_COMMENT))
		  {
			$mode=$IN_CODE if ($token eq "*/");
		  }
		elsif ($mode == $IN_LINE_COMMENT)
		  {
			$mode=$IN_CODE if ($token=~/[\n\r]/);
		  }
		elsif ($mode == $IN_STRING) 
		  {
			if ($token eq $string_mode)
			  {
#				print STDERR ("String end $in_string\n");
				if (($string_len>2048) || (($.-$string_start)>10))
				  {
					print STDERR ("***** $ARGV starting at line $string_start ********\n");

					printf STDERR ("Very long string with %d bytes, spanning %d lines!\n", 
								   $string_len, $.-$string_start);
				  }
				$string_mode="";
				$string_start=-1;
				$string_len=0;
				$mode=$IN_CODE;
			  }
			else
			  {
#				print STDERR ("in String '$token'\n");
				$string_len += length $token;
			  }
		  }
# recognize the mode startings
		elsif ($token eq "/*")
		  {
			$mode=$IN_COMMENT;
		  }
		elsif ($token eq "/**")
		  {
			$mode=$IN_DOC_COMMENT;
		  }
		elsif ($token eq "//")
		  {
			$mode=$IN_LINE_COMMENT;
		  }
		elsif ($token=~/[\'\"]/)
		  {
			$mode=$IN_STRING;
			$string_mode = $&;
			$string_len = 0;
			$string_start = $.;
#			print STDERR ("String start $in_string\n");
		  }
	  }
  }

# get next Token according to the @token_patterns array. 
# Reads next line, if current line is completed.
sub nextToken
  {
	my ($token);
	my ($token_pattern);

	if ($cur_line eq "") 
	  {
		$cur_line=<>;
	  }
	
	if ($cur_line ne "")
	  {
		foreach $token_pattern (@token_patterns)
		  {
			if ($cur_line=~s/^$token_pattern//)
			  {
				$token=$&;
#	   		    printf ("Found: %s (%s)\n", $token, $token_pattern);
				last;
			  }
		  }
	  } 
 
	switchMode($token);

	$token;
  }

# get next Token according to the @token_patterns array,
# which is not white-space.
# Reads next line, if current line is completed.
sub nextNoneWsToken
  {
	my ($token)=nextToken;
	while ($token=~/\s+/) 
	  {
		$token=nextToken;
	  }

	$token;
  }

# get next Token according to the @token_patterns array,
# which is not space or tab.
sub nextNoneSpaceToken
  {
	my ($token)=nextToken;
	while ($token=~/[ \t]+/) 
	  {
		$token=nextToken;
	  }

	$token;
  }

# get next Token according to the @token_patterns array,
# which is not space or tab.
sub skipToEOL
  {
	my ($token)=nextToken;
	while ($token!~/$newline_pattern/o) 
	  {
		$token=nextToken;
	  }
  }

# parse java-script function expression.
# store result in context (NAME and PARAM). 
sub scanFunction 
  {
	my ($param)="(";
	my ($token)=nextNoneWsToken;

	if ($token!~/\w+/)
	  {
		parserErrorOut (6, "'\w+' expected, not '$token'!\n");
	  }
	$$context{NAME}=$token;
	$token=nextNoneWsToken;
	if ($token ne "(")
	  {
		parserErrorOut (7, "'(' expected, not '$token'!\n");
	  }
	$token=nextNoneWsToken;
	if ($token ne ")")
	  {
		while ($token=~/\w+/)
		  {
			$param .= $token;
			$token=nextNoneWsToken;
			if ($token eq ",")
			  {
				$param .= ", ";
				$token=nextNoneWsToken;
			  }
		  }
	  }

	if ($token ne ")")
	  {
		$$context{PARAM}=$param;
		parserErrorOut (8, "')' expected, not '$token'!\n");
	  }

	$param .= ")";
	$$context{PARAM}=$param;
  }

# get attribute, function or method return type
# store result in context (RET_TYPE). 
sub scanType
  {
	my ($data_type)=@_;
	my ($token)=nextNoneSpaceToken;
	if ($token=~/\w+/)
	  {
		$data_type=$token;
	  }
   
	while ($token!~/$newline_pattern/o)
	  {
		$token=nextToken;
	  }

  	$$context{DATA_TYPE}=$data_type;
	$data_type;
  }

# parse java-script attribute expression.
# store result in context (NAME).
sub scanAttribute 
  {
	my ($token)=nextNoneWsToken;

	if ($token ne ".")
	  {
		parserErrorOut (9, "'.' expected, not '$token'!\n");
	  }
	$token=nextNoneWsToken;
	if ($token!~/\w+/)
	  {
		parserErrorOut (10, "'\w+' expected, not '$token'!\n");
	  }
	$$context{NAME}=$token;
	$token=nextNoneWsToken;
	if ($token ne "=")
	  {
		parserErrorOut (11, "'=' expected, not '$token'!\n");
	  }
  }

# parse java-script var expression.
# stor result in context (NAME).
sub scanVar 
  {
	my ($token)=nextNoneWsToken;
    my ($value);

	if ($token!~/\w+/)
	  {
		parserErrorOut (12, "'\w+' expected, not '$token'!\n");
	  }
	$$context{NAME}=$token;
	$token=nextNoneWsToken;
	if ($token eq "=")
	  {
		while ($token ne "")
		  {
			$token=nextToken;
			last if (($mode==$IN_CODE)&&($token eq ";"));
			$value .= $token;
		  }

		$$context{PARAM}=$value;
	  }

	if ($token ne ";") 
	  {
		parserErrorOut (13, "';' expected, not '$token'!\n");
	  }
  }

# main parse loop
# read token as long as there tokens left.
while (($token=nextToken) ne "")
  {
	if (($token eq "@@") && ($mode == $IN_DOC_COMMENT))
	  {
		# test for special metatag
		$token=nextToken;
		if ($token eq "class")
		  {
			resetContext("class");
			out("/**");
		  }
		elsif ($token eq "struct")
		  {
			resetContext("struct");
			out("/**");
		  }
		elsif ($token eq "method")
		  {
			resetContext("method");			
			scanType("void");
			out("\t/**\n");
		  }
		elsif ($token eq "attrib")
		  {
			resetContext("attrib");
			scanType;
			out("\t/**\n");
		  }
		elsif ($token eq "var")
		  {
			resetContext("var");
			scanType;
			out("/**\n");
		  }
		elsif ($token eq "function")
		  {
			resetContext("function");
			scanType("void");
			out("/**\n");
		  }
		elsif ($token eq "ctor")
		  {
			out("\n */\n");
			$$context{CTOR}=1;
			$out_mode=1;
			out("/**");			
		  }
		elsif ($token eq "file")
		  {
			resetContext("file");
			skipToEOL;
			out("/**\n * \\file\n"); 
		  }
		else
		  {
			parserErrorOut(14, "\@\@$token is not valid!\n");
		  }
		$token=nextToken;
	  }

	if ($$context{MODE}==$CM_IN)
	  {
		# copy document-comment to out.
		out($token);

		if ($token eq "*/")
		  {
			# if end of document-comment is reached, 
			# search for function if not in "file"-comment
			
			if ($$context{TYPE} eq "file")
			  {
				$$context{MODE}=$CM_READY;
			  }
			elsif ($$context{TYPE} eq "attrib")
			  {
				$$context{MODE}=$CM_SEARCH_ATTRIB;
			  }
			elsif ($$context{TYPE} eq "var")
			  {
				$$context{MODE}=$CM_SEARCH_VAR;
			  }
			else
			  {
				$$context{MODE}=$CM_SEARCH_FUNCTION;
			  }
			out("\n");
		  }
		# assertion
		if (!(($token eq "*/") xor ($mode==$IN_DOC_COMMENT)))
		  {
			parserErrorOut(15, "parser corrupted 1 ($token)!\n");
		  }
	  }
	elsif ($$context{MODE}==$CM_SEARCH_FUNCTION)
	  {
		if (($token eq "function") && ($mode==$IN_CODE))
		  {
			# if keyword "function" is found, try to 
			# get the name and parameterlist.
			scanFunction;
			$$context{MODE}=$CM_READY;
			if (($$context{TYPE} eq "class")||($$context{TYPE} eq "struct"))
			  {
				# force to out of class-body!
				out (sprintf("%s %s", $$context{TYPE}, $$context{NAME}), 0);
				# switch to class-body
				$out_mode=1;

				if ($$context{CTOR})
				  {
					out (sprintf ("\t%s %s;\n\n", $$context{NAME}, 
							$$context{PARAM}));  
				  }
				$$context{CLASS_NAME}=$$context{NAME};
			  }
			elsif ($$context{TYPE} eq "function")
			  {
				out (sprintf ("%s %s %s;\n\n", $$context{DATA_TYPE}, $$context{NAME}, 
						$$context{PARAM}));  
			  }
			elsif ($$context{TYPE} eq "method")
			  {
				out (sprintf ("\t%s %s %s;\n\n", $$context{DATA_TYPE}, $$context{NAME}, 
						$$context{PARAM}));  
			  }
		  }
	  }
	elsif ($$context{MODE}==$CM_SEARCH_ATTRIB)
	  {
		if (($token eq "this") && ($mode==$IN_CODE))
		  {
			# if keyword "this" is found, try to 
			# get the name.
			scanAttribute;
			$$context{MODE}=$CM_READY;

			if ($$context{TYPE} eq "attrib")
			  {
				out (sprintf ("\t%s %s;\n\n", $$context{DATA_TYPE}, $$context{NAME} ));  
			  }
		  }
	  }
	elsif ($$context{MODE}==$CM_SEARCH_VAR)
	  {
		if (($token eq "var") && ($mode==$IN_CODE))
		  {
			# if keyword "var" is found, try to 
			# get the name.
			scanVar;
			$$context{MODE}=$CM_READY;

			if ($$context{TYPE} eq "var")
			  {
				out (sprintf ("%s %s", $$context{DATA_TYPE}, $$context{NAME} ));
				if ($$context{PARAM} ne "")
				  {
					out (sprintf (" = %s", $$context{PARAM} ));
				  }
				out (";\n\n");
			  }
		  }
	  }
	else
	  {
		if ($mode==$IN_CODE)
		  {
			if ($$context{IN_CLASS}&&($token eq "this"))
			  {
				# test for super-class 
				$token=nextNoneWsToken;
				next if ($token ne ".");
				
				$token=nextNoneWsToken;
				next if ($token ne "_super");
				
				$token=nextNoneWsToken;
				next if ($token ne "=");
				
				my ($super_class)=nextNoneWsToken;
				next if ($super_class!~/\w+/);
				
				$token=nextNoneWsToken;
				next if ($token ne ";");
				
				my ($name)=$$context{CLASS_NAME};
				# print STDERR "Found superclass $super_class of $name (Line $.)\n";
				push (@{$$context{SUPER_CLASSES}}, $super_class);
			  }
			elsif ($token eq "<!--")
			  {
				# test for include 
				$token=nextNoneWsToken;
				next if ($token ne "#");

				$token=nextNoneWsToken;
				next if ($token ne "include");

				$token=nextNoneWsToken;
				next if ($token ne "file");

				$token=nextNoneWsToken;
				next if ($token ne "=");

				$token=nextNoneWsToken;
				my ($name)="";
				my ($is_string)="\\s";

				if (($token eq '"') || ($token eq "'"))
				  {
					$is_string=$token;
					$token=nextToken;
				  }

				while ($token) 
				  {
					$name .= $token;
					$token=nextToken;
					last if (($mode==$IN_CODE) && ($token eq "-->"));	
				  }

				$name=~s/$is_string\s*$//;
#				print STDERR ("#include \"$name\"\n") if (length $name < 1024);
				out( "#include \"$name\"\n");
			  }
		  }
	  }
  }

resetContext("class");
