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

if( this.WScript )
{
	var fso = new ActiveXObject( "Scripting.FileSystemObject" );
	var file = fso.OpenTextFile( "../lib/JsUtil.js", 1 );
	var all = file.ReadAll();
	file.Close();
	eval( all );
}
else
	load( "../lib/JsUtil.js" );

eval( JsUtil.prototype.include( "../lib/JsUnit.js" ));
eval( JsUtil.prototype.include( "ArrayTest.js" ));
eval( JsUtil.prototype.include( "money/IMoney.js" ));
eval( JsUtil.prototype.include( "money/Money.js" ));
eval( JsUtil.prototype.include( "money/MoneyBag.js" ));
eval( JsUtil.prototype.include( "money/MoneyTest.js" ));
eval( JsUtil.prototype.include( "SimpleTest.js" ));

function AllTests()
{
	TestSuite.call( this, "AllTests" );
}
function AllTests_suite()
{
	var suite = new AllTests();
	suite.addTest( ArrayTestSuite.prototype.suite());
	suite.addTest( MoneyTestSuite.prototype.suite());
	suite.addTest( SimpleTestSuite.prototype.suite());
	return suite;
}
AllTests.prototype = new TestSuite();
AllTests.prototype.suite = AllTests_suite;

var args;
if( this.WScript )
{
	args = new Array();
	for( var i = 0; i < WScript.Arguments.Count(); ++i )
		args[i] = WScript.Arguments( i );
}
else 
	args = arguments;
		
var result = TextTestRunner.prototype.main( args );
JsUtil.prototype.quit( result );

