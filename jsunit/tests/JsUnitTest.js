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
	this._super = TestCase;
	this._super( name );

	function testToString()
	{
		var afe = new AssertionFailedError( "The Message", null );
		this.assertEquals( "The Message", afe );
	}

	this.testToString = testToString;
}

function TestTest( name )
{
	this._super = TestCase;
	this._super( name );

	function testCountTestCases()
	{
		var test = new Test( "Test" );
		this.assertEquals( 0, test.countTestCases());
	}
	function testFindTest()
	{
		var test = new Test( "Test" );
		this.assertEquals( "Test", test.findTest( "Test" ));
		this.assertNull( test.findTest( "Any" ));
	}
	function testName()
	{
		var test = new Test( "Test" );
		this.assertEquals( "Test", test.name());
	}
	function testRun()
	{
		var test = new Test( "Test" );
		this.assertUndefined( test.run());
	}
	function testToString()
	{
		var test = new Test( "Test" );
		this.assertEquals( "Test", test );
	}

	this.testCountTestCases = testCountTestCases;
	this.testFindTest = testFindTest;
	this.testName = testName;
	this.testRun = testRun;
	this.testToString = testToString;
}

function TestFailureTest( name )
{
	this._super = TestCase;
	this._super( name );

	this.mException = new AssertionFailedError( "Message", null );
	this.mTest = "testFunction";

	function testFailedTest()
	{
		var ft = new TestFailure( this.mTest, this.mException );
		this.assertEquals( "testFunction", ft.failedTest());
	}
	function testThrownException()
	{
		var ft = new TestFailure( this.mTest, this.mException );
		this.assertEquals( this.mException, ft.thrownException());
	}
	function testToString()
	{
		var ft = new TestFailure( this.mTest, this.mException );
		this.assertEquals( "Test testFunction failed: Message", ft );
	}

	this.testFailedTest = testFailedTest;
	this.testThrownException = testThrownException;
	this.testToString = testToString;
}

function TestResultTest( name )
{
	this._super = TestCase;
	this._super( name );

	this.mListener = new TestListener();
	this.mListener.addError = function() { this.mErrors++; };
	this.mListener.addFailure = function() { this.mFailures++; };
	this.mListener.startTest = function() { this.mStarted = true; };
	this.mListener.endTest = function() { this.mEnded = true; };

	function setUp()
	{
		this.mListener.mErrors = 0;
		this.mListener.mFailures = 0;
		this.mListener.mStarted = false;
		this.mListener.mEnded = false;
	}
	function testAddError()
	{
		var result = new TestResult();
		result.addListener( this.mListener );
		result.addError( new Test( "Test" ), new Error());
		this.assertEquals( 1, result.errorCount());
		this.assertEquals( 1, this.mListener.mErrors );
	}
	function testAddFailure()
	{
		var result = new TestResult();
		result.addListener( this.mListener );
		result.addFailure( new Test( "Test" ), new Error());
		this.assertEquals( 1, result.failureCount());
		this.assertEquals( 1, this.mListener.mFailures );
	}
	function testAddListener()
	{
		var result = new TestResult();
		result.addListener( this.mListener );
		result.run( new TestResultTest( "testAddError" ));
		this.assertEquals( true, this.mListener.mStarted );
		this.assertEquals( true, this.mListener.mEnded );
		this.assertEquals( 0, this.mListener.mErrors );
		this.assertEquals( 0, this.mListener.mFailures );
	}
	function testEndTest()
	{
		var result = new TestResult();
		result.addListener( this.mListener );
		result.endTest( new Test( "Test" ));
		this.assertEquals( true, this.mListener.mEnded );
	}
	function testErrorCount()
	{
		var result = new TestResult();
		result.addError( new Test( "Test" ), new Error());
		this.assertEquals( 1, result.errorCount());
	}
	function testFailureCount()
	{
		var result = new TestResult();
		result.addFailure( new Test( "Test" ), new Error());
		this.assertEquals( 1, result.failureCount());
	}
	function testRun()
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
			throw new Error(); 
		}
		result.run( test );
		this.assertEquals( true, this.mListener.mStarted );
		this.assertEquals( true, this.mListener.mEnded );
		this.assertEquals( 1, this.mListener.mErrors );
		this.assertEquals( 0, this.mListener.mFailures );
	}
	function testRunCount()
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
	function testShouldStop()
	{
		var result = new TestResult();
		result.stop();
		this.assertEquals( 1, result.shouldStop());
	}
	function testStartTest()
	{
		var result = new TestResult();
		result.addListener( this.mListener );
		result.startTest( new Test( "Test" ));
		this.assertEquals( true, this.mListener.mStarted );
	}
	function testStop()
	{
		var result = new TestResult();
		result.stop();
		this.assertEquals( 1, result.shouldStop());
	}
	function testWasSuccessful()
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
			throw new Error(); 
		}
		result.run( test );
		this.assertEquals( false, result.wasSuccessful());
	}

	this.setUp = setUp;
	this.testAddError = testAddError;
	this.testAddFailure = testAddFailure;
	this.testAddListener = testAddListener;
	this.testEndTest = testEndTest;
	this.testErrorCount = testErrorCount;
	this.testFailureCount = testFailureCount;
	this.testRun = testRun;
	this.testRunCount = testRunCount;
	this.testShouldStop = testShouldStop;
	this.testStartTest = testStartTest;
	this.testStop = testStop;
	this.testWasSuccessful = testWasSuccessful;
}

