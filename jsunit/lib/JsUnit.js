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

/**
 * @file
 * Test unit classes for JavaScript.
 * This file contains a port of the JUnit Java package of Kent Beck and 
 * Erich Gamma for JavaScript.
 *
 * If this file is loaded within a browser, an onLoad event handler is set.
 * This event handler will set the global variable isJsUnitPageLoaded to true.
 * Any previously set onLoad event handler is restored and called.
 */


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// JUnit framework classes
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * Thrown, when a test assertion fails.
 * @ctor
 * Constructor.
 * An AssertionFailedMessage needs a message and a call stack for construction.
 * @tparam String msg Failure message.
 * @tparam CallStack stack The call stack of the assertion.
 */
function AssertionFailedError( msg, stack )
{
	// Error.call( this, msg );
	this.message = msg;
	/**
	 * The call stack for the message.
	 */
	this.mCallStack = stack;
}
AssertionFailedError.prototype = new Error();
/**
 * The name of the TypeError class as String.
 * @type String
 */
AssertionFailedError.prototype.name = "AssertionFailedError";


/**
 * A test can be run and collect its results.
 * @note Additional to JsUnit 3.8 the test has always a name. The interface
 * requires a getter and a setter and a method to search for tests.
 */
function Test()
{
}
/**
 * Counts the number of test cases that will be run by this test.
 * @treturn Number The number of test cases.
 */
Test.prototype.countTestCases = function() {}
/**
 * Search a test by name.
 * The function compares the given name with the name of the test and 
 * returns its own instance if the name is equal.
 * @note This is an enhancement to JUnit 3.8
 * @tparam String testName The name of the searched test.
 * @treturn Test The test instance itself of null.
 */
Test.prototype.findTest = function( testName ) {}
/**
 * Retrieves the name of the test.
 * @note This is an enhancement to JUnit 3.8
 * @treturn String The name of test.
 */
Test.prototype.getName = function() {}
/**
 * Runs the test.
 * @tparam TestResult result The result to fill.
 * @treturn TestResult The result of test cases.
 */
Test.prototype.run = function( result ) {}
/**
 * Sets the name of the test.
 * @note This is an enhancement to JUnit 3.8
 * @tparam String testName The new name of the test.
 */
Test.prototype.setName = function( testName ) {}


/**
 * A TestFailure collects a failed test together with the caught exception.
 * @ctor
 * Constructor.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown error of the exception
 * @see TestResult
 */
function TestFailure( test, except )
{
	this.mException = except;
	this.mTest = test;
}
/**
 * Retrieve the exception message.
 * @treturn String Returns the exception message.
 */
function TestFailure_exceptionMessage()
{ 
	var ex = this.thrownException(); 
	return ex ? ex.toString() : "";
}
/**
 * Retrieve the failed test.
 * @treturn Test Returns the failed test.
 */
function TestFailure_failedTest() { return this.mTest; }
/**
 * Test for a JsUnit failure.
 * @treturn Boolean Returns true if the exception is a failure.
 */
function TestFailure_isFailure() 
{ 
	return this.thrownException() instanceof AssertionFailedError; 
}
/**
 * Retrieve the thrown exception.
 * @treturn Test Returns the thrown exception.
 */
function TestFailure_thrownException() { return this.mException; }
/**
 * Retrieve failure as string.
 * Slightly enhanced message format compared to JsUnit 3.7.
 * @treturn String Returns the error message.
 */
function TestFailure_toString() 
{ 
	return "Test " + this.mTest + " failed: " + this.thrownException();
}
/**
 * Retrieve the stack trace.
 * @treturn String Returns stack trace (if available).
 */
function TestFailure_trace() 
{ 
	var ex = this.thrownException();
	if( ex && ex.mCallStack )
		return ex.mCallStack.toString();
	else
		return "";
}
TestFailure.prototype.exceptionMessage = TestFailure_exceptionMessage;
TestFailure.prototype.failedTest = TestFailure_failedTest;
TestFailure.prototype.isFailure = TestFailure_isFailure;
TestFailure.prototype.thrownException = TestFailure_thrownException;
TestFailure.prototype.toString = TestFailure_toString;
TestFailure.prototype.trace = TestFailure_trace;


/**
 * A protectable can be run and throw an Error.
 */
function Protectable()
{
}
/**
 * Runs a test.
 * @tparam Test test The test to run.
 */
Protectable.prototype.protect = function( test ) {}


/**
 * A listener for test progress.
 */
function TestListener()
{
}
/**
 * An occured error was added.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
TestListener.prototype.addError = function( test, except ) {}
/**
 * An occured failure was added.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
TestListener.prototype.addFailure = function( test, except ) {}
/**
 * A test ended.
 * @tparam Test test The ended test.
 */
