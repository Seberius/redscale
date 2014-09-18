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
 * ZERO - Returns a redscale.BigDecimal equal to 0.
 * @returns {!redscale.BigDecimal}
 * @const
 * @export
 */
redscale.BigDecimal.ZERO = new redscale.BigDecimal( 0, new Int16Array( 0 ), 0, 0 );

/**
 * ONE - Returns a redscale.BigDecimal equal to 1.
 * @returns {!redscale.BigDecimal}
 * @const
 * @export
 */
redscale.BigDecimal.ONE = new redscale.BigDecimal( 1, new Int16Array( [1] ), 0, 0 );

/**
 * Rounding Mode - Up
 * @type {!number}
 * @const
 * @export
 */
redscale.BigDecimal.ROUND_UP = 0;

/**
 * Rounding Mode - Down
 * @type {!number}
 * @const
 * @export
 */
redscale.BigDecimal.ROUND_DOWN = 1;

/**
 * Rounding Mode - Ceiling
 * @type {!number}
 * @const
 * @export
 */
redscale.BigDecimal.ROUND_CEILING = 2;

/**
 * Rounding Mode - Floor
 * @type {!number}
 * @const
 * @export
 */
redscale.BigDecimal.ROUND_FLOOR = 3;

/**
 * Rounding Mode - Half Up
 * @type {!number}
 * @const
 * @export
 */
redscale.BigDecimal.ROUND_HALF_UP = 4;

/**
 * Rounding Mode - Half Down
 * @type {!number}
 * @const
 * @export
 */
redscale.BigDecimal.ROUND_HALF_DOWN = 5;

/**
 * Rounding Mode - Half Even
 * @type {!number}
 * @const
 * @export
 */
redscale.BigDecimal.ROUND_HALF_EVEN = 6;

/**
 * Rounding Mode - Unnecessary
 * @type {!number}
 * @const
 * @export
 */
redscale.BigDecimal.ROUND_UNNECESSARY = 7;

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

/**
 * Square
 * @param {!redscale.BigDecimal} aVal
 * @returns {!redscale.BigDecimal}
 * @export
 */
redscale.BigDecimal.square = function( aVal ) {
  var rSign,
      rSignificand,
      rExpo;

  rExpo = aVal.exponent * 2;

  if ( aVal.signum === 0 ) {
    rSign = 0;
    rSignificand = new Int16Array( 0 );
  } else {
    rSign = 1;
    rSignificand = redscale.arithmetic.square( aVal.significand );
  }

  return new redscale.BigDecimal( rSign, rSignificand, rExpo, 0 );
};

/**
 * Power
 * @param {!redscale.BigDecimal} aVal
 * @param {!number} eInt
 * @returns {!redscale.BigDecimal}
 * @export
 */
redscale.BigDecimal.pow = function( aVal, eInt ) {
  var rSign,
      rSignificand,
      rExpo;

  if ( eInt < 0 ) { throw new Error( "Exponent is negative." ) }

  if ( aVal.signum === 0 ) { return eInt === 0 ? redscale.BigDecimal.ONE() : aVal }

  rSign = aVal.signum < 0 && (eInt & 1) === 1 ? -1 : 1;
  rSignificand = redscale.arithmetic.pow( aVal.significand, eInt );
  rExpo = aVal.exponent * eInt;

  return new redscale.BigDecimal( rSign, rSignificand, rExpo, 0 );
};

/**
 * Compare To
 * @param {!redscale.BigDecimal} aVal
 * @param {!redscale.BigDecimal} bVal
 * @returns {!number}
 * @export
 */
redscale.BigDecimal.compareTo = function( aVal, bVal ) {
  var rInt;

  if ( aVal.signum !== bVal.signum ) {
    return aVal.signum > bVal.signum ? 1 : -1;
  }

  rInt = redscale.util.compareExpo( aVal.significand, aVal.exponent, bVal.significand, bVal.exponent );
  rInt = rInt === 0 ? 0 : rInt * aVal.signum;

  return rInt;
};

/**
 * Equals - Returns a boolean representing whether aVal and bVal are equal.
 * @param {!redscale.BigDecimal} aVal
 * @param {!redscale.BigDecimal} bVal
 * @returns {!boolean}
 * @export
 */
redscale.BigDecimal.equals = function( aVal, bVal ) {
  return redscale.util.compareExpo( aVal.significand, aVal.exponent, bVal.significand, bVal.exponent ) === 0 &&
    aVal.signum === bVal.signum;
};

/**
 * Max
 * @param {!redscale.BigDecimal} aVal
 * @param {!redscale.BigDecimal} bVal
 * @returns {!redscale.BigDecimal}
 * @export
 */
redscale.BigDecimal.max = function( aVal, bVal ) {
  var rInt;

  rInt = redscale.BigDecimal.compareTo( aVal, bVal );

  return rInt < 0 ? bVal : aVal;
};

/**
 * Min
 * @param {!redscale.BigDecimal} aVal
 * @param {!redscale.BigDecimal} bVal
 * @returns {!redscale.BigDecimal}
 * @export
 */
redscale.BigDecimal.min = function( aVal, bVal ) {
  var rInt;

  rInt = redscale.BigDecimal.compareTo( aVal, bVal );

  return rInt > 0 ? bVal : aVal;
};