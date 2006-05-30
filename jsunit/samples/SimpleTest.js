/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002,2003 Joerg Schaible

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
 * Some simple tests.
 */
function SimpleTest(name)
{
	TestCase.call( this, name );
}
function SimpleTest_setUp()
{
	this.fValue1= 2;
	this.fValue2= 3;
}
function SimpleTest_testAdd()
{
	var result = this.fValue1 + this.fValue2;
	// forced failure result == 5
	this.assertEquals( 6, result );
}
function SimpleTest_testDivideByZero()
{
	var zero = 0;
	this.assertEquals( "Infinity", 8/zero );
}
function SimpleTest_testAsserts()
{
	this.assertTrue( true );
	this.assertFalse( false );
	this.assertEquals( 1, this.fValue2 - this.fValue1 );
	this.assertNull( null );
	this.assertNotNull( this.fValue1 );
	this.assertUndefined();
	this.assertNotUndefined( true );
	this.assertSame( this, this );
	this.assertNotSame( 
		new Number( this.fValue1 ), new Number( this.fValue1 ));
}
SimpleTest.prototype = new TestCase();
SimpleTest.prototype.setUp = SimpleTest_setUp;
SimpleTest.prototype.testAdd = SimpleTest_testAdd;
SimpleTest.prototype.testDivideByZero = SimpleTest_testDivideByZero;
SimpleTest.prototype.testAsserts = SimpleTest_testAsserts;


function SimpleTestSuite()
{
	TestSuite.call( this, "SimpleTestSuite" );
	this.addTestSuite( SimpleTest );
}
SimpleTestSuite.prototype = new TestSuite();
SimpleTestSuite.prototype.suite = function () { return new SimpleTestSuite(); }

