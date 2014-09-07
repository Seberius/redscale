goog.provide( 'redscale.BigDecimal' );

/**
 * BigDecimal type
 * @param {!number} signum
 * @param {!Int16Array} significand
 * @param {!number} scale
 * @constructor
 * @struct
 * @export
 */
redscale.BigDecimal = function( signum, significand, scale ) {
  this.redscaleType = 'BigDecimal';
  this.signum = signum;
  this.significand = significand;
  this.scale = scale;
};