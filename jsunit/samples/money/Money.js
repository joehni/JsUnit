/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002,2003,2006 Joerg Schaible

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
 * A simple Money.
 *
 * Constructs a money from the given amount and currency.
 */
function Money( theAmount, theCurrency ) 
{
    this.fAmount = theAmount;
    this.fCurrency = theCurrency;
}
/**
 * Adds a money to this money. Forwards the request to the addMoney helper.
 */
function Money_add( money ) 
{
    return money.addMoney( this );
}
function Money_addMoney( money ) 
{
    if( money.currency() == this.currency())
        return new Money( this.amount() + money.amount(), this.currency());
    return new MoneyBag.prototype.create( this, money );
}
function Money_addMoneyBag( moneyBag ) 
{
    return moneyBag.addMoney( this );
}
function Money_amount() 
{
    return this.fAmount;
}
function Money_currency() 
{
    return this.fCurrency;
}
function Money_equals( object ) 
{
    if( object instanceof MoneyBag )
        return this.isZero() && object.isZero();

    if( object instanceof Money ) 
    {
        return    object.currency() == this.currency()
               && this.amount() == object.amount();
    }
    return false;
}
/*
public Money_int hashCode() 
{
    return fCurrency.hashCode()+fAmount;
} 
*/
function Money_isZero() 
{
    return this.amount() == 0;
}
function Money_multiply( factor ) 
{
    return new Money( this.amount() * factor, this.currency());
}
function Money_negate() 
{
    return new Money( -this.amount(), this.currency());
}
function Money_subtract( money ) 
{
    return this.add( money.negate());
}
function Money_toString() 
{
    return "[" + this.amount() + " " + this.currency() + "]";
}
function Money_appendTo( m ) 
{
    m.appendMoney( this );
}
Money.prototype.add = Money_add;
Money.prototype.addMoney = Money_addMoney;
Money.prototype.addMoneyBag = Money_addMoneyBag;
Money.prototype.amount = Money_amount;
Money.prototype.currency = Money_currency;
Money.prototype.equals = Money_equals;
Money.prototype.isZero = Money_isZero;
Money.prototype.multiply = Money_multiply;
Money.prototype.negate = Money_negate;
Money.prototype.subtract = Money_subtract;
Money.prototype.toString = Money_toString;
Money.prototype.appendTo = Money_appendTo;
Money.prototype.fAmount = 0.0;
Money.fulfills( IMoney );

