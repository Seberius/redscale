goog.provide( 'redscale.BigDecimal' );

/**
 * BigDecimal type
 * @param {!number} signum
 * @param {!Int16Array} significand
 * @param {!number} exponent
 * @param {!number} precision
 * @constructor
 * @struct
 * @export
 */
redscale.BigDecimal = function( signum, significand, exponent, precision ) {
  this.redscaleType = 'BigDecimal';
  this.signum = signum;
  this.significand = significand;
  this.exponent = exponent;
  this.precision = precision;
};

/**
 * Add
 * @param {!redscale.BigDecimal} aVal
 * @param {!redscale.BigDecimal} bVal
 * @returns {!redscale.BigDecimal}
 * @export
 */
redscale.BigDecimal.add = function( aVal, bVal ) {
  var eDiff = aVal.exponent - bVal.exponent,
      aArray = aVal.significand,
      bArray = bVal.significand,
      abComp,
      rSign,
      rSignificand,
      rExpo,
      powerTen;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }

  if ( eDiff !== 0 ) {
    if ( eDiff < 0 ) {
      rExpo = bVal.exponent;
      powerTen = redscale.decimal.genPowerOfTen( -eDiff );
      aArray = redscale.arithmetic.multiply( aArray, powerTen );
    } else {
      rExpo = aVal.exponent;
      powerTen = redscale.decimal.genPowerOfTen( eDiff );
      bArray = redscale.arithmetic.multiply( bArray, powerTen );
    }
  } else {
    rExpo = aVal.exponent;
  }

  if ( aVal.signum === bVal.signum ) {
    rSign = aVal.signum;
    rSignificand = redscale.arithmetic.add( aArray, bArray );
  } else {
    abComp = redscale.util.compare( aArray, bArray );

    if ( abComp === 0 ) {
      rSign = 0;
      rSignificand = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      rSign = abComp === aVal.signum ? 1 : -1;
      rSignificand = redscale.arithmetic.subtract( aArray, bArray );
    } else {
      rSign = abComp === aVal.signum ? 1 : -1;
      rSignificand = redscale.arithmetic.subtract( aArray, bArray );
    }
  }

  return new redscale.BigDecimal( rSign, rSignificand, rExpo, 0 );
};