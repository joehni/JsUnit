/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002,2003,2006 Joerg Schaible

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
 * Thrown when a test assertion fails.
 * @ctor
 * Constructor.
 * An AssertionFailedMessage needs a message and a call stack for construction.
 * @tparam String msg Failure message.
 * @tparam CallStack stack The call stack of the assertion.
 */
function AssertionFailedError( msg, stack )
{
	JsUnitError.call( this, msg );
	/**
	 * The call stack for the message.
	 */
	this.mCallStack = stack;
}
AssertionFailedError.prototype = new JsUnitError();
/**
 * The name of the AssertionFailedError class as String.
 * @type String
 */
AssertionFailedError.prototype.name = "AssertionFailedError";


/**
 * Thrown when a test assert comparing equal strings fail.
 * @ctor
 * Constructor.
 * An AssertionFailedMessage needs a message and a call stack for construction.
 * @tparam String msg Failure message (optional).
 * @tparam String expected The expected string value.
 * @tparam String actual The actual string value.
 * @tparam CallStack stack The call stack of the assertion.
 */
function ComparisonFailure( msg, expected, actual, stack )
{
	AssertionFailedError.call( 
		this, ( msg ? msg + " " : "" ) + "expected", stack );
	this.mExpected = new String( expected );
	this.mActual = new String( actual );
}
/**
 * Returns the error message.
 * @treturn String Returns the formatted error message.
 * Returns "..." in place of common prefix and "..." in
 * place of common suffix between expected and actual.
 */
function ComparisonFailure_toString()
{
	var str = AssertionFailedError.prototype.toString.call( this );
	
	var end = Math.min( this.mExpected.length, this.mActual.length );
	var i = 0;
	for( ; i < end; ++i )
		if( this.mExpected.charAt( i ) != this.mActual.charAt( i ))
			break;
	var j = this.mExpected.length - 1;
	var k = this.mActual.length - 1;
	for( ; k >= i && j >= i; --k, --j )
		if( this.mExpected.charAt( j ) != this.mActual.charAt( k ))
			break;

	var expected;
	var actual;

	if( j < i && k < i )
	{
		expected = this.mExpected;
		actual = this.mActual;
	}
	else
	{
		expected = this.mExpected.substring( i, j + 1 );
		actual = this.mActual.substring( i, k + 1 );
		if( i <= end && i > 0 )
		{
			expected = "..." + expected;
			actual = "..." + actual;
		}
		if( j < this.mExpected.length - 1 )
			expected += "...";
		if( k < this.mActual.length - 1 )
			actual += "...";
	}
	
	return str + ":<" + expected + ">, but was:<" + actual + ">";
}
ComparisonFailure.prototype = new AssertionFailedError();
ComparisonFailure.prototype.toString = ComparisonFailure_toString;
/**
 * The name of the ComparisonFailure class as String.
 * @type String
 */
ComparisonFailure.prototype.name = "ComparisonFailure";


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
 * @tparam Error except The thrown error.
 */
TestListener.prototype.addError = function( test, except ) {}
/**
 * An occured failure was added.
 * @tparam Test test The failed test.
 * @tparam AssertionFailedError afe The thrown assertion failure.
 */
TestListener.prototype.addFailure = function( test, afe ) {}
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
 * @tparam Error except The thrown error.
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
 * @tparam AssertionFailedError afe The thrown assertion failure.
 */
function TestResult_addFailure( test, afe )
{
	this.mFailures.push( new TestFailure( test, afe ));
	for( var i = 0; i < this.mListeners.length; ++i )
		this.mListeners[i].addFailure( test, afe );
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
	if( expected instanceof RegExp && typeof( actual ) == "string" )
	{
		if( !actual.match( expected ))
			this.fail( "RegExp:<" + expected + "> did not match:<" + actual + ">" );
	}
	else if( expected != actual )
		if( typeof( expected ) == "string" && typeof( actual ) == "string" )
			throw new ComparisonFailure( msg, expected, actual, new CallStack());
		else
			this.fail( "Expected:<" + expected + ">, but was:<" + actual + ">"
				, new CallStack(), msg );
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
		this.fail( "Condition should have failed \"" + cond + "\""
			, new CallStack(), msg );
}
/**
 * Asserts that two floating point values are equal to within a given tolerence.
 * @tparam String msg An optional error message.
 * @tparam Object expected The expected value.
 * @tparam Object actual The actual value.
 * @tparam Object tolerance The maximum difference allowed to make equality check pass.
 * @note This is an enhancement to JUnit 3.8
 * @exception AssertionFailedError Thrown if the expected value is not within 
 * the tolerance of the actual one.
 */
