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