function AssertTest( name )
{
	this._super = TestCase;
	this._super( name );

	this.mAssert = new Assert();

	function testAssert()
	{
		this.mAssert.assert( true, "Should not throw!" );
		try
		{
			this.mAssert.assert( false, "Have to throw!" );
			throw new Error();
		}
		catch( ex )
		{
			this.assertEquals( true, ex instanceof AssertionFailedError );
		}
	}
	function testAssertEquals()
	{
		this.mAssert.assertEquals( true, 1 == 1 );
		try
		{
			this.mAssert.assertEquals( true, 0 == 1 );
			throw new Error();
		}
		catch( ex )
		{
			this.assertEquals( true, ex instanceof AssertionFailedError );
		}
	}
	function testAssertNotNull()
	{
		this.mAssert.assertNotNull( 0 );
		this.mAssert.assertNotNull( 1 );
		this.mAssert.assertNotNull( "Hi!" );
		try
		{
			this.mAssert.assertNotNull( null );
			throw new Error();
		}
		catch( ex )
		{
			this.assertEquals( true, ex instanceof AssertionFailedError );
		}
	}
	function testAssertNotUndefined()
	{
		this.mAssert.assertNotUndefined( 0 );
		this.mAssert.assertNotUndefined( false );
		this.mAssert.assertNotUndefined( "Hi!" );
		try
		{
			this.mAssert.assertNotUndefined( undefined );
			throw new Error();
		}
		catch( ex )
		{
			this.assertEquals( true, ex instanceof AssertionFailedError );
		}
	}
	function testAssertNull()
	{
		this.mAssert.assertNull( null );
		try
		{
			this.mAssert.assertNull( 0 );
			throw new Error();
		}
		catch( ex )
		{
			this.assertEquals( true, ex instanceof AssertionFailedError );
		}
	}
	function testAssertUndefined()
	{
		var x;
		this.mAssert.assertUndefined( undefined );
		this.mAssert.assertUndefined( x );
		this.mAssert.assertUndefined( Assert());
		try
		{
			this.mAssert.assertUndefined( this );
			throw new Error();
		}
		catch( ex )
		{
			this.assertEquals( true, ex instanceof AssertionFailedError );
		}
	}
	function testFail()
	{
		try
		{
			this.mAssert.fail( "Have to throw!", null );
			throw new Error();
		}
		catch( ex )
		{
			this.assertEquals( true, ex instanceof AssertionFailedError );
		}
	}

	this.testAssert = testAssert;
	this.testAssertEquals = testAssertEquals;
	this.testAssertNotNull = testAssertNotNull;
	this.testAssertNotUndefined = testAssertNotUndefined;
	this.testAssertNull = testAssertNull;
	this.testAssertUndefined = testAssertUndefined;
	this.testFail = testFail;
}

