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

  aNum = redscale.util.fromString( aStrNum[0].slice( leadingZeroes[0].length ), aRadix );
  aSig = aStr.indexOf( "-" ) === 0 ? -1 : 1;

  return new redscale.Ratio( aSig, aNum, new Int16Array( 0 ) );
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
  var gcd = redscale.arithmetic.gcd( aNum, aDen );

  if ( !redscale.util.isOne( gcd ) ) {
    aNum = redscale.arithmetic.divide( aNum, gcd );
    aDen = redscale.arithmetic.divide( aDen, gcd );
  }

  return [aNum, aDen];
};