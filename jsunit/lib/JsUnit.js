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
 * @@file
 * Test unit classes for JavaScript.
 * This file contains a port of the JUnit Java package of Kent Beck and 
 * Erich Gamma for JavaScript.
 *
 * If this file is loaded within a browser, an onLoad event handler is set.
 * This event handler will set the global variable isJsUnitPageLoaded to true.
 * Any previously set onLoad event handler is restored and called.
 */

/**
 * @@class
 * Thrown, when a test assertion failed.
 * @@ctor
 * Constructor.
 * An AssertionFailedMessage needs a message and a call stack for construction.
 * @param msg Failure message.
 * @param stack The call stack of the assertion.
 */
function AssertionFailedError( msg, stack )
{
	/**
	 * @@attrib String
	 * The message text.
	 */
	this.mMessage = msg;
	/**
	 * @@attrib CallStack
	 * The call stack for the message.
	 */
	this.mCallStack = stack;

	/**
	 * @@method String
	 * Retrieve failure as string.
	 * @return Returns the error message.
	 */
	function toString() { return this.mMessage; }

	this.toString = toString;
}

/**
 * @@class
 * A test can be run and collect its results.
 * @@ctor
 * A test has always a name.
 * @param testName Name of the test.
 * @see TestResult
 */
function Test( testName )
{
	this.mName = testName;

	/**
	 * @@method Number
	 * Counts the number of test cases that will be run by this test.
	 * @return The number of test cases.
	 */
	function countTestCases() { return 0; }
	/**
	 * @@method String
	 * Search a test by name.
	 * The function compares the given name with the name of the test and 
	 * returns its own instance if the name is equal.
	 * @param testName The name of the searched test.
	 * @return The instance itself of null.
	 */
	function findTest( testName ) 
	{ 
		return testName == this.mName ? this : null; 
	}
	/**
	 * @@method String
	 * Retrieves the name of the test.
	 * @return The name of test cases.
	 */
	function name() { return this.mName; }
	/**
	 * @@method
	 * Runs a test and collects its result in a TestResult instance.
	 * @param result The test result to fill.
	 */
	function run( result ) {}
	/**
	 * @@method String
	 * Retrieve the test case as string.
	 * @return Returns the name of the test case.
	 */
	function toString() { return this.mName; }

	this.countTestCases = countTestCases;
	this.findTest = findTest;
	this.name = name;
	this.run = run;
	this.toString = toString;
}

/**
 * @@class
 * A TestFailure collects a failed test together with the caught exception.
 * @@ctor
 * Constructor.
 * @param test The failed test.
 * @param except The thrown exception
 * @see TestResult
 */
function TestFailure( test, except )
{
	this.mException = except;
	this.mTest = test;

	/**
	 * @@method Test
	 * Retrieve the failed test.
	 * @return Returns the failed test.
	 */
	function failedTest() { return this.mTest }
	/**
	 * @@method object
	 * Retrieve the thrown exception.
	 * @return Returns the thrown exception.
	 */
	function thrownException() { return this.mException }
	/**
	 * @@method String
	 * Retrieve failure as string.
	 * @return Returns the error message.
	 */
	function toString() 
	{ 
		return "Test " + this.mTest + " failed: " + this.mException; 
	}

	this.failedTest = failedTest;
	this.thrownException = thrownException;
	this.toString = toString;
}

/**
 * @@class
 * A listener for test progress.
 */
function TestListener()
{
	/**
	 * @@method
	 * An occured error was added.
	 * @param test The failed test.
	 * @param except The thrown exception.
	 */
	function addError( test, except ) {}
	/**
	 * @@method
	 * An occured failure was added.
	 * @param test The failed test.
	 * @param except The thrown exception.
	 */
	function addFailure( test, except ) {}
	/**
	 * @@method
	 * A test ended.
	 * @param test The ended test.
	 */
	function endTest( test ) {}
	/**
	 * @@method
	 * A test started
	 * @param test The started test.
	 */
	function startTest( test ) {}

	this.addError = addError;
	this.addFailure = addFailure;
	this.endTest = endTest;
	this.startTest = startTest;
}

