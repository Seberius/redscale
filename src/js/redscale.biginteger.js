goog.provide('redscale.BigInteger');

/**
 * BigInteger type.
 * @param {!number} signum - Maybe 0, 1, or -1.
 * @param {!Int16Array} magnitude - An Int16Array.
 * @constructor
 * @struct
 * @export
 */
redscale.BigInteger = function( signum, magnitude ) {
  /** @type {string} */
  this.redscaleType = "BigInteger";
  this.signum = signum;
  this.magnitude = magnitude;
};

/**
 * Add - Returns a RedScale type representing the sum.
 * @param {!redscale.BigInteger|number} bVal - The RedScale type or number being added.
 * @returns {!redscale.BigInteger}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.add = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.add( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.add( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Subtract - Returns a RedScale type representing the difference.
 * @param {!redscale.BigInteger|number} bVal - The RedScale type or number being subtracted.
 * @returns {!redscale.BigInteger}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.sub = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.subtract( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.subtract( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Multiply - Returns a RedScale type representing the product.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!redscale.BigInteger}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.mul = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.multiply( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.multiply( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Divide:Quotient - Returns a RedScale type representing the quotient.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!redscale.BigInteger}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.div = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.divide( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.divide( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Divide:Remainder - Returns a RedScale type representing the remainder.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!redscale.BigInteger}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.rem = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.remainder( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.remainder( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Divide - Returns an Array containing the RedScale types representing the quotient & remainder.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!Array<!redscale.BigInteger, !redscale.BigInteger>}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.divRem = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.divideRem( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.divideRem( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * GCD - Returns an Array containing the RedScale types representing the GCD.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!Array<!redscale.BigInteger, !redscale.BigInteger>}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.gcd = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.gcd( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.gcd( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * toString - Returns a string exactly representing the BigInteger.
 * @param {number} radix - A number in the range of 2 - 36.
 * @returns {!string}
 * @override
 * @export
 */
redscale.BigInteger.prototype.toString = function( radix ) {
  return redscale.magnitude.toString( this.signum, this.magnitude, radix );
};

/**
 * ofValue - Returns the closest precision representation possible as a native JS number.
 *     Precise if Number.isSafeInteger(result).
 * @returns {!number}
 * @export
 */
redscale.BigInteger.prototype.ofValue = function() {
  return redscale.magnitude.toNumber( this.signum, this.magnitude );
};

/**
 * toNumber - Returns the closest precision representation possible as a native JS number.
 *     Precise if Number.isSafeInteger(result).
 * @returns {!number}
 * @export
 */
redscale.BigInteger.prototype.toNumber = function() {
  return redscale.magnitude.toNumber( this.signum, this.magnitude );
};

/**
 * Negate - Returns the negation of the BigInteger
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.negate = function() {
  return new redscale.BigInteger( this.signum * -1, this.magnitude );
};

/**
 * Absolute - Returns the absolute BigInteger.  Will return the current BigInteger if positive or zero.
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.abs = function() {
  return this.signum === -1 ? this.negate() : this;
};

/**
 * Sign - Returns the signum value.
 * @returns {!number}
 * @export
 */
redscale.BigInteger.prototype.sign = function() {
  return this.signum;
};

/**
 * ZERO - Returns a BigInteger equal to 0.
 * @returns {!redscale.BigInteger}
 * @constructor
 * @export
 */
redscale.BigInteger.ZERO = function() {
  return new redscale.BigInteger( 0, new Int16Array( 0 ) );
};

/**
 * ONE - Returns a BigInteger equal to 1.
 * @returns {!redscale.BigInteger}
 * @constructor
 * @export
 */
redscale.BigInteger.ONE = function() {
  return new redscale.BigInteger( 1, new Int16Array( [1] ) );
};

