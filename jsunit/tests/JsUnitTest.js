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

function AssertionFailedErrorTest( name )
{
	this.constructor.call( this, name );
}
function AssertionFailedErrorTest_testToString()
{
	var afe = new AssertionFailedError( "The Message", null );
	this.assertEquals( "The Message", afe );
}
AssertionFailedErrorTest.prototype = new TestCase();
AssertionFailedErrorTest.prototype.testToString = AssertionFailedErrorTest_testToString;


function TestTest( name )
{
	this.constructor.call( this, name );
}
function TestTest_testCountTestCases()
{
	var test = new Test( "Test" );
	this.assertEquals( 0, test.countTestCases());
}
function TestTest_testFindTest()
{
	var test = new Test( "Test" );
	this.assertEquals( "Test", test.findTest( "Test" ));
	this.assertNull( test.findTest( "Any" ));
}
function TestTest_testName()
{
	var test = new Test( "Test" );
	this.assertEquals( "Test", test.name());
}
function TestTest_testRun()
{
	var test = new Test( "Test" );
	this.assertUndefined( test.run());
}
function TestTest_testToString()
{
	var test = new Test( "Test" );
	this.assertEquals( "Test", test );
}
TestTest.prototype = new TestCase();
TestTest.prototype.testCountTestCases = TestTest_testCountTestCases;
TestTest.prototype.testFindTest = TestTest_testFindTest;
TestTest.prototype.testName = TestTest_testName;
TestTest.prototype.testRun = TestTest_testRun;
TestTest.prototype.testToString = TestTest_testToString;


function TestFailureTest( name )
{
	this.constructor.call( this, name );
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
	this.assertEquals( "Test testFunction failed: Message", ft );
}
TestFailureTest.prototype = new TestCase();
TestFailureTest.prototype.mException = new AssertionFailedError( "Message", null );
TestFailureTest.prototype.mTest = "testFunction";
TestFailureTest.prototype.testFailedTest = TestFailureTest_testFailedTest;
TestFailureTest.prototype.testThrownException = TestFailureTest_testThrownException;
TestFailureTest.prototype.testToString = TestFailureTest_testToString;


function TestResultTest( name )
{
	this.constructor.call( this, name );

	this.mListener = new TestListener();
	this.mListener.addError = function() { this.mErrors++; };
	this.mListener.addFailure = function() { this.mFailures++; };
	this.mListener.startTest = function() { this.mStarted = true; };
	this.mListener.endTest = function() { this.mEnded = true; };
}
function TestResultTest_setUp()
{
	this.mListener.mErrors = 0;
	this.mListener.mFailures = 0;
	this.mListener.mStarted = false;
	this.mListener.mEnded = false;
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
	this.assertEquals( true, this.mListener.mStarted );
	this.assertEquals( true, this.mListener.mEnded );
	this.assertEquals( 0, this.mListener.mErrors );
	this.assertEquals( 0, this.mListener.mFailures );
}
function TestResultTest_testEndTest()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	result.endTest( new Test( "Test" ));
	this.assertEquals( true, this.mListener.mEnded );
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
function TestResultTest_testRun()
{
	var result = new TestResult();
	result.addListener( this.mListener );
	var test = new TestResultTest( "testAddError" )
	result.run( test );
	this.assertEquals( true, this.mListener.mStarted );
	this.assertEquals( true, this.mListener.mEnded );
	this.assertEquals( 0, this.mListener.mErrors );
	this.assertEquals( 0, this.mListener.mFailures );
	this.setUp();
	test.testAddError = function() 
	{ 
		throw new AssertionFailedError( "Message", null ); 
	}
	result.run( test );
	this.assertEquals( true, this.mListener.mStarted );
	this.assertEquals( true, this.mListener.mEnded );
	this.assertEquals( 0, this.mListener.mErrors );
	this.assertEquals( 1, this.mListener.mFailures );
	this.setUp();
	test.testAddError = function() 
	{ 
		throw new Object(); 
	}
	result.run( test );
	this.assertEquals( true, this.mListener.mStarted );
	this.assertEquals( true, this.mListener.mEnded );
	this.assertEquals( 1, this.mListener.mErrors );
	this.assertEquals( 0, this.mListener.mFailures );
}
function TestResultTest_testRunCount()
{
	var result = new TestResult();
	var test = new TestResultTest( "testAddError" )
	result.run( test );
	test.testAddError = function() 
	{ 
		throw new AssertionFailedError( "Message", null ); 
	}
	result.run( test );
	this.assertEquals( 2, result.runCount());
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
	this.assertEquals( true, this.mListener.mStarted );
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
	this.assertEquals( true, result.wasSuccessful());
	test.testAddError = function() 
	{ 
		throw new AssertionFailedError( "Message", null ); 
	}
	result.run( test );
	this.assertEquals( false, result.wasSuccessful());
	result = new TestResult();
	test.testAddError = function() 
	{ 
		throw new Object(); 
	}
	result.run( test );
	this.assertEquals( false, result.wasSuccessful());
}
TestResultTest.prototype = new TestCase();
TestResultTest.prototype.setUp = TestResultTest_setUp;
TestResultTest.prototype.testAddError = TestResultTest_testAddError;
TestResultTest.prototype.testAddFailure = TestResultTest_testAddFailure;
TestResultTest.prototype.testAddListener = TestResultTest_testAddListener;
TestResultTest.prototype.testEndTest = TestResultTest_testEndTest;
TestResultTest.prototype.testErrorCount = TestResultTest_testErrorCount;
TestResultTest.prototype.testFailureCount = TestResultTest_testFailureCount;
TestResultTest.prototype.testRun = TestResultTest_testRun;
TestResultTest.prototype.testRunCount = TestResultTest_testRunCount;
TestResultTest.prototype.testShouldStop = TestResultTest_testShouldStop;
TestResultTest.prototype.testStartTest = TestResultTest_testStartTest;
TestResultTest.prototype.testStop = TestResultTest_testStop;
TestResultTest.prototype.testWasSuccessful = TestResultTest_testWasSuccessful;


