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
 * Utility classes needed for the JsUnit classes.
 * JsUnit need several helper classes to work properly. This file conatins
 * anything that is not related directly to JsUnit, but may be useful in other
 * environments, too.
 */

/**
 * CallStack object.
 * The object is extremly system dependent, since its functionality is not
 * within the range of ECMA 262, 3rd edition. It is supported by the
 * JScript engine and was supported in Netscape Enterprise Server 2.x, but
 * not in the newer version 4.x.
 * @ctor
 * Constructor.
 * The object collects the current call stack up to the JavaScript engine.
 * Most engines will not support call stack information with a recursion.
 * Therefore the collection is stopped when the stack has two identical
 * functions in direct sequence.
 * @tparam Number depth Maximum recorded stack depth (defaults to 10).
 **/
function CallStack( depth )
{
	/**
	 * The array with the stack. 
	 * @type Array<String>
	 */
	this.mStack = new Array();

	// set stack depth to default
	if( depth == null )
		depth = 10;

	var fn = this.getCaller( CallStack );
	if( fn === undefined )
	{
		this.mStack.push( "[CallStack information not supported]" );
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
			this.mStack.push( f + args );
	
			// Retrieve caller function
			if( fn == this.getCaller( fn ))
			{
				this.mStack.push( "[JavaScript recursion]" );
				break;
			}
			else
				fn = this.getCaller( fn );
		}
	
		if( fn == null )
		{
			this.mStack.push( "[JavaScript engine]" );
		}
	}
}

/** 
 * Retrieve the caller of a function.
 * @tparam Function fn The function to examin.
 * @treturn Function The caller as Function or undefined.
 **/
function CallStack_getCaller( fn )
{
	if( fn.caller !== undefined )
		return fn.caller;
	if( fn.arguments !== undefined && fn.arguments.caller !== undefined )
		return fn.arguments.caller;
			
	return undefined;
}

/**
 * Retrieve call stack as string.
 * The function returns the call stack as string. Each stack frame has an 
 * own line and is prepended with the call stack depth.
 * @treturn String The call stack as string.
 **/
function CallStack_toString()
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

CallStack.prototype.getCaller = CallStack_getCaller;
CallStack.prototype.toString = CallStack_toString;


