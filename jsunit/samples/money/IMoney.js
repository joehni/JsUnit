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
 */
function IMoney() 
{
}
/**
 * Adds a money to this money.
 */
function IMoney_add( money ) 
{ 
}
/**
 * Adds a simple Money to this money. This is a helper method for
 * implementing double dispatch
 */
function IMoney_addMoney( money ) 
{
}
/**
 * Adds a MoneyBag to this money. This is a helper method for
 * implementing double dispatch
 */
function IMoney_addMoneyBag( moneyBag ) 
{
}
/**
 * Tests whether this money is null
 */
function IMoney_isNull() 
{
}
/**
 * Multiplies a money by the given factor.
 */
function IMoney_multiply( factor ) 
{
}
/**
 * Negates this money.
 */
function IMoney_negate() 
{
}
/**
 * Subtracts a money from this money.
 */
function IMoney_subtract( iMoney ) 
{
}

IMoney.prototype.add = IMoney_add;
IMoney.prototype.addMoney = IMoney_addMoney;
IMoney.prototype.addMoneyBag = IMoney_addMoneyBag;
IMoney.prototype.isNull = IMoney_isNull;
IMoney.prototype.multiply = IMoney_multiply;
IMoney.prototype.negate = IMoney_negate;
IMoney.prototype.subtract = IMoney_subtract;

