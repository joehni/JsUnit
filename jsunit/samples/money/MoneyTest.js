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

function MoneyTest( name )
{
	this.constructor.call( this, name );
}	
function MoneyTest_setUp()
{
	this.f12CHF = new Money(12, "CHF");
	this.f14CHF = new Money(14, "CHF");
	this.f7USD = new Money(7, "USD");
	this.f21USD = new Money(21, "USD");
	this.fMB1 = new MoneyBag(this.f12CHF, this.f7USD);
	this.fMB2 = new MoneyBag(this.f14CHF, this.f21USD);
}
function MoneyTest_testBagMultiply()
{
	// {[12 CHF][7 USD]} *2 == {[24 CHF][14 USD]}
	var expected = 
		new MoneyBag( new Money( 24, "CHF" ), new Money( 14, "USD" ));
	this.assertTrue( expected.equals( this.fMB1.multiply( 2 ))); 
	this.assertTrue( this.fMB1.multiply( 0 ).isNull());
}
function MoneyTest_testBagNegate()
{
	// {[12 CHF][7 USD]} negate == {[-12 CHF][-7 USD]}
	var expected = 
		new MoneyBag( new Money( -12, "CHF" ), new Money( -7, "USD" ));
	this.assertTrue( expected.equals( this.fMB1.negate()));
}
function MoneyTest_testBagSimpleAdd()
{
	// {[12 CHF][7 USD]} + [14 CHF] == {[26 CHF][7 USD]}
	var expected = 
		new MoneyBag( new Money( 26, "CHF" ), new Money( 7, "USD" ));
	this.assertTrue( expected.equals( this.fMB1.add( this.f14CHF )));
}
function MoneyTest_testBagSubtract()
{
	// {[12 CHF][7 USD]} - {[14 CHF][21 USD] == {[-2 CHF][-14 USD]}
	var expected = 
		new MoneyBag( new Money( -2, "CHF" ), new Money( -14, "USD" ));
	this.assertTrue( expected.equals( this.fMB1.subtract( this.fMB2 )));
}
function MoneyTest_testBagSumAdd()
{
	// {[12 CHF][7 USD]} + {[14 CHF][21 USD]} == {[26 CHF][28 USD]}
	var expected = 
		new MoneyBag( new Money( 26, "CHF" ), new Money( 28, "USD" ));
	this.assertTrue( expected.equals( this.fMB1.add( this.fMB2 )));
}
function MoneyTest_testIsNull()
{
	this.assertTrue( this.fMB1.subtract( this.fMB1 ).isNull()); 
}
function MoneyTest_testMixedSimpleAdd()
{
	// [12 CHF] + [7 USD] == {[12 CHF][7 USD]}
	var expected = new MoneyBag( this.f12CHF, this.f7USD );
	this.assertTrue( expected.equals( this.f12CHF.add( this.f7USD )));
}
function MoneyTest_testMoneyBagEquals()
{
	this.assertFalse( this.fMB1.equals( null )); 

	this.assertTrue( this.fMB1.equals( this.fMB1 ));
	var equal = new MoneyBag( new Money( 12, "CHF" ), new Money( 7, "USD" ));
	this.assertTrue( this.fMB1.equals( equal ));
	this.assertFalse( this.fMB1.equals( this.f12CHF ));
	this.assertFalse( this.f12CHF.equals( this.fMB1 ));
	this.assertFalse( this.fMB1.equals( this.fMB2 ));
}
/* 
function MoneyTest_testMoneyBagHash()
{
	var equal = new MoneyBag( new Money( 12, "CHF" ), new Money( 7, "USD" ));
	this.assertEquals( this.fMB1.hashCode(), equal.hashCode());
} 
*/
function MoneyTest_testMoneyEquals()
{
	this.assertFalse( this.f12CHF.equals( null )); 
	var equalMoney = new Money( 12, "CHF" );
	this.assertTrue( this.f12CHF.equals( this.f12CHF ));
	this.assertTrue( this.f12CHF.equals( equalMoney ));
	//this.assertEquals( this.f12CHF.hashCode(), equalMoney.hashCode());
	this.assertFalse( this.f12CHF.equals( this.f14CHF ));
}
/* 
function MoneyTest_testMoneyHash()
{
	this.assertFalse( this.f12CHF.equals( null )); 
	var equal= new Money( 12, "CHF" );
	this.assertEquals( this.f12CHF.hashCode(), equal.hashCode());
} 
*/
function MoneyTest_testNormalize()
{
	var moneyBag = 
		new MoneyBag( 
			new Money( 26, "CHF" ), 
			new Money( 28, "CHF" ), 
			new Money( 6, "CHF" )
		);
	var expected = new MoneyBag( new Money( 60, "CHF" ));
	var expectedBag= new MoneyBag( expected );
	this.assertTrue( expectedBag.equals( moneyBag ));
}
function MoneyTest_testNormalize2()
{
	// {[12 CHF][7 USD]} - [12 CHF] == [7 USD]
	var expected = new Money( 7, "USD" );
	this.assertTrue( expected.equals( this.fMB1.subtract( this.f12CHF )));
}
function MoneyTest_testNormalize3()
{
	// {[12 CHF][7 USD]} - {[12 CHF][3 USD]} == [4 USD]
	var ms1 = new MoneyBag( new Money( 12, "CHF" ), new Money( 3, "USD" ));
	var expected = new Money( 4, "USD" );
	this.assertTrue( expected.equals( this.fMB1.subtract( ms1 )));
}
function MoneyTest_testNormalize4()
{
	// [12 CHF] - {[12 CHF][3 USD]} == [-3 USD]
	var ms1 = new MoneyBag( new Money( 12, "CHF" ), new Money( 3, "USD" ));
	var expected = new Money( -3, "USD" );
	this.assertTrue( expected.equals( this.f12CHF.subtract( ms1 )));
}
function MoneyTest_testPrint()
{
	this.assertEquals( "[12 CHF]", this.f12CHF.toString());
}
function MoneyTest_testSimpleAdd()
{
	// [12 CHF] + [14 CHF] == [26 CHF]
	var expected = new Money( 26, "CHF" );
	this.assertEquals( expected.toString(), 
		this.f12CHF.add( this.f14CHF ).toString());
}
function MoneyTest_testSimpleBagAdd()
{
	// [14 CHF] + {[12 CHF][7 USD]} == {[26 CHF][7 USD]}
	var expected = 
		new MoneyBag( new Money( 26, "CHF" ), new Money( 7, "USD" ));
	this.assertTrue( expected.equals( this.f14CHF.add( this.fMB1 )));
}
function MoneyTest_testSimpleMultiply()
{
	// [14 CHF] *2 == [28 CHF]
	var expected = new Money( 28, "CHF" );
	this.assertEquals( expected.toString(), 
		this.f14CHF.multiply( 2 ).toString());
}
function MoneyTest_testSimpleNegate()
{
	// [14 CHF] negate == [-14 CHF]
	var expected= new Money( -14, "CHF" );
	this.assertEquals( expected.toString(), 
		this.f14CHF.negate().toString());
}
function MoneyTest_testSimpleSubtract()
{
	// [14 CHF] - [12 CHF] == [2 CHF]
	var expected= new Money( 2, "CHF" );
	this.assertEquals( expected.toString(), 
		this.f14CHF.subtract( this.f12CHF ).toString());
}
MoneyTest.prototype = new TestCase();
MoneyTest.prototype.setUp = MoneyTest_setUp
MoneyTest.prototype.testBagMultiply = MoneyTest_testBagMultiply
MoneyTest.prototype.testBagNegate = MoneyTest_testBagNegate
MoneyTest.prototype.testBagSimpleAdd = MoneyTest_testBagSimpleAdd
MoneyTest.prototype.testBagSubtract = MoneyTest_testBagSubtract
MoneyTest.prototype.testBagSumAdd = MoneyTest_testBagSumAdd
MoneyTest.prototype.testIsNull = MoneyTest_testIsNull
MoneyTest.prototype.testMixedSimpleAdd = MoneyTest_testMixedSimpleAdd
MoneyTest.prototype.testMoneyBagEquals = MoneyTest_testMoneyBagEquals
// MoneyTest.prototype.testMoneyBagHash = MoneyTest_testMoneyBagHash
MoneyTest.prototype.testMoneyEquals = MoneyTest_testMoneyEquals
// MoneyTest.prototype.testMoneyHash = MoneyTest_testMoneyHash
MoneyTest.prototype.testNormalize = MoneyTest_testNormalize
MoneyTest.prototype.testNormalize2 = MoneyTest_testNormalize2
MoneyTest.prototype.testNormalize3 = MoneyTest_testNormalize3
MoneyTest.prototype.testNormalize4 = MoneyTest_testNormalize4
MoneyTest.prototype.testPrint = MoneyTest_testPrint
MoneyTest.prototype.testSimpleAdd = MoneyTest_testSimpleAdd
MoneyTest.prototype.testSimpleBagAdd = MoneyTest_testSimpleBagAdd
MoneyTest.prototype.testSimpleMultiply = MoneyTest_testSimpleMultiply
MoneyTest.prototype.testSimpleNegate = MoneyTest_testSimpleNegate
MoneyTest.prototype.testSimpleSubtract = MoneyTest_testSimpleSubtract


function MoneyTestSuite()
{
	this.addTestSuite( MoneyTest );
}
MoneyTestSuite.prototype = new TestSuite();

