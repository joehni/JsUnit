#!/bin/perl

use strict;

use vars qw( $VERSION );
$VERSION = "2.0";

############ Options ####################

use vars qw( $DEB_NONE $DEB_PARSER $DEB_SCANNER $DEB_DATABASE );
$DEB_NONE = 0;
$DEB_DATABASE = 1;
$DEB_PARSER = 2;
$DEB_SCANNER = 4;

use Getopt::Long;
use Pod::Usage;
my ( $opt_usage, $opt_help, $opt_version, $opt_debug );
$opt_debug = 0;
GetOptions(
	'questionmark|?' => \$opt_usage,
	'debug:i' => \$opt_debug,
	'help' => \$opt_help,
	'version' => \$opt_version );
Getopt::Long::Configure( "bundling", "no_ignore_case", "no_permute" );

print "Version: ", $VERSION, "\n" and exit( 0 ) if $opt_version;
pod2usage( -exitval => 0, -verbose => 2 ) if $opt_help;
pod2usage( 1 ) if( $opt_usage or ( $#ARGV < 0 && -t ));


############ Error functions ############

sub syntax_err
{
	print STDERR "Line ", $., ": Syntax: ", @_, "\n";
	exit( 3 );
}

sub warning
{
	print STDERR "Line ", $., ": Warning: ", @_, "\n";
}


############ Scanner ####################

use vars qw( @scan_mode_names $scan_mode $string_type );
use vars qw( $S_CODE $S_COMMENT $S_DOC_COMMENT $S_LINE_COMMENT $S_STRING );
# general scanner modes
@scan_mode_names = qw( CODE COMMENT DOC_COMMENT LINE_COMMENT STRING );
$S_CODE = 0;
$S_COMMENT = 1;
$S_DOC_COMMENT = 2;
$S_LINE_COMMENT = 3;
$S_STRING = 4;
$scan_mode = $S_CODE;
$string_type = "";

use vars qw( $identifier $prototype $interface );
$identifier = "[a-zA-Z_]\\w*";

use vars qw( $cur_line @token_patterns $newline_pattern );
# lexer 
$cur_line = "";
# recognized tokens
@token_patterns =
(
    quotemeta("/**"),
    quotemeta("/*!"),
    quotemeta("*/"),
    quotemeta("/*"),
    quotemeta("//"),
    "@@",
    "(?:0[xX])?\\d+",
    $identifier,
    "\\s+",
    "\\\\.",
    ".",
);
$newline_pattern = "[\\n\\r\\f]";

use subs qw( switch_scan_mode );

# get next Token according to the @token_patterns array. 
# Reads next line, if current line is completed.
sub next_token
{
	my ( $token, $token_pattern, $pattern );

	$cur_line = <> if $cur_line eq "";
	
	if( $cur_line ne "" )
	{
		foreach $token_pattern ( @token_patterns )
		{
			if( $cur_line =~ s/^($token_pattern)// )
			{
				$token = $1;
				$pattern = $token_pattern;
				last;
			}
		}
	}
	
	switch_scan_mode $token;
	$_ = $token, s/\n/\\n/go, s/\r//go, printf STDERR ( "Scanner: '%s' ~ '%s' %s\n", $_, $pattern, $scan_mode_names[$scan_mode] )
		if $opt_debug & $DEB_SCANNER;

	$token;
}

# get next Token according to the @token_patterns array,
# which is not white-space.
# Reads next line, if current line is completed.
sub next_none_ws_token
{
	my $token = next_token;
	while( $token =~ /\s+/ ) 
	{
		$token = next_token;
	}

	$token;
}
 
# handle $scan_mode properly
# recognize comments and strings
sub switch_scan_mode
{
	my $token = shift;

	if( $token ne "" )
	{
		# recognize the mode endings
		if(( $scan_mode == $S_COMMENT ) || ( $scan_mode == $S_DOC_COMMENT ))
		{
			$scan_mode = $S_CODE if $token eq "*/";
		}
		elsif( $scan_mode == $S_LINE_COMMENT )
		{
			$scan_mode = $S_CODE if $token =~ /[\n\r]/;
		}
		elsif( $scan_mode == $S_STRING ) 
		{
			syntax_err "Unterminated string literal." if $token =~ /[\n\r]/;
			if( $token eq $string_type )
			{
				$string_type = "";
				$scan_mode = $S_CODE;
			}
		}
		# recognize the mode startings
		elsif( $token eq "/*" )
		{
			$scan_mode = $S_COMMENT;
		}
		elsif( $token eq "/**" or $token eq "/*!" )
		{
			$scan_mode = $S_DOC_COMMENT;
		}
		elsif( $token eq "//" )
		{
			$scan_mode = $S_LINE_COMMENT;
		}
		elsif( $token =~ /[\'\"]/ )
		{
			$scan_mode = $S_STRING;
			$string_type = $&;
		}
	}
}


############ Parser #####################

use vars qw( $last_token $last_document );
$last_token = "";
$last_document = "";

use vars qw( 
	$OT_FILE 
	$OT_FUNCTION 
	$OT_CLASS 
	$OT_INTERFACE 
	$OT_MEMBERFUNC 
	$OT_MEMBERVAR 
);
$OT_FILE = 0;
$OT_FUNCTION = 1;
$OT_CLASS = 2;
$OT_INTERFACE = 3;
$OT_MEMBERFUNC = 4;
$OT_MEMBERVAR = 5;

use subs qw( parse next_parser_token );

sub parse_string
{
	my $token = shift;
	$token .= next_token while $scan_mode == $S_STRING;
	$token;
}

sub parse_comment
{
	my $token;
	$token = next_token 
		while $scan_mode == $S_COMMENT or $scan_mode == $S_LINE_COMMENT;
	$token;
}

sub parse_doc_comment
{
	my $token;
	my $doc;
	while( $token ne "@@" )
	{
		$token = next_token;
		last if $scan_mode != $S_DOC_COMMENT;
		$doc .= $token;
	}

	$last_token = "@@" if $token eq "@@";
	$doc;
}

sub parse_code
{
	my $token; 
	while(( $token = $last_token ? $last_token : next_none_ws_token ) ne "" )
	{
		$last_token = "";

		syntax_err "Unexpected documentation comment." 
			if $scan_mode == $S_DOC_COMMENT;

		parse_comment, next
			if $scan_mode == $S_COMMENT or $scan_mode == $S_LINE_COMMENT;

		last;
	}
	printf STDERR ( "Parser: '%s' %s\n", $token, $scan_mode_names[$scan_mode] ) if $opt_debug & $DEB_PARSER;
	$token;
}

sub next_parser_token
{
	my $token;
	my $struct = "";

	while(( $token = $last_token ? $last_token : next_none_ws_token ) ne "" )
	{
		$last_token = "";

		parse_comment, next
			if $scan_mode == $S_COMMENT or $scan_mode == $S_LINE_COMMENT;

		if( $scan_mode == $S_CODE )
		{
			if( $token =~ /(?:$identifier)/ )
			{
				my $debug = $opt_debug;
				$opt_debug &= ~$DEB_PARSER;
				
				$struct .= $token;
				while(( $token = parse_code ) eq "." )
				{
					$struct .= $token;
					$token = parse_code;
					syntax_err "Identifier expected" 
						if $token !~ /(?:$identifier)/;
					$struct .= $token;
				}
				$last_token = $token if not $last_token;
				$token = $struct;

				$opt_debug = $debug;
			}
			last;
		}
		elsif( $scan_mode == $S_STRING )
		{
			$token = parse_string $token;
			last;
		}
		elsif( $scan_mode == $S_DOC_COMMENT )
		{
			$token = next_none_ws_token, last if $token eq "@@";
		}
	}
	printf STDERR ( "Parser: '%s' %s\n", $token, $scan_mode_names[$scan_mode] ) if $opt_debug & $DEB_PARSER;
	$token;
}

sub parse_doc_file
{
	my $context = shift;
	my $doc = parse_doc_comment;

	if( $$context->{otype} != $OT_FILE )
	{
		warning "File comment in wrong context.";
		return;
	}

	$$context->{comment} = $doc;
}

sub parse_function
{
	my $context = shift;
	
	my $name;
	my $token = parse_code;
	if( $token ne "(" )
	{
		syntax_err "Function name expected." if( $token !~ /$identifier/ );
		$name = $token;
		$token = parse_code;
	}
	else
	{
		$$context->{anonymous} = 0 if not exists $$context->{anonymous};
		$name = "?".($$context->{anonymous}++);
	}

	$$context->{objs}{$name} = 
	{ 
		name => $name,
		otype => $OT_FUNCTION, 
		scope => $$context 
	};
	my $fnContext = $$context->{objs}{$name};

	syntax_err "'(' expected." if( $token ne "(" );
	$fnContext->{args} = [];
	while(( $token = parse_code ) ne ")" )
	{
		next if $token eq ",";
		syntax_err "Function parameter name expected." 
			if $token !~ /$identifier/;
		push @{$fnContext->{args}}, { name => $token };
	}

	syntax_err "'{' expected." if(( $token = parse_code ) ne "{" );
	$last_token = $token;
	parse \$fnContext;

	$name;
}

sub create_base
{
	my $context = shift;
	my $base = shift;

	my $scope = $context;
	while( defined $$scope && not exists $$scope->{objs}{$base} )
	{
		$context = $scope;
		$scope = \$$scope->{scope};
	}	
	if( not defined $$scope )
	{
		$$context->{objs}{$base} = 
		{ 
			name => $base,
			otype => $OT_CLASS, 
			scope => $$context,
		};
		$scope = $context;
	}
	return $scope;
}

sub parse_prototype
{
	my $context = shift;
	my $token;
	my $name;
	my $member;
	
	$_ = shift;
		/^($identifier)\.prototype\.($identifier)$/
	||	/^($identifier)\.prototype$/
	||  do 
		{
			warning "prototype definition '".$_."' not supported.";
			while(( $token = parse_code ) ne ";" ) {}
			return;
		};
	
	$name = $1;
	$member = $2;
	
	syntax_err "Syntax error in prototype definition." if parse_code ne "=";
	syntax_err "Prototype assignment, but no constructor of $name."
		if not exists $$context->{objs}{$name};
	my $fnContext = $$context->{objs}{$name};
	$fnContext->{otype} = $OT_CLASS if $fnContext->{otype} == $OT_FUNCTION;
	syntax_err "Prototype assignment to invalid type."
		if    $fnContext->{otype} != $OT_CLASS 
		   && $fnContext->{otype} != $OT_INTERFACE;
			
	if( $member eq "" )
	{
		syntax_err "'new' expected." if parse_code ne "new";
		syntax_err "Identifier expected." if parse_code !~ /($identifier)/;
		my $base = $1;
		while(( $token = parse_code ) =~ /[()]/ ) {}
		syntax_err "';' expected." if $token ne ";";
		
		my $scope = create_base $context, $base;
		$fnContext->{base} = $$scope->{objs}{$base};
	}
	else
	{
		if(( $token = parse_code ) =~ /$identifier/ )
		{
			my $end = 1;
			if( $token eq "function" )
			{
				$token = parse_function $context;
				$end = 0;
			}
			my $scope = $context;
			$scope = \$$scope->{scope} 
				while defined $$scope && not exists $$scope->{objs}{$token};
			if( not defined $$scope )
			{
				warning $token, " is not defined.";
			}
			else
			{
				$scope = $$context->{objs}{$token};
				$scope->{otype} = $OT_MEMBERFUNC 
					if $scope->{otype} == $OT_FUNCTION;
				syntax_err $token, " is not a member." 
					if    $scope->{otype} != $OT_MEMBERFUNC 
					   && $scope->{otype} != $OT_MEMBERVAR;
				$fnContext->{members}{$member} = $scope;
				syntax_err "';' expected." if $end && parse_code ne ";";
			}
		}
		else
		{
			syntax_err "'".$member."' already defined."
				if exists $fnContext->{members}{$member};
			$fnContext->{members}{$member} = { otype => $OT_MEMBERVAR };
			while(( $token = parse_code ) ne ";" ) {}
		}
	}
}

sub parse_interface
{
	my $context = shift;
	my $token;

	$_ = shift;
	  	/^($identifier)\.fulfills$/
	||  do
		{
			warning "interface definition '".$_."' not supported.";
			while(( $token = parse_code ) ne ";" ) {}
			return;
		};
	
	my $name = $1;
	
	if(( $token = parse_code ) ne "(" )
	{
		warning "'(' expected.";
		return;
	}
	if( not exists $$context->{objs}{$name} )
	{
		warning "Prototype fulfillment, but no constructor of $name.";
		return;
	}
	my $fnContext = $$context->{objs}{$name};
	$fnContext->{fulfills} = {};
	while(( $token = parse_code ) ne ")" )
	{
		next if $token eq ",";
		if( $token !~ /(?:$identifier)/ or $token =~ /(?:new|delete)/ )
		{
			warning "Interface name expected.";
			return;
		}
		
		my $scope = create_base $context, $token;
		$scope = $$scope->{objs}{$token};
		$scope->{otype} = $OT_INTERFACE if $scope->{otype} == $OT_CLASS;
		syntax_err $token, " is not a class." 
			if $scope->{otype} != $OT_INTERFACE;
		
		$fnContext->{fulfills}{$token} = $scope;
	}
}

sub parse
{
	my $context = shift;
	my $level = 0;
	my $token;

	PARSE: while(( $token = next_parser_token ) ne "" )
	{
		if( $scan_mode == $S_CODE )
		{
			for( $token )
			{
				/(?:})/				&& --$level == 0 && last PARSE;
				/(?:{)/				&& ++$level;
				/(?:function)/		&& parse_function $context;
				/(?:.+\.prototype)/	&& parse_prototype $context, $token;
				/(?:.+\.fulfills)/	&& parse_interface $context, $token;
			}
		}
		elsif( $scan_mode == $S_DOC_COMMENT )
		{
			for( $token )
			{
				/(?:file)/			&& parse_doc_file $context;
			}
		}
	}

	syntax_err "Unbalanced '}' found." if $level < 0;
	syntax_err "EOF found. '}' expected." if $level > 0;
}


############ Debug #######################

sub dump_context
{
	my $context = shift;
	my $prefix = shift;

	if( ref $context eq "HASH" )
	{
		foreach my $key ( keys %$context )
		{
			my $value = $context->{$key};
			$value =~ s/\n/\\n/go;
			$value =~ s/\r//go;
			print $prefix, $key, ": ", $value, "\n";
			next if $key =~ /(?:scope|base)/;
			for( ref $value )
			{
				/HASH/ 	&& dump_context( $value, $prefix.$key."." );
				/ARRAY/ && dump_context( $value, $prefix.$key );
			}
		}
	}
	elsif( ref $context eq "ARRAY" )
	{
		foreach my $i ( 0 .. $#$context )
		{
			my $value = $context->[$i];
			print $prefix, "[", $i, "]: ", $value, "\n";
			for( ref $value )
			{
				/HASH/	&& dump_context( $value, $prefix."[".$i."]." );
				/ARRAY/	&& dump_context( $value, $prefix."[".$i."]" );
			}
		}
	}
}

############ output #####################

my $indent = "\t";

sub generate_comment
{
	my ( $type, $text, $pref ) = @_;
	$text = "/** \\$type".$text."*/";
	s/^\s*//, print $pref.$_."\n" for split /(\r?\n|^\n?)[ \t]/, $text;
}

sub generate_forward_classes
{
	my ( $objects, $pref ) = @_;
	for ( keys %$objects )
	{
		print $pref, "class ", $_, ";\n" 
			if $objects->{$_}{otype} == $OT_CLASS;
		print $pref, "interface ", $_, ";\n" 
			if $objects->{$_}{otype} == $OT_INTERFACE;
	}
}

sub generate_function
{
	my ( $func, $name, $pref, $virtual ) = @_;
	my $delim = "";
	
	return if $name !~ /$identifier/;
	$virtual = $virtual == $OT_INTERFACE ? "virtual " : "";
	print $pref, "void ", $name, "(";
	for my $arg (@{$func->{args}})
	{
		print $delim, $virtual."void ", $arg->{name};
		$delim = ",";
	}
	print ");\n";
}

sub generate_variable
{
	my ( $var, $name, $pref ) = @_;
	print $pref, "int ", $name, ";\n";
}

sub generate_class
{
	my ( $context, $name, $pref ) = @_;
	my $delim = " : ";
	my $type = "class ";
	
	$type = "interface " if $context->{otype} == $OT_INTERFACE;
	print $pref.$type.$name;
	if( exists $context->{base} )
	{
		print $delim, "public ", $context->{base}{name};
		$delim = ", ";
	}
	for my $if (keys %{$context->{fulfills}})
	{
		print $delim, "public ", $if;
		$delim = ", ";
	}
	print "\n", $pref, "{\n", $pref, "public:\n";
	generate_forward_classes $context->{objs}, $pref.$indent;
	generate_function $context, $name, $pref.$indent, $context->{otype};
	for ( keys %{$context->{members}} )
	{
		my $member = $context->{members}{$_};
		generate_function $member, $_, $pref.$indent, $context->{otype}
			if $member->{otype} == $OT_MEMBERFUNC;
		generate_variable $member, $_, $pref.$indent
			if $member->{otype} == $OT_MEMBERVAR;
	}
	print $pref, "};\n"
}

sub generate
{
	sub generate;

	my ( $context, $name, $pref ) = @_;
	for( $context->{otype} )
	{
		/(?:$OT_FILE)/ && do
			{
				generate_comment "file ".$ARGV, $context->{comment}
					if exists $context->{comment};
				generate_forward_classes $context->{objs}, "";
				generate $context->{objs}{$_}, $_, ""
					for ( keys %{$context->{objs}} );
			};
		/(?:$OT_FUNCTION)/ && do
			{
				generate_function $context, $name, $pref;
			};
		/(?:$OT_CLASS|$OT_INTERFACE)/ && do
			{
				generate_class $context, $name, $pref;
			};
	}
}

############ Main #######################

use vars qw( $context );

$context = 
{ 
	otype => $OT_FILE,
	scope => undef
};

parse \$context;
dump_context $context, "Main: " if $opt_debug & $DEB_DATABASE;
generate $context;


############ Manual #####################

__END__

=head1 NAME

js2doxy - utility to convert JavaScript into something Doxygen can understand

=head1 SYNOPSIS

 js2doxy.pl < file.js > file.cpp
 js2doxy.pl [Options] file.js

 Options:

 -?		Print usage
 --debug	Debug mode
 --help		Show manual
 --version	Print version

=head1 OPTIONS

=over 8

=item B<-?>

Prints the usage of the script.

=item B<--debug>

Prints internal states to the error stream. States are triggered by single
bits:

 Bit 0:	Database (1)
 Bit 1:	Parser (2)
 Bit 2:	Scanner	(4)

=item B<--help>

Shows the manual pages of the script using perldoc.

=item B<--version>

Print the version of the utility and exits.

=back

=head1 DESCRIPTION

B<This program> will read from standard input or from the given input file
and convert the input into pseudo C++ that can be understood by help 
generator Doxygen.

=cut
