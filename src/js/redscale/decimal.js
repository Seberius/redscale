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
      aSqr;

  if ( aInt <= 16 ) {
    return redscale.decimal.POWERS_OF_TEN[aInt];
  }

  rArray = redscale.decimal.POWERS_OF_TEN[16];
  aInt -= 16;
  aSqr = 16;

  while ( aInt >= aSqr ) {
    rArray = redscale.arithmetic.square( rArray );
    aInt -= aSqr;
    aSqr *= 2;
  }

  while ( aInt > 16 ) {
    rArray = redscale.arithmetic.multiply( rArray, rBase );
  }

  if ( aInt ) {
    rArray = redscale.arithmetic.multiply( rArray, redscale.decimal.POWERS_OF_TEN[aInt] );
  }

  return rArray;
};