/**
 * A simple Money.
 *
 * Constructs a money from the given amount and currency.
 */
function Money(theAmount, theCurrency) {
	this._super = IMoney;
	this._super();

	this.fAmount = theAmount;
	this.fCurrency = theCurrency;

	/**
	 * Adds a money to this money. Forwards the request to the addMoney helper.
	 */
	function add(money) {
		return money.addMoney(this);
	}
	function addMoney(money) {
		if (money.currency() == this.currency())
			return new Money(this.amount()+money.amount(), this.currency());
		return new MoneyBag(this, money);
	}
	function addMoneyBag(moneyBag) {
		return moneyBag.addMoney(this);
	}
	function amount() {
		return this.fAmount;
	}
	function currency() {
		return this.fCurrency;
	}
	function equals(object) {
		if (object == null)
			return false;

		if (this.isNull()) {
			if (   object.constructor == Money
			    || object.constructor == MoneyBag)
				return object.isNull();
		}
				
		if (object.constructor == Money) {
			return    object.currency() == this.currency()
				   && this.amount() == object.amount();
		}
		return false;
	}
	/*
	public int hashCode() {
		return fCurrency.hashCode()+fAmount;
	} */
	function isNull() {
		return this.amount() == 0;
	}
	function multiply(factor) {
		return new Money(this.amount()*factor, this.currency());
	}
	function negate() {
		return new Money(-this.amount(), this.currency());
	}
	function subtract(money) {
		return this.add(money.negate());
	}
	function toString() {
		return "[" + this.amount() + " " + this.currency() + "]";
	}

	this.add = add;
	this.addMoney = addMoney;
	this.addMoneyBag = addMoneyBag;
	this.amount = amount;
	this.currency = currency;
	this.equals = equals;
	this.isNull = isNull;
	this.multiply = multiply;
	this.negate = negate;
	this.subtract = subtract;
	this.toString = toString;
}
