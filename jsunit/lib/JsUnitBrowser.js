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
 * Test unit classes for browser GUI.
 * This file contains extensions for the test unit framework especially for 
 * the browser GUI.
 */

/**
 * @@class
 * Class to build a test suite from a test HTML page.
 */
function TestPage( file )
{
	this._super = TestSuite;
	this._super( file );

	
}

/**
 * @@class
 * Class for an application running test suites in the browser GUI.
 */
function BrowserTestRunner()
{
	this._super = TestRunner;
	this._super();

	
}


