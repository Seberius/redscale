goog.provide('BigInteger');

/**
 * BigInteger type.
 * @param {!number} signum - Maybe 0, 1, or -1.
 * @param {!Int16Array} magnitude - An Int16Array.
 * @constructor
 * @struct
 * @export
 */
BigInteger = function( signum, magnitude ) {
  /** @type {string} */
  this.redscaleType = "BigInteger";
  this.signum = signum;
  this.magnitude = magnitude;
};

/**
 * Add - Returns a RedScale type representing the sum.
 * @param {!BigInteger|number} bVal - The RedScale type or number being added.
 * @returns {!BigInteger}
 * @throws {TypeError}
 * @export
 */
BigInteger.prototype.add = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? BigInteger.add( this, bVal ) :
         typeof bVal === "number" ? BigInteger.add( this, BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Subtract - Returns a RedScale type representing the difference.
 * @param {!BigInteger|number} bVal - The RedScale type or number being subtracted.
 * @returns {!BigInteger}
 * @throws {TypeError}
 * @export
 */
BigInteger.prototype.subtract = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? BigInteger.subtract( this, bVal ) :
         typeof bVal === "number" ? BigInteger.subtract( this, BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Multiply - Returns a RedScale type representing the product.
 * @param {!BigInteger|number} bVal - A RedScale type or number.
 * @returns {!BigInteger}
 * @throws {TypeError}
 * @export
 */
BigInteger.prototype.multiply = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? BigInteger.multiply( this, bVal ) :
         typeof bVal === "number" ? BigInteger.multiply( this, BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Divide:Quotient - Returns a RedScale type representing the quotient.
 * @param {!BigInteger|number} bVal - A RedScale type or number.
 * @returns {!BigInteger}
 * @throws {TypeError}
 * @export
 */
BigInteger.prototype.divide = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? BigInteger.divide( this, bVal ) :
         typeof bVal === "number" ? BigInteger.divide( this, BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Divide:Remainder - Returns a RedScale type representing the remainder.
 * @param {!BigInteger|number} bVal - A RedScale type or number.
 * @returns {!BigInteger}
 * @throws {TypeError}
 * @export
 */
BigInteger.prototype.remainder = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? BigInteger.remainder( this, bVal ) :
         typeof bVal === "number" ? BigInteger.remainder( this, BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Divide - Returns an Array containing the RedScale types representing the quotient & remainder.
 * @param {!BigInteger|number} bVal - A RedScale type or number.
 * @returns {!Int16Array[]}
 * @throws {TypeError}
 * @export
 */
BigInteger.prototype.divideRem = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? BigInteger.divideRem( this, bVal ) :
         typeof bVal === "number" ? BigInteger.divideRem( this, BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * GCD - Returns an Array containing the RedScale types representing the GCD.
 * @param {!BigInteger|number} bVal - A RedScale type or number.
 * @returns {!BigInteger}
 * @throws {TypeError}
 * @export
 */
BigInteger.prototype.gcd = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? BigInteger.gcd( this, bVal ) :
         typeof bVal === "number" ? BigInteger.gcd( this, BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Square
 * @returns {!BigInteger}
 * @export
 */
BigInteger.prototype.square = function() {
  return BigInteger.square( this );
};

/**
 * Power
 * @param {!number} aNum
 * @returns {!BigInteger}
 * @export
 */
BigInteger.prototype.pow = function( aNum ) {
  return BigInteger.pow( this, aNum );
};

/**
 * Mod
 * @param {!BigInteger} mVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.prototype.mod = function( mVal ) {
  return BigInteger.mod( this, mVal );
};

/**
 * Mod Inverse
 * @param  {!BigInteger} mVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.prototype.modInverse = function( mVal ) {
  return BigInteger.modInverse( this, mVal );
};

/**
 * Mod Power
 * @param {!BigInteger} expoVal
 * @param {!BigInteger} mVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.prototype.modPow = function( expoVal, mVal ) {
  return BigInteger.modPow( this, expoVal, mVal );
};

/**
 * Equals - Returns a boolean value for whether this BigInteger is equal to bVal.
 * @param {!BigInteger} bVal
 * @returns {boolean}
 * @export
 */
BigInteger.prototype.equals = function( bVal ) {
  return BigInteger.equals( this, bVal );
};

/**
 * toString - Returns a string exactly representing the BigInteger.
 * @param {number} radix - A number in the range of 2 - 36.
 * @returns {!string}
 * @override
 * @export
 */
BigInteger.prototype.toString = function( radix ) {
  return redscale.toString( this.signum, this.magnitude, radix );
};

/**
 * ofValue - Returns the closest precision representation possible as a native JS number.
 *     Precise if Number.isSafeInteger(result).
 * @returns {!number}
 * @export
 */
BigInteger.prototype.ofValue = function() {
  return redscale.toNumber( this.signum, this.magnitude );
};

/**
 * toNumber - Returns the closest precision representation possible as a native JS number.
 *     Precise if Number.isSafeInteger(result).
 * @returns {!number}
 * @export
 */
BigInteger.prototype.toNumber = function() {
  return redscale.toNumber( this.signum, this.magnitude );
};

/**
 * Negate - Returns the negation of the BigInteger
 * @returns {!BigInteger}
 * @export
 */
BigInteger.prototype.negate = function() {
  return new BigInteger( this.signum * -1, this.magnitude );
};

/**
 * Absolute - Returns the absolute BigInteger.  Will return the current BigInteger if positive or zero.
 * @returns {!BigInteger}
 * @export
 */
BigInteger.prototype.abs = function() {
  return this.signum === -1 ? this.negate() : this;
};

/**
 * Sign - Returns the signum value.
 * @returns {!number}
 * @export
 */
BigInteger.prototype.sign = function() {
  return this.signum;
};

/**
 * ZERO - Returns a BigInteger equal to 0.
 * @returns {!BigInteger}
 * @constructor
 * @export
 */
BigInteger.ZERO = function() {
  return new BigInteger( 0, new Int16Array( 0 ) );
};

/**
 * ONE - Returns a BigInteger equal to 1.
 * @returns {!BigInteger}
 * @constructor
 * @export
 */
BigInteger.ONE = function() {
  return new BigInteger( 1, new Int16Array( [1] ) );
};

/**
 * Add - Returns BigInteger representation of the sum.
 * @param {!BigInteger} aVal
 * @param {!BigInteger} bVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.add = function( aVal, bVal ) {
  var abComp,
      sSig,
      sMag;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }
  if ( aVal.signum === bVal.signum ) {
    sSig = aVal.signum;
    sMag = redscale.add( aVal.magnitude, bVal.magnitude );
  } else {
    abComp = redscale.compare( aVal.magnitude, bVal.magnitude );

    if ( abComp === 0 ) {
      sSig = 0;
      sMag = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.subtract( aVal.magnitude, bVal.magnitude );
    } else {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.subtract( bVal.magnitude, aVal.magnitude );
    }
  }

  return new BigInteger( sSig, sMag );
};

/**
 * Subtract - Returns BigInteger representation of the difference.
 * @param {!BigInteger} aVal
 * @param {!BigInteger} bVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.subtract = function( aVal, bVal ) {
  var abComp,
      dSig,
      dMag;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }
  if ( aVal.signum !== bVal.signum ) {
    dSig = aVal.signum;
    dMag = redscale.add( aVal.magnitude, bVal.magnitude );
  } else {
    abComp = redscale.compare( aVal.magnitude, bVal.magnitude );

    if ( abComp === 0 ) {
      dSig = 0;
      dMag = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      dSig = abComp === aVal.signum ? 1 : -1;
      dMag = redscale.subtract( aVal.magnitude, bVal.magnitude );
    } else {
      dSig = abComp === aVal.signum ? 1 : -1;
      dMag = redscale.subtract( bVal.magnitude, aVal.magnitude );
    }
  }

  return new BigInteger( dSig, dMag );
};

/**
 * Multiply - Returns BigInteger representation of the product.
 * @param {!BigInteger} aVal
 * @param {!BigInteger} bVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.multiply = function( aVal, bVal ) {
  var pSig,
      pMag;

  if ( aVal.signum === 0 || bVal.signum === 0 ) { return new BigInteger( 0, new Int16Array( 0 ) ) }

  pSig = aVal.signum === bVal.signum ? 1 : -1;
  pMag = redscale.multiply( aVal.magnitude, bVal.magnitude );

  return new BigInteger( pSig, pMag );
};

/**
 * Divide:Quotient - Returns BigInteger representation of the quotient.
 * @param {!BigInteger} aVal
 * @param {!BigInteger} bVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.divide = function( aVal, bVal ) {
  var qSig,
      qMag;

  qMag = redscale.divide( aVal.magnitude, bVal.magnitude )[0];
  qSig = qMag.length === 0 ? 0 :
         aVal.signum === bVal.signum ? 1 : -1;

  return new BigInteger( qSig, qMag );
};

/**
 * Divide:Remainder - Returns BigInteger representation of the remainder.
 * @param {!BigInteger} aVal
 * @param {!BigInteger} bVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.remainder = function( aVal, bVal ) {
  var rSig,
      rMag;

  rMag = redscale.divide( aVal.magnitude, bVal.magnitude )[1];
  rSig = rMag.length === 0 ? 0 : aVal.signum;

  return new BigInteger( rSig, rMag );
};

/**
 * Divide - Returns an Array of BigInteger representations of the quotient and remainder.
 * @param {!BigInteger} aVal
 * @param {!BigInteger} bVal
 * @returns {Int16Array[]}
 * @export
 */
BigInteger.divideRem = function( aVal, bVal ) {
  var qSig,
      rSig,
      qMag,
      rMag,
      quotRem;

  quotRem = redscale.divide( aVal.magnitude, bVal.magnitude );
  qMag = quotRem[0];
  qSig = qMag.length === 0 ? 0 :
         aVal.signum === bVal.signum ? 1 : -1;
  rMag = quotRem[1];
  rSig = rMag.length === 0 ? 0 : aVal.signum;

  return [new BigInteger( qSig, qMag ), new BigInteger( rSig, rMag )];
};

/**
 * GCD - Returns BigInteger representation of the GCD.
 * @param {!BigInteger} aVal
 * @param {!BigInteger} bVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.gcd = function( aVal, bVal ) {
  var gMag;

  if ( aVal.signum === 0 ) { return bVal.abs() }
  if ( bVal.signum === 0 ) { return aVal.abs() }

  gMag = redscale.gcd( aVal.magnitude, bVal.magnitude );

  return new BigInteger( 1, gMag );
};

/**
 * Square
 * @param {!BigInteger} aVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.square = function( aVal ) {
  if ( aVal.signum === 0 ) { return aVal }

  return new BigInteger( 1, redscale.square( aVal.magnitude ) );
};

/**
 * Power
 * @param {!BigInteger} aVal
 * @param {!number} aNum
 * @returns {!BigInteger}
 * @export
 */
BigInteger.pow = function( aVal, aNum ) {
  var pSign,
      pArray;

  if ( aNum < 0 ) { throw new Error( "Exponent is negative." ) }

  if ( aVal.signum === 0 ) { return aNum === 0 ? BigInteger.ONE() : aVal }

  pSign = aVal.signum < 0 && (aNum & 1) === 1 ? -1 : 1;
  pArray = redscale.pow( aVal.magnitude, aNum );

  return new BigInteger( pSign, pArray );
};

/**
 * Mod
 * @param {!BigInteger} aVal
 * @param {!BigInteger} mVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.mod = function( aVal, mVal ) {
  var rMag,
      rSig;

  if ( mVal.signum !== 1 ) { throw new Error( "RedScale: Modulus not positive." ) }

  rMag = redscale.mod( aVal.magnitude, aVal.signum, mVal.magnitude );
  rSig = redscale.isZero( rMag ) ? 0 : 1;

  return new BigInteger( rSig, rMag );
};

/**
 * Mod Inverse
 * @param {!BigInteger} aVal
 * @param {!BigInteger} mVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.modInverse = function( aVal, mVal ) {
  var rMag;

  if ( mVal.signum !== 1 ) { throw new Error( "RedScale: Modulus not positive." ) }
  if ( BigInteger.equals( mVal, BigInteger.ONE() ) ) { return BigInteger.ZERO() }

  rMag = redscale.modInverse( aVal.magnitude, aVal.signum, mVal.magnitude );

  return new BigInteger( 1, rMag );
};

/**
 * Mod Power
 * @param {!BigInteger} aVal
 * @param {!BigInteger} expoVal
 * @param {!BigInteger} mVal
 * @returns {!BigInteger}
 * @export
 */
BigInteger.modPow = function( aVal, expoVal, mVal ) {
  var rMag,
      rSig;

  rMag = redscale.modPow( aVal.magnitude, aVal.signum, expoVal.magnitude, mVal.magnitude );
  rSig = 1;

  console.log(rMag);

  return new BigInteger( rSig, rMag );
};

/**
 * Equals - Returns a boolean representing whether aVal and bVal are equal.
 * @param {!BigInteger} aVal
 * @param {!BigInteger} bVal
 * @returns {!boolean}
 * @export
 */
BigInteger.equals = function( aVal, bVal ) {
  return redscale.compare( aVal.magnitude, bVal.magnitude ) === 0 &&
         aVal.signum === bVal.signum;
};

/**
 * fromString - Returns a BigInteger representing the value of the string with the given radix.
 * @param {!string} aStr
 * @param {!number} radix - A number in the range of 2 - 36.
 * @returns {!BigInteger}
 * @export
 */
BigInteger.fromString = function( aStr, radix ) {
  var aRadix = radix ? radix : 10,
      aStrMag = aStr.match( /[a-z0-9]+/i ),
      leadingZeroes,
      aSig,
      aMag;

  if ( aStrMag === null ) { throw new Error( "Zero length number." ) }

  leadingZeroes = aStr.match( /[0]+/ );

  if ( leadingZeroes === null || leadingZeroes.index !== 0 ) { leadingZeroes = [""]; }
  if ( leadingZeroes[0].length === aStrMag[0].length ) { return BigInteger.ZERO() }

  aMag = redscale.fromString( aStrMag[0].slice( leadingZeroes[0].length ), aRadix );
  aSig = aStr.indexOf( "-" ) === 0 ? -1 : 1;

  return new BigInteger( aSig, aMag );
};

/**
 * fromNumber - Returns a BigInteger representing the value of the number.
 * @param {!number} aNum
 * @returns {!BigInteger}
 * @export
 */
BigInteger.fromNumber = function( aNum ) {
  var aSig = aNum === 0 ? 0 : aNum > 0 ? 1 : -1,
      aMag = redscale.fromNumber( aNum * aSig );

  return new BigInteger( aSig, aMag );
};