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

var hasExceptions = "false";
var exceptionsWorking = "false";

function throwEx()
{
	throw new Object();
}
function testEx()
{
	var me = this;
	try { hasExceptions = "true"; new throwEx(); } 
	catch( ex ) { exceptionsWorking = this == me; }
}
new testEx();

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

JsUtil.prototype.print( "\nJavaScript compatibility:" );
JsUtil.prototype.print( "\thas exceptions: " + hasExceptions );
JsUtil.prototype.print( "\texceptions working: " + exceptionsWorking );

JsUtil.prototype.print( "\nJavaScript engine detection:" );
for( var i in JsUtil.prototype )
	if( typeof JsUtil.prototype[i] != "function" && i.match( /^(is|has)/ ))
		JsUtil.prototype.print( "\t" + i + ": " + JsUtil.prototype[i] );

function main( args )
{
	var runner = new TextTestRunner();
	runner.addSuite( new JsUtilTestSuite());
	runner.addSuite( new JsUnitTestSuite());
	return runner.start( args );
}

JsUtil.prototype.print( "\nJsUnit Test Suite:\n" );
if( exceptionsWorking )
{
	eval( JsUtil.prototype.load( "../lib/JsUnit.js" ));
	eval( JsUtil.prototype.load( "JsUtilTest.js" ));
	eval( JsUtil.prototype.load( "JsUnitTest.js" ));

	var args;
	if( this.WScript )
	{
		if( WScript.Arguments.Count())
			args = WScript.Arguments( 0 );
	}
	else 
		args = arguments;
		
	JsUtil.prototype.quit( main( args ));
}
else
{
	JsUtil.prototype.print( "\tSorry, exceptions not working!\n" );
	JsUtil.prototype.quit( -1 );
}

