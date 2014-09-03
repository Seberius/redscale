goog.provide('redscale.bitwise');

/**
 * Array Bit Shift Left - Shifts the source array left given bits.
 *     Will also grow array by at least leftShift / 16 + extraZeroes, a feature for Knuth Division.
 * @param {Int16Array} srcArray
 * @param {number} leftShift
 * @param {number} padZeroes
 * @returns {Int16Array}
 * @export
 */
redscale.bitwise.bitShiftLeft = function( srcArray, leftShift, padZeroes ) {
  var srcLen = srcArray.length,
      intShift = leftShift >>> 4,
      leftBitShift = leftShift & 0xF,
      rightBitShift = 16 - leftBitShift,
      leadingZeroes = redscale.util.numberLeadingZeroes( srcArray ),
      extraShift = (15 + leftBitShift - (leadingZeroes & 0xF)) >>> 4,
      tarLen = srcLen + intShift + extraShift - (leadingZeroes >>> 4) + padZeroes,
      carry = 0,
      tarArray,
      srcIndex,
      tarIndex;

  if ( srcLen < 0 ) { return new Int16Array( 0 ); }

  tarArray = new Int16Array(tarLen);

  if ( leftShift === 0 ) { return redscale.util.copy( srcArray, 0, tarArray, 0, srcLen ); }

  for ( srcIndex = 0, tarIndex = intShift; srcIndex < srcLen; srcIndex++, tarIndex++ ) {
    var srcVal = srcArray[srcIndex] & redscale.util.INT16_MASK;

    tarArray[tarIndex] = ((srcVal << leftBitShift) | carry) & redscale.util.INT16_MASK;
    carry = srcVal >>> rightBitShift;
  }

  if ( tarLen > srcLen ) { tarArray[tarIndex] = carry; }

  return tarArray;
};

/**
 * Array Bit Shift Right - Shifts the source array right given bits.
 *     Will shrink array to minimum size required.
 * @param {!Int16Array} srcArray
 * @param {!number} rightShift
 * @returns {!Int16Array}
 */
redscale.bitwise.bitShiftRight = function( srcArray, rightShift ) {
  var srcLen = srcArray.length,
      leadingZeroes = redscale.util.numberLeadingZeroes( srcArray ),
      intShift = rightShift >>> 4,
      rightBitShift = rightShift & 0xF,
      leftBitShift = 16 - rightBitShift,
      tarLen = srcLen - intShift - (rightBitShift + leadingZeroes >>> 4),
      carry = 0,
      tarArray,
      srcIndex,
      tarIndex;

  if ( srcLen === 0 ) { return new Int16Array( 0 ); }

  tarArray = new Int16Array( tarLen < 0 ? 0 : tarLen );

  if ( rightShift === 0 ) { return redscale.util.copy( srcArray, 0, tarArray, 0, srcLen ) }

  for ( srcIndex = intShift, tarIndex = 0; tarIndex < tarLen; srcIndex++, tarIndex++ ) {
    carry = (srcArray[srcIndex + 1] << leftBitShift) & redscale.util.INT16_MASK;
    tarArray[tarIndex] = ((srcArray[srcIndex] & redscale.util.INT16_MASK) >>> rightBitShift) | carry;
  }

  return tarArray;
};

redscale.bitwise.and = function( aArray, aSign, bArray, bSign ) {

};

redscale.bitwise.or = function( aArray, aSign, bArray, bSign ) {

};

redscale.bitwise.xor = function( aArray, aSign, bArray, bSign ) {

};

redscale.bitwise.not = function( aArray, aSign ) {

};