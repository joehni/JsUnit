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

function AssertionFailedErrorTest( name )
{
	TestCase.call( this, name );
}
function AssertionFailedErrorTest_testToString()
{
	var afe = new AssertionFailedError( "The Message", null );
	this.assertEquals( "AssertionFailedError: The Message", afe );
}
AssertionFailedErrorTest.prototype = new TestCase();
AssertionFailedErrorTest.prototype.testToString = AssertionFailedErrorTest_testToString;


function ComparisonFailureTest( name )
{
	TestCase.call( this, name );
}
function ComparisonFailureTest_testToString()
{
	var cf = new ComparisonFailure( "!", "a", "b", null );
	this.assertEquals( "ComparisonFailure: ! expected:<a>, but was:<b>", cf );
	cf = new ComparisonFailure( null, "a", "b", null );
	this.assertEquals( "ComparisonFailure: expected:<a>, but was:<b>", cf );
	cf = new ComparisonFailure( null, "ba", "bc", null );
	this.assertEquals( 
		"ComparisonFailure: expected:<...a>, but was:<...c>", cf );
	cf = new ComparisonFailure( null, "ab", "cb", null );
	this.assertEquals( 
		"ComparisonFailure: expected:<a...>, but was:<c...>", cf );
	cf = new ComparisonFailure( null, "ab", "ab", null );
	this.assertEquals( 
		"ComparisonFailure: expected:<ab>, but was:<ab>", cf );
	cf = new ComparisonFailure( null, "abc", "adc", null );
	this.assertEquals( 
		"ComparisonFailure: expected:<...b...>, but was:<...d...>", cf );
	cf = new ComparisonFailure( null, "ab", "abc", null );
	this.assertEquals( 
		"ComparisonFailure: expected:<...>, but was:<...c>", cf );
	cf = new ComparisonFailure( null, "bc", "abc", null );
	this.assertEquals( 
		"ComparisonFailure: expected:<...>, but was:<a...>", cf );
	cf = new ComparisonFailure( null, "abc", "abbc", null );
	this.assertEquals( 
		"ComparisonFailure: expected:<......>, but was:<...b...>", cf );
	cf = new ComparisonFailure( null, "abcdde", "abcde", null );
	this.assertEquals( 
		"ComparisonFailure: expected:<...d...>, but was:<......>", cf );
	cf = new ComparisonFailure( null, "a", null, null );
	this.assertEquals( 
		"ComparisonFailure: expected:<a>, but was:<null>", cf );
	cf = new ComparisonFailure( null, null, "a", null );
	this.assertEquals( 
		"ComparisonFailure: expected:<null>, but was:<a>", cf );
}
ComparisonFailureTest.prototype = new TestCase();
ComparisonFailureTest.prototype.testToString = ComparisonFailureTest_testToString;


function TestFailureTest( name )
{
	TestCase.call( this, name );
}
function TestFailureTest_testExceptionMessage()
{
	var ft = new TestFailure( this.mTest, this.mException );
	this.assertEquals( "AssertionFailedError: Message", ft.exceptionMessage());
}
function TestFailureTest_testFailedTest()
{
	var ft = new TestFailure( this.mTest, this.mException );
	this.assertEquals( "testFunction", ft.failedTest());
}
function TestFailureTest_testIsFailure()
{
	var ft = new TestFailure( this.mTest, this.mException );
	this.assertTrue( ft.isFailure());
	ft = new TestFailure( this.mTest, new Error( "Error" ));
	this.assertFalse( ft.isFailure());
}
function TestFailureTest_testThrownException()
{
	var ft = new TestFailure( this.mTest, this.mException );
	this.assertEquals( this.mException, ft.thrownException());
}
function TestFailureTest_testToString()
{
	var ft = new TestFailure( this.mTest, this.mException );
	this.assertEquals( 
		"Test testFunction failed: AssertionFailedError: Message", ft );
}
function TestFailureTest_testTrace()
{
	var ft = new TestFailure( this.mTest, 
		new AssertionFailedError( "Message", "Trace" ));
	this.assertEquals( "Trace", ft.trace());
}
TestFailureTest.prototype = new TestCase();
TestFailureTest.prototype.mException = new AssertionFailedError( "Message", null );
TestFailureTest.prototype.mTest = "testFunction";
TestFailureTest.prototype.testExceptionMessage = TestFailureTest_testExceptionMessage;
TestFailureTest.prototype.testFailedTest = TestFailureTest_testFailedTest;
TestFailureTest.prototype.testIsFailure = TestFailureTest_testIsFailure;
TestFailureTest.prototype.testThrownException = TestFailureTest_testThrownException;
TestFailureTest.prototype.testToString = TestFailureTest_testToString;
TestFailureTest.prototype.testTrace = TestFailureTest_testTrace;


