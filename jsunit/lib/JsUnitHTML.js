/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999-2001 Joerg Schaible

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
 * @@file
 * Test unit classes for HTML output.
 * This file contains extensions for the test unit framework especially for 
 * output of the results in HTML.
 */

/**
 * @@class
 * Class for an application running test suites reporting in HTML.
 */
function HTMLTestRunner()
{
	this._super = TextTestRunner;
	this._super();

	/**
	 * @@method
	 * Write a header starting the application.
	 */
	function printHeader( result )
	{
		document.writeln( "<pre>" );
		this._printHeader( result );
	}
	/**
	 * @@method
	 * Write a footer at application end with a summary of the tests.
	 */
	function printFooter( result )
	{
		this._printFooter( result );
		document.writeln( "</pre>" );
	}
	/**
	 * @@method
     * Write a line of text to the console to the browser window.
     * @param str The text to print on the line.
     */
	function writeLn( str ) { document.writeln( str ); }

	this._printHeader = this.printHeader;
	this.printHeader = printHeader;
	this._printFooter = this.printFooter;
	this.printFooter = printFooter;
	this.writeLn = writeLn;
}

