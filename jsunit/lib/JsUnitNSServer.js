/**
 * @@file
 * Test unit classes for a Netscape Server environment.
 * This file contains extensions for the test unit framework especially for 
 * output of the results at a Netscape Server.
 */

/**
 * @@class
 * Class for an application running test suites with a Netscape Server.
 */
function NSServerTestRunner()
{
	this._super = TextTestRunner;
	this._super();

	/**
	 * @@method
	 * Write a header starting the application.
	 */
	function printHeader( result )
	{
		write( "<pre>" );
		this._printHeader( result );
	}
	/**
	 * @@method
	 * Write a footer at application end with a summary of the tests.
	 */
	function printFooter( result )
	{
		this._printFooter( result );
		write( "</pre>" );
	}
	/**
	 * @@method
     * Write a line of text to the console to the browser window.
     * @param str The text to print on the line.
     */
	function writeLn( str ) { write( str + "\n" ); }

	this._printHeader = this.printHeader;
	this.printHeader = printHeader;
	this._printFooter = this.printFooter;
	this.printFooter = printFooter;
	this.writeLn = writeLn;
}

