/**
 * Some simple tests.
 *
 */
function SimpleTest(name) {
	this._super = TestCase;
	this._super( name );

	function setUp() {
		this.fValue1= 2;
		this.fValue2= 3;
	}
	function testAdd() {
		var result = this.fValue1 + this.fValue2;
		// forced failure result == 5
		this.assert(result == 6);
	}
	function testDivideByZero() {
		var zero = 0;
		this.assertEquals("Infinity", 8/zero);
	}
	function testAsserts() {
		this.assert(true);
		this.assertEquals(1, this.fValue2 - this.fValue1);
		this.assertNotNull(this.fValue1);
		this.assertNull(null);
		this.assertUndefined();
		this.assertNotUndefined( true );
	}
	
	this.setUp = setUp;
	this.testAdd = testAdd;
	this.testDivideByZero = testDivideByZero;
	this.testAsserts = testAsserts;
}

