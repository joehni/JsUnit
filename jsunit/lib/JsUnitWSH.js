/**
 * @@file
 * Test unit classes for Windows Scripting Host environment.
 * This file contains extensions for the test unit framework especially for
 * the Windows Scriptinh Host.
 */

/**
 * @@class
 * Class for an application running test suites with the Windows Scripting Host
 * using the console.
 */
function WshTestRunner()
{
	this._super = TextTestRunner;
	this._super();

	/**
	 * @@method
     * Write a line of text to the console via the Windows Scripting Host.
     * @param str The text to print on the line.
     */
	function writeLn( str ) { WScript.Echo( str ); }

	this.writeLn = writeLn;
}
