/**
 * A sample test case, testing <code>Array</code> object.
 *
 */
function ArrayTest(name) {
	this._super = TestCase;
	this._super( name );

	function setUp() {
		this.fEmpty = new Array();
		this.fFull = new Array();
		this.fFull[0] = 1;
		this.fFull[1] = 2;
		this.fFull[2] = 3;
	}
	function testCapacity() {
		var size = this.fFull.length; 
		for (var i = 0; i < 100; i++)
			this.fFull[size + i] = i;
		this.assertEquals(100+size, this.fFull.length);
	}
	function testConcat() {
		for (var i = 0; i < 3; i++)
			this.fEmpty[i] = i+4;
		var all = this.fFull.concat(this.fEmpty);
		this.assertEquals("1,2,3,4,5,6", all);
	}
	function testJoin() {
		this.assertEquals("1-2-3", this.fFull.join("-"));
		// Interesting: Following test fails!
		//this.assertEquals("123", this.fFull.join());
	}
	function testReverse() {
		this.assertEquals("3,2,1", this.fFull.reverse());
	}
	function testSlice() {
		this.assertEquals("2,3", this.fFull.slice(1));
		this.assertEquals("2", this.fFull.slice(1,2));
		this.assertEquals("1,2", this.fFull.slice(0,-1));
	}
	function testSort() {
		for (var i = 0; i < 3; i++)
			this.fEmpty[i] = i+4;
		var all = this.fEmpty.concat(this.fFull);
		this.assertEquals("1,2,3,4,5,6", all.sort());
	}

	this.setUp = setUp;
	this.testCapacity = testCapacity;
	this.testConcat = testConcat;
	this.testJoin = testJoin;
	this.testReverse = testReverse;
	this.testSlice = testSlice;
	this.testSort = testSort;
}

function ArrayTest_suite()
{
	var suite = new TestSuite( "Array" );
	suite.addTest( new ArrayTest( "testCapacity" ));
	suite.addTest( new ArrayTest( "testConcat" ));
	suite.addTest( new ArrayTest( "testJoin" ));
	suite.addTest( new ArrayTest( "testReverse" ));
	suite.addTest( new ArrayTest( "testSlice" ));
	suite.addTest( new ArrayTest( "testSort" ));

	return suite;
}

