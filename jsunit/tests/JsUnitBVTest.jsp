<!-- include other JavaScript pages here -->
<%
function main( args )
{
	var runner = new CtxTestRunner();
	runner.addSuite( new TestSuite( new CallStackTest()));
	runner.addSuite( new TestSuite( new AssertionFailedErrorTest()));
	runner.addSuite( new TestSuite( new TestTest()));
	runner.addSuite( new TestSuite( new TestFailureTest()));
	runner.addSuite( new TestSuite( new TestResultTest()));
	runner.addSuite( new TestSuite( new AssertTest()));
	runner.addSuite( new TestSuite( new TestCaseTest()));
	runner.addSuite( new TestSuite( new TestSuiteTest()));
	runner.addSuite( new TestSuite( new TestRunnerTest()));
	runner.addSuite( new TestSuite( new TextTestRunnerTest()));

	return runner.start( main.arguments );
}

main( "all" );
%>

