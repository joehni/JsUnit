/**
 * The common interface for simple Monies and MoneyBags
 *
 */
function IMoney() {
	/**
	 * Adds a money to this money.
	 */
	function add(money) { 
		throw new AbstractFunctionCalledException( "add" ); 
	}
	/**
	 * Adds a simple Money to this money. This is a helper method for
	 * implementing double dispatch
	 */
	function addMoney(money) {
		throw new AbstractFunctionCalledException( "addMoney" ); 
	}
	/**
	 * Adds a MoneyBag to this money. This is a helper method for
	 * implementing double dispatch
	 */
	function addMoneyBag(moneyBag) {
		throw new AbstractFunctionCalledException( "addMoneyBag" ); 
	}
	/**
	 * Tests whether this money is null
	 */
	function isNull() {
		throw new AbstractFunctionCalledException( "isNull" ); 
	}
	/**
	 * Multiplies a money by the given factor.
	 */
	function multiply(factor) {
		throw new AbstractFunctionCalledException( "multiply" ); 
	}
	/**
	 * Negates this money.
	 */
	function negate() {
		throw new AbstractFunctionCalledException( "negate" ); 
	}
	/**
	 * Subtracts a money from this money.
	 */
	function subtract(iMoney) {
		throw new AbstractFunctionCalledException( "subtract" ); 
	}

	this.add = add;
	this.addMoney = addMoney;
	this.addMoneyBag = addMoneyBag;
	this.isNull = isNull;
	this.multiply = multiply;
	this.negate = negate;
	this.subtract = subtract;
}
