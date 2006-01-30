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
 * Test unit classes for BroadVision environment.
 * This file contains extensions for the test unit framework especially 
 * for BroadVision
 */

/**
 * Class for an application running test suites with the BroadVision ctxdriver
 * and console output.
 */
function CtxWriter()
{
}
/** 
 * \internal 
 */
function CtxWriter__flush( str )
{
	print( str.substring( 0, str.length - 1 )); 
}
CtxWriter.prototype = new PrinterWriter();
CtxWriter.prototype._flush = CtxWriter__flush;


/**
 * Class for an application running test suites with the BroadVision ctxdriver 
 * and console output.
 * @see TextTestRunner
 * @see CtxWriter
 * @deprecated since 1.2 in favour of TextTestRunner in combination with a 
 * CtxWriter.
 */
function CtxTestRunner()
{
	TextTestRunner.call( this );
}
/**
 * Write a line of text to the browser window.
 * @tparam String str The text to print on the line.
 * @deprecated since 1.2
 */
function CtxTestRunner_writeLn( str ) { print( str ); }

CtxTestRunner.prototype = new TextTestRunner();
CtxTestRunner.prototype.writeLn = CtxTestRunner_writeLn;

