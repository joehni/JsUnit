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

var hasExceptions = "false";
var exceptionsWorking = "false";

function throwEx()
{
	throw new Error;
}
function testEx()
{
	var me = this;
	try { hasExceptions = "true"; new throwEx(); } 
	catch( ex ) { exceptionsWorking = this == me; }
}
new testEx();

function main( args )
{
	var runner = new MozillaTestRunner();
	runner.addSuite( new TestSuite( CallStackTest ));
	runner.addSuite( new TestSuite( ArrayTest ));
	runner.addSuite( new TestSuite( StringTest ));
	runner.addSuite( new TestSuite( AssertionFailedErrorTest ));
	runner.addSuite( new TestSuite( TestTest ));
	runner.addSuite( new TestSuite( TestFailureTest ));
	runner.addSuite( new TestSuite( TestResultTest ));
	runner.addSuite( new TestSuite( AssertTest ));
	runner.addSuite( new TestSuite( TestCaseTest ));
	runner.addSuite( new TestSuite( TestSuiteTest ));
	runner.addSuite( new TestSuite( TestRunnerTest ));
	runner.addSuite( new TestSuite( TextTestRunnerTest ));
	return runner.start( args );
}

print( "\nJavaScript compatibility:" );
print( "\thas exceptions: " + hasExceptions );
print( "\texceptions working: " + exceptionsWorking );

print( "\nJsUnit Test Suite:\n" );
if( exceptionsWorking )
{
	load( "../lib/JsUtil.js"
		, "../lib/JsUnit.js"
		, "../lib/JsUnitMozilla.js"
		, "JsUtilTest.js"
		, "JsUnitTest.js" );

	quit( main( arguments ));
}
else
{
	write( "\tSorry, exceptions not working!\n" );
	quit( -1 );
}