function TestCaseTest( name )
{
	this._super = TestCase;
	this._super( name );

	this.mTestCase = new function()
	{
		this._super = TestCase;
		this._super( "testMe" );

		this.mSetUp = false;
		this.mTearDown = false;

		this.setUp = function() { this.mSetUp = true; }
		this.testMe = function() { }
		this.tearDown = function() { this.mTearDown = true; }
	}

	function testCountTestCases()
	{
		this.assertEquals( 1, this.mTestCase.countTestCases());
	}
	function testRun()
	{
		var result = new TestResult();
		this.assertUndefined( this.mTestCase.run( result ));
		this.assertEquals( true, result.wasSuccessful());
	}
	function testSetUp()
	{
		this.assertUndefined( this.mTestCase.run( new TestResult()));
		this.assertEquals( true, this.mTestCase.mSetUp );
	}
	function testTearDown()
	{
		this.assertUndefined( this.mTestCase.run( new TestResult()));
		this.assertEquals( true, this.mTestCase.mTearDown );
	}

	this.testCountTestCases = testCountTestCases;
	this.testRun = testRun;
	this.testSetUp = testSetUp;
	this.testTearDown = testTearDown;
}

function TestSuiteTest( name )
{
	this._super = TestCase;
	this._super( name );

	function MyTest( name )
	{
		this._super = TestCase;
		this._super( name );

		this.testMe = function() { }
		this.testMyself = function() { }
	}

	function testAddTest()
	{
		var suite = new TestSuite();
		this.assertEquals( 0, suite.countTestCases());
		this.assertUndefined( suite.addTest( new MyTest( "testMe" )));
		this.assertEquals( 1, suite.countTestCases());
	}
	function testCountTestCases()
	{
		var suite = new TestSuite();
		this.assertEquals( 0, suite.countTestCases());
		suite.addTest( new MyTest( "testMe" ));
		this.assertEquals( 1, suite.countTestCases());
		suite.addTest( new MyTest( "testMyself" ));
		this.assertEquals( 2, suite.countTestCases());
		suite.addTest( new TestSuite( new MyTest()));
		this.assertEquals( 4, suite.countTestCases());
	}
	function testFindTest()
	{
		var suite = new TestSuite( new MyTest());
		var test = suite.findTest( "testMe" );
		this.assertEquals( "testMe", test.name());
		this.assertNotNull( suite.findTest( "testMyself" ));
		this.assertNotNull( suite.findTest( "My" ));
		this.assertNull( suite.findTest( "you" ));
		this.assertNull( suite.findTest());
	}
	function testRun()
	{
		var suite = new TestSuite();
		var result = new TestResult();
		suite.run( result );
		this.assertEquals( 1, result.failureCount());
		this.assertEquals( 0, result.runCount());
		result = new TestResult();
		result.addFailure = function() { this.stop(); }
		suite.addTest( new TestSuite( new MyTest()));
		suite.addTest( new TestSuite());
		suite.addTest( new TestSuite( new MyTest()));
		suite.run( result );
		this.assertEquals( 2, result.runCount());
		this.assertEquals( 4, suite.countTestCases());
	}
	function testSetUp()
	{
		var suite = new TestSuite();
		suite.mSetUp = false;
		suite.setUp = function() { this.mSetUp = true; }
		suite.run( new TestResult());
		this.assertEquals( true, suite.mSetUp );
	}
	function testTearDown()
	{
		var suite = new TestSuite();
		suite.mTearDown = false;
		suite.tearDown = function() { this.mTearDown = true; }
		suite.run( new TestResult());
		this.assertEquals( true, suite.mTearDown );
	}
	function testTestCount()
	{
		var suite = new TestSuite();
		this.assertEquals( 0, suite.testCount());
		suite.AddTest( new TestSuite( new MyTest ));
		this.assertEquals( 1, suite.testCount());
		suite.addTest( new MyTest( "testMyself" ));
		this.assertEquals( 2, suite.countTestCases());
	}

	this.testAddTest = testAddTest;
	this.testCountTestCases = testCountTestCases;
	this.testFindTest = testFindTest;
	this.testRun = testRun;
	this.testSetUp = testSetUp;
	this.testTearDown = testTearDown;
}

