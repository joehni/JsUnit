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
	this._super = TestCase;
	this._super( name );

	function testToString()
	{
		var cs = new CallStack();
		if( cs.toString() != "1: [CallStack information not supported]" )
		{
			var reg = /(.*)\n*/;
			reg.exec( cs );
			this.assertEquals( "1: testToString()", RegExp.$1);
		}
	}

	this.testToString = testToString;
}

function ArrayTest( name )
{
	this._super = TestCase
	this._super( name );

	function testPop()
	{
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
	function testPush()
	{
		var a = new Array();
		this.assertEquals( 3, a.push( 1, 2, 3 ));
		this.assertEquals( 3, a.length );
		this.assertEquals( 3, a.push());
		this.assertEquals( 3, a.length );
		this.assertEquals( 4, a.push( 4 ));
		this.assertEquals( 4, a.length );
		this.assertEquals( "1,2,3,4", a.toString());
	}

	this.testPop = testPop;
	this.testPush = testPush;
}

function StringTest( name )
{
	this._super = TestCase
	this._super( name );

	function testTrim()
	{
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

	this.testTrim = testTrim;
}

