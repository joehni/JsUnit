<!-- include other JavaScript pages here -->
<%
function main( args )
{
	var runner = new CtxTestRunner();
	runner.addSuite( new TestSuite( new CallStackTest()));

	return runner.start( main.arguments );
}

main( "all" );
%>