// MS engine does not implement Array.push and Array.pop until JScript 5.6
if( !Array.prototype.pop )
{
	/**
	 * \class Array
	 * Standard ECMA class.
	 * \docgen function Array() {}
	 */
	/**
	 * Pops last element from Array.
	 * The function is an implementation of the Array::pop method described
	 * in the ECMA standard. It removes the last element of the Array and
	 * returns it.
	 *
	 * The function is active if the ECMA implementation does not implement
	 * it (like Microsoft JScript engine up to version 5.5).
	 * @treturn Object Last element or undefined
	 */
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
	/**
	 * Pushes elements into Array.
	 * The function is an implementation of the Array::push method described
	 * in the ECMA standard. It adds all given parameters at the end of the
	 * array.
	 *
	 * The function is active if the ECMA implementation does not implement
	 * it (like Microsoft JScript engine up to version 5.5).
	 * @treturn Object Number of added elements
	 */
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


/**
 * \class String
 * Standard ECMA class.
 * \docgen function String() {}
 */
/**
 * Trims characters from string.
 * @tparam String chars String with characters to remove.  The character may
 * also be a regular expression character class like "\\s" (which is the 
 * default).
 *
 * The function removes the given chararcters \a chars from the beginning an 
 * the end from the current string and returns the result. The function will 
 * not modify the current string.
 *
 * The function is written as String enhancement and available as new member 
 * function of the class String.
 * @treturn String String without given characters at start or end.
 */
function String_trim( chars )
{
	if( !chars )
		chars = "\\s";
	var re = new RegExp( "^[" + chars + "]*(.*?)[" + chars + "]*$" );
	var s = this.replace( re, "$1" );
	return s;
}
String.prototype.trim = String_trim;


/**
 * Flag for Microsoft JScript.
 * @type Boolean
 * The variable is true, if the script is run by the Microsoft JScript engine.
 */
var isJScript = this.ScriptEngine != null;
/**
 * \internal
 */
var hasCompatibleErrorClass = 
	(    this.Error != null 
	  && (   !isJScript 
	  	  || ( isJScript && ( this.ScriptEngineMajorVersion() >= 6 ))));

if( !this.Error || !hasCompatibleErrorClass )
{
	/**
	 * Error class according ECMA specification.
	 * This class is only active, if the ECMA implementation of the current
	 * engine does not support it or implements it not following the ECMA 
	 * standard (3rd edition).
	 * @ctor
	 * Constructor.
	 * The constructor initializes the \c message member with the argument 
	 * \a msg.
	 * @tparam String msg The error message.
	 **/
	function Error( msg )
	{
		/**
		 * The error message.
		 * @type String
		 **/
		this.message = msg || "";
	}
	/**
	 * String representation of the error.
	 * @treturn String Returns a \c String containing the Error class name 
	 * and the error message.
	 **/
	function Error_toString()
	{
		var msg = this.message;
		return this.name + ": " + msg;
	}
	Error.prototype = new Object();
	Error.prototype.toString = Error_toString;
	/**
	 * The name of the Error class as String.
	 * @type String
	 **/
	Error.prototype.name = "Error";
}


if( !this.TypeError || !hasCompatibleErrorClass )
{
	/**
	 * TypeError class according ECMA specification.
	 * This class is only active, if the ECMA implementation of the current
	 * engine does not support it or implements it nof following the ECMA 
	 * standard (3rd edition).
	 * @ctor
	 * Constructor.
	 * The constructor initializes the \c message member with the argument 
	 * \a msg.
	 * @tparam String msg The error message.
	 **/
	function TypeError( msg )
	{
		Error.call( this, msg );
	}
	TypeError.prototype = new Error();
	/**
	 * The name of the TypeError class as String.
	 * @type String
	 **/
	TypeError.prototype.name = "TypeError";
}


/**
 * InterfaceError class.
 * This error class is used for interface definitions. Such definitions are 
 * simulated using Function::fulfills. The class has no explicit functionality
 * despite the separate type
 * @see Function::fulfills
 * @ctor
 * Constructor.
 * The constructor initializes the \c message member with the argument 
 * \a msg.
 * @tparam String msg The error message.
 **/
function InterfaceError( msg )
{
	// TypeError.call( this, msg );
	this.message = msg;
}
InterfaceError.prototype = new TypeError();
/**
 * The name of the InterfaceError class as String.
 * @type String
 **/
InterfaceError.prototype.name = "InterfaceError";


/**
 * \class Function
 * Standard ECMA class.
 * \docgen function Function() {}
 */
/**
 * Ensures that a function fulfills an interface.
 * Since with ECMA 262 (3rd edition) interfaces are not supported yet, this
 * function will simulate the functionality. The arguments for the functions
 * are all classes that the current class will implement. The function checks
 * whether the current class fulfills the interface of the given classes or not.
 * @exception TypeError If the current object is not a class or the interface
 * is not a Function object with a prototype.
 * @exception InterfaceError If an interface is not fulfilled or the interface
 * has invalid members.
 */
function Function_fulfills()
{
	for( var i = 0; i < arguments.length; ++i )
	{
		var I = arguments[i];
		if( typeof I != "function" || !I.prototype )
			throw new TypeError( I.toString() + " is not an Interface" );
		if( !this.prototype )
			throw new TypeError( 
				"Current instance is not a Function definition" );
		for( var f in I.prototype )
		{
			if( typeof I.prototype[f] != "function" )
				throw new InterfaceError( f.toString() 
					+ " is not a method in Interface " + I.toString());
			if(    typeof this.prototype[f] != "function" 
				&& typeof this[f] != "function" )
			{
				if(    typeof this.prototype[f] == "undefined" 
					&& typeof this[f] == "undefined" )
					throw new InterfaceError( 
						f.toString() + " is not defined" );
				else
					throw new InterfaceError( 
						f.toString() + " is not a function" );
			}
		}
	}
}
/**
 * Simulate multiple inheritance.
 * The function adds any element of the prototype of the given classes to the
 * prototype of the current classes. Therefore the class seems to inherit the
 * definitions of the given classes. Since it is no true ECMAScript inheritance
 * any extension to the classes inherited by this function will not be 
 * available for the current class and the constructor is also not called
 * automatically.
 * @exception Error If an ambiguity occurs inheriting a class.
 * @exception TypeError If the current object is not a class or the given class
 * is not a Function object with a prototype.
 */
function Function_inherits()
{
	for( var i = 0; i < arguments.length; ++i )
	{
		var C = arguments[i];
		if( typeof C != "function" || !C.prototype )
			throw new TypeError( C.toString() + " is not a Class" );
		if( !this.prototype )
			throw new TypeError( 
				"Current instance is not a Function definition" );
		for( var m in C.prototype )
		{
			if( this.prototype[m] )
				throw new Error( "Ambiguity inheriting member " + m );
			this.prototype[m] = C.prototype[m];
		}
	}
}
Function.prototype.fulfills = Function_fulfills;
Function.prototype.inherits = Function_inherits;

