/**
 * \file
 * This is the file.
 */

function B(x, y) {}
B.prototype.memfun = function (q) {}

function C() {}
C.prototype.memvar = 1;

if( true )
{
	function CC_test() {}
	C.prototype.CC = function () {}
	C.prototype.CC.prototype.test = CC_test;

	var vvv;
}

var regex = /function (\w+)([^\{\}]*\))/;

/**
 * This is variable v.
 * \type Array<int>
 */
var v = new Array( 5 );

/**
 * \ctor
 * C'tor of x.
 * \tparam float a this is \a a
 * @tparam double b this is \a b
 * This is the long text of the c'tor.
 */
function x(a,b)
{
	/*! A member var. */
	this.xx = " Hi\n\"";
	if( /^$/ )
	{
		this.xxx = 1;
	}

	function N()
	{
	/*! \file xxx */
	}

	N.prototype = new M();
}
/**
 * This is class x.
 * We can describe x also with a long text.
 */
x.prototype = new y();
/**
 * This is static member a.
 * \type long
 * Long description of a.
 */
x.prototype.a = 1;
x.prototype.xxx = 0;
x.prototype.fn = B.prototype.memfun;
/**
 * Member function.
 * \type "char *"
 */
x.prototype.anonymous = function() { return "Hello"; }
/**
 * This is class O.
 * \ctor
 * Nothing special.
 */
x.prototype.O = function () {}
x.prototype.O.prototype = new y();
x.fulfills( A, B );

/**
 * Hi.
 * Function returns "Hi!"
 * \tparam int x this is \a x
 * \type String
 * This is the long text of the function.
 */
function fn2(x)
{
	return "Hi!";
}

/**
 * \class Array
 * Standard ECMA class.
 * \docgen function Array() {}
 */
 /**
 * Test for emptiness.
 * Expand Array with test for emptiness.
 * @treturn Boolean true or false
 */
function Array_isEmpty( array )
{
	return array.length() == 0;
}
Array.prototype.isEmpty = Array_isEmpty;
Array.prototype.test = x.prototype.CC.prototype.test;
Array.prototype._toString = Array.prototype.toString;
Array.prototype.member = 1;


