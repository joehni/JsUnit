/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002 Joerg Schaible

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
function MoneyBag() 
{
	this._super = IMoney;
	this._super();
	
	this.fMonies = new Array();

	for( var i = 0; i < arguments.length; ++i ) 
	{
		if( arguments[i] instanceof Money ) 
			this.appendMoney( arguments[i] );
		if( arguments[i] instanceof MoneyBag ) 
			this.appendBag( arguments[i] );
	}
}
function MoneyBag_add( money ) 
{
	return money.addMoneyBag( this );
}
function MoneyBag_addMoney( money ) 
{
	var moneyBag = new MoneyBag( money, this );
	return moneyBag.simplify();
}
function MoneyBag_addMoneyBag( moneyBag ) 
{
	var moneyBag = new MoneyBag( moneyBag, this );
	return moneyBag.simplify();
}
function MoneyBag_appendBag( moneyBag ) 
{
	for( var i = 0; i < moneyBag.fMonies.length; ++i )
		this.appendMoney( moneyBag.fMonies[i] );
}
function MoneyBag_appendMoney( money ) 
{
	if( money.amount() == 0 )
		return;
	var i = this.findMoney( money.currency());
	if ( i == null )
	{
		this.fMonies.push( money );
		return;
	}
	var old = this.fMonies[i];
	var sum = old.add( money );
	if( sum.amount() != 0 ) 
	{
		this.fMonies[i] = sum;
	} 
	else 
	{
		var monies = new Array();
		for( j = 0; j < this.fMonies.length; ++j ) 
		{
			if( j != i )
				monies.push( this.fMonies[j] );
		}
		this.fMonies = monies;
	}
}
function MoneyBag_contains( money ) 
{
	var i = this.findMoney( money.currency());
	return i != null && this.fMonies[i].amount() == money.amount();
}
function MoneyBag_equals( object ) 
{
	if( object == null )
		return false;

	if( object instanceof Money )
		return this.isNull() && object.isNull();

	if( object instanceof MoneyBag ) 
	{
		if( object.fMonies.length != this.fMonies.length )
			return false;

		for( var i = 0; i < this.fMonies.length; ++i )
		{
			if( !object.contains(this.fMonies[i]))
				return false;
		}
		return true;
	}
	return false;
}
function MoneyBag_findMoney( currency ) 
{
	for( var i = 0; i < this.fMonies.length; ++i ) 
	{
		var money = this.fMonies[i];
		if( money.currency() == currency ) 
			return i;
	}
	return null;
}
/*
function MoneyBag_int hashCode() 
{
	int hash= 0;
    for( Enumeration e= fMonies.elements(); e.hasMoreElements(); ) 
	{
        Object m = e.nextElement();
		hash ^= m.hashCode();
	}
    return hash;
} 
*/
function MoneyBag_isNull() 
{
	return this.fMonies.length == 0;
}
function MoneyBag_multiply( factor ) 
{
	var result = new MoneyBag();
	if( factor != 0 )
	{
		for( var i = 0; i < this.fMonies.length; ++i ) 
	        result.appendMoney( this.fMonies[i].multiply( factor ));
	}
	return result;
}
function MoneyBag_negate() 
{
	var result = new MoneyBag();
	for( var i = 0; i < this.fMonies.length; ++i )
        result.appendMoney( this.fMonies[i].negate());
	return result;
}
function MoneyBag_simplify() 
{
	if( this.fMonies.length == 1 )
		return this.fMonies[0];
	return this;
}
function MoneyBag_subtract( money ) 
{
	return this.add( money.negate());
}
function MoneyBag_toString() 
{
	var	buffer = "{";
	for( var i = 0; i < this.fMonies.length; ++i )
	    buffer = buffer + this.fMonies[i].toString();
	return buffer + "}";
}

MoneyBag.prototype.add = MoneyBag_add;
MoneyBag.prototype.addMoney = MoneyBag_addMoney;
MoneyBag.prototype.addMoneyBag = MoneyBag_addMoneyBag;
MoneyBag.prototype.appendBag = MoneyBag_appendBag;
MoneyBag.prototype.appendMoney = MoneyBag_appendMoney;
MoneyBag.prototype.contains = MoneyBag_contains;
MoneyBag.prototype.equals = MoneyBag_equals;
MoneyBag.prototype.findMoney = MoneyBag_findMoney;
MoneyBag.prototype.isNull = MoneyBag_isNull;
MoneyBag.prototype.multiply = MoneyBag_multiply;
MoneyBag.prototype.negate = MoneyBag_negate;
MoneyBag.prototype.simplify = MoneyBag_simplify;
MoneyBag.prototype.subtract = MoneyBag_subtract;
MoneyBag.prototype.toString = MoneyBag_toString;
