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

function CallStackTest( name )
{
	TestCase.call( this, name );
}
function CallStackTest_testCtor()
{
	if( JsUtil.prototype.hasCallStackSupport )
	{
		var cs = this.f0().getStack();
		cs = this.f12().getStack();
		this.assertEquals( 10, cs.length );
		this.assertEquals( /^f9\(.*\)$/, cs.pop());
		cs = this.f12(13).getStack();
		this.assertEquals( /^f12\(.*\)$/, cs.pop());
		cs = this.f4().getStack();
		this.assertEquals( /^f4\(.*\)$/, cs[4] );
		this.assertEquals( /^CallStackTest_testCtor\(.*\)$/, cs[5] );
	}
}
function CallStackTest_testFill()
{
	if( JsUtil.prototype.hasCallStackSupport )
	{
		this.f0 = function f0( d ) { this.cs.fill(d); }

		this.cs = new CallStack();
		this.f12(13);
		this.assertEquals( /^f12\(.*\)$/, this.cs.getStack().pop());
		this.f0();
		this.assertEquals( /^f0\(.*\)$/, this.cs.getStack()[0] );
	}
}
function CallStackTest_testGetStack()
{
	if( JsUtil.prototype.hasCallStackSupport )
	{
		var cs = this.f12(13);
		this.assertEquals( 13, cs.getStack().length );
		cs = this.f0();
		this.assertEquals( 10, cs.getStack().length );
	}
}
function CallStackTest_testToString()
{
	if( JsUtil.prototype.hasCallStackSupport )
	{
		var cs = this.f4().toString().replace( /\n/g, "|" );
		this.assertTrue( cs.indexOf( "f5" ) == -1 );
		this.assertTrue( cs.indexOf( "f4" ) >= 0 );
		this.assertTrue( cs.indexOf( "testToString" ) >= 0 );
	}
}
CallStackTest.prototype = new TestCase();
CallStackTest.prototype.ctor = CallStackTest;
CallStackTest.prototype.testCtor = CallStackTest_testCtor;
CallStackTest.prototype.testGetStack = CallStackTest_testGetStack;
CallStackTest.prototype.testFill = CallStackTest_testFill;
CallStackTest.prototype.testToString = CallStackTest_testToString;
CallStackTest.prototype.f0 = function f0(d) { return new CallStack(d); }
CallStackTest.prototype.f1 = function f1(d) { return this.f0(d); }
CallStackTest.prototype.f2 = function f2(d) { return this.f1(d); }
CallStackTest.prototype.f3 = function f3(d) { return this.f2(d); }
CallStackTest.prototype.f4 = function f4(d) { return this.f3(d); }
CallStackTest.prototype.f5 = function f5(d) { return this.f4(d); }
CallStackTest.prototype.f6 = function f6(d) { return this.f5(d); }
CallStackTest.prototype.f7 = function f7(d) { return this.f6(d); }
CallStackTest.prototype.f8 = function f8(d) { return this.f7(d); }
CallStackTest.prototype.f9 = function f9(d) { return this.f8(d); }
CallStackTest.prototype.f10 = function f10(d) { return this.f9(d); }
CallStackTest.prototype.f11 = function f11(d) { return this.f10(d); }
CallStackTest.prototype.f12 = function f12(d) { return this.f11(d); }


