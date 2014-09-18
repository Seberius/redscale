goog.provide('redscale.Ratio');

/**
 * Ratio type.
 * @param {!number} signum
 * @param {!Int16Array} numerator
 * @param {!Int16Array} denominator
 * @constructor
 * @struct
 * @export
 */
redscale.Ratio = function( signum, numerator, denominator ) {
  this.redscaleType = "Ratio";
  this.signum = signum;
  this.numerator = numerator;
  this.denominator = denominator;
};

/**
 * Add - Returns a RedScale type representing the sum.
 * @param {!redscale.BigInteger|number} bVal - The RedScale type or number being added.
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.Ratio.prototype.add = function( bVal ) {
  return bVal.redscaleType === "Ratio" ? redscale.Ratio.add( this, bVal ) :
         bVal.redscaleType === "BigInteger" ? redscale.Ratio.add( this, bVal.toRatio() ) :
         typeof bVal === "number" ? redscale.Ratio.add( this, redscale.Ratio.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Subtract - Returns a RedScale type representing the difference.
 * @param {!redscale.BigInteger|number} bVal - The RedScale type or number being subtracted.
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.Ratio.prototype.subtract = function( bVal ) {
  return bVal.redscaleType === "Ratio" ? redscale.Ratio.subtract( this, bVal ) :
         bVal.redscaleType === "BigInteger" ? redscale.Ratio.subtract( this, bVal.toRatio() ) :
         typeof bVal === "number" ? redscale.Ratio.subtract( this, redscale.Ratio.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Multiply - Returns a RedScale type representing the product.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.Ratio.prototype.multiply = function( bVal ) {
  return bVal.redscaleType === "Ratio" ? redscale.Ratio.multiply( this, bVal ) :
         bVal.redscaleType === "BigInteger" ? redscale.Ratio.multiply( this, bVal.toRatio() ) :
         typeof bVal === "number" ? redscale.Ratio.multiply( this, redscale.Ratio.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Divide - Returns a RedScale type representing the quotient.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.Ratio.prototype.divide = function( bVal ) {
  return bVal.redscaleType === "Ratio" ? redscale.Ratio.divide( this, bVal ) :
         bVal.redscaleType === "BigInteger" ? redscale.Ratio.divide( this, bVal.toRatio() ) :
         typeof bVal === "number" ? redscale.Ratio.divide( this, redscale.Ratio.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * GCD - Returns an Array containing the RedScale types representing the GCD.
 * @param {!redscale.BigInteger|number} bVal - A RedScale type or number.
 * @returns {!redscale.BigInteger|!redscale.Ratio}
 * @throws {TypeError}
 * @export
 */
redscale.Ratio.prototype.gcd = function( bVal ) {
  return bVal.redscaleType === "Ratio" ? redscale.Ratio.gcd( this, bVal ) :
         bVal.redscaleType === "BigInteger" ? redscale.Ratio.gcd( this, bVal.toRatio() ) :
         typeof bVal === "number" ? redscale.Ratio.gcd( this, redscale.Ratio.fromNumber( bVal ) ) :
         (function() { throw new TypeError( "Not a number." ); }());
};

/**
 * Equals - Returns a boolean value for whether this redscale.BigInteger is equal to bVal.
 * @param {!redscale.BigInteger} bVal
 * @returns {boolean}
 * @export
 */
redscale.Ratio.prototype.equals = function( bVal ) {
  return redscale.Ratio.equals( this, bVal );
};

/**
 * Square
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.Ratio.prototype.square = function() {
  return redscale.Ratio.square( this );
};

/**
 * Power
 * @param {!number} aInt
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.Ratio.prototype.pow = function( aInt ) {
  return redscale.Ratio.pow( this, aInt );
};

/**
 * Negate - Returns the negation of the redscale.Ratio
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.prototype.negate = function() {
  return new redscale.Ratio( this.signum * -1, this.numerator, this.denominator );
};

/**
 * Absolute - Returns the absolute redscale.Ratio.  Will return the current redscale.Ratio if positive or zero.
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.prototype.abs = function() {
  return this.signum === -1 ? this.negate() : this;
};

/**
 * Sign - Returns the signum value.
 * @returns {!number}
 * @export
 */