function Assert_assertFloatEquals( msg, expected, actual, tolerance)
{
    if( arguments.length == 3 )
    {
        tolerance = actual;
        actual = expected;
        expected = msg;
        msg = null;
    }
    if(    typeof( actual ) != "number" 
        || typeof( expected ) != "number" 
        || typeof( tolerance ) != "number" )
    {
        this.fail( "Can not compare " + expected + " and " + actual 
            + " with tolerance " + tolerance + " (must all be numbers).");
    }
 
    if( Math.abs(expected - actual) > tolerance)
    {
        this.fail( "Expected:<" + expected + ">, but was:<" + actual + ">"
            , new CallStack(), msg );
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
		this.fail( "Object was null.", new CallStack(), msg );
}
/**
 * Asserts that two values are not the same.
 * @tparam String msg An optional error message.
 * @tparam Object expected The expected value.
 * @tparam Object actual The actual value.
 * @exception AssertionFailedError Thrown if the expected value is not the 
 * actual one.
 */
function Assert_assertNotSame( msg, expected, actual )
{
	if( arguments.length == 2 )
	{
		actual = expected;
		expected = msg;
		msg = null;
	}
	if( expected === actual )
		this.fail( "Not the same expected:<" + expected + ">"
			, new CallStack(), msg );
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
		this.fail( "Object <" + object + "> was undefined."
			, new CallStack(), msg );
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
		this.fail( "Object <" + object + "> was not null."
			, new CallStack(), msg );
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
		this.fail( "Same expected:<" + expected + ">, but was:<" + actual + ">"
			, new CallStack(), msg );
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
		this.fail( "Condition failed \"" + cond + "\"", new CallStack(), msg );
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
		this.fail( "Object <" + object + "> was not undefined."
			, new CallStack(), msg );
}
/**
 * Fails a test with a give message.
 * @tparam String msg The error message.
 * @tparam CallStack stack The call stack of the error.
 * @tparam String usermsg The message part of the user.
 * @exception AssertionFailedError Is always thrown.
 */
function Assert_fail( msg, stack, usermsg )
{
	var afe = new AssertionFailedError(
		( usermsg ? usermsg + " " : "" ) + msg, stack );
	throw afe;
}
Assert.prototype.assertEquals = Assert_assertEquals;
Assert.prototype.assertFalse = Assert_assertFalse;
Assert.prototype.assertFloatEquals = Assert_assertFloatEquals;
Assert.prototype.assertNotNull = Assert_assertNotNull;
Assert.prototype.assertNotSame = Assert_assertNotSame;
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
	var method = this.getName();
	this.assertNotNull( method );
	method = method.substring( method.lastIndexOf( "." ) + 1 );
	method = this[method];
	if( method )
		method.call( this );
	else
		this.fail( "Method '" + this.getName() + "' not found!" );
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
			if( name == "" )
				name = "[anonymous]";
			break;
		case "string": name = obj; break;
		case "object": 
			if( obj !== null )
			{
				if( obj.getName && typeof( obj.getName ) == "function" )
				{
					var tname = obj.getName();
					if( tname )
					{
						var idx = tname.indexOf( "." );
						if( idx == tname.lastIndexOf( "." ))
							obj = eval( name = tname.substring( 0, idx ));
					}
				}
				if( typeof( obj ) != "function" )
					this.addTest( 
						this.warning( "Cannot instantiate test class for " 
							+ "object '" + obj + "'" ));
			}
			// fall through
		case "undefined": 	
			// fall through
		default: 
			if( typeof( name ) == "undefined" )
				name = null; 
			break;
	}

	this.setName( name );

	// collect all testXXX methods
	if( typeof( obj ) == "function" && obj.prototype )
	{
		for( var member in obj.prototype )
		{
			if(    member.indexOf( "test" ) == 0 
				&& typeof( obj.prototype[member] ) == "function" )
			{
				this.addTest( new ( obj )( member ));
			}
		}
	}
}
/**
 * Add a test to the suite.
 * @tparam Test test The test to add.
 * The test suite will add the given \a test to the suite and prepends the
 * name of a TestCase with the name of the suite.
 */
