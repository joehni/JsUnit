
function CallStackTest( name )
{
	this._super = TestCase;
	this._super( name );

	function testToString()
	{
		var cs = new CallStack();
		var reg = /(.*)\n/;
		reg.exec( cs );
		this.assertEquals( "1: testToString()", RegExp.$1);
	}

	this.testToString = testToString;
}

function CallStackTest_suite()
{
	var suite = new TestSuite( "CallStack" );
	suite.addTest( new CallStackTest( "testToString" ));

	return suite;
}

