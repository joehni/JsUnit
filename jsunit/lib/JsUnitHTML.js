/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002 Joerg Schaible

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
 * Test unit classes for HTML output.
 * This file contains extensions for the test unit framework especially for 
 * output of the results in HTML.
 */

/**
 * Class for an application running test suites reporting in HTML.
 */
function HTMLTestRunner()
{
	this.constructor.call( this );
}
/**
 * Write a header starting the application.
 * The function will print a \<pre\> tag before calling the inherited function.
 */
function HTMLTestRunner_printHeader()
{
	document.writeln( "<pre>" );
	this._printHeader();
}
/**
 * Write a footer at application end with a summary of the tests.
 * @tparam TestResult result The result of the test run.
 * The function will print a \</pre\> tag before calling the inherited function.
 */
function HTMLTestRunner_printFooter( result )
{
	this._printFooter( result );
	document.writeln( "</pre>" );
}
/**
 * Write a line of text to the browser window.
 * @tparam String str The text to print on the line.
 */
function HTMLTestRunner_writeLn( str ) 
{ 
	str = str.toString();
	document.writeln( str.replace( /</g, "&lt;" )); 
}

HTMLTestRunner.prototype = new TextTestRunner();
HTMLTestRunner.prototype._printHeader = HTMLTestRunner.prototype.printHeader;
HTMLTestRunner.prototype.printHeader = HTMLTestRunner_printHeader;
HTMLTestRunner.prototype._printFooter = HTMLTestRunner.prototype.printFooter;
HTMLTestRunner.prototype.printFooter = HTMLTestRunner_printFooter;
HTMLTestRunner.prototype.writeLn = HTMLTestRunner_writeLn;


