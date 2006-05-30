/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002,2003 Joerg Schaible

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
 */
function IMoney() 
{
}

/**
 * Adds a money to this money.
 */
IMoney.prototype.add = function ( money ) {};
/**
 * Adds a simple Money to this money. This is a helper method for
 * implementing double dispatch
 */
IMoney.prototype.addMoney = function ( money ) {};
/**
 * Adds a MoneyBag to this money. This is a helper method for
 * implementing double dispatch
 */
IMoney.prototype.addMoneyBag = function ( moneyBag ) {};
/**
 * Tests whether this money is zero
 */
IMoney.prototype.isZero = function () {};
/**
 * Multiplies a money by the given factor.
 */
IMoney.prototype.multiply = function ( factor ) {};
/**
 * Negates this money.
 */
IMoney.prototype.negate = function () {};
/**
 * Subtracts a money from this money.
 */
IMoney.prototype.subtract = function ( iMoney ) {};
/**
 * Append this to a MoneyBag m.
 */
IMoney.prototype.appendTo = function ( moneyBag ) {};