function TestResultTest( name )
{
	TestCase.call( this, name );

	this.mListener = new TestListener();
	this.mListener.addError = function() { this.mErrors++; };
	this.mListener.addFailure = function() { this.mFailures++; };
	this.mListener.startTest = function() { this.mStarted++; };
	this.mListener.endTest = function() { this.mEnded++; };
}
function TestResultTest_setUp()
{
	this.mListener.mErrors = 0;
	this.mListener.mFailures = 0;
	this.mListener.mStarted = 0;
	this.mListener.mEnded = 0;
}
function TestResultTest_testAddError()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	result.addError( new Test( "Test" ), new Object());
	this.assertEquals( 1, result.errorCount());
	this.assertEquals( 1, this.mListener.mErrors );
}
function TestResultTest_testAddFailure()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	result.addFailure( new Test( "Test" ), new Object());
	this.assertEquals( 1, result.failureCount());
	this.assertEquals( 1, this.mListener.mFailures );
}
function TestResultTest_testAddListener()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	result.run( new TestResultTest( "testAddError" ));
	this.assertEquals( 1, this.mListener.mStarted );
	this.assertEquals( 1, this.mListener.mEnded );
	this.assertEquals( 0, this.mListener.mErrors );
	this.assertEquals( 0, this.mListener.mFailures );
}
function TestResultTest_testCloneListeners()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	var listeners = result.cloneListeners();
	this.assertEquals( 1, listeners.length );
	this.assertEquals( 0, this.mListener.mStarted );
	this.assertEquals( 0, this.mListener.mEnded );
	this.assertEquals( 0, listeners[0].mStarted );
	this.assertEquals( 0, listeners[0].mEnded );
	result.run( new TestResultTest( "testAddError" ));
	this.assertEquals( 1, this.mListener.mStarted );
	this.assertEquals( 1, this.mListener.mEnded );
	this.assertEquals( 1, listeners[0].mStarted );
	this.assertEquals( 1, listeners[0].mEnded );
	result.removeListener( this.mListener );
	this.assertEquals( 1, listeners.length );
	this.assertEquals( 0, result.cloneListeners().length );
}
function TestResultTest_testEndTest()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	result.endTest( new Test( "Test" ));
	this.assertEquals( 1, this.mListener.mEnded );
}
function TestResultTest_testErrorCount()
{
	var result = new TestResult();
	result.addError( new Test( "Test" ), new Object());
	this.assertEquals( 1, result.errorCount());
}
function TestResultTest_testFailureCount()
{
	var result = new TestResult();
	result.addFailure( new Test( "Test" ), new Object());
	this.assertEquals( 1, result.failureCount());
}
function TestResultTest_testRemoveListener()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	result.run( new TestResultTest( "testRemoveError" ));
	this.assertEquals( 1, this.mListener.mStarted );
	this.assertEquals( 1, this.mListener.mEnded );
	this.setUp();
	result.removeListener( this.mListener );
	result.run( new TestResultTest( "testRemoveError" ));
	this.assertEquals( 0, this.mListener.mStarted );
	this.assertEquals( 0, this.mListener.mEnded );
}
function TestResultTest_testRun()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	var test = new TestResultTest( "testAddError" );
	result.run( test );
	this.assertEquals( 1, this.mListener.mStarted );
	this.assertEquals( 1, this.mListener.mEnded );
}
function TestResultTest_testRunCount()
{
	var result = new TestResult();
	var test = new TestResultTest( "testAddError" );
	result.run( test );
	test.testAddError = function() 
	{ 
		throw new AssertionFailedError( "Message", null ); 
	}
	result.run( test );
	this.assertEquals( 2, result.runCount());
}
function TestResultTest_testRunProtected()
{
	function OnTheFly() { this.mThrown = null; }
	OnTheFly.prototype.protect = function()
	{	
		try
		{
			test.runBare();	
		}
		catch( ex )
		{
			this.mThrown = ex;
			throw ex;
		}
	}
	OnTheFly.fulfills( Protectable );
	
	var result = new TestResult();
	var test = new TestResultTest( "testAddError" );
	this.assertEquals( 0, result.errorCount());
	this.assertEquals( 0, result.failureCount());
	var fly = new OnTheFly();
	result.runProtected( test, fly );
	this.assertEquals( 0, result.errorCount());
	this.assertEquals( 0, result.failureCount());
	this.assertNull( fly.mThrown );
	this.setUp();
	test.testAddError = function() 
	{ 
		throw new AssertionFailedError( "Message", null ); 
	}
	fly = new OnTheFly();
	result.runProtected( test, fly );
	this.assertEquals( 0, result.errorCount());
	this.assertEquals( 1, result.failureCount());
	this.assertNotNull( fly.mThrown );
	this.setUp();
	test.testAddError = function() 
	{ 
		throw new Object(); 
	}
	fly = new OnTheFly();
	result.runProtected( test, fly );
	this.assertEquals( 1, result.errorCount());
	this.assertEquals( 1, result.failureCount());
	this.assertNotNull( fly.mThrown );
}
function TestResultTest_testShouldStop()
{
	var result = new TestResult();
	result.stop();
	this.assertEquals( 1, result.shouldStop());
}
function TestResultTest_testStartTest()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	result.startTest( new Test( "Test" ));
	this.assertEquals( 1, this.mListener.mStarted );
}
function TestResultTest_testStop()
{
	var result = new TestResult();
	result.stop();
	this.assertEquals( 1, result.shouldStop());
}
function TestResultTest_testWasSuccessful()
{
	var result = new TestResult();
	var test = new TestResultTest( "testAddError" )
	result.run( test );
	this.assertTrue( result.wasSuccessful());
	test.testAddError = function() 
	{ 
		throw new AssertionFailedError( "Message", null ); 
	}
	result.run( test );
	this.assertFalse( result.wasSuccessful());
	result = new TestResult();
	test.testAddError = function() 
	{ 
		throw new Object(); 
	}
	result.run( test );
	this.assertFalse( result.wasSuccessful());
}
TestResultTest.prototype = new TestCase();
TestResultTest.prototype.setUp = TestResultTest_setUp;
TestResultTest.prototype.testAddError = TestResultTest_testAddError;
TestResultTest.prototype.testAddFailure = TestResultTest_testAddFailure;
TestResultTest.prototype.testAddListener = TestResultTest_testAddListener;
TestResultTest.prototype.testCloneListeners = TestResultTest_testCloneListeners;
TestResultTest.prototype.testEndTest = TestResultTest_testEndTest;
TestResultTest.prototype.testErrorCount = TestResultTest_testErrorCount;
TestResultTest.prototype.testFailureCount = TestResultTest_testFailureCount;
TestResultTest.prototype.testRemoveListener = TestResultTest_testRemoveListener;
TestResultTest.prototype.testRun = TestResultTest_testRun;
TestResultTest.prototype.testRunCount = TestResultTest_testRunCount;
TestResultTest.prototype.testRunProtected = TestResultTest_testRunProtected;
TestResultTest.prototype.testShouldStop = TestResultTest_testShouldStop;
TestResultTest.prototype.testStartTest = TestResultTest_testStartTest;
TestResultTest.prototype.testStop = TestResultTest_testStop;
TestResultTest.prototype.testWasSuccessful = TestResultTest_testWasSuccessful;


