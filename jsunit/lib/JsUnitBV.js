/**
 * @@file
 * Test unit classes for BroadVision environment.
 * This file contains extensions for the test unit framework especially for BroadVision
 */

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

