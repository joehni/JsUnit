#!/bin/perl

use strict;

use vars qw( $VERSION );
$VERSION = "2.0";

############ Options ####################

use Getopt::Long;
use Pod::Usage;
my ( $opt_usage, $opt_help, $opt_version );
GetOptions(
	'questionmark|?' => \$opt_usage,
	'help' => \$opt_help,
	'version' => \$opt_version );
Getopt::Long::Configure( "bundling", "no_ignore_case", "no_permute" );

print "Version: ", $VERSION, "\n" and exit( 0 ) if $opt_version;
pod2usage( -exitval => 0, -verbose => 2 ) if $opt_help;
pod2usage( 1 ) if( $opt_usage or ( $#ARGV < 0 && -t ));


############ Error functions ############

sub syntax_err
{
	print STDERR $., ": Syntax: ", @_;
	exit( 3 );
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
$prototype = $identifier."\\s*\\.\\s*prototype(?!\\w)";
$interface = $identifier."\\s*\\.\\s*fulfills(?!\\w)";

use vars qw( $cur_line @token_patterns $newline_pattern );
# lexer 
$cur_line = "";
# recognized tokens
@token_patterns =
(
    quotemeta("/**"),
    quotemeta("*/"),
    quotemeta("/*"),
    quotemeta("//"),
    "@@",
    "(?:0[xX])?\\d+",
    $prototype,
    $interface,
    $identifier,
    "\\s+",
    "\\\\.",
    ".",
);
$newline_pattern = "[\\n\\r\\f]";

use subs qw(switch_scan_mode);

# get next Token according to the @token_patterns array. 
# Reads next line, if current line is completed.
sub next_token
{
	my ( $token, $token_pattern );

	$cur_line = <> if $cur_line eq "";
	
	if( $cur_line ne "" )
	{
		foreach $token_pattern ( @token_patterns )
		{
			if( $cur_line =~ s/^($token_pattern)// )
			{
				$token = $1;
	   		    printf STDERR ( "Found: '%s' ~ '%s'\n", $token, $token_pattern );
				last;
			}
		}
	}
	
	switch_scan_mode $token;
	# printf STDERR ( "Mode: %s\n", $mode_names[$mode] );

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
			syntax_err "Unterminated string literal." if( $token =~ /[\n\r]/ );
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
		elsif( $token eq "/**" )
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

use vars qw( $string );

use vars qw( $T_FILE $T_FUNCTION $T_CLASS $T_MEMBERFUNCTION );
$T_FILE = 0;
$T_FUNCTION = 1;
$T_CLASS = 2;
$T_MEMBERFUNCTION = 3;

use subs qw( parse );

sub parse_string
{
	my $token = shift;
	$string = $token;

	$string .= $token
		while(( $token = next_token ), $scan_mode == $S_STRING );

	$token;
}

sub parse_comment
{
	my $token;

	$token = next_token 
		while $scan_mode == $S_COMMENT or $scan_mode = $S_LINE_COMMENT;

	$token;
}

sub parse_code
{
	my $token; 
	while(( $token = next_none_ws_token ) ne "" )
	{
		syntax_err "Unexpected documentation comment." 
			if $scan_mode == $S_DOC_COMMENT;

		next if    $scan_mode == $S_COMMENT 
				or $scan_mode == $S_LINE_COMMENT;

		last;
	}

	$token;
}

sub parse_function
{
	my $context = shift;
	
	my $name;
	my $token = next_none_ws_token;
	if( $token ne "(" )
	{
		syntax_err "Function name expected." if( $token !~ /$identifier/ );
		$name = $token;
		$token = next_none_ws_token;
	}
	else
	{
		if( not exists $$context->{anonymous} )
		{
			$$context->{anonymous} = 0;
		}
		$name = "?".$$context->{anonymous};
		++$$context->{anonymous};
	}

	$$context->{objs}{$name} = { type => $T_FUNCTION, scope => $$context };
	my $fnContext = $$context->{objs}{$name};

	syntax_err "'(' expected." if( $token ne "(" );
	$fnContext->{args} = [];
	while(( $token = next_none_ws_token ) ne ")" )
	{
		next if( $token =~ /,/ );
		syntax_err "Function parameter name expected." 
			if( $token !~ /$identifier/ );
		push @{$fnContext->{args}}, { name => $token };
	}

	syntax_err "'{' expected." if(( $token = next_none_ws_token ) ne "{" );
	$token = parse \$fnContext, $token;
	syntax_err "EOF found. '}' expected." if not defined $token;

	$name;
}


sub parse_prototype
{
	my $context = shift;
	my $token = shift;

	$token =~ /($identifier)/;
	my $name = $1;
	
	syntax_err "Syntax error in prototype definition."
		if (( $token = next_none_ws_token ) !~ /(?:\.|\=)/ );
		
	syntax_err "Prototype assignment, but no constructor of $name."
		if not exists $$context->{objs}{$name};
	my $fnContext = $$context->{objs}{$name};
	$fnContext->{type} = $T_CLASS if $fnContext->{type} == $T_FUNCTION;
	syntax_err "Prototype assignment to invalid type."
		if $fnContext->{type} != $T_CLASS;
			
	if( $token eq "=" )
	{
		syntax_err "'new' expected." if next_none_ws_token ne "new";
		syntax_err "Identifier expected." 
			if next_none_ws_token !~ /($identifier)/;
		while(( $token = next_token ) =~ /[ \t()]+/ ) {}
		syntax_err "';' expected." if $token ne ";";
		
		my $scope = $context;
		$scope = $$scope->{scope} 
			while defined $$scope && not exists $$scope->{objs}{$1};
		if( not defined $$scope )
		{
			$$context->{objs}{$1} = { type => $T_CLASS, scope => $$context };
			$scope = $context;
		}
		$fnContext->{base} = $$scope->{objs}{$1};
	}
	else
	{
		syntax_err "Identifier expected." 
			if(( $token = next_none_ws_token ) !~ /$identifier/ );
		$name = $token;
		syntax_err "'=' expcted." if(( $token = next_none_ws_token ) ne "=" );

		if(( $token = next_none_ws_token ) =~ /$identifier/ )
		{
			$token = parse_function $context if( $token eq "function" );
			my $scope = $context;
			$scope = $$scope->{scope} 
				while defined $$scope && not exists $$scope->{objs}{$token};
			if( not defined $$scope )
			{
				$$context->{objs}{$token} = 
					{ type => $T_MEMBERFUNCTION, scope => $$context };
				$scope = $context;
			}
			$scope = $$context->{objs}{$token};
			$scope->{type} = $T_MEMBERFUNCTION if $scope->{type} == $T_FUNCTION;
			syntax_err $token, " is not a member function." 
				if $scope->{type} != $T_MEMBERFUNCTION;
			$fnContext->{member_funcs}{$name} = $scope;
		}
		else
		{
			my $value = $token;
			if( $scan_mode == $S_STRING )
			{
				$value .= $token 
					while(( $token = next_token ), $scan_mode == $S_STRING );

				$fnContext->{member_vars}{$name} = {};
			}
		}
	}
}

sub parse_interface
{
	my $context = shift;
	my $token = shift;

	$token =~ /($identifier)/;
	my $name = $1;
	
	syntax_err "'(' expected." if (( $token = next_none_ws_token ) ne "(" );
	syntax_err "Prototype fulfillment, but no constructor of $name."
		if not exists $$context->{objs}{$name};
	my $fnContext = $$context->{objs}{$name};
	$fnContext->{fulfills} = {};
	while(( $token = next_none_ws_token ) ne ")" )
	{
		next if( $token =~ /,/ );
		syntax_err "Interface name expected." if( $token !~ /$identifier/ );
		
		my $scope = $context;
		$scope = $$scope->{scope} 
			while defined $$scope && not exists $$scope->{objs}{$token};
		if( not defined $$scope )
		{
			$$context->{objs}{$token} = 
				{ type => $T_CLASS, scope => $$context };
			$scope = $context;
		}
		$scope = $$context->{objs}{$token};
		syntax_err $token, " is not a class." if $scope->{type} != $T_CLASS;
		
		$fnContext->{fulfills}{$token} = $scope;
	}
}

sub parse
{
	my $context = shift;
	my $token = shift;
	my $level = 0;

	TOKEN: until( $token eq "" )
	{
		next if    $scan_mode == $S_COMMENT 
				or $scan_mode == $S_LINE_COMMENT 
				or $scan_mode == $S_STRING;

		if( $scan_mode == $S_CODE )
		{
			for( $token )
			{
				/}/ && --$level == 0 	&& last TOKEN;
				/{/						&& ++$level;
				/function/				&& parse_function $context;
				/$prototype/			&& parse_prototype $context, $token;
				/$interface/			&& parse_interface $context, $token;
			}
		}
	} continue {
		$token = next_token;
	}

	syntax_err "Unbalanced '}' found." if $level < 0;
	syntax_err "EOF found. '}' expected." if $level > 0;
	$token;
}


############ Debug #######################

sub dump_context
{
	my $context = shift;
	my $prefix = shift;

	if( ref $$context eq "HASH" )
	{
		foreach my $key ( keys %$$context )
		{
			my $value = $$context->{$key};
			print $prefix, $key, ": ", $value, "\n";
			next if $key =~ /(?:scope|base)/;
			for( ref $value )
			{
				/HASH/ 	&& dump_context( \$value, $prefix.$key."." );
				/ARRAY/ && dump_context( \$value, $prefix.$key );
			}
		}
	}
	elsif( ref $$context eq "ARRAY" )
	{
		foreach my $i ( 0 .. $#$$context )
		{
			my $value = $$context->[$i];
			print $prefix, "[", $i, "]: ", $value, "\n";
			for( ref $value )
			{
				/HASH/	&& dump_context( \$value, $prefix."[".$i."]." );
				/ARRAY/	&& dump_context( \$value, $prefix."[".$i."]" );
			}
		}
	}
}

############ Main #######################

use vars qw( $context );

$context = 
{ 
	type => $T_FILE,
	scope => undef
};

parse \$context, next_token;
dump_context \$context, "Main: ";


############ Manual #####################

__END__

=head1 NAME

js2doxy - utility to convert JavaScript into something Doxygen can understand

=head1 SYNOPSIS

 js2doxy.pl < file.js > file.cpp
 js2doxy.pl [Options] file.js

 Options:
 	-?		Print usage
 	--help		Show manual
	--version	Print version

=head1 OPTIONS

=over 8

=item B<-?>

Prints the usage of the script.

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
