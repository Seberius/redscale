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
 * Zero
 * @returns {!redscale.Ratio}
 * @constructor
 */
redscale.Ratio.ZERO = function() {
  return new redscale.Ratio( 0, new Int16Array( 0 ), new Int16Array( 0 ) );
};

/**
 * One
 * @returns {!redscale.Ratio}
 * @constructor
 */
redscale.Ratio.ONE = function() {
  return new redscale.Ratio( 1, new Int16Array( [1] ), new Int16Array( [1] ) );
};

/**
 * Add
 * @param {!redscale.Ratio} aVal
 * @param {!redscale.Ratio} bVal
 * @returns {!redscale.Ratio}
 */
redscale.Ratio.add = function( aVal, bVal ) {
  var abNumComp,
      abDenComp,
      aNum,
      bNum,
      sSig,
      sNum,
      sDen;

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

  return new redscale.Ratio( sSig, sNum, sDen );
};

/**
 * Subtract
 * @param {!redscale.Ratio} aVal
 * @param {!redscale.Ratio} bVal
 * @returns {!redscale.Ratio}
 */
redscale.Ratio.subtract = function( aVal, bVal ) {
  var abNumComp,
      abDenComp,
      aNum,
      bNum,
      dSig,
      dNum,
      dDen;

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

  return new redscale.Ratio( dSig, dNum, dDen );
};

/**
 * Ratio from string
 * @param {!string} aStr
 * @param {!number} radix
 * @returns {!redscale.Ratio}
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