function ArrayTest( name )
{
	TestCase.call( this, name );
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
	TestCase.call( this, name );
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


function ErrorTest( name )
{
	TestCase.call( this, name );
}
function ErrorTest_testAttributes()
{
	if( Error.prototype.testable )
	{
		var err = new Error( "my message" );
		this.assertEquals( "Error", err.name );
		this.assertEquals( "my message", err.message );
	}
}
function ErrorTest_testCtorAsFunction()
{
	if( Error.prototype.testable )
	{
		var err = Error( "my message" );
		this.assertTrue( err instanceof Error );
		this.assertEquals( "Error", err.name );
		this.assertEquals( "my message", err.message );
	}
}
ErrorTest.prototype = new TestCase();
ErrorTest.prototype.testAttributes = ErrorTest_testAttributes;
ErrorTest.prototype.testCtorAsFunction = ErrorTest_testCtorAsFunction;


function JsUnitErrorTest( name )
{
	TestCase.call( this, name );
}
function JsUnitErrorTest_testAttributes()
{
	var err = new JsUnitError( "my message" );
	this.assertEquals( "JsUnitError", err.name );
	this.assertEquals( "my message", err.message );
	err = new JsUnitError();
	this.assertEquals( "", err.message );
}
function JsUnitErrorTest_testToString()
{
	var err = new JsUnitError( "my message" );
	this.assertEquals( "JsUnitError: my message", err.toString());
}
JsUnitErrorTest.prototype = new TestCase();
JsUnitErrorTest.prototype.testAttributes = JsUnitErrorTest_testAttributes;
JsUnitErrorTest.prototype.testToString = JsUnitErrorTest_testToString;


function InterfaceDefinitionErrorTest( name )
{
	TestCase.call( this, name );
}
function InterfaceDefinitionErrorTest_testAttributes()
{
	var err = new InterfaceDefinitionError( "my message" );
	this.assertEquals( "InterfaceDefinitionError", err.name );
	this.assertEquals( "my message", err.message );
}
InterfaceDefinitionErrorTest.prototype = new TestCase();
InterfaceDefinitionErrorTest.prototype.testAttributes = InterfaceDefinitionErrorTest_testAttributes;


function FunctionTest( name )
{
	TestCase.call( this, name );
}
function FunctionTest_testFulfills()
{
	function MyInterface1()	{}
	MyInterface1.prototype = new Function();
	MyInterface1.prototype.if1 = function() {}

	function MyInterface2()	{}
	MyInterface2.prototype = new Function();
	MyInterface2.prototype.if2 = function() {}
	
	function MyInterface2Ex() {}
	MyInterface2Ex.prototype = new MyInterface2();
	MyInterface2Ex.prototype.if3 = function() {}
	
	function F() {}
	F.prototype.m1 = "member";
	
	this.assertNotNull( F.fulfills );
	var err = null;
	try { F.fulfills( 1 ); } catch( ex ) { err = ex; }
	this.assertEquals( "InterfaceDefinitionError", err.name );
	try { F.fulfills( new F()); } catch( ex ) { err = ex; }
	this.assertEquals( "InterfaceDefinitionError", err.name );
	try { F.fulfills( F ); } catch( ex ) { err = ex; }
	this.assertEquals( "InterfaceDefinitionError", err.name );
	try { F.fulfills( MyInterface1 ); } catch( ex ) { err = ex; }
	this.assertEquals( "InterfaceDefinitionError", err.name );
	F.prototype.if1 = function() {}
	F.prototype.if2 = function() {}
	F.fulfills( MyInterface1 ); 
	F.fulfills( MyInterface1, MyInterface2 ); 
	
	function G() {}
	G.prototype = new F();
	G.prototype.if3 = function() {}

	G.fulfills( MyInterface1, MyInterface2Ex ); 
}
FunctionTest.prototype = new TestCase();
FunctionTest.prototype.testFulfills = FunctionTest_testFulfills;


function PrinterWriterErrorTest( name )
{
	TestCase.call( this, name );
}
function PrinterWriterErrorTest_testAttributes()
{
	var err = new PrinterWriterError( "my message" );
	this.assertEquals( "PrinterWriterError", err.name );
	this.assertEquals( "my message", err.message );
}
PrinterWriterErrorTest.prototype = new TestCase();
PrinterWriterErrorTest.prototype.testAttributes = PrinterWriterErrorTest_testAttributes;


function PrinterWriterTest( name )
{
	TestCase.call( this, name );
}
function PrinterWriterTest_setUp()
{
	this.mWriter = new PrinterWriter();
	this.mWriter.mLastLine = "";
	this.mWriter._flush = function( str )
	{
		this.mLastLine = str;
	}
	this.mWriter.toString = function()
	{
		return this.mLastLine;
	}
}
function PrinterWriterTest_tearDown()
{
	delete this.mWriter;
}
function PrinterWriterTest_testClose()
{
	this.assertFalse( this.mWriter.mClosed );
	this.mWriter.close();
	this.assertTrue( this.mWriter.mClosed );
}
function PrinterWriterTest_testFlush()
{
	this.assertSame( "", this.mWriter.toString());
	this.mWriter.print( "Test it" );
	this.assertSame( "", this.mWriter.toString());
	this.mWriter.flush();
	this.assertEquals( "Test it\n", this.mWriter.toString());
	this.mWriter.close();
	var err = null;
	try { this.mWriter.flush(); } catch( ex ) { err = ex; }
	this.assertEquals( "PrinterWriterError", err.name );
}
function PrinterWriterTest_testPrint()
{
	this.mWriter.print( "Test it" );
	this.assertSame( "", this.mWriter.toString());
	this.assertEquals( "Test it", this.mWriter.mBuffer );
	this.mWriter.flush();
	this.assertEquals( "Test it\n", this.mWriter.toString());
	this.mWriter.print();
	this.mWriter.print( null );
	this.assertEquals( "Test it\n", this.mWriter.toString());
	this.mWriter.close();
	var err = null;
	try { this.mWriter.print( "again" ); } catch( ex ) { err = ex; }
	this.assertEquals( "PrinterWriterError", err.name );
}
function PrinterWriterTest_testPrintln()
{
	this.assertSame( "", this.mWriter.toString());
	this.mWriter.println( "Test it" );
	this.assertEquals( "Test it\n", this.mWriter.toString());
}
PrinterWriterTest.prototype = new TestCase();
PrinterWriterTest.prototype.setUp = PrinterWriterTest_setUp;
PrinterWriterTest.prototype.tearDown = PrinterWriterTest_tearDown;
PrinterWriterTest.prototype.testClose = PrinterWriterTest_testClose;
PrinterWriterTest.prototype.testFlush = PrinterWriterTest_testFlush;
PrinterWriterTest.prototype.testPrint = PrinterWriterTest_testPrint;
PrinterWriterTest.prototype.testPrintln = PrinterWriterTest_testPrintln;


function SystemWriterTest( name )
{
	TestCase.call( this, name );
}
function SystemWriterTest_testClose()
{
	var writer = new SystemWriter();
	writer._flush = function() {}
	this.assertFalse( writer.mClosed );
	writer.close();
	this.assertFalse( writer.mClosed );
}
SystemWriterTest.prototype = new TestCase();
SystemWriterTest.prototype.testClose = SystemWriterTest_testClose;


function StringWriterTest( name )
{
	TestCase.call( this, name );
}
function StringWriterTest_testGet()
{
	var writer = new StringWriter();
	this.assertFalse( writer.mClosed );
	writer.print( "Js" );
	writer.println( "Unit" );
	writer.print( "rocks!" );
	this.assertEquals( "JsUnit\nrocks!\n", writer.get());
	this.assertTrue( writer.mClosed );
}
StringWriterTest.prototype = new TestCase();
StringWriterTest.prototype.testGet = StringWriterTest_testGet;


function HTMLWriterFilterTest( name )
{
	TestCase.call( this, name );
}
function HTMLWriterFilterTest_testFlush()
{
	var filter = new HTMLWriterFilter();
	filter.println( "Hello & Co. Test if \"5 < 6\" and \"6 > 5\" ..." );
	var str = filter.getWriter().get();
	this.assertEquals( /&amp;/, str );
	this.assertEquals( /&lt;/, str );
	this.assertEquals( /&quot;/, str );
	this.assertEquals( /<br>$/, str );
	this.assertFalse( str.match( /&gt;/ ));
}
function HTMLWriterFilterTest_testGetWriter()
{
	var writer = new PrinterWriter();
	var filter = new HTMLWriterFilter( writer );
	this.assertSame( writer, filter.getWriter());
}
function HTMLWriterFilterTest_testSetWriter()
{
	var filter = new HTMLWriterFilter();
	this.assertTrue( filter.getWriter() instanceof StringWriter );
	var writer = new PrinterWriter();
	filter.setWriter( writer );
	this.assertSame( writer, filter.getWriter());
}
HTMLWriterFilterTest.prototype = new TestCase();
HTMLWriterFilterTest.prototype.testFlush = HTMLWriterFilterTest_testFlush;
HTMLWriterFilterTest.prototype.testGetWriter = HTMLWriterFilterTest_testGetWriter;
HTMLWriterFilterTest.prototype.testSetWriter = HTMLWriterFilterTest_testSetWriter;


function JsUtilTestSuite()
{
	TestSuite.call( this, "JsUtilTest" );
	this.addTestSuite( CallStackTest );
	this.addTestSuite( ArrayTest );
	this.addTestSuite( StringTest );
	this.addTestSuite( ErrorTest );
	this.addTestSuite( JsUnitErrorTest );
	this.addTestSuite( InterfaceDefinitionErrorTest );
	this.addTestSuite( FunctionTest );
	this.addTestSuite( PrinterWriterErrorTest );
	this.addTestSuite( PrinterWriterTest );
	this.addTestSuite( SystemWriterTest );
	this.addTestSuite( StringWriterTest );
	this.addTestSuite( HTMLWriterFilterTest );
}
JsUtilTestSuite.prototype = new TestSuite();
JsUtilTestSuite.prototype.suite = function (){ return new JsUtilTestSuite(); }