redscale.Ratio.prototype.sign = function() {
  return this.signum;
};

/**
 * To String
 * @param {!number} radix
 * @returns {!string}
 * @export
 */
redscale.Ratio.prototype.toString = function( radix ) {
  var rDen,
      rStr;

  if ( this.signum === 0 ) { return "0" }

  rStr = redscale.util.toString( this.signum, this.numerator, radix );

  if ( !redscale.util.isOne( this.denominator ) ) {
    rDen = redscale.util.toString( 1, this.denominator, radix );
    rStr = rStr + "/" + rDen;
  }

  return rStr;
};

/**
 * To Mixed Number (string).
 * @param {number} radix
 * @returns {!string}
 * @export
 */
redscale.Ratio.prototype.toMixed = function( radix ) {
  var mQuotRem,
      mInt,
      mNum,
      mDen,
      mStr;

  if ( this.signum === 0 ) { return "0" }

  if ( redscale.util.isOne( this.denominator ) ) {
    mStr = redscale.util.toString( this.signum, this.numerator, radix );
  } else if ( redscale.util.compare( this.numerator, this.denominator ) === -1 ) {
    mStr = this.toString( radix );
  } else {
    mQuotRem = redscale.arithmetic.divide( this.numerator, this.denominator );
    mInt = redscale.util.toString( this.signum, mQuotRem[0], radix );
    mNum = redscale.util.toString( 1, mQuotRem[1], radix );
    mDen = redscale.util.toString( 1, this.denominator, radix );

    mStr = mInt + " " + mNum + "/" + mDen;
  }

  return mStr;
};

/**
 * toBigInteger
 * @returns {!redscale.BigInteger}
 * @export
 */
redscale.Ratio.prototype.toBigInteger = function() {
  var rSig,
      rMag;

  if ( this.signum === 0 ) {
    return redscale.BigInteger.ZERO();
  }

  rMag = redscale.arithmetic.divide( this.numerator, this.denominator )[0];
  rSig = redscale.util.isZero( rMag ) ? 0 : this.signum;

  return new redscale.BigInteger( rSig, rMag );
};

/**
 * Zero
 * @returns {!redscale.Ratio}
 * @const
 * @export
 */
redscale.Ratio.ZERO =  new redscale.Ratio( 0, new Int16Array( 0 ), new Int16Array( 0 ) );

/**
 * One
 * @returns {!redscale.Ratio}
 * @const
 * @export
 */
redscale.Ratio.ONE = new redscale.Ratio( 1, new Int16Array( [1] ), new Int16Array( [1] ) );

