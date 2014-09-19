goog.provide( 'redscale.decimal' );

redscale.decimal.POWERS_OF_TEN =
  [ new Int16Array( [1] ), new Int16Array( [10] ), new Int16Array( [100] ),
    new Int16Array( [1000] ), new Int16Array( [10000] ), new Int16Array( [-31072, 1] ),
    new Int16Array( [16960, 15] ), new Int16Array( [-27008, 152] ), new Int16Array( [-7936, 1525] ),
    new Int16Array( [-13824, 15258] ), new Int16Array( [-7168, 21515, 2] ), new Int16Array( [-6144, 18550, 23] ),
    new Int16Array( [4096, -11099, 232] ), new Int16Array( [-24576, 20082, 2328] ),
    new Int16Array( [16384, 4218, 23283] ), new Int16Array( [-32768, -23354, -29314, 3] ),
    new Int16Array( [0, 28609, -30990, 35] ) ];

/**
 * Generate Power of Ten
 * @param {!number} aInt
 * @returns {!Int16Array}
 */
redscale.decimal.genPowerOfTen = function( aInt ) {
  var rArray,
      rBase,
      aSqr;

  if ( aInt <= 16 ) {
    return redscale.decimal.POWERS_OF_TEN[aInt];
  }

  rArray = redscale.decimal.POWERS_OF_TEN[16];
  rBase = redscale.decimal.POWERS_OF_TEN[16];
  aInt -= 16;
  aSqr = 16;

  while ( aInt >= aSqr ) {
    rArray = redscale.arithmetic.square( rArray );
    aInt -= aSqr;
    aSqr *= 2;
  }

  while ( aInt > 16 ) {
    rArray = redscale.arithmetic.multiply( rArray, rBase );
    aInt -= 16;
  }

  if ( aInt ) {
    rArray = redscale.arithmetic.multiply( rArray, redscale.decimal.POWERS_OF_TEN[aInt] );
  }

  return rArray;
};

/**
 * Check Rounding
 * @param {!Int16Array} qArray
 * @param {!number} qSign
 * @param {!Int16Array} rArray
 * @param {!Int16Array} dArray
 * @param {!number} roundMode
 * @returns {!Int16Array}
 */
redscale.decimal.checkRounding = function( qArray, qSign, rArray, dArray, roundMode ) {
  var rdHalfComp = redscale.util.compareHalf( dArray, rArray ),
      isQuotOdd = redscale.util.isOdd( qArray );

  if ( !redscale.util.isZero() ) {
    if ( roundMode === 0 ) {
      return redscale.arithmetic.add( qArray, [1] );
    } else if ( roundMode === 1 ) {
      return qArray;
    } else if ( roundMode === 2 ) {
      return qSign > 0 ? redscale.arithmetic.add( qArray, [1] ) : qArray;
    } else if ( roundMode === 3 ) {
      return qSign < 0 ? redscale.arithmetic.add( qArray, [1] ) : qArray;
    } else if ( rdHalfComp > 0 ) {
      return redscale.arithmetic.add( qArray, [1] );
    } else if ( rdHalfComp < 0 ) {
      return qArray;
    } else if ( roundMode === 4 ) {
      return redscale.arithmetic.add( qArray, [1] );
    } else if ( roundMode === 5 ) {
      return qArray;
    } else if ( roundMode === 6 ) {
      return isQuotOdd ? redscale.arithmetic.add( qArray, [1] ) : qArray;
    } else if ( roundMode === 7 ) {
      return redscale.arithmetic.add( qArray, [1] );
    } else {
      throw new Error( "Unrecognized rounding mode." )
    }
  }

  return qArray;
};