TestListener.prototype.endTest = function( test ) {}
/**
 * A test started
 * @tparam Test test The started test.
 */
TestListener.prototype.startTest = function( test ) {}


/**
 * A TestResult collects the results of executing a test case.
 * The test framework distinguishes between <i>failures</i> and <i>errors</i>.
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
}
/**
 * Add an occured error.
 * Add an occured error and call the registered listeners.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
function TestResult_addError( test, except )
{
	this.mErrors.push( new TestFailure( test, except ));
	for( var i = 0; i < this.mListeners.length; ++i )
		this.mListeners[i].addError( test, except );
}
/**
 * Add an occured failure.
 * Add an occured failure and call the registered listeners.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
function TestResult_addFailure( test, except )
{
	this.mFailures.push( new TestFailure( test, except ));
	for( var i = 0; i < this.mListeners.length; ++i )
		this.mListeners[i].addFailure( test, except );
}
/**
 * Add a listener.
 * @tparam TestListener listener The listener.
 */
function TestResult_addListener( listener ) 
{ 
	this.mListeners.push( listener ); 
}
/**
 * Returns a copy of the listeners.
 * @treturn Array A copy of the listeners.
 */
function TestResult_cloneListeners() 
{ 
	var listeners = new Array();
	for( var i = 0; i < this.mListeners.length; ++i )
		listeners[i] = this.mListeners[i];
	return listeners;
}
/**
 * A test ended.
 * A test ended, inform the listeners.
 * @tparam Test test The ended test.
 */
function TestResult_endTest( test )
{
	for( var i = 0; i < this.mListeners.length; ++i )
		this.mListeners[i].endTest( test );
}
/**
 * Retrieve the number of occured errors.
 * @type Number
 */
function TestResult_errorCount() { return this.mErrors.length; }
/**
 * Retrieve the number of occured failures.
 * @type Number
 */
function TestResult_failureCount() { return this.mFailures.length; }
/**
 * Remove a listener.
 * @tparam TestListener listener The listener.
 */
function TestResult_removeListener( listener ) 
{ 
	for( var i = 0; i < this.mListeners.length; ++i )
	{
		if( this.mListeners[i] == listener )
		{
			this.mListeners.splice( i, 1 );
			break;
		}
	}
}
/**
 * Runs a test case.
 * @tparam Test test The test case to run.
 */
function TestResult_run( test )
{
	this.startTest( test );

	function OnTheFly() {}
	OnTheFly.prototype.protect = function() { this.mTest.runBare(); }
	OnTheFly.prototype.mTest = test;
	OnTheFly.fulfills( Protectable );
	
	this.runProtected( test, new OnTheFly());
	this.endTest( test );
}
/**
 * Retrieve the number of run tests.
 * @type Number
 */
function TestResult_runCount() { return this.mRunTests; }
/**
 * Runs a test case protected.
 * @tparam Test test The test case to run.
 * @tparam Protectable p The protectable block running the test.
 * To implement your own protected block that logs thrown exceptions, 
 * pass a Protectable to TestResult.runProtected().
 */
function TestResult_runProtected( test, p )
{
	try
	{
		p.protect();
	}
	catch( ex )
	{
		if( ex instanceof AssertionFailedError )
			this.addFailure( test, ex );
		else
			this.addError( test, ex );
	}
}
/**
 * Checks whether the test run should stop.
 * @type Boolean
 */
function TestResult_shouldStop() { return this.mStop; }
/**
 * A test starts.
 * A test starts, inform the listeners.
 * @tparam Test test The test to start.
 */
function TestResult_startTest( test )
{
	++this.mRunTests;

	for( var i = 0; i < this.mListeners.length; ++i )
		this.mListeners[i].startTest( test );
}
/**
 * Marks that the test run should stop.
 */
function TestResult_stop() { this.mStop = 1; }
/**
 * Returns whether the entire test was successful or not.
 * @type Boolean
 */
function TestResult_wasSuccessful() 
{ 
	return this.mErrors.length + this.mFailures.length == 0; 
}
TestResult.prototype.addError = TestResult_addError;
TestResult.prototype.addFailure = TestResult_addFailure;
TestResult.prototype.addListener = TestResult_addListener;
TestResult.prototype.cloneListeners = TestResult_cloneListeners;
TestResult.prototype.failureCount = TestResult_failureCount;
TestResult.prototype.endTest = TestResult_endTest;
TestResult.prototype.errorCount = TestResult_errorCount;
TestResult.prototype.removeListener = TestResult_removeListener;
TestResult.prototype.run = TestResult_run;
TestResult.prototype.runCount = TestResult_runCount;
TestResult.prototype.runProtected = TestResult_runProtected;
TestResult.prototype.startTest = TestResult_startTest;
TestResult.prototype.shouldStop = TestResult_shouldStop;
TestResult.prototype.stop = TestResult_stop;
TestResult.prototype.wasSuccessful = TestResult_wasSuccessful;
TestResult.fulfills( TestListener );