function AssertTest( name )
{
	this.constructor.call( this, name );
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
		this.assertEquals( true, ex instanceof AssertionFailedError );
	}
}
function AssertTest_testAssertEquals()
{
	this.mAssert.assertEquals( true, 1 == 1 );
	try
	{
		this.mAssert.assertEquals( true, 0 == 1 );
		throw new Object();
	}
	catch( ex )
	{
		this.assertEquals( true, ex instanceof AssertionFailedError );
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
		this.assertEquals( true, ex instanceof AssertionFailedError );
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
		this.assertEquals( true, ex instanceof AssertionFailedError );
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
		this.assertEquals( true, ex instanceof AssertionFailedError );
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
		this.assertEquals( true, ex instanceof AssertionFailedError );
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
		this.assertEquals( true, ex instanceof AssertionFailedError );
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
		this.assertEquals( true, ex instanceof AssertionFailedError );
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
		this.assertEquals( true, ex instanceof AssertionFailedError );
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
	this.constructor.call( this, name );

	function MyTestCase()
	{
		this.constructor.call( this, "testMe" );

		this.mSetUp = false;
		this.mTearDown = false;
	}
	MyTestCase.prototype = new TestCase();
	MyTestCase.prototype.setUp = function() { this.mSetUp = true; }
	MyTestCase.prototype.testMe = function() { }
	MyTestCase.prototype.tearDown = function() { this.mTearDown = true; }

	this.mTestCase = new MyTestCase();
}
function TestCaseTest_testCountTestCases()
{
	this.assertEquals( 1, this.mTestCase.countTestCases());
}
function TestCaseTest_testRun()
{
	var result = new TestResult();
	this.assertUndefined( this.mTestCase.run( result ));
	this.assertEquals( true, result.wasSuccessful());
}
function TestCaseTest_testSetUp()
{
	this.assertUndefined( this.mTestCase.run( new TestResult()));
	this.assertEquals( true, this.mTestCase.mSetUp );
}
function TestCaseTest_testTearDown()
{
	this.assertUndefined( this.mTestCase.run( new TestResult()));
	this.assertEquals( true, this.mTestCase.mTearDown );
}
TestCaseTest.prototype = new TestCase();
TestCaseTest.prototype.testCountTestCases = TestCaseTest_testCountTestCases;
TestCaseTest.prototype.testRun = TestCaseTest_testRun;
TestCaseTest.prototype.testSetUp = TestCaseTest_testSetUp;
TestCaseTest.prototype.testTearDown = TestCaseTest_testTearDown;


function TestSuiteTest( name )
{
	this.constructor.call( this, name );
	
	function MyTestOldStyle( name )
	{
		this._super = TestCase;
		this._super( name );

		this.testMe = function() { }
		this.testMyself = function() { }
	}
	this.MyTestOldStyle = MyTestOldStyle;
}
function TestSuiteTest_testCtor()
{
	var undefined;
	var suite = new TestSuite();
	this.assertEquals( 0, suite.countTestCases());
	this.assertEquals( "all", suite.name());
	suite = new TestSuite( null );
	this.assertEquals( 0, suite.countTestCases());
	this.assertEquals( "all", suite.name());
	suite = new TestSuite( undefined );
	this.assertEquals( 0, suite.countTestCases());
	this.assertEquals( "all", suite.name());
	suite = new TestSuite( "name" );
	this.assertEquals( 0, suite.countTestCases());
	this.assertEquals( "name", suite.name());
	suite = new TestSuite( this.MyTest );
	this.assertEquals( 2, suite.countTestCases());
	this.assertEquals( "MyTest", suite.name());
	suite = new TestSuite( new this.MyTestOldStyle());
	this.assertEquals( 2, suite.countTestCases());
	this.assertEquals( "MyTestOldStyle", suite.name());
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
	this.assertEquals( "testMe", test.name());
	this.assertNotNull( suite.findTest( "testMyself" ));
	this.assertNotNull( suite.findTest( "MyTest" ));
	this.assertNull( suite.findTest( "you" ));
	this.assertNull( suite.findTest());
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
function TestSuiteTest_testSetUp()
{
	var suite = new TestSuite();
	suite.mSetUp = false;
	suite.setUp = function() { this.mSetUp = true; }
	suite.run( new TestResult());
	this.assertEquals( true, suite.mSetUp );
}
function TestSuiteTest_testTearDown()
{
	var suite = new TestSuite();
	suite.mTearDown = false;
	suite.tearDown = function() { this.mTearDown = true; }
	suite.run( new TestResult());
	this.assertEquals( true, suite.mTearDown );
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
TestSuiteTest.prototype = new TestCase();
TestSuiteTest.prototype.testCtor = TestSuiteTest_testCtor;
TestSuiteTest.prototype.testAddTest = TestSuiteTest_testAddTest;
TestSuiteTest.prototype.testAddTestSuite = TestSuiteTest_testAddTestSuite;
TestSuiteTest.prototype.testCountTestCases = TestSuiteTest_testCountTestCases;
TestSuiteTest.prototype.testFindTest = TestSuiteTest_testFindTest;
TestSuiteTest.prototype.testRun = TestSuiteTest_testRun;
TestSuiteTest.prototype.testSetUp = TestSuiteTest_testSetUp;
TestSuiteTest.prototype.testTearDown = TestSuiteTest_testTearDown;
TestSuiteTest.prototype.testTestCount = TestSuiteTest_testTestCount;
TestSuiteTest.prototype.MyTest = function MyTest( name )
{
	this.constructor.call( this, name );
};
TestSuiteTest.prototype.MyTest.prototype = new TestCase();
TestSuiteTest.prototype.MyTest.prototype.testMe = function() {};
TestSuiteTest.prototype.MyTest.prototype.testMyself = function() {};


function TestRunnerTest( name )
{
	this.constructor.call( this, name );
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
	this.assertEquals( true, 
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
	this.constructor.call( this, name );
};
TestRunnerTest.prototype.MyTest.prototype = new TestCase();
TestRunnerTest.prototype.MyTest.prototype.testMe = function() {};
TestRunnerTest.prototype.MyTest.prototype.testMyself = function() {};

function TextTestRunnerTest( name )
{
	this.constructor.call( this, name );

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
	this.assertEquals( true, 
		this.mRunner.mMsg.indexOf( "2 tests successful" ) > 0);
	var test = new this.MyTest( "testMe" );
	test.testMe = function() { throw new Object(); }
	var suite = new TestSuite();
	suite.addTest( test );
	this.mRunner.addSuite( suite );
	this.mRunner.start();
	this.assertEquals( true, 
		this.mRunner.mMsg.indexOf( "1 error, 0 failures." ) > 0);
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
	this.constructor.call( this, name );
};
TextTestRunnerTest.prototype.MyTest.prototype = new TestCase();
TextTestRunnerTest.prototype.MyTest.prototype.testMe = function() {};
TextTestRunnerTest.prototype.MyTest.prototype.testMyself = function() {};