/**
 * Add - Returns BigInteger representation of the sum.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.add = function( aVal, bVal ) {
  var abComp,
      dSig,
      dMag;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }
  if ( aVal.signum === bVal.signum ) {
    dSig = aVal.signum;
    dMag = redscale.magnitude.add( aVal.magnitude, bVal.magnitude );
  } else {
    abComp = redscale.magnitude.compare( aVal.magnitude, bVal.magnitude );

    if ( abComp === 0 ) {
      dSig = 0;
      dMag = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      dSig = abComp === aVal.signum ? 1 : -1;
      dMag = redscale.magnitude.subtract( aVal.magnitude, bVal.magnitude );
    } else {
      dSig = abComp === aVal.signum ? 1 : -1;
      dMag = redscale.magnitude.subtract( bVal.magnitude, aVal.magnitude );
    }
  }

  return new redscale.BigInteger( dSig, dMag );
};

/**
 * Subtract - Returns BigInteger representation of the difference.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.subtract = function( aVal, bVal ) {
  var abComp,
      sSig,
      sMag;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }
  if ( aVal.signum !== bVal.signum ) {
    sSig = aVal.signum;
    sMag = redscale.magnitude.add( aVal.magnitude, bVal.magnitude );
  } else {
    abComp = redscale.magnitude.compare( aVal.magnitude, bVal.magnitude );

    if ( abComp === 0 ) {
      sSig = 0;
      sMag = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.magnitude.subtract( aVal.magnitude, bVal.magnitude );
    } else {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.magnitude.subtract( bVal.magnitude, aVal.magnitude );
    }
  }

  return new redscale.BigInteger( sSig, sMag );
};

/**
 * Multiply - Returns BigInteger representation of the product.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.multiply = function( aVal, bVal ) {
  var pSig,
      pMag;

  if ( aVal.signum === 0 || bVal.signum === 0 ) { return new redscale.BigInteger( 0, new Int16Array( 0 ) ) }

  pSig = aVal.signum === bVal.signum ? 1 : -1;
  pMag = redscale.magnitude.multiply( aVal.magnitude, bVal.magnitude );

  return new redscale.BigInteger( pSig, pMag );
};

/**
 * Divide:Quotient - Returns BigInteger representation of the quotient.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.divide = function( aVal, bVal ) {
  var qSig,
      qMag;

  qMag = redscale.magnitude.divide( aVal.magnitude, bVal.magnitude )[0];
  qSig = qMag.length === 0 ? 0 :
         aVal.signum === bVal.signum ? 1 : -1;

  return new redscale.BigInteger( qSig, qMag );
};

/**
 * Divide:Remainder - Returns BigInteger representation of the remainder.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.remainder = function( aVal, bVal ) {
  var rSig,
      rMag;

  rMag = redscale.magnitude.divide( aVal.magnitude, bVal.magnitude )[1];
  rSig = rMag.length === 0 ? 0 : aVal.signum;

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Divide - Returns an Array of BigInteger representations of the quotient and remainder.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {Array<!redscale.BigInteger, !redscale.BigInteger>}
 * @export
 */
redscale.BigInteger.divideRem = function( aVal, bVal ) {
  var qSig,
      rSig,
      qMag,
      rMag,
      quotRem;

  quotRem = redscale.magnitude.divide( aVal.magnitude, bVal.magnitude );
  qMag = quotRem[0];
  qSig = qMag.length === 0 ? 0 :
         aVal.signum === bVal.signum ? 1 : -1;
  rMag = quotRem[1];
  rSig = rMag.length === 0 ? 0 : aVal.signum;

  return [new redscale.BigInteger( qSig, qMag ), new redscale.BigInteger( rSig, rMag )];
};

/**
 * GCD - Returns BigInteger representation of the GCD.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.gcd = function( aVal, bVal ) {
  var gMag;

  if ( aVal.signum === 0 ) { return bVal.abs() }
  if ( bVal.signum === 0 ) { return aVal.abs() }

  gMag = redscale.magnitude.gcd( aVal.magnitude, bVal.magnitude );

  return new redscale.BigInteger( 1, gMag );
};

/**
 * fromString - Returns a BigInteger representing the value of the string with the given radix.
 * @param {!string} aStr
 * @param {!number} radix - A number in the range of 2 - 36.
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.fromString = function( aStr, radix ) {
  var aRadix = radix ? radix : 10,
      aStrMag = aStr.match( /[a-z0-9]+/i ),
      leadingZeroes,
      aSig,
      aMag;

  if ( aStrMag.length === 0 ) { throw new Error( "Zero length number." ) }

  leadingZeroes = aStr.match( /[0]/ );

  if ( leadingZeroes.length === aStrMag.length ) { return redscale.BigInteger.ZERO() }

  aMag = redscale.magnitude.fromString( aStrMag[0].slice( leadingZeroes.length ), aRadix );
  aSig = aStr.indexOf( "-" ) === 0 ? -1 : 1;

  return new redscale.BigInteger( aSig, aMag );
};

/**
 * fromNumber - Returns a BigInteger representing the value of the number.
 * @param {!number} aNum
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.fromNumber = function( aNum ) {
  var aSig = aNum === 0 ? 0 : aNum > 0 ? 1 : -1,
      aMag = redscale.magnitude.fromNumber( aNum * aSig );

  return new redscale.BigInteger( aSig, aMag );
};