/**
 * A set of assert methods.
 */
function Assert()
{
}
/**
 * Asserts that two values are equal.
 * @tparam String msg An optional error message.
 * @tparam Object expected The expected value.
 * @tparam Object actual The actual value.
 * @exception AssertionFailedError Thrown if the expected value is not the 
 * actual one.
 */
function Assert_assertEquals( msg, expected, actual )
{
	if( arguments.length == 2 )
	{
		actual = expected;
		expected = msg;
		msg = null;
	}
	if( expected != actual )
	{
		var m = ( msg ? ( msg + " " ) : "" ) 
			+ "Expected:<" + expected + ">, but was:<" + actual + ">";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that a condition is false.
 * @tparam String msg An optional error message.
 * @tparam String cond The condition to evaluate.
 * @exception AssertionFailedError Thrown if the evaluation was not false.
 */
function Assert_assertFalse( msg, cond )
{
	if( arguments.length == 1 )
	{
		cond = msg;
		msg = null;
	}
	if( eval( cond ))
	{
		var m = ( msg ? ( msg + " " ) : "" ) 
			+ "Condition should have failed \"" + cond + "\"";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that an object is not null.
 * @tparam String msg An optional error message.
 * @tparam Object object The valid object.
 * @exception AssertionFailedError Thrown if the object is not null.
 */
function Assert_assertNotNull( msg, object )
{
	if( arguments.length == 1 )
	{
		object = msg;
		msg = null;
	}
	if( object === null )
	{
		var m = ( msg ? ( msg + " " ) : "" ) + "Object was null.";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that an object is not undefined.
 * @tparam String msg An optional error message.
 * @tparam Object object The defined object.
 * @exception AssertionFailedError Thrown if the object is undefined.
 */
function Assert_assertNotUndefined( msg, object )
{
	if( arguments.length == 1 )
	{
		object = msg;
		msg = null;
	}
	if( object === undefined )
	{
		var m = ( msg ? ( msg + " " ) : "" ) 
			+ "Object <" + object + "> was undefined.";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that an object is null.
 * @tparam String msg An optional error message.
 * @tparam Object object The null object.
 * @exception AssertionFailedError Thrown if the object is not null.
 */
function Assert_assertNull( msg, object )
{
	if( arguments.length == 1 )
	{
		object = msg;
		msg = null;
	}
	if( object !== null )
	{
		var m = ( msg ? ( msg + " " ) : "" ) 
			+ "Object <" + object + "> was not null.";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that two values are the same.
 * @tparam String msg An optional error message.
 * @tparam Object expected The expected value.
 * @tparam Object actual The actual value.
 * @exception AssertionFailedError Thrown if the expected value is not the 
 * actual one.
 */
function Assert_assertSame( msg, expected, actual )
{
	if( arguments.length == 2 )
	{
		actual = expected;
		expected = msg;
		msg = null;
	}
	if( expected === actual )
		return;
	else
	{
		var m = ( msg ? ( msg + " " ) : "" ) 
			+ "Same expected:<" + expected + ">, but was:<" + actual + ">";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that a condition is true.
 * @tparam String msg An optional error message.
 * @tparam String cond The condition to evaluate.
 * @exception AssertionFailedError Thrown if the evaluation was not true.
 */
function Assert_assertTrue( msg, cond )
{
	if( arguments.length == 1 )
	{
		cond = msg;
		msg = null;
	}
	if( !eval( cond ))
	{
		var m = ( msg ? ( msg + " " ) : "" ) 
			+ "Condition failed \"" + cond + "\"";
		this.fail( m, new CallStack());
	}
}
/**
 * Asserts that an object is undefined.
 * @tparam String msg An optional error message.
 * @tparam Object object The undefined object.
 * @exception AssertionFailedError Thrown if the object is not undefined.
 */
function Assert_assertUndefined( msg, object )
{
	if( arguments.length == 1 )
	{
		object = msg;
		msg = null;
	}
	if( object !== undefined )
	{
		var m = ( msg ? ( msg + " " ) : "" ) 
			+ "Object <" + object + "> was not undefined.";
		this.fail( m, new CallStack());
	}
}
/**
 * Fails a test with a give message.
 * @tparam String msg The error message.
 * @tparam CallStack stack The call stack of the error.
 * @exception AssertionFailedError Is always thrown.
 */
function Assert_fail( msg, stack )
{
	var afe = new AssertionFailedError( msg, stack );
	throw afe;
}
Assert.prototype.assertEquals = Assert_assertEquals;
Assert.prototype.assertFalse = Assert_assertFalse;
Assert.prototype.assertNotNull = Assert_assertNotNull;
Assert.prototype.assertNotUndefined = Assert_assertNotUndefined;
Assert.prototype.assertNull = Assert_assertNull;
Assert.prototype.assertSame = Assert_assertSame;
Assert.prototype.assertTrue = Assert_assertTrue;
Assert.prototype.assertUndefined = Assert_assertUndefined;
Assert.prototype.fail = Assert_fail;


/**
 * A test case defines the fixture to run multiple tests. 
 * To define a test case
 * -# implement a subclass of TestCase
 * -# define instance variables that store the state of the fixture
 * -# initialize the fixture state by overriding <code>setUp</code>
 * -# clean-up after a test by overriding <code>tearDown</code>.
 * Each test runs in its own fixture so there can be no side effects among 
 * test runs.
 *
 * For each test implement a method which interacts
 * with the fixture. Verify the expected results with assertions specified
 * by calling <code>assertTrue</code> with a boolean or one of the other assert 
 * functions.
 *
 * Once the methods are defined you can run them. The framework supports
 * both a static and more generic way to run a test.
 * In the static way you override the runTest method and define the method to
 * be invoked.
 * The generic way uses the JavaScript functionality to enumerate a function's
 * methods to implement <code>runTest</code>. In this case the name of the case
 * has to correspond to the test method to be run.
 *
 * The tests to be run can be collected into a TestSuite. JsUnit provides
 * several <i>test runners</i> which can run a test suite and collect the
 * results.
 * A test runner expects a function <code><i>FileName</i>Suite</code> as the 
 * entry point to get a test to run.
 *
 * @see TestResult
 * @see TestSuite
 * @ctor
 * Constructs a test case with the given name.
 * @tparam String name The name of the test case.
 */
function TestCase( name )
{
	Assert.call( this );
	this.mName = name;
}
/**
 * Counts the number of test cases that will be run by this test.
 * @treturn Number Returns 1.
 */
function TestCase_countTestCases() { return 1; }
/**
 * Creates a default TestResult object.
 * @treturn TestResult Returns the new object.
 */
function TestCase_createResult() { return new TestResult(); }
/**
 * Find a test by name.
 * @note This is an enhancement to JUnit 3.8
 * @tparam String testName The name of the searched test.
 * @treturn Test Returns this if the test's name matches or null.
 */
function TestCase_findTest( testName ) 
{ 
	return testName == this.mName ? this : null; 
}
/**
 * Retrieves the name of the test.
 * @treturn String The name of test cases.
 */
function TestCase_getName() { return this.mName; }
/**
 * Runs a test and collects its result in a TestResult instance.
 * The function can be called with or without argument. If no argument is
 * given, the function will create a default result set and return it.
 * Otherwise the return value can be omitted.
 * @tparam TestResult result The test result to fill.
 * @treturn TestResult Returns the test result.
 */
function TestCase_run( result )
{
	if( !result )
		result = this.createResult();
	result.run( this );
	return result;
}
/**
 * \internal
 */
function TestCase_runBare()
{
	this.setUp();
	try
	{
		this.runTest();
		this.tearDown();
	}
	catch( ex )
	{
		this.tearDown();
		throw ex;
	}
}
/**
 * Override to run the test and assert its state.
 */
function TestCase_runTest()
{
	var method = this[this.mName];
	if( method )
		method.call( this );
	else
		this.fail( "Method '" + this.mName + "' not found!" );
}
/**
 * Sets the name of the test case.
 * @tparam String name The new name of test cases.
 */
function TestCase_setName( name ) { this.mName = name; }
/**
 * Retrieve the test case as string.
 * @treturn String Returns the name of the test case.
 */
function TestCase_toString() 
{ 
	/*
	var className = new String( this.constructor ); 
	var regex = /function (\w+)/;
	regex.exec( className );
	className = new String( RegExp.$1 );
	*/
	return this.mName; // + "(" + className + ")"; 
}
TestCase.prototype = new Assert();
TestCase.prototype.countTestCases = TestCase_countTestCases;
TestCase.prototype.createResult = TestCase_createResult;
TestCase.prototype.findTest = TestCase_findTest;
TestCase.prototype.getName = TestCase_getName;
TestCase.prototype.run = TestCase_run;
TestCase.prototype.runBare = TestCase_runBare;
TestCase.prototype.runTest = TestCase_runTest;
TestCase.prototype.setName = TestCase_setName;
TestCase.prototype.toString = TestCase_toString;
TestCase.fulfills( Test );
/**
 * Set up the environment of the fixture.
 */
TestCase.prototype.setUp = function() {};
/**
 * Clear up the environment of the fixture.
 */
TestCase.prototype.tearDown = function() {};


/**
 * A TestSuite is a composition of Tests.
 * It runs a collection of test cases.
 * In despite of the JUnit implementation, this class has also functionality of
 * TestSetup of the extended JUnit framework. This is because of &quot;recursion
 * limits&quot; of the JavaScript implementation of BroadVision's One-to-one
 * Server (an OEM version of Netscape Enterprise Edition).
 * @see Test
 * @ctor
 * Constructor.
 * The constructor collects all test methods of the given object and adds them
 * to the array of tests.
 * @tparam Object obj if obj is an instance of a TestCase, the suite is filled 
 * with the fixtures automatically. Otherwise obj's string value is treated as 
 * name.
 */
function TestSuite( obj )
{
	this.mTests = new Array();

	var name, str;
	switch( typeof obj )
	{
		case "function":
			if( !str )
				str = new String( obj );
			name = str.substring( str.indexOf( " " ) + 1, str.indexOf( "(" ));
			if( name == "(" )
				name = "[anonymous]";
			break;
		case "string": name = obj; break;
		case "object": 
			if( obj !== null )
			{
				this.addTest( 
					this.warning( "Cannot instantiate test class for " 
						+ "object '" + obj + "'" ));
			}
			// fall through
		case "undefined": 	// fall through
		default: name = null; break;
	}

	this.mName = name;

	// collect all testXXX methods
	if( typeof( obj ) == "function" )
	{
		for( var member in obj.prototype )
		{
			if( member.indexOf( "test" ) == 0 )
				this.addTest( new ( obj )( member ));
		}
	}
}
/**
 * Add a test to the suite.
 * @tparam Test test The test to add.
 */
function TestSuite_addTest( test ) 
{ 
	this.mTests.push( test ); 
}
/**
 * Add a test suite to the current suite.
 * All fixtures of the test case will be collected in a suite which
 * will be added.
 * @tparam TestCase testCase The TestCase object to add.
 */
function TestSuite_addTestSuite( testCase ) 
{ 
	this.addTest( new TestSuite( testCase )); 
}
/**
 * Counts the number of test cases that will be run by this test suite.
 * @treturn Number The number of test cases.
 */
function TestSuite_countTestCases()
{
	var tests = 0;
	for( var i = 0; i < this.testCount(); ++i )
		tests += this.mTests[i].countTestCases();
	return tests;
}
/**
 * Search a test by name.
 * @note This is an enhancement to JUnit 3.8
 * The function compares the given name with the name of the test and 
 * returns its own instance if the name is equal.
 * @tparam String name The name of the searched test.
 * @treturn String The instance itself of null.
 */
function TestSuite_findTest( name )
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
 * Retrieves the name of the test suite.
 * @treturn String The name of test suite.
 */
function TestSuite_getName() { return this.mName; }
/**
 * Runs the tests and collects their result in a TestResult instance.
 * @note As an enhancement to JUnit 3.8 the method calls also startTest
 * and endTest of the TestResult.
 * @tparam TestResult result The test result to fill.
 */
function TestSuite_run( result )
{
	--result.mRunTests;
	result.startTest( this );

	for( var i = 0; i < this.testCount(); ++i )
	{
		if( result.shouldStop())
			break;
		var test = this.mTests[i];
		this.runTest( test, result );
	}

	if( i == 0 )
	{
		var ex = new AssertionFailedError( 
			"Test suite with no tests.", new CallStack());
		result.addFailure( this, ex );
	}

	result.endTest( this );
}
/**
 * Runs a single test test and collect its result in a TestResult instance.
 * @tparam Test test The test to run.
 * @tparam TestResult result The test result to fill.
 */
function TestSuite_runTest( test, result )
{
	test.run( result );
}
/**
 * Sets the name of the suite.
 * @tparam String name The name to set.
 */
function TestSuite_setName( name ) { this.mName = name }
/**
 * Runs the test at the given index.
 * @tparam Number index The index.
 * @type Test
 */
function TestSuite_testAt( index )
{
	return this.mTests[index];
}
/**
 * Returns the number of tests in this suite.
 * @type Number
 */
function TestSuite_testCount() { return this.mTests.length; }
/**
 * Retrieve the test suite as string.
 * @treturn String Returns the name of the test case.
 */
function TestSuite_toString() 
{ 
	return "Suite '" + this.mName + "'";
}
/**
 * Returns a test which will fail and log a warning message.
 * @tparam String message The warning message.
 * @type Test
 */
function TestSuite_warning( message )
{
	function Warning() { TestCase.call( this, "warning" ); }
	Warning.prototype = new TestCase();
	Warning.prototype.runTest = function() { this.fail( this.mMessage ); }
	Warning.prototype.mMessage = message;

	return new Warning();
}
TestSuite.prototype.addTest = TestSuite_addTest;
TestSuite.prototype.addTestSuite = TestSuite_addTestSuite;
TestSuite.prototype.countTestCases = TestSuite_countTestCases;
TestSuite.prototype.findTest = TestSuite_findTest;
TestSuite.prototype.getName = TestSuite_getName;
TestSuite.prototype.run = TestSuite_run;
TestSuite.prototype.runTest = TestSuite_runTest;
TestSuite.prototype.setName = TestSuite_setName;
TestSuite.prototype.testAt = TestSuite_testAt;
TestSuite.prototype.testCount = TestSuite_testCount;
TestSuite.prototype.toString = TestSuite_toString;
TestSuite.prototype.warning = TestSuite_warning;
TestSuite.fulfills( Test );


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// JUnit extension classes
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * A Decorator for Tests. Use TestDecorator as the base class
 * for defining new test decorators. Test decorator subclasses
 * can be introduced to add behaviour before or after a test
 * is run.
 * @see Test
 * @ctor
 * Constructor.
 * The constructore saves the test.
 * @tparam Test test The test to decorate.
 */
function TestDecorator( test )
{
	Assert.call( this );
	this.mTest = test;
}
/**
 * The basic run behaviour. The function calls the run method of the decorated
 * test.
 * @tparam TestResult result The test result.
 */
function TestDecorator_basicRun( result ) { this.mTest.run( result ); }
/**
 * Returns the number of the test cases.
 * @type Number.
 */
function TestDecorator_countTestCases() { return this.mTest.countTestCases(); }
/** 
 * Returns the test if it matches the name. 
 * @tparam String name The searched test name.
 * @type Test
 */
function TestDecorator_findTest( name ) { return this.mTest.findTest( name ); }
/** 
 * Returns name of the test.
 * @type String
 */
function TestDecorator_getName() { return this.mTest.getName(); }
/** 
 * Returns name the decorated test.
 * @type Test
 */
function TestDecorator_getTest() { return this.mTest; }
/**
 * Run the test.
 * @tparam TestResult result The test result.
 */
function TestDecorator_run( result ) { this.basicRun( result ); }
/** 
 * Sets name of the test.
 * @tparam String name The new name of the test.
 */
function TestDecorator_setName( name ) { this.mTest.setName( name ); }
/** 
 * Returns the test as string. 
 * @type String
 */
function TestDecorator_toString() { return this.mTest.toString(); }
TestDecorator.prototype = new Assert();
TestDecorator.prototype.basicRun = TestDecorator_basicRun;
TestDecorator.prototype.countTestCases = TestDecorator_countTestCases;
TestDecorator.prototype.findTest = TestDecorator_findTest;
TestDecorator.prototype.getName = TestDecorator_getName;
TestDecorator.prototype.getTest = TestDecorator_getTest;
TestDecorator.prototype.run = TestDecorator_run;
TestDecorator.prototype.setName = TestDecorator_setName;
TestDecorator.prototype.toString = TestDecorator_toString;
TestDecorator.fulfills( Test );


/**
 * A Decorator to set up and tear down additional fixture state.
 * Subclass TestSetup and insert it into your tests when you want
 * to set up additional state once before the tests are run.
 * @see TestCase
 * @ctor
 * Constructor.
 * The constructore saves the test.
 * @tparam Test test The test to decorate.
 */
function TestSetup( test )
{
	TestDecorator.call( this, test );
}
/**
 * Runs a test case with additional set up and tear down.
 * @tparam TestResult result The result set.
 */
function TestSetup_run( result )
{
	function OnTheFly() {}
	OnTheFly.prototype.protect = function()
	{	
		this.mTestSetup.setUp();
		this.mTestSetup.basicRun( this.result );
		this.mTestSetup.tearDown();
	}
	OnTheFly.prototype.result = result;
	OnTheFly.prototype.mTestSetup = this;
	OnTheFly.fulfills( Protectable );
	
	result.runProtected( this.mTest, new OnTheFly());
}
TestSetup.prototype = new TestDecorator();
TestSetup.prototype.run = TestSetup_run;
/**
 * Sets up the fixture. Override to set up additional fixture
 * state.
 */
TestSetup.prototype.setUp = function() {}
/**
 * Tears down the fixture. Override to tear down the additional
 * fixture state.
 */
TestSetup.prototype.tearDown = function() {}


/**
 * A Decorator that runs a test repeatedly.
 * @ctor
 * Constructor.
 * @tparam Test test The test to repeat.
 * @tparam Number repeat The number of repeats.
 */
function RepeatedTest( test, repeat )
{
	TestDecorator.call( this, test );
	this.mTimesRepeat = repeat;
}
function RepeatedTest_countTestCases()
{
	var tests = TestDecorator.prototype.countTestCases.call( this );
	return tests * this.mTimesRepeat;
}
/**
 * Runs a test case with additional set up and tear down.
 * @tparam TestResult result The result set.
 */
function RepeatedTest_run( result )
{
	for( var i = 0; i < this.mTimesRepeat; i++ )
	{
		if( result.shouldStop())
			break;
		TestDecorator.prototype.run.call( this, result );
	}
}
function RepeatedTest_toString()
{
	return TestDecorator.prototype.toString.call( this ) + " (repeated)";
}
RepeatedTest.prototype = new TestDecorator();
RepeatedTest.prototype.countTestCases = RepeatedTest_countTestCases;
RepeatedTest.prototype.run = RepeatedTest_run;
RepeatedTest.prototype.toString = RepeatedTest_toString;


/**
 * A TestCase that expects an exception of class mClass to be thrown.
 * The other way to check that an expected exception is thrown is:
 * <pre>
 * try {
 *   this.shouldThrow();
 * }
 * catch (ex) {
 *   if (ex instanceof SpecialException)
 *   	return;
 *   else
 *      throw ex;
 * }
 * this.fail("Expected SpecialException");
 * </pre>
 *
 * To use ExceptionTestCase, create a TestCase like:
 * <pre>
 * new ExceptionTestCase("testShouldThrow", SpecialException);
 * </pre>
 * @ctor
 * Constructor.
 * The constructor is initialized with the name of the test and the expected
 * class to be thrown.
 * @tparam String name The name of the test case.
 * @tparam Function clazz The class to be thrown.
 */
function ExceptionTestCase( name, clazz )
{
	TestCase.call( this, name )
	/**
	 * Save the class.
	 * @type Function
	 */
	this.mClass = clazz;
}
/**
 * Execute the test method expecting that an exception of
 * class mClass or one of its subclasses will be thrown
 */
function ExceptionTestCase_runTest()
{
	try
	{
		TestCase.prototype.runTest.call( this );
	}
	catch( ex )
	{
		if( ex instanceof this.mClass )
			return;
		else
			throw ex;
	}
	this.fail( "Expected exception " + this.mClass.toString());
}
ExceptionTestCase.prototype = new TestCase();
ExceptionTestCase.prototype.runTest = ExceptionTestCase_runTest;


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// JUnit runner classes
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * General base class for an application running test suites.
 */
function TestRunner()
{
	this.mSuites = new TestSuite();
	this.mElapsedTime = 0;
}
/**
 * Add a test suite to the application.
 * @tparam TestSuite suite The suite to add.
 */
function TestRunner_addSuite( suite ) { this.mSuites.addTest( suite ); }
/**
 * Counts the number of test cases that will be run by this test 
 * application.
 * @treturn Number The number of test cases.
 */
function TestRunner_countTestCases() { return this.mSuites.countTestCases(); }
/**
 * The milliseconds needed to execute all registered tests of the runner.
 * This number is 0 as long as the test was never started.
 * @treturn Number The milliseconds.
 */
function TestRunner_countMilliSeconds() { return this.mElapsedTime; }
/**
 * Creates an instance of a TestResult.
 * @treturn TestResult Returns the new TestResult instance.
 */
function TestRunner_createTestResult() { return new TestResult(); }
/**
 * Runs all test of all suites and collects their results in a TestResult 
 * instance.
 * @tparam String name The name of the test.
 * @tparam TestResult result The test result to fill.
 */
function TestRunner_run( name, result )
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
 * Runs all test of all suites and collects their results in a TestResult 
 * instance.
 * @tparam TestResult result The test result to fill.
 */
function TestRunner_runAll( result ) 
{ 
	this.mElapsedTime = new Date();
	this.mSuites.run( result ); 
	this.mElapsedTime = new Date() - this.mElapsedTime;
}
TestRunner.prototype.addError = function( test, except ) {}
TestRunner.prototype.addFailure = function( test, except ) {}
TestRunner.prototype.addSuite = TestRunner_addSuite;
TestRunner.prototype.countTestCases = TestRunner_countTestCases;
TestRunner.prototype.countMilliSeconds = TestRunner_countMilliSeconds;
TestRunner.prototype.createTestResult = TestRunner_createTestResult;
TestRunner.prototype.endTest = function( test ) {}
TestRunner.prototype.run = TestRunner_run;
TestRunner.prototype.runAll = TestRunner_runAll;
TestRunner.prototype.startTest = function( test ) {}
TestRunner.fulfills( TestListener );


/**
 * Class for an application running test suites with a test based status report.
 */
function TextTestRunner()
{
	TestRunner.call( this );

	this.mRunTests = 0;
	this.mNest = "";
	this.mStartArgs = new Array();
}
/**
 * An occured error was added.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
function TextTestRunner_addError( test, except )
{
	var str = "";
	if( except.message || except.description )
	{
		if( except.name )
			str = except.name + ": ";
		str += except.message || except.description;
	}
	else
		str = except;
	this.writeLn( "ERROR in " + test + ": " + str );
}
/**
 * An occured failure was added.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
function TextTestRunner_addFailure( test, except )
{
	this.writeLn( "FAILURE in " + test + ": " + except );
	this.writeLn( except.mCallStack );
}
/**
 * A test ended
 * @tparam Test test The ended test.
 */
function TextTestRunner_endTest( test )
{
	if( test.testCount != null )
	{
		this.mNest = this.mNest.substr( 1 );
		this.writeLn( 
			  "<" + this.mNest.replace( /-/g, "=" ) 
			+ " Completed test suite \"" + test.getName() + "\"" );
	}
}
/**
 * Write a header starting the application.
 */
function TextTestRunner_printHeader()
{
	this.writeLn( 
		  "TestRunner(" + this.mStartArgs[0] + ") (" 
		+ this.countTestCases() + " test cases available)" );
}
/**
 * Write a footer at application end with a summary of the tests.
 * @tparam TestResult result The result of the test run.
 */
function TextTestRunner_printFooter( result )
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
			+ ( this.mElapsedTime / 1000 ) + " seconds." );
}
/**
 * Start the test functionality of the application.
 * @param args list of test names in an array or a single test name
 * @treturn Number 0 if no test fails, otherwise -1
 */
function TextTestRunner_start( args )
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

	this.printHeader();
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
 * A test started
 * @tparam Test test The started test.
 */
function TextTestRunner_startTest( test )
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
			+ test.getName() + "\"" );
		this.mNest += "-";
	}
}
TextTestRunner.prototype = new TestRunner();
TextTestRunner.prototype.addFailure = TextTestRunner_addFailure;
TextTestRunner.prototype.addError = TextTestRunner_addError;
TextTestRunner.prototype.endTest = TextTestRunner_endTest;
TextTestRunner.prototype.printHeader = TextTestRunner_printHeader;
TextTestRunner.prototype.printFooter = TextTestRunner_printFooter;
TextTestRunner.prototype.start = TextTestRunner_start;
TextTestRunner.prototype.startTest = TextTestRunner_startTest;
/**
 * Write a line of text.
 * @tparam String str The text to print on the line.
 * The method of this object does effectivly nothing. It must be 
 * overloaded with a proper version, that knows how to print a line,
 * if the script engine cannot be detected (yet).
 */
TextTestRunner.prototype.writeLn = function ( str )
{
	JsUtil.prototype.print( str );
};


/**
 * Class for an application running test suites reporting in HTML.
 */
function HTMLTestRunner()
{
	TextTestRunner.call( this );
	this.mPrefix = "";
	this.mPostfix = "";
}
/**
 * Write a header starting the application.
 * The function will add a \<pre\> tag in front of the header.
 */
function HTMLTestRunner_printHeader()
{
	this.setPrefix( "<pre>" );
	TextTestRunner.prototype.printHeader.call( this );
	this.setPrefix( "" );
}
/**
 * Write a footer at application end with a summary of the tests.
 * @tparam TestResult result The result of the test run.
 * The function will add a \</pre\> tag at the end of the footer.
 */
function HTMLTestRunner_printFooter( result )
{
	this.setPostfix( "</pre>" );
	TextTestRunner.prototype.printFooter.call( this, result );
	this.setPostfix( "" );
}
/**
 * Set prefix of printed lines.
 * @tparam String prefix The prefix.
 */
function HTMLTestRunner_setPrefix( prefix )
{
	this.mPrefix = prefix;
}
/**
 * Set postfix of printed lines.
 * @tparam String postfix The postfix.
 */
function HTMLTestRunner_setPostfix( postfix )
{
	this.mPostfix = postfix;
}
/**
 * Write a line of text to the output stream.
 * @tparam String str The text to print on the line.
 * The function will convert '\&' and '\<' to \&amp; and \&lt; and add
 * prefix and postfix to the string.
 */
function HTMLTestRunner_writeLn( str ) 
{ 
	str = str.toString();
	str = str.replace( /&/g, "&amp;" ); 
	str = str.replace( /</g, "&lt;" ); 
	str = this.mPrefix + str + this.mPostfix;
	TextTestRunner.prototype.writeLn.call( this, str );
}
HTMLTestRunner.prototype = new TextTestRunner();
HTMLTestRunner.prototype.printHeader = HTMLTestRunner_printHeader;
HTMLTestRunner.prototype.printFooter = HTMLTestRunner_printFooter;
HTMLTestRunner.prototype.setPrefix = HTMLTestRunner_setPrefix;
HTMLTestRunner.prototype.setPostfix = HTMLTestRunner_setPostfix;
HTMLTestRunner.prototype.writeLn = HTMLTestRunner_writeLn;


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

