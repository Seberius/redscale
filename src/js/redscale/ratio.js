goog.provide('redscale.Ratio');

/**
 * redscale.Ratio type.
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
 * Zero
 * @returns {!redscale.Ratio}
 * @constructor
 * @export
 */
redscale.Ratio.ZERO = function() {
  return new redscale.Ratio( 0, new Int16Array( 0 ), new Int16Array( 0 ) );
};

/**
 * One
 * @returns {!redscale.Ratio}
 * @constructor
 * @export
 */
redscale.Ratio.ONE = function() {
  return new redscale.Ratio( 1, new Int16Array( [1] ), new Int16Array( [1] ) );
};

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
      return redscale.Ratio.ZERO();
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
      return redscale.Ratio.ZERO();
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
    return redscale.Ratio.ZERO();
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
    return redscale.Ratio.ZERO();
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
  if ( leadingZeroes[0].length === aStrNum[0].length ) { return redscale.Ratio.ZERO() }

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
  var aSig = aVal === 0 ? 0 : aVal > 0 ? 1 : -1,
      aNum = redscale.util.fromNumber( aVal * aSig ),
      aDen = new Int16Array( [1] );

  return new redscale.Ratio( aSig, aNum, aDen );
};

/**
 * Ratio from BigInteger
 * @param {!redscale.BigInteger} aBigInt
 * @returns {!redscale.Ratio}
 * @export
 */
redscale.Ratio.fromBigInteger = function( aBigInt ) {
  return new redscale.Ratio( aBigInt.signum, aBigInt.magnitude, new Int16Array( [1] ) );
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