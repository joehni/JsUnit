/**
 * @@file
 * Test unit classes for an Internet Browser environment.
 * This file contains extensions for the test unit framework especially for 
 * output of the results at an Internet browser.
 */

/**
 * @@class
 * Class for an application running test suites with a browser.
 */
function BrowserTestRunner()
{
	this._super = TextTestRunner;
	this._super();

	/**
	 * @@method
	 * Write a header starting the application.
	 */
	function printHeader( result )
	{
		document.writeln( "<pre>" );
		this._printHeader( result );
	}
	/**
	 * @@method
	 * Write a footer at application end with a summary of the tests.
	 */
	function printFooter( result )
	{
		this._printFooter( result );
		document.writeln( "</pre>" );
	}
	/**
	 * @@method
     * Write a line of text to the console to the browser window.
     * @param str The text to print on the line.
     */
	function writeLn( str ) { document.writeln( str ); }

	this._printHeader = this.printHeader;
	this.printHeader = printHeader;
	this._printFooter = this.printFooter;
	this.printFooter = printFooter;
	this.writeLn = writeLn;
}

