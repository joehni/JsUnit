<!-- include other JavaScript pages here -->
<%
function main( args )
{
	var runner = new CtxTestRunner();
	runner.addSuite( ArrayTest_suite());
	runner.addSuite( MoneyTest_suite());
	runner.addSuite( SimpleTest_suite());

	return runner.start( main.arguments );
}

main( "all" );
%>

