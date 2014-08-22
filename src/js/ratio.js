goog.provide('Ratio');

/**
 * Ratio type.
 * @param {!number} signum
 * @param {!Int16Array} numerator
 * @param {!Int16Array} denominator
 * @constructor
 * @struct
 * @export
 */
Ratio = function( signum, numerator, denominator ) {
  this.signum = signum;
  this.numerator = numerator;
  this.denominator = denominator;
};