/**
 * @@class
 * A TestResult collects the results of executing a test case.
 * The test framework distinguishes between failures and errors.
 * A failure is anticipated and checked for with assertions. Errors are
 * unanticipated problems like a JavaScript run-time error.
 *
 * @see Test
 */
function TestResult()
{
	this.mErrors = new Array();
	this.mFailures = new Array();
	this.mListeners = new Array();
	this.mRunTests = 0;
	this.mStop = 0;

	/**
	 * @@method
	 * Add an occured error.
	 * Add an occured error and call the registered listeners.
	 * @param test The failed test.
	 * @param except The thrown exception.
	 */
	function addError( test, except )
	{
		this.mErrors[this.mErrors.length] = new TestFailure( test, except );
		for( var i = 0; i < this.mListeners.length; ++i )
			this.mListeners[i].addError( test, except );
	}
	/**
	 * @@method
	 * Add an occured failure.
	 * Add an occured failure and call the registered listeners.
	 * @param test The failed test.
	 * @param except The thrown exception.
	 */
	function addFailure( test, except )
	{
		this.mFailures[this.mFailures.length] = new TestFailure( test, except );
		for( var i = 0; i < this.mListeners.length; ++i )
			this.mListeners[i].addFailure( test, except );
	}
	/**
	 * @@method
	 * Add a listener.
	 * @param listener The listener.
	 */
	function addListener( listener ) 
	{ 
		this.mListeners[this.mListeners.length] = listener; 
	}
	/**
	 * @@method
	 * A test ended.
	 * A test ended, inform the listeners.
	 * @param test The ended test.
	 */
	function endTest( test )
	{
		for( var i = 0; i < this.mListeners.length; ++i )
			this.mListeners[i].endTest( test );
	}
	/**
	 * @@method Number
	 * Retrieve the number of occured errors.
	 */
	function errorCount() { return this.mErrors.length; }
	/**
	 * @@method Number
	 * Retrieve the number of occured failures.
	 */
	function failureCount() { return this.mFailures.length; }
	/**
	 * @@method
	 * Runs a test case.
	 * @param test The test case to run.
	 */
	function run( test )
	{
		try
		{
			this.startTest( test );
			test.runBare();
		}
		catch( ex )
		{
			if( ex instanceof AssertionFailedError )
				this.addFailure( test, ex );
			else
				this.addError( test, ex );
		}
		this.endTest( test );
	}
	/**
	 * @@method Number
	 * Retrieve the number of run tests.
	 */
	function runCount() { return this.mRunTests; }
	/**
	 * @@method Boolean
	 * Checks whether the test run should stop.
	 */
	function shouldStop() { return this.mStop; }
	/**
	 * @@method
	 * A test starts.
	 * A test starts, inform the listeners.
	 * @param test The test to start.
	 */
	function startTest( test )
	{
		++this.mRunTests;

		for( var i = 0; i < this.mListeners.length; ++i )
			this.mListeners[i].startTest( test );
	}
	/**
	 * @@method
	 * Marks that the test run should stop.
	 */
	function stop() { this.mStop = 1; }
	/**
	 * @@method Boolean
	 * Returns whether the entire test was successful or not.
	 */
	function wasSuccessful() 
	{ 
		return this.mErrors.length + this.mFailures.length == 0; 
	}

	this.addListener = addListener;
	this.addError = addError;
	this.addFailure = addFailure;
	this.failureCount = failureCount;
	this.endTest = endTest;
	this.errorCount = errorCount;
	this.run = run;
	this.runCount = runCount;
	this.startTest = startTest;
	this.shouldStop = shouldStop;
	this.stop = stop;
	this.wasSuccessful = wasSuccessful;
}

/**
 * @@class
 * A set of assert methods.
 */
