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
 * Some simple tests.
 *
 */
function SimpleTest(name) {
	this._super = TestCase;
	this._super( name );

	function setUp() {
		this.fValue1= 2;
		this.fValue2= 3;
	}
	function testAdd() {
		var result = this.fValue1 + this.fValue2;
		// forced failure result == 5
		this.assert(result == 6);
	}
	function testDivideByZero() {
		var zero = 0;
		this.assertEquals("Infinity", 8/zero);
	}
	function testAsserts() {
		this.assert(true);
		this.assertEquals(1, this.fValue2 - this.fValue1);
		this.assertNotNull(this.fValue1);
		this.assertNull(null);
		this.assertUndefined();
		this.assertNotUndefined( true );
	}
	
	this.setUp = setUp;
	this.testAdd = testAdd;
	this.testDivideByZero = testDivideByZero;
	this.testAsserts = testAsserts;
}

