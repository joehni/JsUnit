/**
 * @@file
 * Test unit classes for BroadVision environment.
 * This file contains extensions for the test unit framework especially for BroadVision
 */

/**
 * @@class
 * Base class for a test in an initialised BroadVision session setup.
 * @@ctor
 * The constructor.
 * @param test The test.
 */
function TestBVSessionSuite( name )
{
	this._super = TestSuite;
	this._super( name )

	/**
	 * @@method
	 * Set up the environment of the test.
	 */
	function setUp() 
	{ 
		p15_initSystemState(); 
		setCurrentService( P15_SERVICE_TEST );
	}

	this.setUp = setUp;
}

/**
 * @@class
 * Class for an application running test suites with the BroadVision ctxdriver and console output.
 */
function CtxTestRunner()
{
	this._super = TextTestRunner;
	this._super();

	/**
	 * @@method
     * Write a line of text to the console via BroadVision ctxdriver.
     * @param str The text to print on the line.
     */
	function writeLn( str ) { print( str ); }

	this.writeLn = writeLn;
}

/**
 * @@class
 * Class for an application running test suites with the BroadVision ctxdriver and HTML output.
 */
function CtxJspTestRunner()
{
	this._super = TextTestRunner;
	this._super();

	/**
	 * @@method
     * Write a line of text to the console via BroadVision ctxdriver.
     * @param str The text to print on the line.
     */
	function writeLn( str ) { Response.write( str + "\n" ); }

	this.writeLn = writeLn;
}
