goog.provide('redscale.bitwise');

/**
 * Array Bit Shift Left - Shifts the source array left given bits.
 *     Will also grow array by at least leftShift / 16 + extraZeroes, a feature for Knuth Division.
 * @param {Int16Array} srcArray
 * @param {number} leftShift
 * @param {number} padZeroes
 * @returns {Int16Array}
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

  if ( srcLen === 0 ) { return new Int16Array( 0 ); }

  tarArray = new Int16Array( tarLen );

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

/**
 * Signed Int
 * @param {!number} aInt
 * @param {!number} aSign
 * @param {!number} aZeroes
 * @param {!number} aLen
 * @param {!number} aIndex
 * @returns {!number}
 */
redscale.bitwise.signedInt = function( aInt, aSign, aZeroes, aLen, aIndex ) {
  if ( aIndex >= aLen ) {
    return aSign < 0 ? 65535 : 0;
  }

  if ( aSign < 0 ) {
    if ( aIndex <= aZeroes ) {
      aInt = -aInt;
    } else {
      aInt = ~aInt;
    }
  }

  return aInt;
};

/**
 * Unsigned Array
 * @param {!Int16Array} aArray
 * @returns {!Int16Array}
 */
redscale.bitwise.toUnsignedArray = function( aArray ) {
  var aLen = aArray.length,
      aIndex = aLen - 1,
      rIndex,
      aSignIntCount,
      rLen,
      rArray;

  while ( aIndex >= 0 && aArray[aIndex] === -1 ) { aIndex--; }

  aSignIntCount = aLen - aIndex - 1;

  while ( aIndex >= 0 && aArray[aIndex] === 0 ) { aIndex--; }

  rLen = aLen - aSignIntCount;
  rArray = new Int16Array( rLen + (aIndex === 0 ? 1 : 0) );

  for ( rIndex = 0; rIndex < rLen; rIndex++ ) {
    rArray[rIndex] = ~aArray[rIndex];
  }

  for ( rIndex = 0; (rArray[rIndex] += 1) === 0; rIndex++ ) {}

  return rArray;
};

/**
 * Bitwise and
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} bArray
 * @param {!number} bSign
 * @returns {!Int16Array}
 */
redscale.bitwise.and = function( aArray, aSign, bArray, bSign ) {
  var aZeroes = redscale.util.numberTrailingZeroes( aArray ) >>> 4,
      bZeroes = redscale.util.numberTrailingZeroes( bArray ) >>> 4,
      aLen = aArray.length,
      bLen = bArray.length,
      rLen = Math.max( aLen, bLen ),
      rArray = new Int16Array( rLen ),
      rIndex,
      aInt,
      bInt;

  for ( rIndex = 0; rIndex < rLen; rIndex++ ) {
    aInt = aArray[rIndex];
    bInt = bArray[rIndex];
    rArray[rIndex] =
      redscale.bitwise.signedInt( aInt, aSign, aZeroes, aLen, rIndex ) &
      redscale.bitwise.signedInt( bInt, bSign, bZeroes, bLen, rIndex );
  }

  return rArray;
};

/**
 * Bitwise or
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} bArray
 * @param {!number} bSign
 * @returns {!Int16Array}
 */
redscale.bitwise.or = function( aArray, aSign, bArray, bSign ) {
  var aZeroes = redscale.util.numberTrailingZeroes( aArray ) >>> 4,
      bZeroes = redscale.util.numberTrailingZeroes( bArray ) >>> 4,
      aLen = aArray.length,
      bLen = bArray.length,
      rLen = Math.max( aLen, bLen ),
      rArray = new Int16Array( rLen ),
      rIndex,
      aInt,
      bInt;

  for ( rIndex = 0; rIndex < rLen; rIndex++ ) {
    aInt = aArray[rIndex];
    bInt = bArray[rIndex];
    rArray[rIndex] =
      redscale.bitwise.signedInt( aInt, aSign, aZeroes, aLen, rIndex ) |
      redscale.bitwise.signedInt( bInt, bSign, bZeroes, bLen, rIndex );
  }

  return rArray;
};