function Assert()
{
	/**
	 * @@method
	 * Asserts that a condition is true.
	 * @param cond The condition to evaluate.
	 * @param msg An optional error message.
	 * @exception AssertionFailedError Thrown if the evaluation was not true.
	 * @depricated
	 */
	function assert( cond, msg )
	{
		if( !eval( cond ))
		{
			var m = "Condition failed \"" + cond + "\"";
			if( msg != null && msg != "" )
				m += ": " + msg;
			this.fail( m, new CallStack());
		}
	}
	/**
	 * @@method
	 * Asserts that two values are equal.
	 * @param expected The expected value.
	 * @param actual The actual value.
	 * @exception AssertionFailedError Thrown if the expected value is not the 
	 * actual one.
	 */
	function assertEquals( expected, actual )
	{
		if( expected != actual )
		{
			var m = "Expected <" + expected + ">, actual was <" + actual + ">.";
			this.fail( m, new CallStack());
		}
	}
	/**
	 * @@method
	 * Asserts that a condition is false.
	 * @param cond The condition to evaluate.
	 * @param msg An optional error message.
	 * @exception AssertionFailedError Thrown if the evaluation was not false.
	 */
	function assertFalse( cond, msg )
	{
		if( eval( cond ))
		{
			var m = "Condition should have failed \"" + cond + "\"";
			if( msg != null && msg != "" )
				m += ": " + msg;
			this.fail( m, new CallStack());
		}
	}
	/**
	 * @@method
	 * Asserts that an object is not null.
	 * @param object The valid object.
	 * @exception AssertionFailedError Thrown if the object is not null.
	 */
	function assertNotNull( object )
	{
		if( object === null )
		{
			var m = "Object was null.";
			this.fail( m, new CallStack());
		}
	}
	/**
	 * @@method
	 * Asserts that an object is not undefined.
	 * @param object The defined object.
	 * @exception AssertionFailedError Thrown if the object is undefined.
	 */
	function assertNotUndefined( object )
	{
		if( object === undefined )
		{
			var m = "Object <" + object + "> was undefined.";
			this.fail( m, new CallStack());
		}
	}
	/**
	 * @@method
	 * Asserts that an object is null.
	 * @param object The null object.
	 * @exception AssertionFailedError Thrown if the object is not null.
	 */
	function assertNull( object )
	{
		if( object !== null )
		{
			var m = "Object <" + object + "> was not null.";
			this.fail( m, new CallStack());
		}
	}
	/**
	 * @@method
	 * Asserts that a condition is true.
	 * @param cond The condition to evaluate.
	 * @param msg An optional error message.
	 * @exception AssertionFailedError Thrown if the evaluation was not true.
	 */
	function assertTrue( cond, msg )
	{
		if( !eval( cond ))
		{
			var m = "Condition failed \"" + cond + "\"";
			if( msg != null && msg != "" )
				m += ": " + msg;
			this.fail( m, new CallStack());
		}
	}
	/**
	 * @@method
	 * Asserts that an object is undefined.
	 * @param object The undefined object.
	 * @exception AssertionFailedError Thrown if the object is not undefined.
	 */
	function assertUndefined( object )
	{
		if( object !== undefined )
		{
			var m = "Object <" + object + "> was not undefined.";
			this.fail( m, new CallStack());
		}
	}
	/**
	 * @@method
	 * Fails a test with a give message.
	 * @param msg The error message.
	 * @param stack The call stack of the error.
	 * @exception AssertionFailedError Is always thrown.
	 */
	function fail( msg, stack )
	{
		var afe = new AssertionFailedError( msg, stack );
		throw afe;
	}

	this.assert = assert;
	this.assertEquals = assertEquals;
	this.assertFalse = assertFalse;
	this.assertNotNull = assertNotNull;
	this.assertNotUndefined = assertNotUndefined;
	this.assertNull = assertNull;
	this.assertTrue = assertTrue;
	this.assertUndefined = assertUndefined;
	this.fail = fail;
}

/**
 * @@class
 * A test case defines the fixture to run multiple tests. To define a test 
 * case<br>
 * 1) implement a subclass of TestCase<br>
 * 2) define instance variables that store the state of the fixture<br>
 * 3) initialize the fixture state by overriding <code>setUp</code><br>
 * 4) clean-up after a test by overriding <code>tearDown</code>.<br>
 * Each test runs in its own fixture so there can be no side effects among 
 * test runs.
 *
 * For each test implement a method which interacts
 * with the fixture. Verify the expected results with assertions specified
 * by calling <code>assert</code> with a bool or one of the other assert 
 * functions.
 *
 * Once the methods are defined you can run them. The framework supports
 * both a static and more generic way to run a test.
 * In the static way you override the runTest method and define the method to
 * be invoked.
 * The generic way uses member function pointer to implement 
 * <code>runTest</code>.
 * It uses a table of function names.
 *
 * The tests to be run can be collected into a TestSuite. TestUnit provide
 * a <i>test runner</i> which can run a test suite and collect the results.
 * A test runner expects a function <code>TestCase_suite</code> as the entry
 * point to get a test to run.
 *
 * @see TestResult
 * @see TestSuite
 * @@ctor
 * Constructor.
 * @param name The name of the test case.
 */
