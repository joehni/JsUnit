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

function CallStackTest( name )
{
	this.constructor.call( this, name );
}
function CallStackTest_testToString()
{
	function f0(d) { return new CallStack(d); }
	function f1(d) { return f0(d); }
	function f2(d) { return f1(d); }
	function f3(d) { return f2(d); }
	function f4(d) { return f3(d); }
	function f5(d) { return f4(d); }
	function f6(d) { return f5(d); }
	function f7(d) { return f6(d); }
	function f8(d) { return f7(d); }
	function f9(d) { return f8(d); }
	function f10(d) { return f9(d); }
	function f11(d) { return f10(d); }
	function f12(d) { return f11(d); }

	var cs = f0().toString().replace(/\n/g, "|");
	if( cs.indexOf( "not supported" ) == -1 )
	{
		cs = f12().toString().replace(/\n/g, "|");
		this.assertTrue( cs.indexOf( "f10" ) == -1 );
		this.assertTrue( cs.indexOf( "f9" ) > 0 );
		cs = f12(13).toString().replace(/\n/g, "|");
		this.assertTrue( cs.indexOf( "f12" ) > 0 );
		cs = f4().toString().replace(/\n/g, "|");
		this.assertTrue( cs.indexOf( "f5" ) == -1 );
		this.assertTrue( cs.indexOf( "f4" ) >= 0 );
		this.assertTrue( cs.indexOf( "testToString" ) >= 0 );
	}
}
CallStackTest.prototype = new TestCase();
CallStackTest.prototype.testToString = CallStackTest_testToString;

function ArrayTest( name )
{
	this.constructor.call( this, name );
}
function ArrayTest_testPop()
{
	this.assertEquals( 4, [1,2,3,4].pop());
	var a = new Array( 1, 2, 3, 4, 5 );
	this.assertEquals( 5, a.pop());
	this.assertEquals( 4, a.length );
	a[2] = undefined;
	this.assertEquals( 4, a.pop());
	this.assertEquals( 3, a.length );
	this.assertUndefined( a.pop());
	this.assertEquals( 2, a.pop());
	this.assertEquals( 1, a.pop());
	this.assertUndefined( a.pop());
}
function ArrayTest_testPush()
{
	this.assertEquals( 4, [1,2,3].push( 4 ));
	var a = new Array();
	this.assertEquals( 3, a.push( 1, 2, 3 ));
	this.assertEquals( 3, a.length );
	this.assertEquals( 3, a.push());
	this.assertEquals( 3, a.length );
	this.assertEquals( 4, a.push( 4 ));
	this.assertEquals( 4, a.length );
	this.assertEquals( "1,2,3,4", a.toString());
}
ArrayTest.prototype = new TestCase();
ArrayTest.prototype.testPop = ArrayTest_testPop;
ArrayTest.prototype.testPush = ArrayTest_testPush;

function StringTest( name )
{
	this.constructor.call( this, name );
}
function StringTest_testTrim()
{
	this.assertEquals( "abc", "bbbabcbbb".trim( "b" ));
	var s = new String( "abc" );
	this.assertEquals( "abc", s.trim());
	s = " abc \t ";
	this.assertEquals( "abc", s.trim());
	this.assertEquals( " abc \t ", s );
	s = "123abc456";
	this.assertEquals( "abc", s.trim( "0123456789" ));
	this.assertEquals( "123abc456", s );
	s = "bbbabcbbb";
	this.assertEquals( "abc", s.trim( "b" ));
	this.assertEquals( "bbbabcbbb", s );
}
StringTest.prototype = new TestCase();
StringTest.prototype.testTrim = StringTest_testTrim;