/**
 * Bitwise xor
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} bArray
 * @param {!number} bSign
 * @returns {!Int16Array}
 */
redscale.bitwise.xor = function( aArray, aSign, bArray, bSign ) {
  var aZeroes = redscale.util.numberTrailingZeroes( aArray ) >>> 4,
      bZeroes = redscale.util.numberTrailingZeroes( bArray ) >>> 4,
      aLen = aArray.length,
      bLen = bArray.length,
      rLen = Math.max( aLen, bLen ),
      rArray = new Int16Array( rLen ),
      rIndex,
      aInt,
      bInt;

  for ( rIndex = 0; rIndex < rLen; rIndex++ ) {
    aInt = aArray[rIndex];
    bInt = bArray[rIndex];
    rArray[rIndex] =
      redscale.bitwise.signedInt( aInt, aSign, aZeroes, aLen, rIndex ) ^
      redscale.bitwise.signedInt( bInt, bSign, bZeroes, bLen, rIndex );
  }

  return rArray;
};

/**
 * Bitwise not
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @returns {!Int16Array}
 */
redscale.bitwise.not = function( aArray, aSign ) {
  var aZeroes = redscale.util.numberTrailingZeroes( aArray ) >>> 4,
      aLen = aArray.length,
      rLen = aLen,
      rArray = new Int16Array( rLen ),
      rIndex,
      aInt;

  for ( rIndex = 0; rIndex < rLen; rIndex++ ) {
    aInt = aArray[rIndex];
    rArray[rIndex] =
      ~redscale.bitwise.signedInt( aInt, aSign, aZeroes, aLen, rIndex );
  }

  return rArray;
};

/**
 * Bitwise andNot
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} bArray
 * @param {!number} bSign
 * @returns {!Int16Array}
 */
redscale.bitwise.andNot = function ( aArray, aSign, bArray, bSign ) {
  var aZeroes = redscale.util.numberTrailingZeroes( aArray ) >>> 4,
      bZeroes = redscale.util.numberTrailingZeroes( bArray ) >>> 4,
      aLen = aArray.length,
      bLen = bArray.length,
      rLen = Math.max( aLen, bLen ),
      rArray = new Int16Array( rLen ),
      rIndex,
      aInt,
      bInt;

  for ( rIndex = 0; rIndex < rLen; rIndex++ ) {
    aInt = aArray[rIndex];
    bInt = bArray[rIndex];
    rArray[rIndex] =
      redscale.bitwise.signedInt( aInt, aSign, aZeroes, aLen, rIndex ) &
      ~redscale.bitwise.signedInt( bInt, bSign, bZeroes, bLen, rIndex );
  }

  return rArray;
};

/**
 * Bitwise shift left
 * @param {!Int16Array} aArray
 * @param {!number} aShift
 * @returns {!Int16Array}
 */
redscale.bitwise.shiftLeft = function( aArray, aShift ) {
  return redscale.bitwise.bitShiftLeft( aArray, aShift, 0 );
};

/**
 * Bitwise shift right
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!number} aShift
 * @returns {!Int16Array}
 */
redscale.bitwise.shiftRight = function( aArray, aSign, aShift ) {
  var rArray = redscale.bitwise.bitShiftRight( aArray, aShift );

  if ( aSign < 0 ) {
    rArray = redscale.arithmetic.add( rArray, [1] );
  }

  return rArray;
};

/**
 * Bitwise unsigned shift right
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!number} aShift
 * @returns {!Int16Array}
 */
redscale.bitwise.unsignedShiftRight = function( aArray, aSign, aShift ) {
  var aZeroes = redscale.util.numberTrailingZeroes( aArray ) >>> 4,
      aLen = aArray.length,
      rArray = new Int16Array( aLen ),
      rIndex = 0,
      aInt;

  while ( rIndex < aLen ) {
    aInt = aArray[rIndex];
    rArray[rIndex++] = redscale.bitwise.signedInt( aInt, aSign, aZeroes, aLen, rIndex );
  }

  rArray = redscale.bitwise.bitShiftRight( rArray, aShift );

  return rArray;
};