function TestRunnerTest( name )
{
	this._super = TestCase;
	this._super( name );

	function MyTest( name )
	{
		this._super = TestCase;
		this._super( name );

		this.testMe = function() { }
		this.testMyself = function() { }
	}

	this.mRunner = new TestRunner();

	function testAddSuite()
	{
		this.assertUndefined( this.mRunner.addSuite( new TestSuite()));
		this.assertEquals( 0, this.mRunner.countTestCases());
		this.mRunner.addSuite( new TestSuite( new MyTest()));
		this.assertEquals( 2, this.mRunner.countTestCases());
	}
	function testCountTestCases()
	{
		this.assertEquals( 0, this.mRunner.countTestCases());
		this.mRunner.addSuite( new TestSuite( new MyTest()));
		this.assertEquals( 2, this.mRunner.countTestCases());
	}
	function testCreateTestResult()
	{
		this.assertEquals( true, 
			this.mRunner.createTestResult() instanceof TestResult );
	}
	function testRun()
	{
		this.mRunner.addSuite( new TestSuite( new MyTest()));
		var result = new TestResult();
		this.assertUndefined( this.mRunner.run( "none", result ));
		this.assertEquals( 1, result.failureCount());
		this.assertEquals( 0, result.runCount());
		result = new TestResult();
		this.assertUndefined( this.mRunner.run( "testMe", result ));
		this.assertEquals( 0, result.failureCount());
		this.assertEquals( 1, result.runCount());
	}
	function testRunAll()
	{
		this.mRunner.addSuite( new TestSuite( new MyTest()));
		var result = new TestResult();
		this.assertUndefined( this.mRunner.runAll( result ));
		this.assertEquals( 2, result.runCount());
	}

	this.testAddSuite = testAddSuite;
	this.testCountTestCases = testCountTestCases;
	this.testCreateTestResult = testCreateTestResult;
	this.testRun = testRun;
	this.testRunAll = testRunAll;
}

function TextTestRunnerTest( name )
{
	this._super = TestCase;
	this._super( name );

	function MyTest( name )
	{
		this._super = TestCase;
		this._super( name );

		this.testMe = function() { }
		this.testMyself = function() { }
	}

	this.mRunner = new TextTestRunner();
	this.mRunner.mMsg = "";
	this.mRunner.writeLn = function( str ) { this.mMsg += str + "~"; }

	function testAddError()
	{
		this.assertUndefined( this.mRunner.addError( "testMe", false ));
		this.assertEquals( 0, this.mRunner.mMsg.indexOf( "ERROR in" ));
	}
	function testAddFailure()
	{
		this.assertUndefined( 
			this.mRunner.addFailure( "testMe", 
				new AssertionFailedError( "Failed!", new CallStack())));
		this.assertEquals( 0, this.mRunner.mMsg.indexOf( "FAILURE in" ));
	}
	function testEndTest()
	{
		var test = new MyTest( "My" );
		this.mRunner.endTest( test );
		this.assertEquals( "", this.mRunner.mMsg );
		test.testCount = 1;
		this.mRunner.mNest = "----";
		this.mRunner.endTest( test );
		this.assertEquals( 0, 
			this.mRunner.mMsg.indexOf( "<=== Completed test suite \"My\"" ));
	}
	function testPrintHeader()
	{
		this.mRunner.addSuite( new TestSuite( new MyTest()));
		this.mRunner.start();
		this.assertEquals( 0, 
			this.mRunner.mMsg.indexOf(
				"TestRunner(all) (2 test cases available)" ));
	}
	function testPrintFooter()
	{
		this.mRunner.addSuite( new TestSuite( new MyTest()));
		this.mRunner.start();
		this.assertEquals( true, 
			this.mRunner.mMsg.indexOf( "2 tests successful." ) > 0);
		var test = new MyTest( "testMe" );
		test.testMe = function() { throw new Error(); }
		var suite = new TestSuite();
		suite.addTest( test );
		this.mRunner.addSuite( suite );
		this.mRunner.start();
		this.assertEquals( true, 
			this.mRunner.mMsg.indexOf( "1 errors, 0 failures." ) > 0);
	}
	function testStart()
	{
		this.mRunner.addSuite( new TestSuite( new MyTest()));
		this.assertEquals( 0, this.mRunner.start());
		var test = new MyTest( "testMe" );
		test.testMe = function() { throw new Error(); }
		var suite = new TestSuite();
		suite.addTest( test );
		this.mRunner.addSuite( suite );
		this.assertEquals( -1, this.mRunner.start());
		this.assertEquals( 0, this.mRunner.start( "testMyself" ));
	}
	function testStartTest()
	{
		var test = new MyTest( "My" );
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
	function testWriteLn()
	{
		this.assertUndefined( this.mRunner.writeLn( "OK" ));
		this.assertEquals( "OK~", this.mRunner.mMsg );
	}

	this.testAddError = testAddError;
	this.testAddFailure = testAddFailure;
	this.testEndTest = testEndTest;
	this.testPrintHeader = testPrintHeader;
	this.testPrintFooter = testPrintFooter;
	this.testStart = testStart;
	this.testStartTest = testStartTest;
	this.testWriteLn = testWriteLn;
}
