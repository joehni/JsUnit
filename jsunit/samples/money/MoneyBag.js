/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999-2001 Joerg Schaible

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation in version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

Test suites built with JsUnit are derivative works derived from tested 
classes and functions in their production; they are not affected by this 
license.
*/

/**
 * A MoneyBag defers exchange rate conversions. For example adding 
 * 12 Swiss Francs to 14 US Dollars is represented as a bag 
 * containing the two Monies 12 CHF and 14 USD. Adding another
 * 10 Swiss francs gives a bag with 22 CHF and 14 USD. Due to 
 * the deferred exchange rate conversion we can later value a 
 * MoneyBag with different exchange rates.
 *
 * A MoneyBag is represented as a list of Monies and provides 
 * optional arguments to create a MoneyBag. 
 */
function MoneyBag() {
	this._super = IMoney;
	this._super();
	
	this.fMonies = new Array();

	function add(money) {
		return money.addMoneyBag(this);
	}
	function addMoney(money) {
		var moneyBag = new MoneyBag(money, this);
		return moneyBag.simplify();
	}
	function addMoneyBag(moneyBag) {
		var moneyBag = new MoneyBag(moneyBag, this);
		return moneyBag.simplify();
	}
	function appendBag(moneyBag) {
		for (var i = 0; i < moneyBag.fMonies.length; ++i)
			this.appendMoney(moneyBag.fMonies[i]);
	}
	function appendMoney(money) {
		if (money.amount() == 0)
			return;
		var i = this.findMoney(money.currency());
		if (i == null) {
			this.fMonies[this.fMonies.length] = money;
			return;
		}
		var old = this.fMonies[i];
		var sum = old.add(money);
		if (sum.amount() != 0 ) {
			this.fMonies[i] = sum;
		} else {
			var monies = new Array();
			for( j = 0; j < this.fMonies.length; ++j ) {
				if (j != i)
					monies[monies.length] = this.fMonies[j];
			}
			this.fMonies = monies;
		}
	}
	function contains(money) {
		var i = this.findMoney(money.currency());
		return i != null && this.fMonies[i].amount() == money.amount();
	}
	function equals(object) {
		if (object == null)
			return false;

		if (this.isNull())
			if (   object instanceof Money
			    || object instanceof MoneyBag)
				return object.isNull();

		if (object instanceof MoneyBag) {
			if (object.fMonies.length != this.fMonies.length)
				return false;

			for (var i = 0; i < this.fMonies.length; ++i) {
				if (!object.contains(this.fMonies[i]))
					return false;
			}
			return true;
		}
		return false;
	}
	function findMoney(currency) {
		for (var i = 0; i < this.fMonies.length; ++i) {
			var money = this.fMonies[i];
			if (money.currency() == currency) {
				return i;
			}
		}
		return null;
	}
	/*
	function int hashCode() {
		int hash= 0;
	    for (Enumeration e= fMonies.elements(); e.hasMoreElements(); ) {
	        Object m= e.nextElement();
			hash^= m.hashCode();
		}
	    return hash;
	} */
	function isNull() {
		return this.fMonies.length == 0;
	}
	function multiply(factor) {
		var result = new MoneyBag();
		if (factor != 0) {
			for (var i = 0; i < this.fMonies.length; ++i) {
		        result.appendMoney(this.fMonies[i].multiply(factor));
			}
		}
		return result;
	}
	function negate() {
		var result = new MoneyBag();
		for (var i = 0; i < this.fMonies.length; ++i) {
	        result.appendMoney(this.fMonies[i].negate());
		}
		return result;
	}
	function simplify() {
		if (this.fMonies.length == 1)
			return this.fMonies[0];
		return this;
	}
	function subtract(money) {
		return this.add(money.negate());
	}
	function toString() {
		var	buffer = "{";
		for (var i = 0; i < this.fMonies.length; ++i) {
		    buffer = buffer + this.fMonies[i].toString();
		}
		return buffer + "}";
	}

	this.add = add;
	this.addMoney = addMoney;
	this.addMoneyBag = addMoneyBag;
	this.appendBag = appendBag;
	this.appendMoney = appendMoney;
	this.contains = contains;
	this.equals = equals;
	this.findMoney = findMoney;
	this.isNull = isNull;
	this.multiply = multiply;
	this.negate = negate;
	this.simplify = simplify;
	this.subtract = subtract;
	this.toString = toString;

	var args;
	if( MoneyBag.arguments !== undefined )
		args = MoneyBag.arguments;
	else
		args = arguments;
	for (var i = 0; i < args.length; ++i) {
		if (args[i] == null)
			continue;
		if (args[i] instanceof Money) {
			this.appendMoney( args[i] );
		}
		if (args[i] instanceof MoneyBag) {
			this.appendBag( arguments[i] );
		}
	}
}
