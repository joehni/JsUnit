/**
 * @@file
 * Class for a call stack collector.
 * The CallStack object is mainly used for debug purposes.
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

