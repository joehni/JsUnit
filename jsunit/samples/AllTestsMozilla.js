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

load( "../lib/CallStack.js"
	, "../lib/JsUnit.js"
	, "../lib/JsUnitMozilla.js"
	, "ArrayTest.js"
	, "money/AbstractFunctionCalledException.js"
	, "money/IMoney.js"
	, "money/Money.js"
	, "money/MoneyBag.js"
	, "money/MoneyTest.js"
	, "SimpleTest.js" );

function main( test )
{
	var runner = new MozillaTestRunner();
	runner.addSuite( new TestSuite( new ArrayTest()));
	runner.addSuite( new TestSuite( new MoneyTest()));
	runner.addSuite( new TestSuite( new SimpleTest()));
	return runner.start( test );
}

quit( main( arguments ));

