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

function main( test )
{
	var runner = new TextTestRunner();
	runner.addSuite( new ArrayTestSuite());
	runner.addSuite( new MoneyTestSuite());
	runner.addSuite( new SimpleTestSuite());
	return runner.start( test );
}

var args;
if( this.WScript )
{
	if( WScript.Arguments.Count())
		args = WScript.Arguments( 0 );
}
else 
	args = arguments;
		
JsUtil.prototype.quit( main( args ));

