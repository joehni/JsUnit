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
 * A sample test case, testing <code>Array</code> object.
 *
 */
function ArrayTest(name) {
	this._super = TestCase;
	this._super( name );

	function setUp() {
		this.fEmpty = new Array();
		this.fFull = new Array();
		this.fFull[0] = 1;
		this.fFull[1] = 2;
		this.fFull[2] = 3;
	}
	function testCapacity() {
		var size = this.fFull.length; 
		for (var i = 0; i < 100; i++)
			this.fFull[size + i] = i;
		this.assertEquals(100+size, this.fFull.length);
	}
	function testConcat() {
		for (var i = 0; i < 3; i++)
			this.fEmpty[i] = i+4;
		var all = this.fFull.concat(this.fEmpty);
		this.assertEquals("1,2,3,4,5,6", all);
	}
	function testJoin() {
		this.assertEquals("1-2-3", this.fFull.join("-"));
	}
	function testReverse() {
		this.assertEquals("3,2,1", this.fFull.reverse());
	}
	function testSlice() {
		this.assertEquals("2,3", this.fFull.slice(1));
		this.assertEquals("2", this.fFull.slice(1,2));
		this.assertEquals("1,2", this.fFull.slice(0,-1));
	}
	function testSort() {
		for (var i = 0; i < 3; i++)
			this.fEmpty[i] = i+4;
		var all = this.fEmpty.concat(this.fFull);
		this.assertEquals("1,2,3,4,5,6", all.sort());
	}

	this.setUp = setUp;
	this.testCapacity = testCapacity;
	this.testConcat = testConcat;
	this.testJoin = testJoin;
	this.testReverse = testReverse;
	this.testSlice = testSlice;
	this.testSort = testSort;
}

