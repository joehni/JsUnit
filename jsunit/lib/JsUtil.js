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
 * Utility classes needed for the JsUnit classes.
 * JsUnit need several helper classes to work properly. This file conatins
 * anything that is not related directly to JsUnit, but may be useful in other
 * environments, too.
 */

/**
 * @@class
 * CallStack object.
 * The object collects the current call stack up to the JavaScript engine.
 * @@ctor
 * Constructor.
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
			if (s.length != 0)
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

/**
 * ToDo: The perl script cannot handle currently this programming style.
 **/
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

// MS engine does not implement push and pop until JScript 6.0
if ( !Array.prototype.pop )
	Array.prototype.pop = Array_pop;
if ( !Array.prototype.push ) 
	Array.prototype.push = Array_push;

