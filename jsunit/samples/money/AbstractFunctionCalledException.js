function AbstractFunctionCalledException( fnName ) {
	this.mFunction = fnName;

	function toString() { 
		return "Abstract function called: " + this.mFunction; 
	}

	this.toString = toString;
}

