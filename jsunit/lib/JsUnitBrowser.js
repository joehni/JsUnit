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
 * Test unit classes for browser GUI.
 * This file contains extensions for the test unit framework especially for 
 * the browser GUI.
 */

/**
 * Class to build a test suite from a test HTML page.
 */
function TestPage( file )
{
	TestSuite.call( this, file );
}

TestPage.prototype = new TestSuite();


/**
 * Class for an application running test suites in the browser GUI.
 */
function BrowserTestRunner( doc )
{
	TestRunner.call( this );

	this._document = doc;
	this._testPageContainer = null;
	if( this._document )
	{
		this._testPageContainer = this._document.getElementById( "JsUnitContainer" );
		if( !this._testPageContainer )
		{
			var body = this._document.getElementsByTagName("body")[0];
			var id = this._document.createAttribute("id");
			id.nodeValue = "JsUnitContainer";
			var table = this._document.createElement("table");
			table.setAttributeNode(id);
			body.appendChild(table);
		}
		this._testPageContainer = this._document.getElementById( "JsUnitContainer" );
	}
}

function BrowserTestRunner_getTestPageContainer()
{
	return this._testPageContainer;
}

function BrowserTestRunner_loadDocument( filename )
{
	var rows = this._testPageContainer.rows;
	var row = this._testPageContainer.insertRow( rows.length );
	var td = row.insertCell( 0 );
	var node = this._document.createTextNode( filename );
	td.appendChild( node );
	td = row.insertCell( 1 );
	node = this._document.createElement( "iframe" );
	td.appendChild( node );
	node.src = "file:///" + filename;
}

BrowserTestRunner.prototype = new TestRunner();
BrowserTestRunner.prototype.getTestPageContainer 
	= BrowserTestRunner_getTestPageContainer;
BrowserTestRunner.prototype.loadDocument = BrowserTestRunner_loadDocument;