function TestCase( name )
{
	this._super = Assert;
	this._super( name );
	this._super = Test;
	this._super( name );

	/**
	 * @@method Number
	 * Counts the number of test cases that will be run by this test.
	 * @return Returns 1.
	 */
	function countTestCases() { return 1; }
	/**
	 * @@method
	 * Runs a test and collects its result in a TestResult instance.
	 * @param result The test result to fill.
	 */
	function run( result ) { result.run( this ); }
	/**
	 * \internal
	 */
	function runBare()
	{
		this.setUp();
		try
		{
			var fn = eval( "this." + this.mName );
			this._func = fn;
			this._func();
			this.tearDown();
		}
		catch( ex )
		{
			this.tearDown();
			throw ex;
		}
	}
	/**
	 * @@method
	 * Set up the environment of the fixture.
	 */
	function setUp() {}
	/**
	 * @@method
	 * Clear up the environment of the fixture.
	 */
	function tearDown() {}

	this.countTestCases = countTestCases;
	this.run = run;
	this.runBare = runBare;
	if( !this.setUp )
		this.setUp = setUp;
	if( !this.tearDown )
		this.tearDown = tearDown;
}

/**
 * @@class
 * A TestSuite is a composition of Tests.
 * It runs a collection of test cases.
 * In despite of the JUnit implementation, this class has also functionality of
 * TestSetup of the extended JUnit framework. This is because of &quot;recursion
 * limits&quot; of the JavaScript implementation of BroadVision's One-to-one
 * Server (an OEM version of Netscape Enterprise Edition).
 * @see Test
 * @@ctor
 * Constructor.
 * The constructor collects all test methods of the given object and adds them
 * to the array of tests.
 * @param obj if obj is an instance of a TestCase, the suite is filled with the
 * fixtures automatically. Otherwise obj's string value is treated as name.
 */
function TestSuite( obj )
{
	var name, str;
	switch( typeof obj )
	{
		case "undefined": name = "all"; break;
		case "object":
			if( !obj )
			{
				name = "all";
				break;
			}
			str = new String( obj.constructor );
		case "function":
			if( !str )
				str = new String( obj );
			name = str.substring( str.indexOf( " " ) + 1, str.indexOf( "(" ));
			if( name == "(" )
				name = "[anonymous]";
			break;
		case "string": name = obj; break;
		default: name = obj.toString(); break;
	}

	this._super = Test;
	this._super( name );

	this.mTests = new Array();

	/**
	 * @@method
	 * Add a test to the suite.
	 * @param test The test to add.
	 */
	function addTest( test ) 
	{ 
		this.mTests[this.mTests.length] = test; 
	}
	/**
	 * @@method
	 * Add a test suite to the current suite.
	 * All fixtures of the test case will be collected in a suite which
	 * will be added.
	 * @param testCase The TestCase object to add.
	 */
	function addTestSuite( testCase ) 
	{ 
		this.addTest( new TestSuite( testCase )); 
	}
	/**
	 * @@method Number
	 * Counts the number of test cases that will be run by this test suite.
	 * @return The number of test cases.
	 */
	function countTestCases()
	{
		var tests = 0;
		for( var i = 0; i < this.testCount(); ++i )
			tests += this.mTests[i].countTestCases();
		return tests;
	}
	/**
	 * @@method String
	 * Search a test by name.
	 * The function compares the given name with the name of the test and 
	 * returns its own instance if the name is equal.
	 * @param name The name of the searched test.
	 * @return The instance itself of null.
	 */
	function findTest( name )
	{
		if( name == this.mName )
			return this;

		for( var i = 0; i < this.testCount(); ++i )
		{
			var test = this.mTests[i].findTest( name );
			if( test != null )
				return test;
		}
		return null;
	}
	/**
	 * @@method
	 * Runs a test and collects its result in a TestResult instance.
	 * @param result The test result to fill.
	 */
	function run( result )
	{
		--result.mRunTests;
		result.startTest( this );

		this.setUp();

		for( var i = 0; i < this.testCount(); ++i )
		{
			if( result.shouldStop())
				break;
			this.mTests[i].run( result );
		}

		this.tearDown();

		if( i == 0 )
		{
			var ex = new AssertionFailedError( 
				"Test suite with no tests.", new CallStack());
			result.addFailure( this, ex );
		}

		result.endTest( this );
	}
	/**
	 * @@method
	 * Set up the environment of the test suite.
	 */
	function setUp() {}
	/**
	 * @@method
	 * Clear up the environment of the test suite.
	 */
	function tearDown() {}
	/**
	 * @@method Number
	 * Returns the number of tests in this suite.
	 */
	function testCount() { return this.mTests.length; }

	this.addTest = addTest;
	this.addTestSuite = addTestSuite;
	this.countTestCases = countTestCases;
	this.findTest = findTest;
	this.run = run;
	this.setUp = setUp;
	this.tearDown = tearDown;
	this.testCount = testCount;

	// collect all testXXX methods
	if( typeof( obj ) == "function" )
	{
		for( var member in obj.prototype )
		{
			if( member.indexOf( "test" ) == 0 )
				this.addTest( new ( obj )( member ));
		}
	}
 	else if( typeof( obj ) == "object" )
	{
		for( var member in obj )
		{
			if( member.indexOf( "test" ) == 0 )
				this.addTest( new obj.constructor( member ));
		}
		obj = null;
	}
}

