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
 * @@file
 * Utility classes needed for the JsUnit classes.
 * JsUnit need several helper classes to work properly. This file conatins
 * anything that is not related directly to JsUnit, but may be useful in other
 * environments, too.
 */

/**
 * @@class
 * CallStack object.
 * The object is extremly system dependent, since its functionality is not
 * within the range of ECMA 262, 3rd edition. It is supported by the
 * JScript engine and was supported in Netscape Enterprise Server 2.x, but
 * not in the newer version 4.x.
 * @@ctor
 * Constructor.
 * The object collects the current call stack up to the JavaScript engine.
 * Most engines will not support call stack information with a recursion.
 * Therefore the collection is stopped when the stack has two identical
 * functions in direct sequence.
 * @param depth Maximum recorded stack depth (defaults to 10).
 **/
function CallStack(depth)
{
	/** 
	 * @@attrib Array<String>
	 * The array with the stack. 
	 */
	this.mStack = new Array();

	/** @@method Function
	 *  Retrieve the caller of a function.
	 *  @return The caller as Function.
	 **/
	function getCaller( fn )
	{
		if( fn.caller !== undefined )
			return fn.caller;
		if( fn.arguments !== undefined && fn.arguments.caller !== undefined )
			return fn.arguments.caller;
			
		return undefined;
	}
	/**
	 * @@method String
     * Retrieve call stack as string.
	 * @return The call stack as string.
	 **/
	function toString()
	{
		var s = new String();
		for( var i = 1; i <= this.mStack.length; ++i )
		{
			if( s.length != 0 )
				s += "\n";
			s += i.toString() + ": " + this.mStack[i-1];
		}
		return s;
	}

	this.getCaller = getCaller;
	this.toString = toString;

	// set stack depth to default
	if( depth == null )
		depth = 10;

	var fn = this.getCaller( CallStack );
	if( fn === undefined )
	{
		this.mStack[this.mStack.length] = 
			"[CallStack information not supported]";
	}
	else
	{
		while( fn != null && depth > 0 )
		{
			s = new String( fn );
			--depth;
	
			// Extract function name and argument list
			var r = /function (\w+)([^\{\}]*\))/;
			r.exec( s );
			var f = new String( RegExp.$1 );
			var args = new String( RegExp.$2 );
			this.mStack[this.mStack.length] = f + args;
	
			// Retrieve caller function
			if( fn == this.getCaller( fn ))
			{
				this.mStack[this.mStack.length] = "[JavaScript recursion]";
				break;
			}
			else
				fn = this.getCaller( fn );
		}
	
		if( fn == null )
		{
			this.mStack[this.mStack.length] = "[JavaScript engine]";
		}
	}
}


// MS engine does not implement Array.push and Array.pop until JScript 5.6
if( !Array.prototype.pop )
{
	function Array_pop()
	{
		var obj;
		if( this instanceof Array && this.length > 0 )
		{
			var last = parseInt( this.length ) - 1;
			obj = this[last];
			this.length = last;
		}
		return obj;
	}
	Array.prototype.pop = Array_pop;
}	
if( !Array.prototype.push )
{
	function Array_push()
	{
		var i = 0;
		if( this instanceof Array )
		{
			i = this.length;
			
			// Preallocation of array
			if( arguments.length > 0 )
				this[arguments.length + this.length - 1] = null;
			
			for( ; i < this.length; ++i )
				this[i] = arguments[i - this.length + arguments.length];
		}		
		return i;
	}
	Array.prototype.push = Array_push;
}


function String_trim( chars )
{
	if( !chars )
		chars = "\\s";
	var re = new RegExp( "^[" + chars + "]*(.*?)[" + chars + "]*$" );
	var s = this.replace( re, "$1");
	return s;
}
String.prototype.trim = String_trim;


var isJScript = this.ScriptEngine != null;
var hasCompatibleErrorClass = ( this.Error != null && ( !isJScript || ( isJScript && ( this.ScriptEngineMajorVersion() >= 6 ))));

if( !this.Error || !hasCompatibleErrorClass )
{
	function Error( msg )
	{
		this.message = msg || "";
	}
	function Error_toString()
	{
		var msg = this.message;
		return this.name + ": " + msg;
	}
	Error.prototype = new Object();
	Error.prototype.toString = Error_toString;
	Error.prototype.name = "Error";
	Error.prototype.message = "";
}


if( !this.TypeError || !hasCompatibleErrorClass )
{
	function TypeError( msg )
	{
		this.message = msg || "";
	}
	TypeError.prototype = new Error();
	TypeError.prototype.name = "TypeError";
}


function InterfaceError( msg )
{
	this.message = msg || "";
}
InterfaceError.prototype = new TypeError();
InterfaceError.prototype.name = "InterfaceError";


function Function_fulfills()
{
	for( var i = 0; i < arguments.length; ++i )
	{
		var I = arguments[i];
		if( typeof I != "function" || !I.prototype )
			throw new TypeError( I.toString() + " is not an Interface" );
		if( !this.prototype )
			throw new TypeError( "Current instance is not a Function definition" );
		for( var f in I.prototype )
		{
			if( typeof I.prototype[f] != "function" )
				throw new InterfaceError( f.toString() + " is not a method in Interface " + I.toString());
			if( typeof this.prototype[f] != "function" && typeof this[f] != "function" )
			{
				if( typeof this.prototype[f] == "undefined" && typeof this[f] == "undefined" )
					throw new InterfaceError( f.toString() + " is not defined" );
				else
					throw new InterfaceError( f.toString() + " is not a function" );
			}
		}
	}
}
Function.prototype.fulfills = Function_fulfills;