function TestSuite_addTest( test ) 
{ 
	if( test instanceof TestCase )
	{
		var name = test.getName();
		test.setName( this.getName() + "." + name );
	}
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
 * @treturn Test The instance itself or null.
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
function TestSuite_getName() { return this.mName ? this.mName : ""; }
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
function TestSuite_setName( name )
{ 
	this.mName = name;
}
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
 * @note This is an enhancement to JUnit 3.8
 * @type String
 */
function TestDecorator_getName() { return this.mTest.getName(); }
/** 
 * Returns name the decorated test.
 * @note This is an enhancement to JUnit 3.8
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
 * @note This is an enhancement to JUnit 3.8
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
 * A listener interface for observing the execution of a test run.
 * @note This class is an &quot;initial version&quot; in JUnit 3.8.1
 * and might be replace TestListener some day.
 */
function TestRunListener()
{
}
/**
 * Status for an error.
 * @type Number
 */
TestRunListener.prototype.STATUS_ERROR = 1;
/**
 * Status for a failure.
 * @type Number
 */
TestRunListener.prototype.STATUS_FAILURE = 2;
/**
 * A test run was started.
 * @tparam String suiteName The name of the test suite.
 * @tparam Number testCount The number of tests in the suite.
 */
TestRunListener.prototype.testRunStarted = function( suiteName, testCount ) {}
/**
 * A test run was ended.
 * @tparam Number elapsedTime The number of elapsed milliseconds.
 */
TestRunListener.prototype.testRunEnded = function( elapsedTime ) {}
/**
 * A test run was stopped.
 * @tparam Number elapsedTime The number of elapsed milliseconds.
 */
TestRunListener.prototype.testRunStopped = function( elapsedTime ) {}
/**
 * A test started.
 * @tparam String testName The name of the started test.
 */
TestRunListener.prototype.testStarted = function( testName ) {}
/**
 * A test ended.
 * @tparam String testName The name of the ended test.
 */
TestRunListener.prototype.testEnded = function( testName ) {}
/**
 * A test failed.
 * @tparam Number status The status of the test.
 * @tparam String testName The name of the failed test.
 * @tparam String trace The stack trace as String.
 */
TestRunListener.prototype.testFailed = function( status, testName, trace ) {}


/**
 * General base class for an application running test suites.
 */
function BaseTestRunner()
{
	this.mElapsedTime = 0;
}
/**
 * Implementation of TestListener.
 * @tparam Test test The test that had an error.
 * @tparam Error except The thrown error.
 */
function BaseTestRunner_addError( test, except ) 
{ 
	this.testFailed( TestRunListener.prototype.STATUS_ERROR, 
		test.toString(), except.toString()); 
}
/**
 * Implementation of TestListener.
 * @tparam Test test The test that had a failure.
 * @tparam AssertionFailedError afe The thrown failure.
 */
function BaseTestRunner_addFailure( test, afe ) 
{ 
	this.testFailed( TestRunListener.prototype.STATUS_ERROR, 
		test.toString(), afe.toString()); 
}
/**
 * Implementation of TestListener.
 * @tparam Test test The ended test.
 */
function BaseTestRunner_endTest( test ) 
{ 
	this.testEnded( test.toString()); 
}
/**
 * Retrieve the value of a global preference key.
 * @tparam String key The key of the preference.
 * @tparam Object value The default value.
 * @treturn Object The value of the key or the default value.
 */
function BaseTestRunner_getPreference( key, value ) 
{ 
	var v = BaseTestRunner.prototype.getPreferences()[key];
	if( !v )
		v = value;
	return v;
}
/**
 * Retrieves the Object with the global preferences of any runner.
 * @treturn Object Returns the runner's global preferences.
 */
function BaseTestRunner_getPreferences() 
{ 
	return BaseTestRunner.prototype.mPreferences; 
}
/**
 * Returns the Test corresponding to the given suite.
 * @tparam String name The name of the test.
 * This is a template method, subclasses override runFailed(), 
 * clearStatus().
 */
function BaseTestRunner_getTest( name ) 
{ 
	if( typeof( name ) != "string" )
	{
		this.clearStatus();
		return null;
	}
	var test;
	try
	{
		var testFunc = eval( name );
		if( typeof( testFunc ) == "function" && testFunc.prototype )
		{
		  	if( testFunc.prototype.suite )
				test = new testFunc.prototype.suite();
			else if( name.match( /Test$/ ))
				test = new TestSuite( name );
		}
	}
	catch( ex )
	{
	}
	if( test === undefined || !( test instanceof TestSuite ))
	{
		this.runFailed( "Test not found \"" + name + "\"" );
		return null;
	}
	else
	{
		this.clearStatus();
		return test;
	}
}
/**
 * Set a global preference.
 * @tparam String key The key of the preference.
 * @tparam Object value The value of the preference.
 */
function BaseTestRunner_setPreference( key, value ) 
{ 
	BaseTestRunner.prototype.getPreferences()[key] = value;
}
/**
 * Set any runner's global preferences.
 * @tparam Array prefs The new preferences.
 */
function BaseTestRunner_setPreferences( prefs ) 
{ 
	BaseTestRunner.prototype.mPreferences = prefs;
}
/**
 * Retrieve the flag for raw stack output.
 * @treturn Boolean Flag for an unfiltered stack output.
 */
function BaseTestRunner_showStackRaw() 
{ 
	return BaseTestRunner.prototype.getPreference( "filterStack", false ) != true;
}
/**
 * Implementation of TestListener.
 * @tparam Test test The started test.
 */
function BaseTestRunner_startTest( test ) 
{ 
	this.testStarted( test.toString()); 
}
/**
 * Truncates string to maximum length.
 * @tparam String str The string to trancate.
 * @treturn String The truncated string.
 */
function BaseTestRunner_truncate( str ) 
{
	var max = BaseTestRunner.prototype.getPreference( "maxMessageLength" );
	if( max < str.length )
		str = str.substring( 0, max ) + "...";
	return str; 
}
BaseTestRunner.prototype.mPreferences = new Object();
BaseTestRunner.prototype.addError = BaseTestRunner_addError;
BaseTestRunner.prototype.addFailure = BaseTestRunner_addFailure;
BaseTestRunner.prototype.clearStatus = function() {}
BaseTestRunner.prototype.endTest = BaseTestRunner_endTest;
BaseTestRunner.prototype.getPreference = BaseTestRunner_getPreference;
BaseTestRunner.prototype.getPreferences = BaseTestRunner_getPreferences;
BaseTestRunner.prototype.getTest = BaseTestRunner_getTest;
BaseTestRunner.prototype.runFailed = function( msg ) {}
BaseTestRunner.prototype.setPreference = BaseTestRunner_setPreference;
BaseTestRunner.prototype.setPreferences = BaseTestRunner_setPreferences;
BaseTestRunner.prototype.showStackRaw = BaseTestRunner_showStackRaw;
BaseTestRunner.prototype.startTest = BaseTestRunner_startTest;
BaseTestRunner.prototype.testEnded = function( test ) {}
BaseTestRunner.prototype.testFailed = function( test ) {}
BaseTestRunner.prototype.testStarted = function( test ) {}
BaseTestRunner.prototype.truncate = BaseTestRunner_truncate;
BaseTestRunner.fulfills( TestListener );
BaseTestRunner.prototype.setPreference( "filterStack", true );
BaseTestRunner.prototype.setPreference( "maxMessageLength", 500 );


/**
 * TestRunner of JsUnit 1.1
 * @see TextTestRunner
 * @deprecated since 1.2 in favour of TextTestRunner
 */
function TestRunner()
{
	BaseTestRunner.call( this );
	this.mSuites = new TestSuite();
}
/**
 * Add a test suite to the application.
 * @tparam TestSuite suite The suite to add.
 */
function TestRunner_addSuite( suite ) 
{ 
	this.mSuites.addTest( suite ); 
}
/**
 * Counts the number of test cases that will be run by this test 
 * application.
 * @treturn Number The number of test cases.
 */
function TestRunner_countTestCases() 
{ 
	return this.mSuites.countTestCases(); 
}
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
TestRunner.prototype = new BaseTestRunner();
TestRunner.prototype.addSuite = TestRunner_addSuite;
TestRunner.prototype.countTestCases = TestRunner_countTestCases;
TestRunner.prototype.run = TestRunner_run;
TestRunner.prototype.runAll = TestRunner_runAll;


/**
 * Class to print the result of a TextTestRunner.
 * @ctor
 * Constructor.
 * @tparam PrinterWriter writer The writer for the report.
 * Initialization of the ResultPrinter. If no \a writer is provided the 
 * instance uses the SystemWriter.
 */
function ResultPrinter( writer )
{
	this.setWriter( writer );
	this.mColumn = 0;
}
/**
 * Implementation of TestListener.
 * @tparam Test test The test that had an error.
 * @tparam Error except The thrown error.
 */
function ResultPrinter_addError( test, except )
{
	this.getWriter().print( "E" );
}
/**
 * Implementation of TestListener.
 * @tparam Test test The test that had a failure.
 * @tparam AssertionFailedError afe The thrown failure.
 */
function ResultPrinter_addFailure( test, afe )
{
	this.getWriter().print( "F" );
}
/**
 * Returns the elapsed time in seconds as String.
 * @tparam Number runTime The elapsed time in ms.
 * @type String
 */
function ResultPrinter_elapsedTimeAsString( runTime )
{
	return new String( runTime / 1000 );
}
/**
 * Implementation of TestListener.
 * @tparam Test test The test that ends.
 */
function ResultPrinter_endTest( test )
{
}
/**
 * Returns the associated writer to this instance.
 * @type PrinterWriter
 */
function ResultPrinter_getWriter()
{
	return this.mWriter;
}
/**
 * Print the complete test result.
 * @tparam TestResult result The complete test result.
 * @tparam Number runTime The elapsed time in ms.
 */
function ResultPrinter_print( result, runTime )
{
	this.printHeader( runTime );
	this.printErrors( result );
	this.printFailures( result );
	this.printFooter( result );
}
/**
 * Print a defect of the test result.
 * @tparam TestFailure defect The defect to print.
 * @tparam Number count The counter for this defect type.
 */
function ResultPrinter_printDefect( defect, count )
{
	this.printDefectHeader( defect, count );
	this.printDefectTrace( defect );
	this.getWriter().println();
}
/**
 * \internal
 */
function ResultPrinter_printDefectHeader( defect, count )
{
	this.getWriter().print( count + ") " + defect.toString());
}
/**
 * Print the defects of a special type of the test result.
 * @tparam Array<TestFailure> array The array with the defects.
 * @tparam String type The type of the defects.
 */
function ResultPrinter_printDefects( array, type )
{
	if( array.length == 0 )
		return;
	if( array.length == 1 )
		this.getWriter().println( "There was 1 " + type + ":" );
	else
		this.getWriter().println( 
			"There were " + array.length + " " + type + "s:" );
	for( var i = 0; i < array.length; )
		this.printDefect( array[i], ++i );
}
/**
 * \internal
 */
function ResultPrinter_printDefectTrace( defect )
{
	if( defect.getCallStack )
		this.getWriter().print( defect.getCallStack().toString());
}
/**
 * Print the errors of the test result.
 * @tparam TestResult result The complete test result.
 */
function ResultPrinter_printErrors( result )
{
	this.printDefects( result.mErrors, "error" );
}
/**
 * Print the failures of the test result.
 * @tparam TestResult result The complete test result.
 */
function ResultPrinter_printFailures( result )
{
	this.printDefects( result.mFailures, "failure" );
}
/**
 * Print the footer of the test result.
 * @tparam TestResult result The complete test result.
 */
function ResultPrinter_printFooter( result )
{
	var writer = this.getWriter();
	if( result.wasSuccessful())
	{
		var count = result.runCount();
		writer.println();
		writer.print( "OK" );
		writer.println( 
			" (" + count + " test" + ( count == 1 ? "" : "s" ) + ")" );
	}
	else
	{
		writer.println();
		writer.println( "FAILURES!!!" );
		writer.println( "Tests run: " + result.runCount()
			+ ", Failures: " + result.failureCount()
			+ ", Errors: " + result.errorCount());
	}
	writer.println();
}
/**
 * Print the header of the test result.
 * @tparam Number runTime The elapsed time in ms.
 */
function ResultPrinter_printHeader( runTime )
{
	var writer = this.getWriter();
	writer.println();
	writer.println( "Time: " + this.elapsedTimeAsString( runTime ));
}
/**
 * Sets the PrinterWriter.
 * @note This is an enhancement to JUnit 3.8
 * @tparam PrinterWriter writer The writer for the report.
 * Initialization of the ResultPrinter. If no \a writer is provided the 
 * instance uses the SystemWriter.
 */
function ResultPrinter_setWriter( writer )
{
	this.mWriter = writer ? writer : JsUtil.prototype.getSystemWriter();
}
/**
 * Implementation of TestListener.
 * @tparam Test test The test that starts.
 */
function ResultPrinter_startTest( test )
{
	if( !( test instanceof TestSuite ))
	{
		this.getWriter().print( "." );
		if( this.mColumn++ >= 39 )
		{
			this.getWriter().println();
			this.mColumn = 0;
		}
	}
}
ResultPrinter.prototype.addError = ResultPrinter_addError;
ResultPrinter.prototype.addFailure = ResultPrinter_addFailure;
ResultPrinter.prototype.elapsedTimeAsString = ResultPrinter_elapsedTimeAsString;
ResultPrinter.prototype.endTest = ResultPrinter_endTest;
ResultPrinter.prototype.getWriter = ResultPrinter_getWriter;
ResultPrinter.prototype.print = ResultPrinter_print;
ResultPrinter.prototype.printDefect = ResultPrinter_printDefect;
ResultPrinter.prototype.printDefectHeader = ResultPrinter_printDefectHeader;
ResultPrinter.prototype.printDefects = ResultPrinter_printDefects;
ResultPrinter.prototype.printDefectTrace = ResultPrinter_printDefectTrace;
ResultPrinter.prototype.printErrors = ResultPrinter_printErrors;
ResultPrinter.prototype.printFailures = ResultPrinter_printFailures;
ResultPrinter.prototype.printFooter = ResultPrinter_printFooter;
ResultPrinter.prototype.printHeader = ResultPrinter_printHeader;
ResultPrinter.prototype.setWriter = ResultPrinter_setWriter;
ResultPrinter.prototype.startTest = ResultPrinter_startTest;
ResultPrinter.fulfills( TestListener );


/**
 * Class for an application running test suites with a test based status 
 * report.
 * @ctor
 * The constructor.
 * @tparam Object outdev Output device
 * The TestRunner is initialized with the given output device. This may be an
 * instance of a ResultPrinter, a PrinterWriter or undefined. For a 
 * PrinterWriter the constructor creates a new instance of a standard 
 * ResultPrinter with this PrinterWriter. If \a outdev is undefined it creates
 * a ResultPrinter with the SystemWriter.
 */
function TextTestRunner( outdev )
{
	BaseTestRunner.call( this );
	this.setPrinter( outdev );
}
/**
 * Creates an instance of a TestResult to be used for the test run.
 * @treturn TestResult Returns the new TestResult instance.
 */
function TextTestRunner_createTestResult() 
{
	return new TestResult(); 
}
/**
 * Executes a test run with the given test.
 * @tparam Test test The test.
 * @treturn TestResult The result of the test.
 */
function TextTestRunner_doRun( test ) 
{
	var result = this.createTestResult();
	result.addListener( this.mPrinter );
	var startTime = new Date();
	test.run( result );
	var endTime = new Date();
	this.mPrinter.print( result, endTime - startTime );
	return result;
}
/**
 * Runs a single test or a suite extracted from a TestCase subclass.
 * @tparam Object test The class to test or a test.
 * This static method can be used to start a test run from your program.
 * @treturn TestResult The result of the test.
 */
function TextTestRunner_run( test )
{
	if( test instanceof Function )
		test = new TestSuite( test );
	var runner = new TextTestRunner();
	return runner.doRun( test );
}
/**
 * Program entry point.
 * @tparam Array<String> args Program arguments.
 * The function will create a TextTestRunner or the TestRunner given by the
 * preference "TestRunner" and run the tests given by the arguments. The 
 * function will exit the program with an error code indicating the type of
 * success.
 */
function TextTestRunner_main( args )
{
	var ex;
	var runner = BaseTestRunner.prototype.getPreference( "TestRunner" );
	if( runner )
		runner = new runner();
	if( !runner )
		 runner = new TextTestRunner();
	try
	{
		var result = runner.start( args );
		JsUtil.prototype.quit( 
			  result.wasSuccessful() 
			? TextTestRunner.prototype.SUCCESS_EXIT
			: TextTestRunner.prototype.FAILURE_EXIT );
	}
	catch( ex )
	{
		runner.runFailed( ex.toString());
	}
}
/**
 * Run failed.
 * @tparam String msg The failure message.
 * @treturn Number TextTestRunner.FAILURE_EXIT.
 */
function TextTestRunner_runFailed( msg )
{
	JsUtil.prototype.getSystemWriter().println( msg );
	JsUtil.prototype.quit( TextTestRunner.prototype.EXCEPTION_EXIT );
}
/**
 * Set printer.
 * @tparam Object outdev Output device
 * @treturn Number TextTestRunner.FAILURE_EXIT.
 */
function TextTestRunner_setPrinter( outdev )
{
	if( typeof( outdev ) == "object" )
	{
		if( outdev instanceof PrinterWriter )
			outdev = new ResultPrinter( outdev );
		if( !( outdev instanceof ResultPrinter ))
			outdev = new ResultPrinter();
	}
	else
		outdev = new ResultPrinter();

	this.mPrinter = outdev;
}
/**
 * Starts a test run.
 * @tparam Object args The (optional) arguments as Array or String
 * @type TestResult
 * @exception Usage If an unknown option is used
 * Analyzes the command line arguments and runs the given test suite. If
 * no argument was given, the function tries to run AllTests.suite().
 */
function TextTestRunner_start( args )
{
	function Usage( msg )
	{
		JsUnitError.call( this, 
			"[JavaScript engine] [TestScript] TestName [TestName2]" + msg );
	}
	Usage.prototype = new JsUnitError();
	Usage.prototype.name = "Usage";

	var testCases = new Array();
	
	if( typeof( args ) == "undefined" )
		args = new Array();
	else if( typeof( args ) == "string" )
		args = args.split( /[ ,;]/ );

	var optionsPossible = true;
	var msg = "";
	for( var i = 0; i < args.length; ++i )
	{
		args[i] = args[i].trim();
		if( optionsPossible && args[i].match( /^-/ ))
		{
			if( args[i] == "--" )
			{
				optionsPossible = false;
				continue;
			}
			switch( args[i] )
			{
				case "--classic" :
					this.setPrinter( 
                        new ClassicResultPrinter( 
                            this.mPrinter.getWriter()));
					continue;
					
				case "--html" :
                    this.mPrinter.setWriter(
                        new HTMLWriterFilter(
                            this.mPrinter.getWriter()));
                    continue;
                    
				default:
					msg = "\nUnknown option \"" + args[i] + "\"";
				case "-?" :
					throw new Usage( msg );
			}
		}
		testCases.push( args[i] );
	}

	var suite;
	if( testCases.length == 0 )
		suite = this.getTest( "AllTests" );
	else if( testCases.length > 1 )
	{
		suite = new TestSuite( "Start" );
		for( i = 0; i < testCases.length; ++i )
			suite.addTestSuite( testCases[i] );
	}
	else
		suite = this.getTest( testCases[0] );

	if( suite )
		return this.doRun( suite );
	else
		return new TestResult();
}
TextTestRunner.prototype = new BaseTestRunner();
TextTestRunner.prototype.createTestResult = TextTestRunner_createTestResult;
TextTestRunner.prototype.doRun = TextTestRunner_doRun;
TextTestRunner.prototype.main = TextTestRunner_main;
TextTestRunner.prototype.run = TextTestRunner_run;
TextTestRunner.prototype.runFailed = TextTestRunner_runFailed;
TextTestRunner.prototype.setPrinter = TextTestRunner_setPrinter;
TextTestRunner.prototype.start = TextTestRunner_start;
/**
 * Exit code, when all tests succeed
 * @type Number
 */
TextTestRunner.prototype.SUCCESS_EXIT = 0;
/**
 * Exit code, when at least one test fails with a failure.
 * @type Number
 */
TextTestRunner.prototype.FAILURE_EXIT = 1;
/**
 * Exit code, when at least one test fails with an error.
 * @type Number
 */
TextTestRunner.prototype.EXCEPTION_EXIT = 2;


function ClassicResultPrinter( writer )
{
	ResultPrinter.call( this, writer );
}
/**
 * An occured error was added.
 * @tparam Test test The failed test.
 * @tparam Error except The thrown exception.
 */
function ClassicResultPrinter_addError( test, except )
{
	var str = "";
	if( except.description )
	{
		if( except.name )
			str = except.name + ": ";
		str += except.description;
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
function ClassicResultPrinter_addFailure( test, except )
{
	this.writeLn( "FAILURE in " + test + ": " + except );
	if( except.mCallStack )
		this.writeLn( except.mCallStack.toString());
}
/**
 * A test ended
 * @tparam Test test The ended test.
 */
function ClassicResultPrinter_endTest( test )
{
	if( test instanceof TestSuite )
	{
		this.mNest = this.mNest.substr( 1 );
		this.writeLn( 
			  "<" + this.mNest.replace( /-/g, "=" ) 
			+ " Completed test suite \"" + test.getName() + "\"" );
	}
}
/**
 * Print the complete test result.
 * @tparam TestResult result The complete test result.
 * @tparam Number runTime The elapsed time in ms.
 * Overloaded, because only the footer is needed.
 */
function ClassicResultPrinter_print( result, runTime )
{
	this.printFooter( result, runTime );
}
/**
 * Write a header starting the application.
 * @tparam Test test The top level test.
 */
function ClassicResultPrinter_printHeader( test )
{
	this.mRunTests = 0;
	this.mInReport = true;
	this.mNest = "";
	this.writeLn( 
		  "TestRunner (" + test.countTestCases() + " test cases available)" );
}
/**
 * Write a footer at application end with a summary of the tests.
 * @tparam TestResult result The result of the test run.
 * @tparam Number runTime The elapsed time in ms.
 */
function ClassicResultPrinter_printFooter( result, runTime )
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
			+ this.elapsedTimeAsString( runTime ) + " seconds." );
	this.mInReport = false;
}
/**
 * A test started
 * @tparam Test test The started test.
 */
function ClassicResultPrinter_startTest( test )
{
	if( !this.mInReport )
		this.printHeader( test );
	if( !( test instanceof TestSuite ))
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
/**
 * Write a line of text.
 * @tparam String str The text to print on the line.
 * The method of this object does effectivly nothing. It must be 
 * overloaded with a proper version, that knows how to print a line,
 * if the script engine cannot be detected (yet).
 */
function ClassicResultPrinter_writeLn( str )
{
	this.getWriter().println( str );
}
ClassicResultPrinter.prototype = new ResultPrinter();
ClassicResultPrinter.prototype.addError = ClassicResultPrinter_addError;
ClassicResultPrinter.prototype.addFailure = ClassicResultPrinter_addFailure;
ClassicResultPrinter.prototype.endTest = ClassicResultPrinter_endTest;
ClassicResultPrinter.prototype.print = ClassicResultPrinter_print;
ClassicResultPrinter.prototype.printHeader = ClassicResultPrinter_printHeader;
ClassicResultPrinter.prototype.printFooter = ClassicResultPrinter_printFooter;
ClassicResultPrinter.prototype.writeLn = ClassicResultPrinter_writeLn;
ClassicResultPrinter.prototype.startTest = ClassicResultPrinter_startTest;


/**
 * Class for an application running test suites reporting in HTML.
 * @see TextTestRunner
 * @see HTMLWriterFilter
 * @deprecated since 1.2 in favour of TextTestRunner in combination with a
 * HTMLWrtierFilter wrapping an arbitrary PrinterWriter.
 */
function HTMLTestRunner( outdev )
{
	TextTestRunner.call( this, outdev );
}
/**
 * Set printer.
 * @tparam Object outdev Output device
 * @treturn Number TextTestRunner.FAILURE_EXIT.
 * The function wraps the PrinterWriter of the new ResultPrinter with a 
 * HTMLWriterFilter.
 * @deprecated since 1.2
 */
function HTMLTestRunner_setPrinter( outdev )
{
	TextTestRunner.prototype.setPrinter.call( this, outdev );
    this.mPrinter.setWriter( 
        new HTMLWriterFilter( this.mPrinter.getWriter()));
}
HTMLTestRunner.prototype = new TextTestRunner();
HTMLTestRunner.prototype.setPrinter = HTMLTestRunner_setPrinter;