function AssertTest( name )
{
	TestCase.call( this, name );
}
function AssertTest_testAssertEquals()
{
	this.mAssert.assertEquals( 1, 1 );
	this.mAssert.assertEquals( "1 is 1", 1, 1 );
	try
	{
		this.mAssert.assertEquals( 0, 1 );
		this.fail( "'assertEquals' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
	try
	{
		this.mAssert.assertEquals( "0 is not 1", 0, 1 );
		this.fail( "'assertEquals' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "0 is not 1" ) > 0 );
	}
	this.mAssert.assertEquals( "This is 1", "This is 1" );
	try
	{
		this.mAssert.assertEquals( "This is 1", "This is 0" );
		this.fail( "'assertEquals' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof ComparisonFailure );
		this.assertTrue( ex.toString().indexOf( "...1>" ) > 0 );
	}
	this.mAssert.assertEquals( /.*1$/, "This is 1" );
	try
	{
		this.mAssert.assertEquals( /.*1$/, "This is 0" );
		this.fail( "'assertEquals' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "RegExp" ) > 0 );
	}
}
function AssertTest_testAssertFalse()
{
	this.mAssert.assertFalse( "Should not throw!", false );
	this.mAssert.assertFalse( false );
	try
	{
		this.mAssert.assertFalse( "Have to throw!", true );
		this.fail( "'assertFalse' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "Have to throw!" ) > 0 );
	}
	try
	{
		this.mAssert.assertFalse( true );
		this.fail( "'assertFalse' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertNotNull()
{
	this.mAssert.assertNotNull( "Is null!", 0 );
	this.mAssert.assertNotNull( 0 );
	this.mAssert.assertNotNull( "Is null!", 1 );
	this.mAssert.assertNotNull( 1 );
	this.mAssert.assertNotNull( "Is null!", "Hi!" );
	this.mAssert.assertNotNull( "Hi!" );
	try
	{
		this.mAssert.assertNotNull( null );
		this.fail( "'assertNotNull' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
	try
	{
		this.mAssert.assertNotNull( "Is null!", null );
		this.fail( "'assertNotNull' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "Is null!" ) > 0 );
	}
}
function AssertTest_testAssertNotSame()
{
	var one = new String( "1" );
	this.mAssert.assertNotSame( "Should not throw!", one, new String( "1" ));
	this.mAssert.assertNotSame( one, one, new String( "1" ));
	try
	{
		var me = this;
		this.mAssert.assertNotSame( "Have to throw!", this, me );
		this.fail( "'assertNotSame' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "Have to throw!" ) > 0 );
	}
	try
	{
		var me = this;
		this.mAssert.assertNotSame( this, me );
		this.fail( "'assertNotSame' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertNotUndefined()
{
	this.mAssert.assertNotUndefined( "Is undefined!", 0 );
	this.mAssert.assertNotUndefined( 0 );
	this.mAssert.assertNotUndefined( "Is undefined!", false );
	this.mAssert.assertNotUndefined( false );
	this.mAssert.assertNotUndefined( "Is undefined!", "Hi!" );
	this.mAssert.assertNotUndefined( "Hi!" );
	try
	{
		var undefdVar;
		this.mAssert.assertNotUndefined( undefdVar );
		this.fail( "'assertNotUndefined' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
	try
	{
		var undefdVar;
		this.mAssert.assertNotUndefined( "Is undefined!", undefdVar );
		this.fail( "'assertNotUndefined' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "Is undefined!" ) > 0 );
	}
}
function AssertTest_testAssertNull()
{
	this.mAssert.assertNull( "Is not null!", null );
	this.mAssert.assertNull( null );
	try
	{
		this.mAssert.assertNull( 0 );
		this.fail( "'assertNull' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
	try
	{
		this.mAssert.assertNull( "Is not null!", 0 );
		this.fail( "'assertNull' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "Is not null!" ) > 0 );
	}
}
function AssertTest_testAssertSame()
{
	var me = this;
	this.mAssert.assertSame( "Should not throw!", this, me );
	this.mAssert.assertSame( this, me );
	try
	{
		var one = new String( "1" );
		this.mAssert.assertSame( "Have to throw!", one, new String( "1" ));
		this.fail( "'assertSame' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "Have to throw!" ) > 0 );
	}
	try
	{
		var one = new String( "1" );
		this.mAssert.assertSame( one, new String( "1" ));
		this.fail( "'assertSame' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertTrue()
{
	this.mAssert.assertTrue( "Should not throw!", true );
	this.mAssert.assertTrue( true );
	try
	{
		this.mAssert.assertTrue( "Have to throw!", false );
		this.fail( "'assertTrue' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "Have to throw!" ) > 0 );
	}
	try
	{
		this.mAssert.assertTrue( false );
		this.fail( "'assertTrue' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertUndefined()
{
	function fn() {}
	var x;
	this.mAssert.assertUndefined( "Not undefined!", undefined );
	this.mAssert.assertUndefined( undefined );
	this.mAssert.assertUndefined( "Not undefined!", x );
	this.mAssert.assertUndefined( x );
	this.mAssert.assertUndefined( "Not undefined!", fn());
	this.mAssert.assertUndefined( fn());
	try
	{
		this.mAssert.assertUndefined( this );
		this.fail( "'assertUndefined' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
	try
	{
		this.mAssert.assertUndefined( "Not undefined!", this );
		this.fail( "'assertUndefined' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "Not undefined!" ) > 0 );
	}
}
function AssertTest_testFail()
{
	try
	{
		this.mAssert.fail( "Have to throw!", null );
		this.fail( "'fail' should have thrown." );
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
		this.assertTrue( ex.toString().indexOf( "Have to throw!" ) > 0 );
	}
}
AssertTest.prototype = new TestCase();
AssertTest.prototype.mAssert = new Assert();
AssertTest.prototype.testAssertEquals = AssertTest_testAssertEquals;
AssertTest.prototype.testAssertFalse = AssertTest_testAssertFalse;
AssertTest.prototype.testAssertNotNull = AssertTest_testAssertNotNull;
AssertTest.prototype.testAssertNotSame = AssertTest_testAssertNotSame;
AssertTest.prototype.testAssertNotUndefined = AssertTest_testAssertNotUndefined;
AssertTest.prototype.testAssertNull = AssertTest_testAssertNull;
AssertTest.prototype.testAssertSame = AssertTest_testAssertSame;
AssertTest.prototype.testAssertTrue = AssertTest_testAssertTrue;
AssertTest.prototype.testAssertUndefined = AssertTest_testAssertUndefined;
AssertTest.prototype.testFail = AssertTest_testFail;


function TestCaseTest( name )
{
	TestCase.call( this, name );
}
function TestCaseTest_setUp()
{
	this.mTestCase = new this.MyTestCase();
}
function TestCaseTest_testCountTestCases()
{
	this.assertEquals( 1, this.mTestCase.countTestCases());
}
function TestCaseTest_testCreateResult()
{
	this.assertTrue( this.mTestCase.createResult() instanceof TestResult );
}
function TestCaseTest_testFindTest()
{
	this.assertEquals( "testMe", this.mTestCase.findTest( "testMe" ));
	this.assertNull( this.mTestCase.findTest( "Any" ));
}
function TestCaseTest_testGetName()
{
	this.assertEquals( "testMe", this.mTestCase.getName());
}
function TestCaseTest_testRun()
{
	var result = new TestResult();
	this.mTestCase.run( result );
	this.assertTrue( result.wasSuccessful());
	result = this.mTestCase.run();
	this.assertTrue( result.wasSuccessful());
}
function TestCaseTest_testRunTest()
{
	try
	{
		this.mTestCase.runTest();
	}
	catch( ex )
	{
		this.fail( "runTest throwed unexpected exception." );
	}
	try
	{
		this.mTestCase.setName( "noMember" );
		this.mTestCase.runTest();
		this.fail( "runTest did not throw expected exception." );
	}
	catch( ex )
	{
	}
}
function TestCaseTest_testSetName()
{
	this.mTestCase.setName( "newName" );
	this.assertEquals( "newName", this.mTestCase.getName());
}
function TestCaseTest_testSetUp()
{
	this.mTestCase.run( new TestResult());
	this.assertTrue( this.mTestCase.mSetUp );
}
function TestCaseTest_testTearDown()
{
	this.mTestCase.run( new TestResult());
	this.assertTrue(this.mTestCase.mTearDown );
}
function TestCaseTest_testToString()
{
	this.assertEquals( "testMe", this.mTestCase.toString());
	this.assertEquals( "testMe", this.mTestCase );
}
TestCaseTest.prototype = new TestCase();
TestCaseTest.prototype.setUp = TestCaseTest_setUp;
TestCaseTest.prototype.testCountTestCases = TestCaseTest_testCountTestCases;
TestCaseTest.prototype.testCreateResult = TestCaseTest_testCreateResult;
TestCaseTest.prototype.testFindTest = TestCaseTest_testFindTest;
TestCaseTest.prototype.testGetName = TestCaseTest_testGetName;
TestCaseTest.prototype.testRun = TestCaseTest_testRun;
TestCaseTest.prototype.testRunTest = TestCaseTest_testRunTest;
TestCaseTest.prototype.testSetName = TestCaseTest_testSetName;
TestCaseTest.prototype.testSetUp = TestCaseTest_testSetUp;
TestCaseTest.prototype.testTearDown = TestCaseTest_testTearDown;
TestCaseTest.prototype.testToString = TestCaseTest_testToString;
TestCaseTest.prototype.MyTestCase = function()
{
	TestCase.call( this, "testMe" );

	this.mSetUp = false;
	this.mTearDown = false;
}
TestCaseTest.prototype.MyTestCase.prototype = new TestCase();
TestCaseTest.prototype.MyTestCase.prototype.setUp = 
	function() { this.mSetUp = true; }
TestCaseTest.prototype.MyTestCase.prototype.testMe = function() { }
TestCaseTest.prototype.MyTestCase.prototype.tearDown = 
	function() { this.mTearDown = true; }


function TestSuiteTest( name )
{
	TestCase.call( this, name );
}
function TestSuiteTest_testCtor()
{
	var undef;
	var suite = new TestSuite();
	this.assertEquals( 0, suite.countTestCases());
	this.assertNull( suite.getName());
	suite = new TestSuite( null );
	this.assertEquals( 0, suite.countTestCases());
	this.assertNull( suite.getName());
	suite = new TestSuite( undef );
	this.assertEquals( 0, suite.countTestCases());
	this.assertNull( suite.getName());
	suite = new TestSuite( "name" );
	this.assertEquals( 0, suite.countTestCases());
	this.assertEquals( "name", suite.getName());
	suite = new TestSuite( this.MyTest );
	this.assertEquals( 2, suite.countTestCases());
	this.assertEquals( "MyTest", suite.getName());
	suite = new TestSuite( new this.MyTest());
	this.assertEquals( 1, suite.countTestCases());
	this.assertNull( suite.getName());
	suite = new TestSuite( new this.MyTest( "name" ));
	this.assertEquals( 1, suite.countTestCases());
	this.assertNull( suite.getName());
}
function TestSuiteTest_testAddTest()
{
	var suite = new TestSuite();
	this.assertEquals( 0, suite.countTestCases());
	this.assertUndefined( suite.addTest( new this.MyTest( "testMe" )));
	this.assertEquals( 1, suite.countTestCases());
}
function TestSuiteTest_testAddTestSuite()
{
	var suite = new TestSuite();
	this.assertEquals( 0, suite.countTestCases());
	this.assertUndefined( suite.addTestSuite( this.MyTest ));
	this.assertEquals( 2, suite.countTestCases());
}
function TestSuiteTest_testCountTestCases()
{
	var suite = new TestSuite();
	this.assertEquals( 0, suite.countTestCases());
	suite.addTest( new this.MyTest( "testMe" ));
	this.assertEquals( 1, suite.countTestCases());
	suite.addTest( new this.MyTest( "testMyself" ));
	this.assertEquals( 2, suite.countTestCases());
	suite.addTest( new TestSuite( this.MyTest ));
	this.assertEquals( 4, suite.countTestCases());
}
function TestSuiteTest_testFindTest()
{
	var suite = new TestSuite( this.MyTest );
	var test = suite.findTest( "testMe" );
	this.assertEquals( "testMe", test.getName());
	this.assertNotNull( suite.findTest( "testMyself" ));
	this.assertNotNull( suite.findTest( "MyTest" ));
	this.assertNull( suite.findTest( "you" ));
	this.assertNull( suite.findTest());
}
function TestSuiteTest_testGetName()
{
	var suite = new TestSuite( "name" );
	this.assertEquals( "name", suite.getName());
}
function TestSuiteTest_testRun()
{
	var suite = new TestSuite();
	var result = new TestResult();
	suite.run( result );
	this.assertEquals( 1, result.failureCount());
	this.assertEquals( 0, result.runCount());
	result = new TestResult();
	result.addFailure = function() { this.stop(); }
	suite.addTest( new TestSuite( this.MyTest ));
	suite.addTest( new TestSuite());
	suite.addTest( new TestSuite( this.MyTest ));
	suite.run( result );
	this.assertEquals( 2, result.runCount());
	this.assertEquals( 4, suite.countTestCases());
}
function TestSuiteTest_testRunTest()
{
	var suite = new TestSuite();
	var result = new TestResult();
	suite.runTest( new this.MyTest( "name" ), result );
	this.assertEquals( 1, result.runCount());
}
function TestSuiteTest_testSetName()
{
	var suite = new TestSuite();
	this.assertNull( suite.getName());
	suite.setName( "name" );
	this.assertEquals( "name", suite.getName());
}
function TestSuiteTest_testTestAt()
{
	var suite = new TestSuite();
	suite.addTest( new TestSuite( this.MyTest ));
	suite.addTest( new this.MyTest( "testMyself" ));
	this.assertEquals( "MyTest", suite.testAt( 0 ).getName());
	this.assertEquals( "testMyself", suite.testAt( 1 ).getName());
	this.assertUndefined( suite.testAt( 2 ));
}
function TestSuiteTest_testTestCount()
{
	var suite = new TestSuite();
	this.assertEquals( 0, suite.testCount());
	suite.addTest( new TestSuite( this.MyTest ));
	this.assertEquals( 1, suite.testCount());
	suite.addTest( new this.MyTest( "testMyself" ));
	this.assertEquals( 2, suite.testCount());
}
function TestSuiteTest_testToString()
{
	var suite = new TestSuite( "name" );
	this.assertEquals( "Suite 'name'", suite.toString());
	this.assertEquals( "Suite 'name'", suite );
}
function TestSuiteTest_testWarning()
{
	var suite = new TestSuite();
	var test = suite.warning( "This is a warning!" );
	this.assertEquals( "warning", test.getName());
	var result = new TestResult();
	suite.runTest( test, result );
	this.assertEquals( 1, result.failureCount());
	this.assertTrue( result.mFailures[0].toString().indexOf( 
		"This is a warning!" ) > 0 );
}
TestSuiteTest.prototype = new TestCase();
TestSuiteTest.prototype.testCtor = TestSuiteTest_testCtor;
TestSuiteTest.prototype.testAddTest = TestSuiteTest_testAddTest;
TestSuiteTest.prototype.testAddTestSuite = TestSuiteTest_testAddTestSuite;
TestSuiteTest.prototype.testCountTestCases = TestSuiteTest_testCountTestCases;
TestSuiteTest.prototype.testFindTest = TestSuiteTest_testFindTest;
TestSuiteTest.prototype.testGetName = TestSuiteTest_testGetName;
TestSuiteTest.prototype.testRun = TestSuiteTest_testRun;
TestSuiteTest.prototype.testRunTest = TestSuiteTest_testRunTest;
TestSuiteTest.prototype.testSetName = TestSuiteTest_testSetName;
TestSuiteTest.prototype.testTestAt = TestSuiteTest_testTestAt;
TestSuiteTest.prototype.testTestCount = TestSuiteTest_testTestCount;
TestSuiteTest.prototype.testToString = TestSuiteTest_testToString;
TestSuiteTest.prototype.testWarning = TestSuiteTest_testWarning;
TestSuiteTest.prototype.MyTest = function MyTest( name )
{
	TestCase.call( this, name );
};
TestSuiteTest.prototype.MyTest.prototype = new TestCase();
TestSuiteTest.prototype.MyTest.prototype.testMe = function() {};
TestSuiteTest.prototype.MyTest.prototype.testMyself = function() {};


function TestDecoratorTest( name )
{
	TestCase.call( this, name );
}
function TestDecoratorTest_setUp()
{
	function OnTheFly( name ) { TestCase.call( this, name ); }
	OnTheFly.prototype = new TestCase();
	OnTheFly.prototype.testMe = function() {}
	OnTheFly.prototype.testMyself = function() {}
	
	this.mTest = new TestSuite( OnTheFly );
	this.mTest.runTest = function() { this.mCalled = true; }
}
function TestDecoratorTest_testBasicRun()
{
	var decorator = new TestDecorator( this.mTest );
	decorator.basicRun( new TestResult());
	this.assertTrue( this.mTest.mCalled );
}
function TestDecoratorTest_testCountTestCases()
{
	var decorator = new TestDecorator( this.mTest );
	this.assertEquals( 2, decorator.countTestCases());
}
function TestDecoratorTest_testFindTest()
{
	var decorator = new TestDecorator( this.mTest );
	this.assertNotNull( decorator.findTest( "testMyself" ));
}
function TestDecoratorTest_testGetName()
{
	var decorator = new TestDecorator( this.mTest );
	this.assertEquals( "OnTheFly", decorator.getName());
}
function TestDecoratorTest_testGetTest()
{
	var decorator = new TestDecorator( this.mTest );
	this.assertSame( this.mTest, decorator.getTest());
}
function TestDecoratorTest_testRun()
{
	var decorator = new TestDecorator( this.mTest );
	decorator.run( new TestResult());
	this.assertTrue( this.mTest.mCalled );
}
function TestDecoratorTest_testSetName()
{
	var decorator = new TestDecorator( this.mTest );
	decorator.setName( "FlyAlone" );
	this.assertEquals( "FlyAlone", this.mTest.getName());
}
function TestDecoratorTest_testToString()
{
	var decorator = new TestDecorator( this.mTest );
	this.assertTrue( decorator.toString().indexOf( "'OnTheFly'" ) > 0 );
}
TestDecoratorTest.prototype = new TestCase();
TestDecoratorTest.prototype.setUp = TestDecoratorTest_setUp;
TestDecoratorTest.prototype.testBasicRun = TestDecoratorTest_testBasicRun;
TestDecoratorTest.prototype.testCountTestCases = TestDecoratorTest_testCountTestCases;
TestDecoratorTest.prototype.testFindTest = TestDecoratorTest_testFindTest;
TestDecoratorTest.prototype.testGetName = TestDecoratorTest_testGetName;
TestDecoratorTest.prototype.testGetTest = TestDecoratorTest_testGetTest;
TestDecoratorTest.prototype.testRun = TestDecoratorTest_testRun;
TestDecoratorTest.prototype.testSetName = TestDecoratorTest_testSetName;
TestDecoratorTest.prototype.testToString = TestDecoratorTest_testToString;


function TestSetupTest( name )
{
	TestCase.call( this, name );
}
function TestSetupTest_testRun()
{
	var test = new TestSetup( new Test());
	test.setUp = function() { this.mSetUp = true; }
	test.tearDown = function() { this.mTearDown = true; }
	test.run( new TestResult());
	this.assertTrue( test.mSetUp );
	this.assertTrue( test.mTearDown );
}
TestSetupTest.prototype = new TestCase();
TestSetupTest.prototype.testRun = TestSetupTest_testRun;


function RepeatedTestTest( name )
{
	TestCase.call( this, name );
}
function RepeatedTestTest_setUp()
{
	function OnTheFly( name ) { TestCase.call( this, name ); }
	OnTheFly.prototype = new TestCase();
	OnTheFly.prototype.testMe = function() {}
	OnTheFly.prototype.testMyself = function() {}
	
	this.mTest = new TestSuite( OnTheFly );
	this.mTest.runTest = function() { this.mCount++; }
	this.mTest.mCount = 0;
}
function RepeatedTestTest_testCountTestCases()
{
	var test = new RepeatedTest( this.mTest, 5 );
	this.assertEquals( 10, test.countTestCases());
	this.setUp();
	test = new RepeatedTest( this.mTest, 0 );
	this.assertEquals( 0, test.countTestCases());
}
function RepeatedTestTest_testRun()
{
	var test = new RepeatedTest( this.mTest, 5 );
	test.run( new TestResult());
	this.assertEquals( 10, this.mTest.mCount );
	this.setUp();
	test = new RepeatedTest( this.mTest, 0 );
	test.run( new TestResult());
	this.assertEquals( 0, this.mTest.mCount );
}
function RepeatedTestTest_testToString()
{
	var test = new RepeatedTest( this.mTest, 5 );
	this.assertTrue( test.toString().indexOf( "(repeated)" ) > 0);
}
RepeatedTestTest.prototype = new TestCase();
RepeatedTestTest.prototype.setUp = RepeatedTestTest_setUp;
RepeatedTestTest.prototype.testCountTestCases = RepeatedTestTest_testCountTestCases;
RepeatedTestTest.prototype.testRun = RepeatedTestTest_testRun;
RepeatedTestTest.prototype.testToString = RepeatedTestTest_testToString;


function ExceptionTestCaseTest( name )
{
	TestCase.call( this, name );
}
function ExceptionTestCaseTest_testRunTest()
{
	function OnTheFly( name ) 
	{ 
		ExceptionTestCase.call( this, name, TestCase ); 
	}
	OnTheFly.prototype = new ExceptionTestCase();
	OnTheFly.prototype.testClass = function() { throw new TestCase(); }
	OnTheFly.prototype.testDerived = function() { throw new OnTheFly(); }
	OnTheFly.prototype.testOther = function() { throw new Error(); }
	OnTheFly.prototype.testNone = function() {}

	var test = new OnTheFly( "testClass" );
	this.assertTrue( test.run().wasSuccessful());
	test = new OnTheFly( "testDerived" );
	this.assertTrue( test.run().wasSuccessful());
	test = new OnTheFly( "testOther" );
	this.assertEquals( 1, test.run().errorCount());
	test = new OnTheFly( "testNone" );
	this.assertEquals( 1, test.run().failureCount());
}
ExceptionTestCaseTest.prototype = new TestCase();
ExceptionTestCaseTest.prototype.testRunTest = ExceptionTestCaseTest_testRunTest;


function TestRunnerTest( name )
{
	TestCase.call( this, name );
	this.mRunner = new TestRunner();
}
function TestRunnerTest_testAddSuite()
{
	this.assertUndefined( this.mRunner.addSuite( new TestSuite()));
	this.assertEquals( 0, this.mRunner.countTestCases());
	this.mRunner.addSuite( new TestSuite( this.MyTest ));
	this.assertEquals( 2, this.mRunner.countTestCases());
}
function TestRunnerTest_testCountTestCases()
{
	this.assertEquals( 0, this.mRunner.countTestCases());
	this.mRunner.addSuite( new TestSuite( this.MyTest ));
	this.assertEquals( 2, this.mRunner.countTestCases());
}
function TestRunnerTest_testCreateTestResult()
{
	this.assertTrue( this.mRunner.createTestResult() instanceof TestResult );
}
function TestRunnerTest_testRun()
{
	this.mRunner.addSuite( new TestSuite( this.MyTest ));
	var result = new TestResult();
	this.assertUndefined( this.mRunner.run( "none", result ));
	this.assertEquals( 1, result.failureCount());
	this.assertEquals( 0, result.runCount());
	result = new TestResult();
	this.assertUndefined( this.mRunner.run( "testMe", result ));
	this.assertEquals( 0, result.failureCount());
	this.assertEquals( 1, result.runCount());
}
function TestRunnerTest_testRunAll()
{
	this.mRunner.addSuite( new TestSuite( this.MyTest ));
	var result = new TestResult();
	this.assertUndefined( this.mRunner.runAll( result ));
	this.assertEquals( 2, result.runCount());
}
TestRunnerTest.prototype = new TestCase();
TestRunnerTest.prototype.testAddSuite = TestRunnerTest_testAddSuite;
TestRunnerTest.prototype.testCountTestCases = TestRunnerTest_testCountTestCases;
TestRunnerTest.prototype.testCreateTestResult = TestRunnerTest_testCreateTestResult;
TestRunnerTest.prototype.testRun = TestRunnerTest_testRun;
TestRunnerTest.prototype.testRunAll = TestRunnerTest_testRunAll;
TestRunnerTest.prototype.MyTest = function MyTest( name )
{
	TestCase.call( this, name );
};
TestRunnerTest.prototype.MyTest.prototype = new TestCase();
TestRunnerTest.prototype.MyTest.prototype.testMe = function() {};
TestRunnerTest.prototype.MyTest.prototype.testMyself = function() {};


function TextTestRunnerTest( name )
{
	TestCase.call( this, name );

	this.mRunner = new TextTestRunner();
	this.mRunner.mMsg = "";
	this.mRunner.writeLn = function( str ) { this.mMsg += str + "~"; }
}
function TextTestRunnerTest_testAddError()
{
	this.assertUndefined( this.mRunner.addError( "testMe", false ));
	this.assertEquals( 0, this.mRunner.mMsg.indexOf( "ERROR in" ));
}
function TextTestRunnerTest_testAddFailure()
{
	this.assertUndefined( 
		this.mRunner.addFailure( "testMe", 
			new AssertionFailedError( "Failed!", new CallStack())));
	this.assertEquals( 0, this.mRunner.mMsg.indexOf( "FAILURE in" ));
}
function TextTestRunnerTest_testEndTest()
{
	var test = new this.MyTest( "My" );
	this.mRunner.endTest( test );
	this.assertEquals( "", this.mRunner.mMsg );
	test.testCount = 1;
	this.mRunner.mNest = "----";
	this.mRunner.endTest( test );
	this.assertEquals( 0, 
		this.mRunner.mMsg.indexOf( "<=== Completed test suite \"My\"" ));
}
function TextTestRunnerTest_testPrintHeader()
{
	this.mRunner.addSuite( new TestSuite( this.MyTest ));
	this.mRunner.start();
	this.assertEquals( 0, 
		this.mRunner.mMsg.indexOf(
			"TestRunner(all) (2 test cases available)" ));
}
function TextTestRunnerTest_testPrintFooter()
{
	this.mRunner.addSuite( new TestSuite( this.MyTest ));
	this.mRunner.start();
	this.assertTrue( this.mRunner.mMsg.indexOf( "2 tests successful" ) > 0 );
	var test = new this.MyTest( "testMe" );
	test.testMe = function() { throw new Object(); }
	var suite = new TestSuite();
	suite.addTest( test );
	this.mRunner.addSuite( suite );
	this.mRunner.start();
	this.assertTrue( this.mRunner.mMsg.indexOf( "1 error, 0 failures." ) > 0 );
}
function TextTestRunnerTest_testStart()
{
	this.mRunner.addSuite( new TestSuite( this.MyTest ));
	this.assertEquals( 0, this.mRunner.start());
	var test = new this.MyTest( "testMe" );
	test.testMe = function() { throw new Object(); }
	var suite = new TestSuite();
	suite.addTest( test );
	this.mRunner.addSuite( suite );
	this.assertEquals( -1, this.mRunner.start());
	this.assertEquals( 0, this.mRunner.start( "testMyself" ));
}
function TextTestRunnerTest_testStartTest()
{
	var test = new this.MyTest( "My" );
	this.mRunner.mNest = "---";
	this.mRunner.startTest( test );
	this.assertEquals( 0, 
		this.mRunner.mMsg.indexOf( "--- Running test 1: \"My\"" ));
	this.mRunner.mMsg = "";
	test.testCount = 1;
	this.mRunner.startTest( test );
	this.assertEquals( 0, 
		this.mRunner.mMsg.indexOf( "===> Starting test suite \"My\"" ));
}
function TextTestRunnerTest_testWriteLn()
{
	this.assertUndefined( this.mRunner.writeLn( "OK" ));
	this.assertEquals( "OK~", this.mRunner.mMsg );
}
TextTestRunnerTest.prototype = new TestCase();
TextTestRunnerTest.prototype.testAddError = TextTestRunnerTest_testAddError;
TextTestRunnerTest.prototype.testAddFailure = TextTestRunnerTest_testAddFailure;
TextTestRunnerTest.prototype.testEndTest = TextTestRunnerTest_testEndTest;
TextTestRunnerTest.prototype.testPrintHeader = TextTestRunnerTest_testPrintHeader;
TextTestRunnerTest.prototype.testPrintFooter = TextTestRunnerTest_testPrintFooter;
TextTestRunnerTest.prototype.testStart = TextTestRunnerTest_testStart;
TextTestRunnerTest.prototype.testStartTest = TextTestRunnerTest_testStartTest;
TextTestRunnerTest.prototype.testWriteLn = TextTestRunnerTest_testWriteLn;
TextTestRunnerTest.prototype.MyTest = function MyTest( name )
{
	TestCase.call( this, name );
};
TextTestRunnerTest.prototype.MyTest.prototype = new TestCase();
TextTestRunnerTest.prototype.MyTest.prototype.testMe = function() {};
TextTestRunnerTest.prototype.MyTest.prototype.testMyself = function() {};


function JsUnitTestSuite()
{
	TestSuite.call( this, "JsUnitTest" );
	this.addTestSuite( AssertionFailedErrorTest );
	this.addTestSuite( ComparisonFailureTest );
	this.addTestSuite( TestFailureTest );
	this.addTestSuite( TestResultTest );
	this.addTestSuite( AssertTest );
	this.addTestSuite( TestCaseTest );
	this.addTestSuite( TestSuiteTest );
	this.addTestSuite( TestDecoratorTest );
	this.addTestSuite( TestSetupTest );
	this.addTestSuite( RepeatedTestTest );
	this.addTestSuite( ExceptionTestCaseTest );
	this.addTestSuite( TestRunnerTest );
	this.addTestSuite( TextTestRunnerTest );
}
JsUnitTestSuite.prototype = new TestSuite();

