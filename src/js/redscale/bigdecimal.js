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
 * Negate - Returns the negation of the redscale.BigDecimal
 * @returns {!redscale.BigDecimal}
 * @export
 */
redscale.BigDecimal.prototype.negate = function() {
  return new redscale.BigDecimal(
      this.signum === 0 ? 0 : this.signum * -1,
      this.significand,
      this.exponent,
      this.precision );
};

/**
 * Absolute - Returns the absolute redscale.BigDecimal.  Will return the current redscale.BigDecimal if positive or zero.
 * @returns {!redscale.BigDecimal}
 * @export
 */
redscale.BigDecimal.prototype.abs = function() {
  return this.signum === -1 ? this.negate() : this;
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
      rSignificand = redscale.arithmetic.subtract( bArray, aArray );
    }
  }

  return new redscale.BigDecimal( rSign, rSignificand, rExpo, 0 );
};

/**
 * Subtract
 * @param {!redscale.BigDecimal} aVal
 * @param {!redscale.BigDecimal} bVal
 * @returns {!redscale.BigDecimal}
 * @export
 */
redscale.BigDecimal.subtract = function( aVal, bVal ) {
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

  if ( aVal.signum !== bVal.signum ) {
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
      rSignificand = redscale.arithmetic.subtract( bArray, aArray );
    }
  }

  return new redscale.BigDecimal( rSign, rSignificand, rExpo, 0 );
};

/**
 * Multiply
 * @param {!redscale.BigDecimal} aVal
 * @param {!redscale.BigDecimal} bVal
 * @returns {!redscale.BigDecimal}
 * @export
 */
redscale.BigDecimal.multiply = function( aVal, bVal ) {
  var rSign,
      rSignificand,
      rExpo;

  rExpo = aVal.exponent + bVal.exponent;

  if ( aVal.signum === 0 || bVal.signum === 0 ) {
    rSign = 0;
    rSignificand = new Int16Array( 0 );
  } else {
    rSign = aVal.signum === bVal.signum ? 1 : -1;
    rSignificand = redscale.arithmetic.multiply( aVal.significand, bVal.significand );
  }

  return new redscale.BigDecimal( rSign, rSignificand, rExpo, 0 );
};