/**
 * @@class
 * General base class for an application running test suites.
 */
function TestRunner()
{
	this._super = TestListener;
	this._super();

	this.mSuites = new TestSuite();
	this.mElapsedTime = 0;

	/**
	 * @@method
	 * Add a test suite to the application.
	 * @param suite The suite to add.
	 */
	function addSuite( suite ) { this.mSuites.addTest( suite ); }
	/**
	 * @@method Number
	 * Counts the number of test cases that will be run by this test 
	 * application.
	 * @return The number of test cases.
	 */
	function countTestCases() { return this.mSuites.countTestCases(); }
	/**
	 * @@method Number
	 * The milliseconds needed to execute all registered tests of the runner.
	 * This number is 0 as long as the test was never started.
	 * @return The milliseconds.
	 */
	function countMilliSeconds() { return this.mElapsedTime; }
	/**
	 * @@method TestResult
	 * Creates an instance of a TestResult.
	 * @return Returns the new TestResult instance.
	 */
	function createTestResult() { return new TestResult(); }
	/**
	 * @@method
	 * Runs all test of all suites and collects their results in a TestResult 
	 * instance.
	 * @param result The test result to fill.
	 */
	function run( name, result )
	{
		var test = this.mSuites.findTest( name );
		if( test == null )
		{
			var ex = new AssertionFailedError( 
				"Test \"" + name + "\" not found.", new CallStack());
			result.addFailure( new Test( name ), ex );
		}
		else
		{
			this.mElapsedTime = new Date();
			test.run( result );
			this.mElapsedTime = new Date() - this.mElapsedTime;
		}
	}
	/**
	 * @@method
	 * Runs all test of all suites and collects their results in a TestResult 
	 * instance.
	 * @param result The test result to fill.
	 */
	function runAll( result ) 
	{ 
		this.mElapsedTime = new Date();
		this.mSuites.run( result ); 
		this.mElapsedTime = new Date() - this.mElapsedTime;
	}

	this.addSuite = addSuite;
	this.countTestCases = countTestCases;
	this.countMilliSeconds = countMilliSeconds;
	this.createTestResult = createTestResult;
	this.run = run;
	this.runAll = runAll;
}

/**
 * @@class
 * Class for an application running test suites with a test based status report.
 */