/**
 * Add
 * @param {!redscale.Ratio} aVal
 * @param {!redscale.Ratio} bVal
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.add = function( aVal, bVal ) {
  var abNumComp,
      abDenComp,
      aNum,
      bNum,
      sSig,
      sNum,
      sDen,
      sSim;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }

  abDenComp = redscale.util.compare( aVal.denominator, bVal.denominator );

  if ( abDenComp === 0 ) {
    aNum = aVal.numerator;
    bNum = bVal.numerator;
    sDen = redscale.util.copyOf( aVal.denominator );
  } else {
    aNum = redscale.arithmetic.multiply( aVal.numerator, bVal.denominator );
    bNum = redscale.arithmetic.multiply( bVal.numerator, aVal.denominator );
    sDen = redscale.arithmetic.multiply( aVal.denominator, bVal.denominator );
  }

  if ( aVal.signum === bVal.signum ) {
    sSig = aVal.signum;
    sNum = redscale.arithmetic.add( aNum, bNum );
  } else {
    abNumComp = redscale.util.compare( aNum, bNum );

    if ( abNumComp === 0 ) {
      return redscale.Ratio.ZERO;
    } else if ( abNumComp > 0 ) {
      sSig = abNumComp === aVal.signum ? 1 : -1;
      sNum = redscale.arithmetic.subtract( aNum, bNum );
    } else {
      sSig = abNumComp === aVal.signum ? 1 : -1;
      sNum = redscale.arithmetic.subtract( bNum, aNum );
    }
  }

  sSim = redscale.Ratio.simplify( sNum, sDen );

  return new redscale.Ratio( sSig, sSim[0], sSim[1] );
};

/**
 * Subtract
 * @param {!redscale.Ratio} aVal
 * @param {!redscale.Ratio} bVal
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.subtract = function( aVal, bVal ) {
  var abNumComp,
      abDenComp,
      aNum,
      bNum,
      dSig,
      dNum,
      dDen,
      dSim;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }

  abDenComp = redscale.util.compare( aVal.denominator, bVal.denominator );

  if ( abDenComp === 0 ) {
    aNum = aVal.numerator;
    bNum = bVal.numerator;
    dDen = redscale.util.copyOf( aVal.denominator );
  } else {
    aNum = redscale.arithmetic.multiply( aVal.numerator, bVal.denominator );
    bNum = redscale.arithmetic.multiply( bVal.numerator, aVal.denominator );
    dDen = redscale.arithmetic.multiply( aVal.denominator, bVal.denominator );
  }

  if ( aVal.signum !== bVal.signum ) {
    dSig = aVal.signum;
    dNum = redscale.arithmetic.add( aNum, bNum );
  } else {
    abNumComp = redscale.util.compare( aNum, bNum );

    if ( abNumComp === 0 ) {
      return redscale.Ratio.ZERO;
    } else if ( abNumComp > 0 ) {
      dSig = abNumComp === aVal.signum ? 1 : -1;
      dNum = redscale.arithmetic.subtract( aNum, bNum );
    } else {
      dSig = abNumComp === aVal.signum ? 1 : -1;
      dNum = redscale.arithmetic.subtract( bNum, aNum );
    }
  }

  dSim = redscale.Ratio.simplify( dNum, dDen );

  return new redscale.Ratio( dSig, dSim[0], dSim[1] );
};

/**
 * Multiply
 * @param {!redscale.Ratio} aVal
 * @param {!redscale.Ratio} bVal
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.multiply = function( aVal, bVal ) {
  var pSig,
      pNum,
      pDen,
      pSim;

  if ( aVal.signum === 0 || bVal.signum === 0 ) {
    return redscale.Ratio.ZERO;
  }

  pSig = aVal.signum * bVal.signum;
  pNum = redscale.arithmetic.multiply( aVal.numerator, bVal.numerator );
  pDen = redscale.arithmetic.multiply( aVal.denominator, bVal.denominator );

  pSim = redscale.Ratio.simplify( pNum, pDen );

  return new redscale.Ratio( pSig, pSim[0], pSim[1] );
};

/**
 * Divide
 * @param {!redscale.Ratio} aVal
 * @param {!redscale.Ratio} bVal
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.divide = function( aVal, bVal ) {
  var qSig,
      qNum,
      qDen,
      qSim;

  if ( aVal.signum === 0 || bVal.signum === 0 ) {
    return redscale.Ratio.ZERO;
  }

  qSig = aVal.signum * bVal.signum;
  qNum = redscale.arithmetic.multiply( aVal.numerator, bVal.denominator );
  qDen = redscale.arithmetic.multiply( aVal.denominator, bVal.numerator );

  qSim = redscale.Ratio.simplify( qNum, qDen );

  return new redscale.Ratio( qSig, qSim[0], qSim[1] );
};

/**
 * GCD
 * @param {!redscale.Ratio} aVal
 * @param {!redscale.Ratio} bVal
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.gcd = function( aVal, bVal ) {
  var gNum,
      gDen,
      gSim;

  if ( aVal.signum === 0 ) { return bVal.abs() }
  if ( bVal.signum === 0 ) { return aVal.abs() }

  gNum = redscale.arithmetic.gcd( aVal.numerator, bVal.numerator );
  gDen = redscale.arithmetic.lcm( aVal.denominator, bVal.denominator );

  gSim = redscale.Ratio.simplify( gNum, gDen );

  return new redscale.Ratio( 1, gSim[0], gSim[1] );
};

/**
 * Square
 * @param {!redscale.Ratio} aVal
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.square = function( aVal ) {
  var pNum,
      pDen,
      pSim;

  if ( aVal.signum === 0 ) { return aVal }

  pNum = redscale.arithmetic.square( aVal.numerator );
  pDen = redscale.arithmetic.square( aVal.denominator );

  pSim = redscale.Ratio.simplify( pNum, pDen );

  return new redscale.Ratio( 1, pSim[0], pSim[1] );
};

/**
 * Power
 * @param {!redscale.Ratio} aVal
 * @param {!number} aInt
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.pow = function( aVal, aInt ) {
  var pSig,
      pNum,
      pDen,
      pSim;

  if ( aInt < 0 ) { throw new Error( "Exponent is negative." ) }

  if ( aVal.signum === 0 ) { return aInt === 0 ? redscale.Ratio.ONE : aVal }

  pSig = aVal.signum < 0 && (aInt & 1) === 1 ? -1 : 1;
  pNum = redscale.arithmetic.pow( aVal.numerator, aInt );
  pDen = redscale.arithmetic.pow( aVal.denominator, aInt );

  pSim = redscale.Ratio.simplify( pNum, pDen );

  return new redscale.Ratio( pSig, pSim[0], pSim[1] );
};

/**
 * Equals - Returns a boolean representing whether aVal and bVal are equal.
 * @param {!redscale.Ratio} aVal
 * @param {!redscale.Ratio} bVal
 * @returns {!boolean}
 * @export
 */
