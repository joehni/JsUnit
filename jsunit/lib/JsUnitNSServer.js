/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002,2003,2006 Joerg Schaible

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation in version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

Test suites built with JsUnit are derivative works derived from tested 
classes and functions in their production; they are not affected by this 
license.
*/

/**
 * @file
 * Test unit classes for a Netscape Server environment.
 * This file contains extensions for the test unit framework especially for 
 * output of the results at a Netscape Server.
 */

/**
 * Class for an application running test suites with the BroadVision ctxdriver
 * and console output.
 */
function NSServerWriter()
{
}
/** 
 * \internal 
 */
function NSServerWriter__flush( str )
{
	print( str ); 
}
NSServerWriter.prototype = new PrinterWriter();
NSServerWriter.prototype._flush = NSServerWriter__flush;


/**
 * Class for an application running test suites with a Netscape Server.
 * @see TextTestRunner
 * @see NSServerWriter
 * @deprecated since 1.2 in favour of TextTestRunner in combination with a 
 * NSServerWriter.
 */
function NSServerTestRunner()
{
	TextTestRunner.call( this );
}
/**
 * Write a header starting the application.
 * @deprecated since 1.2
 */
function NSServerTestRunner_printHeader()
{
	write( "<pre>" );
	TextTestRunner.prototype.printHeader.call( this );
}
/**
 * Write a footer at application end with a summary of the tests.
 * @tparam TestResult result The result of the test run.
 * @deprecated since 1.2
 */
function NSServerTestRunner_printFooter( result )
{
	TextTestRunner.prototype.printFooter.call( this, result );
	write( "</pre>" );
}
/**
 * Write a line of text to the console to the browser window.
 * @tparam String str The text to print on the line.
 * @deprecated since 1.2
 */
function NSServerTestRunner_writeLn( str ) { write( str + "\n" ); }

NSServerTestRunner.prototype = new TextTestRunner();
NSServerTestRunner.prototype.printHeader = NSServerTestRunner_printHeader;
NSServerTestRunner.prototype.printFooter = NSServerTestRunner_printFooter;
NSServerTestRunner.prototype.writeLn = NSServerTestRunner_writeLn;

