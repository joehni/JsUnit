<!-- include other JavaScript pages here -->
<%
function main( args )
{
	var runner = new CtxTestRunner();
	runner.addSuite( new TestSuite( new ArrayTest()));
	runner.addSuite( new TestSuite( new MoneyTest()));
	runner.addSuite( new TestSuite( new SimpleTest()));

	return runner.start( main.arguments );
}

main( "all" );
%>