function TextTestRunner()
{
	this._super = TestRunner;
	this._super();
	
	this.mRunTests = 0;
	this.mNest = "";
	this.mStartArgs = new Array();

	/**
	 * @@method
	 * An occured error was added.
	 * @param test The failed test.
	 * @param except The thrown exception.
	 */
	function addError( test, except )
	{
		var str;
		if( except instanceof Error )
			str = except.message || except.description || "Unknown";
		else
			str = except;
		this.writeLn( "ERROR in " + test + ": " + str );
	}
	/**
	 * @@method
	 * An occured failure was added.
	 * @param test The failed test.
	 * @param except The thrown exception.
	 */
	function addFailure( test, except )
	{
		this.writeLn( "FAILURE in " + test + ": " + except );
		this.writeLn( except.mCallStack );
	}
	/**
	 * @@method
	 * A test ended
	 * @param test The ended test.
	 */
	function endTest( test )
	{
		if( test.testCount != null )
		{
			this.mNest = this.mNest.substr( 1 );
			this.writeLn( 
				  "<" + this.mNest.replace(/-/g, "=") 
				+ " Completed test suite \"" + test.name() + "\"" );
		}
	}
	/**
	 * @@method
	 * Write a header starting the application.
	 */
	function printHeader( result )
	{
		this.writeLn( 
			  "TestRunner(" + this.mStartArgs[0] + ") (" 
			+ this.countTestCases() + " test cases available)" );
	}
	/**
	 * @@method
	 * Write a footer at application end with a summary of the tests.
	 */
	function printFooter( result )
	{
		if( result.wasSuccessful() == 0 )
		{
			var error = result.errorCount() != 1 ? " errors" : " error";
			var failure = result.failureCount() != 1 ? " failures" : " failure";
			this.writeLn( 
				  result.errorCount() + error + ", " 
				+ result.failureCount() + failure + "." );
		}
		else
			this.writeLn( 
				  result.runCount() + " tests successful in " 
				+ ( this.mElapsedTime / 1000 ) + " seconds.");
	}
	/**
	 * @@method Number
	 * Start the test functionality of the application.
	 * @param args list of test names in an array or a single test name
	 * @returns 0 if no test fails, otherwise -1
	 */
	function start( args )
	{
		if( typeof( args ) == "undefined" )
			args = new Array();
		else if( typeof( args ) == "string" )
			args = new Array( args );
		if( args.length == 0 )
			args[0] = "all";
		this.mStartArgs = args;

		var result = this.createTestResult();
		result.addListener( this );

		this.printHeader( result );
		if( args[0] == "all" )
			this.runAll( result );
		else
		{
			for( var i = 0; i < args.length; ++ i )
				this.run( args[i], result );
		}
		this.printFooter( result );

		return result.wasSuccessful() ? 0 : -1;
	}
	/**
	 * @@method
	 * A test started
	 * @param test The started test.
	 */
	function startTest( test )
	{
		if( test.testCount == null )
		{
			++this.mRunTests;
			this.writeLn( 
				  this.mNest + " Running test " 
				+ this.mRunTests + ": \"" + test + "\"" );
		}
		else
		{
			this.writeLn( 
				  this.mNest.replace(/-/g, "=") + "> Starting test suite \"" 
				+ test.name() + "\"" );
			this.mNest += "-";
		}
	}
	/**
	 * @@method
	 * Write a line of text.
	 * @param str The text to print on the line.
	 * The method of this object does effectivly nothing. It must be 
	 * overloaded with a proper version, that knows how to print a line.
	 */
	function writeLn( str ) {}

	this.addFailure = addFailure;
	this.addError = addError;
	this.endTest = endTest;
	this.printHeader = printHeader;
	this.printFooter = printFooter;
	this.start = start;
	this.startTest = startTest;
	this.writeLn = writeLn;
}


/*************************************************************/
if( this.window )
{
	function newOnLoadEventForJsUnit() 
	{
		window.isJsUnitPageLoaded = true;
		if( typeof( window.savedOnLoadEventBeforeJsUnit ) == "function" )
			window.savedOnLoadEventBeforeJsUnit();
	}

	if( this.name && this.name == "testFrame" )
	{
		window.isJsUnitPageLoaded = false;
		window.savedOnLoadEventBeforeJsUnit = window.onload;
		window.onload = newOnLoadEventForJsUnit;
	}
}

