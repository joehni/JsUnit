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


############ Scanner ####################

use vars qw( @mode_names $mode $string_mode $string_len );
use vars qw( $IN_CODE $IN_COMMENT $IN_DOC_COMMENT $IN_LINE_COMMENT $IN_STRING );
# general scanner modes
@mode_names = qw( CODE COMMENT DOC_COMMENT LINE_COMMENT STRING );
$IN_CODE = 0;
$IN_COMMENT = 1;
$IN_DOC_COMMENT = 2;
$IN_LINE_COMMENT = 3;
$IN_STRING = 4;
$mode = $IN_CODE;
$string_mode = "";
$string_len = 0;

use vars qw($cur_line @token_patterns $newline_pattern);
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
    "\\d+",
    "[_a-zA-Z]\\w+",
    "\\s+",
    "\\\\.",
#    "<!--",
#    "-->",
    ".",
);
$newline_pattern = "[\\n\\r\\f]";

# get next Token according to the @token_patterns array. 
# Reads next line, if current line is completed.
sub nextToken
{
	my ( $token, $token_pattern );

	$cur_line = <> if $cur_line eq "";
	
	if( $cur_line ne "" )
	{
		foreach $token_pattern ( @token_patterns )
		{
			if( $cur_line =~ s/^$token_pattern// )
			{
				$token = $&;
	   		    # printf STDERR ( "Found: %s (%s)\n", $token, $token_pattern );
				last;
			}
		}
	}
	
	switchMode( $token );
	# printf STDERR ( "Mode: %s\n", $mode_names[$mode] );

	$token;
}

# handle $mode properly
# recognize comments and strings
sub switchMode
{
	my ( $token ) = @_;

	if( $token ne "" )
	{
		# recognize the mode endings
		if(( $mode == $IN_COMMENT ) || ( $mode == $IN_DOC_COMMENT ))
		{
			$mode = $IN_CODE if $token eq "*/";
		}
		elsif( $mode == $IN_LINE_COMMENT )
		{
			$mode = $IN_CODE if $token =~ /[\n\r]/;
		}
		elsif( $mode == $IN_STRING ) 
		{
			if( $token =~ /[\n\r]/ )
			{
				print STDERR ( "Syntax Error: Unterminated string literal in line ", $. );
				exit( -1 );
			}
			if( $token eq $string_mode )
			{
#				print STDERR ("String end $in_string\n");
				$string_mode = "";
				$string_len = 0;
				$mode = $IN_CODE;
			}
			else
			{
#				print STDERR ( "in String '$token'\n" );
				$string_len += length $token;
			}
		}
		# recognize the mode startings
		elsif( $token eq "/*" )
		{
			$mode = $IN_COMMENT;
		}
		elsif( $token eq "/**" )
		{
			$mode = $IN_DOC_COMMENT;
		}
		elsif( $token eq "//" )
		{
			$mode = $IN_LINE_COMMENT;
		}
		elsif( $token =~ /[\'\"]/ )
		{
			$mode = $IN_STRING;
			$string_mode = $&;
			$string_len = 0;
		}
	}
}


############ Parser #####################

{
	package Context;

	my $names = qw( NONE COMMENT FUNCTION );
	
	use vars qw( $NONE $COMMENT $FUNCTION );
	$NONE = 0;
	$COMMENT = 0;
	$FUNCTION = 0;

	sub new
	{
		my $class = shift;
		my $context = $NONE;
		bless \$context, $class;
	}
}



############ Main #######################

my ( $token );
while(( $token = nextToken ) ne "" )
{
	next if $mode == $IN_COMMENT;
	print $token;
}


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