redscale.Ratio.equals = function( aVal, bVal ) {
  return redscale.util.compare( aVal.numerator, bVal.numerator ) === 0 &&
         redscale.util.compare( aVal.denominator, bVal.denominator ) === 0 &&
         aVal.signum === bVal.signum;
};

/**
 * Ratio from string
 * @param {!string} aStr
 * @param {!number} radix
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.fromString = function( aStr, radix ) {
  var aRadix = radix ? radix : 10,
      aStrNum = aStr.match( /[a-z0-9]+/i ),
      leadingZeroes,
      aSig,
      aNum;

  if ( aStrNum === null ) { throw new Error( "Zero length number." ) }

  leadingZeroes = aStr.match( /[0]+/ );

  if ( leadingZeroes === null || leadingZeroes.index !== 0 ) { leadingZeroes = [""]; }
  if ( leadingZeroes[0].length === aStrNum[0].length ) { return redscale.Ratio.ZERO }

  aSig = aStr.indexOf( "-" ) === 0 ? -1 : 1;
  aNum = redscale.util.fromString( aStrNum[0].slice( leadingZeroes[0].length ), aRadix );

  return new redscale.Ratio( aSig, aNum, new Int16Array( [1] ) );
};

/**
 * Ratio from number
 * @param {!number} aVal
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.fromNumber = function( aVal ) {
  var aSig,
      aNum,
      aDen,
      aDenLen,
      aStr,
      aStrLen,
      aDecIndex;

  if ( !Number.isFinite( aVal ) ) {
    throw new Error( "Number is not finite." )
  }

  if ( aVal === 0 ) {
    return redscale.Ratio.ZERO;
  }

  aSig = aVal > 0 ? 1 : -1;
  aStr = (aVal * aSig).toString();

  if ( aVal <= 9007199254740991 ) {
    aStrLen = aStr.length;
    aDecIndex = aStr.indexOf(".");

    if ( aDecIndex < 0 ) {
      aNum = redscale.util.fromNumber( aVal );
      aDen = new Int16Array( [1] );
    } else {
      aDenLen = aStrLen - aDecIndex - 1;

      aNum = redscale.util.fromString( aStr.replace( /[.]/, ""), 10 );
      aDen = redscale.util.copyOf( redscale.decimal.POWERS_OF_TEN[aDenLen] );
    }
  } else {
    aNum = redscale.util.fromNumber( aVal );
    aDen = new Int16Array( [1] );
  }

  return new redscale.Ratio( aSig, aNum, aDen );
};

/**
 * Ratio simplification
 * @param {!Int16Array} aNum
 * @param {!Int16Array} aDen
 * @returns {!Int16Array[]}
 */
redscale.Ratio.simplify = function( aNum, aDen ) {
  var aGCD = redscale.arithmetic.gcd( aNum, aDen );

  if ( !redscale.util.isOne( aGCD ) ) {
    aNum = redscale.arithmetic.divide( aNum, aGCD )[0];
    aDen = redscale.arithmetic.divide( aDen, aGCD )[0];
  }

  return [aNum, aDen];
};