<!-- include other JavaScript pages here -->
<%
function main( args )
{
	var runner = new CtxTestRunner();
	runner.addSuite( CallStackTest_suite());

	return runner.start( main.arguments );
}

main( "all" );
%>

