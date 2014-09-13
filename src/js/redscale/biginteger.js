goog.provide( 'redscale.BigInteger' );

goog.require( 'redscale.util' );
goog.require( 'redscale.arithmetic' );
goog.require( 'redscale.modular' );
goog.require( 'redscale.bitwise' );

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
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.add = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.add( this, bVal ) :
         bVal.redscaleType === "Ratio" ? redscale.Ratio.add( this.toRatio(), bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.add( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Subtract - Returns a RedScale type representing the difference.
 * @param {!redscale.BigInteger|number} bVal - The RedScale type or number being subtracted.
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.subtract = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.subtract( this, bVal ) :
         bVal.redscaleType === "Ratio" ? redscale.Ratio.subtract( this.toRatio(), bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.subtract( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Multiply - Returns a RedScale type representing the product.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.multiply = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.multiply( this, bVal ) :
         bVal.redscaleType === "Ratio" ? redscale.Ratio.multiply( this.toRatio(), bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.multiply( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Divide:Quotient - Returns a RedScale type representing the quotient.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.divide = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.divide( this, bVal ) :
         bVal.redscaleType === "Ratio" ? redscale.Ratio.divide( this.toRatio(), bVal ) :
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
redscale.BigInteger.prototype.remainder = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.remainder( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.remainder( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Divide - Returns an Array containing the RedScale types representing the quotient & remainder.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!Int16Array[]}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.divideRem = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.divideRem( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.divideRem( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * GCD - Returns an Array containing the RedScale types representing the GCD.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.BigInteger.prototype.gcd = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.gcd( this, bVal ) :
         bVal.redscaleType === "Ratio" ? redscale.Ratio.gcd( this.toRatio(), bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.gcd( this, redscale.BigInteger.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Square
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.square = function() {
  return redscale.BigInteger.square( this );
};

/**
 * Power
 * @param {!number} aNum
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.pow = function( aNum ) {
  return redscale.BigInteger.pow( this, aNum );
};

/**
 * Mod
 * @param {!redscale.BigInteger} mVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.mod = function( mVal ) {
  return redscale.BigInteger.mod( this, mVal );
};

/**
 * Mod Inverse
 * @param  {!redscale.BigInteger} mVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.modInverse = function( mVal ) {
  return redscale.BigInteger.modInverse( this, mVal );
};

/**
 * Mod Power
 * @param {!redscale.BigInteger} expoVal
 * @param {!redscale.BigInteger} mVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.modPow = function( expoVal, mVal ) {
  return redscale.BigInteger.modPow( this, expoVal, mVal );
};

/**
 * Shift Left
 * @param {!number} aShift
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.shiftLeft = function( aShift ) {
  return redscale.BigInteger.shiftLeft( this, aShift );
};

/**
 * Shift Right
 * @param {!number} aShift
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.shiftRight = function( aShift ) {
  return redscale.BigInteger.shiftRight( this, aShift );
};

/**
 * Unsigned Shift Right
 * @param {!number} aShift
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.unsignedShiftRight = function( aShift ) {
  return redscale.BigInteger.unsignedShiftRight( this, aShift );
};

/**
 * Bitwise and
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 */
redscale.BigInteger.prototype.and = function( bVal ) {
  return redscale.BigInteger.and( this, bVal );
};

/**
 * Bitwise or
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 */
redscale.BigInteger.prototype.or = function( bVal ) {
  return redscale.BigInteger.or( this, bVal );
};

/**
 * Bitwise xor
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 */
redscale.BigInteger.prototype.xor = function( bVal ) {
  return redscale.BigInteger.xor( this, bVal );
};

/**
 * Bitwise not
 * @returns {!redscale.BigInteger}
 */
redscale.BigInteger.prototype.not = function() {
  return redscale.BigInteger.not( this );
};

/**
 * Bitwise andNot
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 */
redscale.BigInteger.prototype.andNot = function( bVal ) {
  return redscale.BigInteger.andNot( this, bVal );
};

/**
 * Equals - Returns a boolean value for whether this redscale.BigInteger is equal to bVal.
 * @param {!redscale.BigInteger} bVal
 * @returns {boolean}
 * @export
 */
redscale.BigInteger.prototype.equals = function( bVal ) {
  return redscale.BigInteger.equals( this, bVal );
};

/**
 * toString - Returns a string exactly representing the redscale.BigInteger.
 * @param {number} radix - A number in the range of 2 - 36.
 * @returns {!string}
 * @override
 * @export
 */
redscale.BigInteger.prototype.toString = function( radix ) {
  return redscale.util.toString( this.signum, this.magnitude, radix );
};

/**
 * ofValue - Returns the closest precision representation possible as a native JS number.
 *     Precise if Number.isSafeInteger(result).
 * @returns {!number}
 * @export
 */
redscale.BigInteger.prototype.valueOf = function() {
  return redscale.util.toNumber( this.signum, this.magnitude );
};

/**
 * toNumber - Returns the closest precision representation possible as a native JS number.
 *     Precise if Number.isSafeInteger(result).
 * @returns {!number}
 * @export
 */
redscale.BigInteger.prototype.toNumber = function() {
  return redscale.util.toNumber( this.signum, this.magnitude );
};

/**
 * toRatio - Returns a Ratio type representing the BigInteger value.
 * @returns {!redscale.Ratio}
 */
redscale.BigInteger.prototype.toRatio = function() {
  return new redscale.Ratio( this.signum, this.magnitude, new Int16Array( [1] ) );
};

/**
 * Negate - Returns the negation of the redscale.BigInteger
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.prototype.negate = function() {
  return new redscale.BigInteger( this.signum === 0 ? 0 : this.signum * -1, this.magnitude );
};

/**
 * Absolute - Returns the absolute redscale.BigInteger.  Will return the current redscale.BigInteger if positive or zero.
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
 * ZERO - Returns a redscale.BigInteger equal to 0.
 * @returns {!redscale.BigInteger}
 * @constructor
 * @export
 */
redscale.BigInteger.ZERO = function() {
  return new redscale.BigInteger( 0, new Int16Array( 0 ) );
};

/**
 * ONE - Returns a redscale.BigInteger equal to 1.
 * @returns {!redscale.BigInteger}
 * @constructor
 * @export
 */
redscale.BigInteger.ONE = function() {
  return new redscale.BigInteger( 1, new Int16Array( [1] ) );
};

/**
 * Add - Returns redscale.BigInteger representation of the sum.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.add = function( aVal, bVal ) {
  var abComp,
      sSig,
      sMag;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }
  if ( aVal.signum === bVal.signum ) {
    sSig = aVal.signum;
    sMag = redscale.arithmetic.add( aVal.magnitude, bVal.magnitude );
  } else {
    abComp = redscale.util.compare( aVal.magnitude, bVal.magnitude );

    if ( abComp === 0 ) {
      sSig = 0;
      sMag = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.arithmetic.subtract( aVal.magnitude, bVal.magnitude );
    } else {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.arithmetic.subtract( bVal.magnitude, aVal.magnitude );
    }
  }

  return new redscale.BigInteger( sSig, sMag );
};

/**
 * Subtract - Returns redscale.BigInteger representation of the difference.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.subtract = function( aVal, bVal ) {
  var abComp,
      dSig,
      dMag;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }
  if ( aVal.signum !== bVal.signum ) {
    dSig = aVal.signum;
    dMag = redscale.arithmetic.add( aVal.magnitude, bVal.magnitude );
  } else {
    abComp = redscale.util.compare( aVal.magnitude, bVal.magnitude );

    if ( abComp === 0 ) {
      dSig = 0;
      dMag = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      dSig = abComp === aVal.signum ? 1 : -1;
      dMag = redscale.arithmetic.subtract( aVal.magnitude, bVal.magnitude );
    } else {
      dSig = abComp === aVal.signum ? 1 : -1;
      dMag = redscale.arithmetic.subtract( bVal.magnitude, aVal.magnitude );
    }
  }

  return new redscale.BigInteger( dSig, dMag );
};

/**
 * Multiply - Returns redscale.BigInteger representation of the product.
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
  pMag = redscale.arithmetic.multiply( aVal.magnitude, bVal.magnitude );

  return new redscale.BigInteger( pSig, pMag );
};

/**
 * Divide:Quotient - Returns redscale.BigInteger representation of the quotient.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.divide = function( aVal, bVal ) {
  var qSig,
      qMag;

  qMag = redscale.arithmetic.divide( aVal.magnitude, bVal.magnitude )[0];
  qSig = qMag.length === 0 ? 0 :
         aVal.signum === bVal.signum ? 1 : -1;

  return new redscale.BigInteger( qSig, qMag );
};

/**
 * Divide:Remainder - Returns redscale.BigInteger representation of the remainder.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.remainder = function( aVal, bVal ) {
  var rSig,
      rMag;

  rMag = redscale.arithmetic.divide( aVal.magnitude, bVal.magnitude )[1];
  rSig = rMag.length === 0 ? 0 : aVal.signum;

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Divide - Returns an Array of redscale.BigInteger representations of the quotient and remainder.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger[]}
 * @export
 */
redscale.BigInteger.divideRem = function( aVal, bVal ) {
  var qSig,
      rSig,
      qMag,
      rMag,
      quotRem;

  quotRem = redscale.arithmetic.divide( aVal.magnitude, bVal.magnitude );
  qMag = quotRem[0];
  qSig = qMag.length === 0 ? 0 : aVal.signum === bVal.signum ? 1 : -1;
  rMag = quotRem[1];
  rSig = rMag.length === 0 ? 0 : aVal.signum;

  return [new redscale.BigInteger( qSig, qMag ), new redscale.BigInteger( rSig, rMag )];
};

/**
 * Divide to Ratio
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.BigInteger.divideRatio = function( aVal, bVal ) {
  var qSig,
      qSim;

  if ( aVal.signum === 0 || bVal.signum === 0 ) {
    return redscale.Ratio.ZERO();
  }

  qSig = aVal.signum * bVal.signum;
  qSim = redscale.Ratio.simplify( aVal.magnitude, bVal.magnitude );

  return new redscale.Ratio( qSig, qSim[0], qSim[1] );
};

/**
 * GCD - Returns redscale.BigInteger representation of the GCD.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.gcd = function( aVal, bVal ) {
  var gMag;

  if ( aVal.signum === 0 ) { return bVal.abs() }
  if ( bVal.signum === 0 ) { return aVal.abs() }

  gMag = redscale.arithmetic.gcd( aVal.magnitude, bVal.magnitude );

  return new redscale.BigInteger( 1, gMag );
};

/**
 * Square
 * @param {!redscale.BigInteger} aVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.square = function( aVal ) {
  if ( aVal.signum === 0 ) { return aVal }

  return new redscale.BigInteger( 1, redscale.arithmetic.square( aVal.magnitude ) );
};

/**
 * Power
 * @param {!redscale.BigInteger} aVal
 * @param {!number} eInt
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.pow = function( aVal, eInt ) {
  var pSign,
      pArray;

  if ( eInt < 0 ) { throw new Error( "Exponent is negative." ) }

  if ( aVal.signum === 0 ) { return eInt === 0 ? redscale.BigInteger.ONE() : aVal }

  pSign = aVal.signum < 0 && (eInt & 1) === 1 ? -1 : 1;
  pArray = redscale.arithmetic.pow( aVal.magnitude, eInt );

  return new redscale.BigInteger( pSign, pArray );
};

/**
 * Mod
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} mVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.mod = function( aVal, mVal ) {
  var rMag,
      rSig;

  if ( mVal.signum !== 1 ) { throw new Error( "Modulus not positive." ) }

  rMag = redscale.modular.mod( aVal.magnitude, aVal.signum, mVal.magnitude );
  rSig = redscale.util.isZero( rMag ) ? 0 : 1;

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Mod Inverse
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} mVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.modInverse = function( aVal, mVal ) {
  var rMag;

  if ( mVal.signum !== 1 ) { throw new Error( "Modulus not positive." ) }
  if ( redscale.BigInteger.equals( mVal, redscale.BigInteger.ONE() ) ) { return redscale.BigInteger.ZERO() }

  rMag = redscale.modular.modInverse( aVal.magnitude, aVal.signum, mVal.magnitude );

  return new redscale.BigInteger( 1, rMag );
};

/**
 * Mod Power
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} expoVal
 * @param {!redscale.BigInteger} mVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.modPow = function( aVal, expoVal, mVal ) {
  var rMag,
      rSig;

  rMag = redscale.modular.modPow( aVal.magnitude, aVal.signum, expoVal.magnitude, expoVal.signum, mVal.magnitude );
  rSig = 1;

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Shift Left
 * @param {!redscale.BigInteger} aVal
 * @param {!number} aShift
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.shiftLeft = function( aVal, aShift ) {
  var rSign = aVal.signum,
      rVal = redscale.bitwise.shiftLeft( aVal.magnitude, aShift );

  return new redscale.BigInteger( rSign, rVal );
};

/**
 * Shift Right
 * @param {!redscale.BigInteger} aVal
 * @param {!number} aShift
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.shiftRight = function( aVal, aShift ) {
  var rSign = aVal.signum,
      rVal = redscale.bitwise.shiftRight( aVal.magnitude, aVal.signum, aShift );

  return new redscale.BigInteger( rSign, rVal );
};

/**
 * Unsigned Shift Right
 * @param {!redscale.BigInteger} aVal
 * @param {!number} aShift
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.unsignedShiftRight = function( aVal, aShift ) {
  var rSign = aVal.signum,
      rVal = redscale.bitwise.unsignedShiftRight( aVal.magnitude, aVal.signum, aShift ) ;

  if ( rSign < 0 && aShift > 0 ) {
    rSign = redscale.util.isZero( rVal ) ? 0 : 1;
  }

  return new redscale.BigInteger( rSign, rVal );
};

/**
 * Bitwise and
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.and = function( aVal, bVal ) {
  var rMag = redscale.bitwise.and( aVal.magnitude, aVal.signum, bVal.magnitude, bVal.signum ),
      rSig = 1;

  if ( rMag[rMag.length - 1] < 0 ) {
    rSig = -1;
    rMag = redscale.bitwise.toUnsignedArray( rMag );
  }

  if ( redscale.util.isZero( rMag ) ) {
    rSig = 0;
  }

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Bitwise or
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.or = function( aVal, bVal ) {
  var rMag = redscale.bitwise.or( aVal.magnitude, aVal.signum, bVal.magnitude, bVal.signum ),
      rSig = 1;

  if ( rMag[rMag.length - 1] < 0 ) {
    rSig = -1;
    rMag = redscale.bitwise.toUnsignedArray( rMag );
  }

  if ( redscale.util.isZero( rMag ) ) {
    rSig = 0;
  }

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Bitwise xor
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.xor = function( aVal, bVal ) {
  var rMag = redscale.bitwise.xor( aVal.magnitude, aVal.signum, bVal.magnitude, bVal.signum ),
      rSig = 1;

  if ( rMag[rMag.length - 1] < 0 ) {
    rSig = -1;
    rMag = redscale.bitwise.toUnsignedArray( rMag );
  }

  if ( redscale.util.isZero( rMag ) ) {
    rSig = 0;
  }

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Bitwise not
 * @param {!redscale.BigInteger} aVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.not = function( aVal ) {
  var rMag = redscale.bitwise.not( aVal.magnitude, aVal.signum ),
      rSig = 1;

  if ( rMag[rMag.length - 1] < 0 ) {
    rSig = -1;
    rMag = redscale.bitwise.toUnsignedArray( rMag );
  }

  if ( redscale.util.isZero( rMag ) ) {
    rSig = 0;
  }

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Bitwise andNot
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.andNot = function( aVal, bVal ) {
  var rMag = redscale.bitwise.andNot( aVal.magnitude, aVal.signum, bVal.magnitude, bVal.signum ),
      rSig = 1;

  if ( rMag[rMag.length - 1] < 0 ) {
    rSig = -1;
    rMag = redscale.bitwise.toUnsignedArray( rMag );
  }

  if ( redscale.util.isZero( rMag ) ) {
    rSig = 0;
  }

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Equals - Returns a boolean representing whether aVal and bVal are equal.
 * @param {!redscale.BigInteger} aVal
 * @param {!redscale.BigInteger} bVal
 * @returns {!boolean}
 * @export
 */
redscale.BigInteger.equals = function( aVal, bVal ) {
  return redscale.util.compare( aVal.magnitude, bVal.magnitude ) === 0 &&
         aVal.signum === bVal.signum;
};

/**
 * fromString - Returns a redscale.BigInteger representing the value of the string with the given radix.
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

  if ( aStrMag === null ) { throw new Error( "Zero length number." ) }

  leadingZeroes = aStr.match( /[0]+/ );

  if ( leadingZeroes === null || leadingZeroes.index !== 0 ) { leadingZeroes = [""]; }
  if ( leadingZeroes[0].length === aStrMag[0].length ) { return redscale.BigInteger.ZERO() }

  aMag = redscale.util.fromString( aStrMag[0].slice( leadingZeroes[0].length ), aRadix );
  aSig = aStr.indexOf( "-" ) === 0 ? -1 : 1;

  return new redscale.BigInteger( aSig, aMag );
};

/**
 * fromNumber - Returns a redscale.BigInteger representing the value of the number.
 * @param {!number} aNum
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.BigInteger.fromNumber = function( aNum ) {
  var aSig = aNum === 0 ? 0 : aNum > 0 ? 1 : -1,
      aMag = redscale.util.fromNumber( aNum * aSig );

  return new redscale.BigInteger( aSig, aMag );
};