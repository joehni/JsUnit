
function CallStackTest( name )
{
	this._super = TestCase;
	this._super( name );

	function testToString()
	{
		var cs = new CallStack();
		if( cs.toString() != "1: [CallStack information not supported]" )
		{
			var reg = /(.*)\n*/;
			reg.exec( cs );
			this.assertEquals( "1: testToString()", RegExp.$1);
		}
	}

	this.testToString = testToString;
}

