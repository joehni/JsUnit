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


function TestFailureTest( name )
{
	TestCase.call( this, name );
}
function TestFailureTest_testFailedTest()
{
	var ft = new TestFailure( this.mTest, this.mException );
	this.assertEquals( "testFunction", ft.failedTest());
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
TestFailureTest.prototype = new TestCase();
TestFailureTest.prototype.mException = new AssertionFailedError( "Message", null );
TestFailureTest.prototype.mTest = "testFunction";
TestFailureTest.prototype.testFailedTest = TestFailureTest_testFailedTest;
TestFailureTest.prototype.testThrownException = TestFailureTest_testThrownException;
TestFailureTest.prototype.testToString = TestFailureTest_testToString;


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
	result.run( new TestResultTest( "testCloneListeners" ));
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
	OnTheFly.prototype.protect = function( test )
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
function AssertTest_testAssert()
{
	this.mAssert.assert( true, "Should not throw!" );
	try
	{
		this.mAssert.assert( false, "Have to throw!" );
		throw new Object();
	}
	catch( ex )
	{
		this.assertTrue(ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertEquals()
{
	this.mAssert.assertTrue(1 == 1 );
	try
	{
		this.mAssert.assertTrue(0 == 1 );
		throw new Object();
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertFalse()
{
	this.mAssert.assertFalse( false, "Should not throw!" );
	try
	{
		this.mAssert.assertFalse( true, "Have to throw!" );
		throw new Object();
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertNotNull()
{
	this.mAssert.assertNotNull( 0 );
	this.mAssert.assertNotNull( 1 );
	this.mAssert.assertNotNull( "Hi!" );
	try
	{
		this.mAssert.assertNotNull( null );
		throw new Object();
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertNotUndefined()
{
	this.mAssert.assertNotUndefined( 0 );
	this.mAssert.assertNotUndefined( false );
	this.mAssert.assertNotUndefined( "Hi!" );
	try
	{
		this.mAssert.assertNotUndefined( undefined );
		throw new Object();
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertNull()
{
	this.mAssert.assertNull( null );
	try
	{
		this.mAssert.assertNull( 0 );
		throw new Object();
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertTrue()
{
	this.mAssert.assertTrue( true, "Should not throw!" );
	try
	{
		this.mAssert.assertTrue( false, "Have to throw!" );
		throw new Object();
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertUndefined()
{
	var x;
	this.mAssert.assertUndefined( undefined );
	this.mAssert.assertUndefined( x );
	this.mAssert.assertUndefined( Assert());
	try
	{
		this.mAssert.assertUndefined( this );
		throw new Object();
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
function AssertTest_testFail()
{
	try
	{
		this.mAssert.fail( "Have to throw!", null );
		throw new Object();
	}
	catch( ex )
	{
		this.assertTrue( ex instanceof AssertionFailedError );
	}
}
AssertTest.prototype = new TestCase();
AssertTest.prototype.mAssert = new Assert();
AssertTest.prototype.testAssert = AssertTest_testAssert;
AssertTest.prototype.testAssertEquals = AssertTest_testAssertEquals;
AssertTest.prototype.testAssertFalse = AssertTest_testAssertFalse;
AssertTest.prototype.testAssertNotNull = AssertTest_testAssertNotNull;
AssertTest.prototype.testAssertNotUndefined = AssertTest_testAssertNotUndefined;
AssertTest.prototype.testAssertNull = AssertTest_testAssertNull;
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
function TestSuiteTest_testSetUp()
{
	var suite = new TestSuite();
	suite.mSetUp = false;
	suite.setUp = function() { this.mSetUp = true; }
	suite.run( new TestResult());
	this.assertTrue( suite.mSetUp );
}
function TestSuiteTest_testTearDown()
{
	var suite = new TestSuite();
	suite.mTearDown = false;
	suite.tearDown = function() { this.mTearDown = true; }
	suite.run( new TestResult());
	this.assertTrue( suite.mTearDown );
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
TestSuiteTest.prototype.testSetUp = TestSuiteTest_testSetUp;
TestSuiteTest.prototype.testTearDown = TestSuiteTest_testTearDown;
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
	this.assertTrue(
		this.mRunner.createTestResult() instanceof TestResult );
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
	this.addTestSuite( TestFailureTest );
	this.addTestSuite( TestResultTest );
	this.addTestSuite( AssertTest );
	this.addTestSuite( TestCaseTest );
	this.addTestSuite( TestSuiteTest );
	this.addTestSuite( TestRunnerTest );
	this.addTestSuite( TextTestRunnerTest );
}
JsUnitTestSuite.prototype = new TestSuite();

