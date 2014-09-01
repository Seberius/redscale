goog.provide('redscale');

/**
 * Int16 Mask
 * @type {number}
 * @const
 */
redscale.INT16_MASK = 0xFFFF;

/**
 * Int16 Unsigned Mask
 * @type {number}
 * @const
 */
redscale.INT16_UNSIGNED = 0x8000;

/**
 * Int32 Unsigned Mask
 * @type {number}
 * @const
 */
redscale.INT32_UNSIGNED = 0x80000000;

/**
 * Int32 Divisor Radix Index
 * @type {Int16Array[]}
 * @const
 */
redscale.RADIX_DIVISOR32_INDEX =
  [new Int16Array(0), new Int16Array(0),
    new Int16Array([0, 16384]), new Int16Array([-19493, 17734]), new Int16Array([0, 16384]),
    new Int16Array([29589, 18626]), new Int16Array([-10240, 5535]), new Int16Array([-25449, 30171]),
    new Int16Array([0, 16384]), new Int16Array([-28343, 5911]), new Int16Array([-13824, 15258]),
    new Int16Array([-9375, 3270]), new Int16Array([0, 6561]), new Int16Array([4129, 12447]),
    new Int16Array([-16128, 22518]), new Int16Array([7023, 2607]), new Int16Array([0, 4096]),
    new Int16Array([17777, 6261]), new Int16Array([-17280, 9341]), new Int16Array([26235, 13639]),
    new Int16Array([16384, 19531]), new Int16Array([28189, 27482]), new Int16Array([2624, 1730]),
    new Int16Array([-9935, 2258]), new Int16Array([0, 2916]), new Int16Array([19025, 3725]),
    new Int16Array([-20928, 4713]), new Int16Array([-28343, 5911]), new Int16Array([4096, 7353]),
    new Int16Array([18585, 9076]), new Int16Array([-22464, 11123]), new Int16Array([15169, 13542]),
    new Int16Array([0, 16384]), new Int16Array([15553, 19706]), new Int16Array([-10176, 23571]),
    new Int16Array([-19175, 28049]), new Int16Array([-23552, 922])];

/**
 * Int16 Divisor Radix Index
 * @type {number[]}
 * @const
 */
redscale.RADIX_DIVISOR16_INDEX =
  [0, 0,
    16384, 19683, 16384, 15625, 7776,  16807, 4096,  6561,  10000, 14641,
    20736, 28561, 2744,  3375,  4096,  4913,  5832,  6859,  8000,  9261,
    10648, 12167, 13824, 15625, 17576, 19683, 21952, 24389, 27000, 29791,
    1024,  1089,  1156,  1225,  1296];

/**
 * Int32 Radix Index
 * @type {number[]}
 * @const
 */
redscale.RADIX_INT32_INDEX =
  [0, 0,
    30, 19, 15, 13, 11, 11, 10, 9, 9, 8,
    8,  8,  8,  7,  7,  7,  7,  7, 7, 7,
    6,  6,  6,  6,  6,  6,  6,  6, 6, 6,
    6,  6,  6,  6,  5];

/**
 * Int16 Radix Index
 * @type {number[]}
 * @const
 */
redscale.RADIX_INT16_INDEX =
  [0, 0,
    14, 9, 7, 6, 5, 5, 4, 4, 4, 4,
    4,  4, 3, 3, 3, 3, 3, 3, 3, 3,
    3,  3, 3, 3, 3, 3, 3, 3, 3, 3,
    2,  2, 2, 2, 2];

/**
 * Bits per Radix Index
 * @type {number[]}
 * @const
 */
redscale.RADIX_BIT_INDEX =
  [0, 0,
    1,     1.585, 2,     2.322, 2.585, 2.808, 3,     3.17,  3.322, 3.46,
    3.585, 3.701, 3.808, 3.907, 4,     4.088, 4.17,  4.248, 4.322, 4.393,
    4.46,  4.524, 4.585, 4.644, 4.701, 4.755, 4.808, 4.858, 4.907, 4.955,
    5,     5.045, 5.088, 5.13,  5.17];

/**
 * Zero String
 * @type {string}
 * @const
 */
redscale.ZERO_STRING = '00000000000000000000000000000';

/**
 * isZero
 * @param {!Int16Array} aArray
 * @returns {!boolean}
 */
redscale.isZero = function( aArray ) {
  return aArray.length === 0;
};

/**
 * isOdd
 * @param {!Int16Array} aArray
 * @returns {!boolean}
 */
redscale.isOdd = function( aArray ) {
  return ((aArray[0] || 0) & 1) === 1;
};

/**
 * isEven
 * @param {!Int16Array} aArray
 * @returns {!boolean}
 */
redscale.isEven = function( aArray ) {
  return ((aArray[0] || 0) & 1) === 0;
};

/**
 * Copy - Copies the value from one array to another. Require source array, source starting index,
 * target array, target starting index, and copy length.
 * @param {!Int16Array} srcArray
 * @param {!number} srcStart
 * @param {!Int16Array} tarArray
 * @param {!number} tarStart
 * @param {!number} copyLength
 * @returns {!Int16Array}
 */
redscale.copy = function( srcArray, srcStart, tarArray, tarStart, copyLength ) {
  var srcLimit = srcStart + copyLength;

  for ( ; srcStart < srcLimit ; srcStart++, tarStart++ ) {
    tarArray[tarStart] = srcArray[srcStart];
  }

  return tarArray;
};

/**
 * Integer Leading Zeroes - Counts the leading zeroes of a native number as if it were a signed 16-bit integer.
 * @param {!number} aNum
 * @returns {!number}
 */
redscale.intLeadingZeroes = function( aNum ) {
  var zeroCount = 0;

  aNum &= redscale.INT16_MASK;
  if ( aNum === 0 ) { return 16; }
  if ( aNum <= 0x00FF ) {
    aNum <<= 8;
    zeroCount += 8;
  }
  if ( aNum <= 0x0FFF ) {
    aNum <<= 4;
    zeroCount += 4;
  }
  if ( aNum <= 0x3FFF ) {
    aNum <<= 2;
    zeroCount += 2;
  }
  if ( aNum <= 0x7FFF ) {
    zeroCount += 1;
  }

  return zeroCount;
};

/**
 * Integer Trailing Zeroes - Counts the trailing zeroes of a native number as if it were a signed 16-bit integer.
 * @param {!number} aNum
 * @returns {!number}
 */
redscale.intTrailingZeroes = function( aNum ) {
  var zeroCount = 0;

  aNum &= redscale.INT16_MASK;
  if ( aNum === 0 ) { return 16; }
  if ( (aNum & 0xFF) === 0 ) {
    aNum >>>= 8;
    zeroCount += 8;
  }
  if ( (aNum & 0xF) === 0 ) {
    aNum >>>= 4;
    zeroCount += 4;
  }
  if ( (aNum & 0x3) === 0 ) {
    aNum >>>= 2;
    zeroCount += 2;
  }
  if ( (aNum & 0x1) === 0 ) {
    zeroCount += 1;
  }

  return zeroCount;
};

/**
 * Array Leading Zeroes - Counts the number of zeroes from the most significant bit to the first "on" bit.
 * @param {!Int16Array} aArray
 * @returns {!number}
 */
redscale.numberLeadingZeroes = function( aArray ) {
  var aLen = aArray.length,
      aIndex;

  for ( aIndex = aLen - 1; (aIndex > 0) && (aArray[aIndex] === 0); aIndex-- ) { }

  return ((aLen - 1 - aIndex) << 4) + redscale.intLeadingZeroes( aArray[aIndex] );
};

/**
 * Array Trailing Zeroes - Counts the number of zeroes from the least significant bit to the last "on" bit.
 * @param {!Int16Array} aArray
 * @returns {!number}
 */
redscale.numberTrailingZeroes = function( aArray ) {
  var aLen = aArray.length,
      aIndex;

  for ( aIndex = 0; (aIndex < (aLen - 1)) && (aArray[aIndex] === 0); aIndex++ ) { }

  return (aIndex << 4) + redscale.intTrailingZeroes( aArray[aIndex] );
};

/**
 * Trim Leading Zeroes - Takes an array and removes leading zero integers.
 *     Returns source array if there aren't any leading zeroes.
 *     Returns an empty array if all zeroes.
 * @param {!Int16Array} srcArray
 * @returns {!Int16Array}
 */
redscale.trimLeadingZeroes = function( srcArray ) {
  var srcLen = srcArray.length,
      tarArray,
      srcIndex;

  if ( redscale.isZero( srcArray ) || (srcArray[srcLen - 1] !== 0) ) { return srcArray; }

  for ( srcIndex = (srcLen - 1); (srcIndex >= 0) && (srcArray[srcIndex] === 0); srcIndex-- ) { }

  tarArray = new Int16Array(srcIndex + 1);
  redscale.copy( srcArray, 0, tarArray, 0, srcIndex + 1 );

  return tarArray;
};

/**
 * Array Bit Shift Left - Shifts the source array left given bits.
 *     Will also grow array by at least leftShift / 16 + extraZeroes, a feature for Knuth Division.
 * @param {Int16Array} srcArray
 * @param {number} leftShift
 * @param {number} padZeroes
 * @returns {Int16Array}
 */
redscale.bitShiftLeft = function( srcArray, leftShift, padZeroes ) {
  var srcLen = srcArray.length,
      intShift = leftShift >>> 4,
      leftBitShift = leftShift & 0xF,
      rightBitShift = 16 - leftBitShift,
      leadingZeroes = redscale.numberLeadingZeroes( srcArray ),
      extraShift = (15 + leftBitShift - (leadingZeroes & 0xF)) >>> 4,
      tarLen = srcLen + intShift + extraShift - (leadingZeroes >>> 4) + padZeroes,
      tarArray = new Int16Array(tarLen),
      carry = 0,
      srcIndex,
      tarIndex;

  if ( leftShift === 0 ) { return redscale.copy( srcArray, 0, tarArray, 0, srcLen ); }

  for ( srcIndex = 0, tarIndex = intShift; srcIndex < srcLen; srcIndex++, tarIndex++ ) {
    var srcVal = srcArray[srcIndex] & redscale.INT16_MASK;

    tarArray[tarIndex] = ((srcVal << leftBitShift) | carry) & redscale.INT16_MASK;
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
redscale.bitShiftRight = function( srcArray, rightShift ) {
  var srcLen = srcArray.length,
      leadingZeroes = redscale.numberLeadingZeroes( srcArray ),
      intShift = rightShift >>> 4,
      rightBitShift = rightShift & 0xF,
      leftBitShift = 16 - rightBitShift,
      tarLen = srcLen - intShift - (rightBitShift + leadingZeroes >>> 4),
      tarArray = new Int16Array( tarLen < 0 ? 0 : tarLen ),
      carry = 0,
      srcIndex,
      tarIndex;

  if ( rightShift === 0 ) { return redscale.copy( srcArray, 0, tarArray, 0, srcLen ) }

  for ( srcIndex = intShift, tarIndex = 0; tarIndex < tarLen; srcIndex++, tarIndex++ ) {
    carry = (srcArray[srcIndex + 1] << leftBitShift) & redscale.INT16_MASK;
    tarArray[tarIndex] = ((srcArray[srcIndex] & redscale.INT16_MASK) >>> rightBitShift) | carry;
  }

  return tarArray;
};

/**
 * Compare - Compares two arrays. Returns 1 if a is larger, -1 if b is larger, and 0 if they are equal.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!number}
 */
redscale.compare = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      aIndex;

  if ( aLen > bLen ) { return 1; }
  if ( aLen < bLen ) { return -1; }

  for ( aIndex = aLen - 1; aIndex >= 0; aIndex-- ) {
    var aVal = (aArray[aIndex] & redscale.INT16_MASK),
        bVal = (bArray[aIndex] & redscale.INT16_MASK);

    if ( aVal !== bVal ) {
      if ( aVal > bVal ) { return 1; } else { return -1; }
    }
  }

  return 0;
};

/**
 * Add - Returns an array representation of the sum.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.add = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      sLen = Math.max( aLen, bLen ) + 1,
      sArray = new Int16Array( sLen ),
      carry = 0,
      sIndex,
      sum;

  redscale.copy( aArray, 0, sArray, 0, aLen );

  for ( sIndex = 0; sIndex < bLen; sIndex++ ) {
    sum = (sArray[sIndex] & redscale.INT16_MASK) + (bArray[sIndex] & redscale.INT16_MASK) + carry;
    sArray[sIndex] = sum & redscale.INT16_MASK;
    carry = sum >>> 16;
  }

  while ( carry ) {
    sum = (sArray[sIndex] & redscale.INT16_MASK) + carry;
    sArray[sIndex++] = sum & redscale.INT16_MASK;
    carry = sum >>> 16;
  }

  return redscale.trimLeadingZeroes( sArray );
};

/**
 * Subtract - Returns an array representation of the difference.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.subtract = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = aArray.length,
      dArray = new Int16Array( aLen ),
      carry = 0,
      bIndex,
      dIndex,
      diff;

  redscale.copy( aArray, 0, dArray, 0, aLen );

  for ( bIndex = 0; bIndex < bLen; bIndex++ ) {
    diff = (dArray[bIndex] & redscale.INT16_MASK) - (bArray[bIndex] & redscale.INT16_MASK) + carry;
    dArray[bIndex] = diff & redscale.INT16_MASK;
    carry = diff >> 16;
  }

  for ( dIndex = bLen; dIndex < aLen; dIndex++ ) {
    diff = (dArray[dIndex] & redscale.INT16_MASK) + carry;
    dArray[dIndex] = diff & redscale.INT16_MASK;
    carry = diff >> 16;
  }

  return redscale.trimLeadingZeroes( dArray );
};

/**
 * Multiply - Returns an array representation of the product.
 * @param {!Int16Array} aArray
 * @param {!Int16Array|[]} bArray
 * @returns {!Int16Array}
 */
redscale.multiply = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      pArray,
      aIndex;

  if ( aLen > 120 && bLen > 120 ) { return redscale.multiplyKaratsuba( aArray, aLen, bArray, bLen )}

  pArray = new Int16Array( aLen + bLen );

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    var carry = 0,
        pIndex,
        bIndex;

    for ( bIndex = 0, pIndex = aIndex; bIndex < bLen; bIndex++, pIndex++ ) {
      var product = (aArray[aIndex] & redscale.INT16_MASK) * (bArray[bIndex] & redscale.INT16_MASK)
                  + (pArray[pIndex] & redscale.INT16_MASK) + carry;

      pArray[pIndex] = product & redscale.INT16_MASK;
      carry = product >>> 16;
    }

    pArray[aIndex + bLen] = carry;
  }

  return redscale.trimLeadingZeroes( pArray );
};

/**
 * Multiply Karatsuba - Returns an array representation of the product.
 * @param {Int16Array} aArray
 * @param {number} aLen
 * @param {Int16Array} bArray
 * @param {number} bLen
 * @returns {Int16Array}
 */
redscale.multiplyKaratsuba = function( aArray, aLen, bArray, bLen ) {
  var kLen = (Math.max( aLen, bLen ) + 1) >>> 1,
      aHigh,
      aLow,
      bHigh,
      bLow,
      prodHigh,
      prodLow,
      prodHighLow;

  var highNum = function( aArray, aLen, kLen ) {
    var highArray;

    if ( aLen <= kLen ) { return new Int16Array( 0 ); }

    highArray = new Int16Array( aLen - kLen );
    redscale.copy( aArray, kLen, highArray, 0, aLen - kLen );

    return highArray;
  };

  var lowNum = function( aArray, aLen, kLen ) {
    var lowArray;

    if ( aLen <= kLen) { return aArray; }

    lowArray = new Int16Array( kLen );
    redscale.copy( aArray, 0, lowArray, 0, kLen );

    return redscale.trimLeadingZeroes( lowArray );
  };

  aHigh = highNum( aArray, aLen, kLen );
  aLow = lowNum( aArray, aLen, kLen );
  bHigh = highNum( bArray, bLen, kLen );
  bLow = lowNum( bArray, bLen, kLen );

  prodHigh = redscale.multiply( aHigh, bHigh );
  prodLow = redscale.multiply( aLow, bLow );
  prodHighLow = redscale.multiply( redscale.add( aHigh, aLow ), redscale.add( bHigh, bLow ) );

  return redscale.add(
           redscale.bitShiftLeft(
             redscale.add(
               redscale.bitShiftLeft( prodHigh, 16 * kLen, 0 ),
               redscale.subtract(
                 redscale.subtract( prodHighLow, prodHigh ),
                 prodLow ) ),
             16 * kLen, 0 ),
           prodLow );
};

/**
 * Divide array by 16bit integer - Returns an Array of Arrays representing the quotient and remainder.
 * @param {!Int16Array} nArray
 * @param {!number} nLen
 * @param {!Int16Array} dArray
 * @returns {!Int16Array[]}
 */
redscale.divideBy1n = function( nArray, nLen, dArray ) {
  var shiftNum,
      dInt32,
      qArray,
      quot,
      rem,
      nIndex;

  if ( nLen === 1 ) {
    quot = ((nArray[0] & redscale.INT16_MASK) / (dArray[0] & redscale.INT16_MASK)) | 0;
    rem = (nArray[0] & redscale.INT16_MASK) % (dArray[0] & redscale.INT16_MASK);

    return [new Int16Array( [quot] ), new Int16Array( rem === 0 ? 0 : [rem] )]
  }

  dInt32 = dArray[0] & redscale.INT16_MASK;
  shiftNum = redscale.intLeadingZeroes( dInt32 );
  qArray = new Int16Array( nLen );
  rem = nArray[nLen - 1] & redscale.INT16_MASK;

  if ( rem >= dInt32 ) {
    qArray[nLen - 1] = (rem / dInt32) & redscale.INT16_MASK;
    rem = (rem % dInt32) & redscale.INT16_MASK;
  }

  for ( nIndex = nLen - 2; nIndex >= 0; nIndex-- ) {
    var nVal = (rem * 65536) + (nArray[nIndex] & redscale.INT16_MASK);

    qArray[nIndex] = (nVal / dInt32) & redscale.INT16_MASK;
    rem = (nVal % dInt32) & redscale.INT16_MASK;
  }

  if ( shiftNum > 0 ) { rem %= dInt32 }

  return [redscale.trimLeadingZeroes( qArray ), new Int16Array( rem === 0 ? 0 : [rem] )];
};

/**
 * Knuth Division - Returns an Array of Arrays representing the quotient and remainder.
 * @param {!Int16Array} nArray
 * @param {!number} nLen
 * @param {!Int16Array} dArray
 * @param {!number} dLen
 * @returns {!Int16Array[]}
 */
redscale.divideKnuth = function( nArray, nLen, dArray, dLen ) {
  var INT16_MASK = redscale.INT16_MASK,
      qLen = nLen - dLen + 1,
      shiftNum = redscale.intLeadingZeroes( dArray[dLen - 1] ),
      aArray = redscale.bitShiftLeft( nArray, shiftNum, 1 ),
      bArray = redscale.bitShiftLeft( dArray, shiftNum, 0 ),
      qArray = new Int16Array( qLen ),
      bHigh = bArray[dLen - 1],
      bLow = bArray[dLen - 2],
      bVal = ((bHigh & INT16_MASK) * 65536) + (bLow & INT16_MASK),
      qIndex,
      aIndex;

  /**
   * Multiply Subtract
   * @param {!number} quot
   * @param {!Int16Array} aArray
   * @param {!Int16Array} bArray
   * @param {!number} qIndex
   * @param {!number} bLen
   * @returns {!number}
   */
  var divMulSub = function( quot, aArray, bArray, qIndex, bLen ) {
    var carry = 0,
        aIndex,
        bIndex;

    for ( aIndex = qIndex, bIndex = 0; bIndex < bLen; aIndex++, bIndex++ ) {
      var prod = (bArray[bIndex] & INT16_MASK) * (quot & INT16_MASK),
          diff = (aArray[aIndex] & INT16_MASK) - (prod & INT16_MASK) - (carry & INT16_MASK);

      aArray[aIndex] = diff & INT16_MASK;
      carry = ((prod >> 16) & INT16_MASK) - ((diff >> 16) & INT16_MASK);
    }

    aArray[aIndex] = (aArray[aIndex] & INT16_MASK) - (carry & INT16_MASK);

    return carry;
  };

  /**
   * Add
   * @param {!Int16Array} aArray
   * @param {!Int16Array} bArray
   * @param {!number} qIndex
   * @param {!number} bLen
   * @returns {!number}
   */
  var divAdd = function( aArray, bArray, qIndex, bLen ) {
    var
      carry = 0,
      aIndex,
      bIndex;

    for ( aIndex = qIndex, bIndex = 0; bIndex < bLen; aIndex++, bIndex++ ) {
      var sum = (aArray[aIndex] & INT16_MASK) + (bArray[bIndex] & INT16_MASK) + carry;

      aArray[aIndex] = sum & INT16_MASK;
      carry = sum >> 16;
    }

    aArray[aIndex] += carry;

    return carry;
  };

  for ( qIndex = qLen - 1, aIndex = nLen; qIndex >= 0; qIndex--, aIndex-- ) {
    var aHigh = aArray[aIndex],
        aMed = aArray[aIndex - 1],
        aLow = aArray[aIndex - 2],
        aVal = ((aHigh & INT16_MASK) * 4294967296) + ((aMed & INT16_MASK) * 65536) + (aLow & INT16_MASK),
        quot;

    quot = (aVal / bVal) & INT16_MASK;

    if ( quot !== 0 ) {
      divMulSub( quot, aArray, bArray, qIndex, dLen );

      if ( aArray[qIndex + dLen] !== 0 ) {
        divAdd( aArray, bArray, qIndex, dLen );
        quot--;
      }
    }

    qArray[qIndex] = quot;
  }

  return [redscale.trimLeadingZeroes( qArray ), redscale.bitShiftRight( aArray, shiftNum )];
};

/**
 * Divide - Returns an Array of Arrays representing the quotient and remainder.
 * @param {!Int16Array} nArray
 * @param {!Int16Array} dArray
 * @returns {!Int16Array[]}
 */
redscale.divide = function( nArray, dArray ) {
  var nLen = nArray.length,
      dLen = dArray.length,
      ndComp = redscale.compare( nArray, dArray );

  if ( redscale.isZero( dArray ) ) { throw new Error( "Division by zero." ) }
  if ( redscale.isZero( nArray ) ) { return [new Int16Array( 0 ), new Int16Array( 0 )]; }
  if ( ndComp === 0 ) { return [new Int16Array( [1] ), new Int16Array( 0 )]; }
  if ( ndComp === -1 ) { return [new Int16Array( 0 ), new Int16Array( nArray )]; }
  if ( dLen === 1 ) { return redscale.divideBy1n( nArray, nLen, dArray ); }

  return redscale.divideKnuth( nArray, nLen, dArray, dLen );
};

/**
 * Binary GCD - Returns an array representing the GCD.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.binaryGCD = function( aArray, bArray ) {
  var aZero = redscale.numberTrailingZeroes( aArray ),
      bZero = redscale.numberTrailingZeroes( bArray ),
      shiftNum = Math.min( aZero, bZero ),
      temp;

  aArray = redscale.bitShiftRight( aArray, aZero );
  bArray = redscale.bitShiftRight( bArray, bZero );

  while ( !redscale.isZero( bArray ) ) {
    var abComp;

    if ( !redscale.isOdd( bArray ) ) {
      bArray = redscale.bitShiftRight( bArray, redscale.numberTrailingZeroes( bArray ) );
    } else {
      abComp = redscale.compare( aArray, bArray );

      if ( abComp === 1 ) {
        temp = redscale.subtract( aArray, bArray );
        aArray = bArray;
        bArray = temp;
      } else {
        bArray = redscale.subtract( bArray, aArray );
      }
    }
  }

  return redscale.bitShiftLeft( aArray, shiftNum, 0 );
};

/**
 * GCD - Returns an array representing the GCD.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.gcd = function( aArray, bArray ) {
  var temp;

  while ( Math.abs( aArray.length - bArray.length ) > 1 && !redscale.isZero( bArray ) ) {
    temp = redscale.divide( aArray, bArray );
    aArray = bArray;
    bArray = temp[1];
  }

  if ( redscale.isZero( bArray ) ) { return aArray; }

  return redscale.binaryGCD( aArray, bArray );
};

/**
 * Lowest Common Multiple
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.lcm = function( aArray, bArray ) {
  return redscale.multiply( redscale.divide( redscale.gcd( aArray, bArray ), aArray)[0], bArray );
};

/**
 * Square - Returns the square of an array.
 * @param {!Int16Array|Array} aArray
 * @returns {!Int16Array}
 */
redscale.square = function( aArray ) {
  var aLen = aArray.length,
      pLen = aLen * 2,
      pArray = new Int16Array( pLen ),
      carry = 0,
      prod,
      sum,
      aVal,
      aIndex,
      pIndex;

  /**
   * Multiply Add Carry Add
   * @param {!Int16Array} pArray
   * @param {!number} pIndex
   * @param {!Int16Array} aArray
   * @param {!number} aIndex
   * @param {!number} aLen
   * @returns {!number}
   */
  var multiplyAddAdd = function( pArray, pIndex, aArray, aIndex, aLen ) {
    var aVal = aArray[aIndex++] & redscale.INT16_MASK,
        carry = 0,
        prod;

    for ( ; aIndex < aLen; aIndex++, pIndex++ ) {
      prod = ((aArray[aIndex] & redscale.INT16_MASK) * aVal + (pArray[pIndex] & redscale.INT16_MASK) + carry);
      pArray[pIndex] = prod & redscale.INT16_MASK;
      carry = prod >>> 16;
    }

    while ( carry ) {
      sum = (pArray[pIndex] & redscale.INT16_MASK) + carry;
      pArray[pIndex++] = sum & redscale.INT16_MASK;
      carry = sum >>> 16;
    }

    return carry;
  };

  if ( redscale.isZero( aArray ) ) { return new Int16Array( 0 ); }

  if ( aLen > 120 ) { return redscale.squareKaratsuba( aArray, aLen ) }

  for ( aIndex = aLen - 1, pIndex = pLen - 1; aIndex >= 0; aIndex-- ) {
    aVal = aArray[aIndex] & redscale.INT16_MASK;
    prod = aVal * aVal;
    pArray[pIndex--] = ((prod >>> 17) | carry) & redscale.INT16_MASK;
    pArray[pIndex--] = (prod >>> 1) & redscale.INT16_MASK;
    carry = (prod << 15) & 0xFFFF;
  }

  for ( aIndex = 0, pIndex = 1; aIndex < aLen; aIndex++, pIndex += 2 ) {
    multiplyAddAdd( pArray, pIndex, aArray, aIndex, aLen );
  }

  pArray = redscale.bitShiftLeft( pArray, 1, 0 );
  pArray[0] |= aArray[0] & 1;

  return pArray;
};

/**
 * Square:Karatsuba
 * @param {!Int16Array} aArray
 * @param {!number} aLen
 * @returns {!Int16Array}
 */
redscale.squareKaratsuba = function( aArray, aLen ) {
  var kLen = (aLen + 1) >>> 1,
      aHigh,
      aLow,
      aHighSqr,
      aLowSqr;

  var highNum = function( aArray, aLen, kLen ) {
    var highArray;

    if ( aLen <= kLen ) { return new Int16Array( 0 ); }

    highArray = new Int16Array( aLen - kLen );
    redscale.copy( aArray, kLen, highArray, 0, aLen - kLen );

    return highArray;
  };

  var lowNum = function( aArray, aLen, kLen ) {
    var lowArray;

    if ( aLen <= kLen) { return aArray; }

    lowArray = new Int16Array( kLen );
    redscale.copy( aArray, 0, lowArray, 0, kLen );

    return redscale.trimLeadingZeroes( lowArray );
  };

  aHigh = highNum( aArray, aLen, kLen );
  aLow = lowNum( aArray, aLen, kLen );
  aHighSqr = redscale.square( aHigh );
  aLowSqr = redscale.square( aLow );

  return redscale.add(
           redscale.bitShiftLeft(
             redscale.add(
               redscale.bitShiftLeft( aHighSqr, kLen * 16, 0 ),
               redscale.subtract(
                 redscale.square( redscale.add( aHigh, aLow) ),
                 redscale.add( aHighSqr, aLowSqr ))), kLen * 16, 0 ),
           aLowSqr );
};

/**
 * Power - Returns an array representing aArray raised to the power of expoNum.
 * @param {!Int16Array} aArray
 * @param {number} expoNum
 * @returns {!Int16Array}
 */
redscale.pow = function( aArray, expoNum ) {
  var aZero = redscale.numberTrailingZeroes( aArray ),
      aNorm = new Int16Array( aArray ),
      expoCount = expoNum,
      rArray;

  if ( aNorm.length === 1 && aNorm[0] === 1 ) { return redscale.bitShiftRight( aNorm, aZero * expoNum ); }

  rArray = new Int16Array([1]);

  while ( expoCount ) {
    if ( (expoCount & 1) === 1 ) {  rArray = redscale.multiply( rArray, aNorm ); }

    expoCount >>>= 1;

    if ( expoCount ) { aNorm = redscale.square( aNorm ); }
  }

  return rArray;
};

/**
 * Mod
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.mod = function( aArray, aSign, bArray ) {
  var rArray = redscale.divide( aArray, bArray )[1],
      rSign = redscale.isZero( rArray ) ? 0 : aSign;

  if (rSign === -1 ) {
    rArray = redscale.subtract( bArray, rArray );
  }

  return rArray;
};

/**
 * Mod Binary Power of 2
 * @param {!Int16Array} aArray
 * @param {!number} aMod
 * @returns {!Int16Array}
 */
redscale.modBinary = function( aArray, aMod ) {
  var aLen = aArray.length * 16,
      aZero = redscale.numberLeadingZeroes( aArray ),
      aInt = (aMod >>> 4) + 1,
      aBit = aMod & 0xF,
      rArray;

  if ( (aLen - aZero) <= aMod ) {
    return aArray;
  }

  rArray = redscale.copy( aArray, 0 , new Int16Array( aInt ), 0, aInt );
  rArray[aInt - 1] &= (1 << (16 - aBit)) - 1;

  return rArray;
};

/**
 * Mod Montgomery
 * @param {!Int16Array} aArray
 * @param {!Int16Array} mArray
 * @param {!Int16Array} mInvDigit
 * @param {!number} mLen
 * @returns {!Int16Array}
 */
redscale.modMontgomery = function( aArray, mArray, mInvDigit, mLen ) {
  var aLen = aArray.length,
      aIndex;

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    var result = redscale.multiply( aArray[aIndex], mInvDigit )[0];

    aArray = redscale.add( aArray, redscale.bitShiftRight( redscale.multiply( mArray, [result] ), 16 * aIndex ) );
  }

  aArray = redscale.bitShiftRight( aArray, mLen );

  while ( redscale.compare( aArray, mArray ) !== -1 ) {
    aArray = redscale.subtract( aArray, mArray );
  }

  return aArray;
};

/**
 * Mod Barrett
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} mArray
 * @param {!Int16Array} uArray
 * @returns {!Int16Array}
 */
redscale.modBarrett = function( aArray, aSign, mArray, uArray ) {
  var mLen = mArray.length,
      bArray,
      qArray,
      rArray;

  /**
   * Partial Multiply
   * @param {!Int16Array} aArray
   * @param {!Int16Array} bArray
   * @returns {!Int16Array}
   */
  var partialMultiply = function( aArray, bArray ) {
    return redscale.multiply( aArray, bArray );
  };

  /**
   * Mod Bit Strip
   * @param {!Int16Array} nArray
   * @param {!number} mLen
   * @returns {!Int16Array}
   */
  var modBitStrip = function( nArray, mLen ) {
    if ( nArray.length > mLen + 1 ) {
      nArray = redscale.copy( nArray, 0, new Int16Array( mLen + 1 ), 0, mLen + 1 );
    }

    return nArray;
  };

  qArray = redscale.bitShiftRight( aArray, (mLen - 1) * 16 );
  qArray = partialMultiply( qArray, uArray );
  qArray = redscale.bitShiftRight( qArray, (mLen + 1) * 16 );
  qArray = modBitStrip( partialMultiply( qArray, mArray ), mLen );
  rArray = modBitStrip( aArray, mLen );

  if ( redscale.compare( rArray, qArray ) >= 0 ) {
    rArray = redscale.subtract( rArray, qArray );
  } else {
    bArray = redscale.bitShiftLeft( new Int16Array( [1] ), (mLen + 1) * 16, 0 );
    rArray = redscale.subtract( redscale.add( rArray, bArray ), qArray );
  }

  while ( redscale.compare( rArray, mArray ) !== -1 ) {
    rArray = redscale.subtract( rArray, mArray );
  }

  return rArray;
};

/**
 * Mod Inverse
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} mArray
 * @returns {!Int16Array}
 */
redscale.modInverse = function( aArray, aSign, mArray ) {
  var mNorm = new Int16Array( mArray ),
      aNorm = new Int16Array( aArray ),
      mSigned = new redscale.SignArray( 1, mArray ),
      bVal = new redscale.SignArray( 0, new Int16Array( 0 ) ),
      dVal = new redscale.SignArray( 1, new Int16Array( [1] ) );

  while( !redscale.isZero( mNorm ) ) {
    while ( redscale.isEven( mNorm ) ) {
      mNorm = redscale.bitShiftRight( mNorm, 1 );

      if ( redscale.isOdd( bVal.array ) ) {
        bVal = redscale.SignArray.signSubtract( bVal, mSigned );
      }

      bVal.array = redscale.bitShiftRight( bVal.array, 1 );

      if ( !bVal.array.length ) {
        bVal.sign = 0;
      }
    }

    while ( redscale.isEven( aNorm ) ) {
      aNorm = redscale.bitShiftRight( aNorm, 1 );

      if ( redscale.isOdd( dVal.array ) ) {
        dVal = redscale.SignArray.signSubtract( dVal, mSigned );
      }

      dVal.array = redscale.bitShiftRight( dVal.array, 1 );

      if ( !dVal.array.length ) {
        dVal.sign = 0;
      }
    }

    if ( redscale.compare( mNorm, aNorm ) >= 0 ) {
      mNorm = redscale.subtract( mNorm, aNorm );
      bVal = redscale.SignArray.signSubtract( bVal, dVal );
    } else {
      aNorm = redscale.subtract( aNorm, mNorm );
      dVal = redscale.SignArray.signSubtract( dVal, bVal );
    }
  }

  if ( dVal.sign < aSign ) {
    redscale.SignArray.signAdd( dVal, mSigned );
  } else if ( dVal.sign > aSign ) {
    redscale.SignArray.signSubtract( dVal, mSigned );
  }

  return dVal.array;
};

/**
 * Mod Inverse Int16
 * @param {!number} aVal
 * @returns {!number}
 */
redscale.modInverseInt16 = function( aVal ) {
  var rVal;

  aVal = aVal & 0xFFFF;
  rVal = aVal;

  rVal *= (2 - (rVal * aVal)) & 0xF;
  rVal *= (2 - (rVal * aVal)) & 0xFF;
  rVal *= (2 - (rVal * aVal)) & 0xFFF;
  rVal *= (2 - (rVal * aVal)) & 0xFFFF;

  return rVal & 0xFFFF;
};

/**
 * Mod Pow
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} aExpo
 * @param {!Int16Array} aMod
 * @returns {!Int16Array}
 */
redscale.modPow = function( aArray, aSign, aExpo, aMod ) {
  var aLen = aArray.length,
      eLen = aExpo.length;

  if ( eLen > 1 || aLen * aExpo[0] > 256 ) {
    return redscale.modPowMontgomery( aArray, aSign, aExpo, aMod );
  } else {
    return redscale.modPowStandard( aArray, aSign, aExpo, aMod );
  }
};

/**
 * Mod Pow Standard
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} aExpo
 * @param {!Int16Array} aMod
 * @returns {!Int16Array}
 */
redscale.modPowStandard = function( aArray, aSign, aExpo, aMod ) {
  var rArray = new Int16Array( [1] );

  while ( !redscale.isZero( aExpo ) ) {
    if ( redscale.isOdd( aExpo ) ) { rArray = redscale.mod( redscale.multiply( aArray, rArray ), 1, aMod ); }

    aExpo = redscale.bitShiftRight( aExpo, 1 );
    aArray = redscale.mod( redscale.square( aArray ), 1, aMod );
  }

  if ( aSign < 0 ) { rArray = redscale.subtract( aMod, rArray ); }

  return rArray;
};

/**
 * Mod Pow Montgomery
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} aExpo
 * @param {!Int16Array} aMod
 * @returns {!Int16Array}
 */
redscale.modPowMontgomery = function( aArray, aSign, aExpo, aMod ) {
  var trailingZeroes = redscale.numberTrailingZeroes( aMod ),
      oMod,
      eMod,
      oModInv,
      eModInv,
      oResult,
      eResult,
      rArray;

  /**
   * Odd Mod Function
   * @param {!Int16Array} aArray
   * @param {!number} aSign
   * @param {!Int16Array} aExpo
   * @param {!Int16Array} oMod
   */
  var oddMod = function( aArray, aSign, aExpo, oMod ) {
    var mInvDigit = new Int16Array( redscale.modInverseInt16( -oMod[0] ) ),
        eLen = aExpo.length,
        mLen = oMod.length,
        aMontArray = redscale.bitShiftLeft( aArray, mLen * 16, 0 ),
        eIndex,
        wIndex,
        wVal = eLen < 8 ? 1 : eLen < 32 ? 2 : eLen < 128 ? 3 : eLen < 512 ? 4 : eLen < 1536 ? 5 : 6,
        wLen = (1 << wVal) - 1,
        wLeadingZeroes = redscale.intLeadingZeroes( aExpo[eLen - 1] ),
        wBits = (eLen * 16) - wLeadingZeroes,
        wArray = new Array( wLen ),
        wBase = redscale.modMontgomery( aMontArray, oMod, mInvDigit, mLen ),
        wBaseSqr = redscale.modMontgomery( redscale.square( wBase ), oMod, mInvDigit, mLen ),
        wBuffer,
        wBufferLen,
        wMask,
        wShift,
        wSqr,
        rArray,
        remainingBits,
        nonZeroShift;

    wArray[1] = wBase;

    for ( wIndex = 3; wIndex < wLen; wIndex += 2 ) {
      wArray[wIndex] = redscale.modMontgomery( redscale.multiply( wArray[wIndex - 2], wBaseSqr), oMod, mInvDigit, mLen );
    }

    wMask = wLen;
    nonZeroShift = 16 - wLeadingZeroes - wVal;
    remainingBits = wBits;
    eIndex = eLen - 1;

    if ( nonZeroShift < 0 ) {
      wBuffer = ((aExpo[eIndex] << -nonZeroShift) & wMask) & ((aExpo[eIndex - 1] >>> nonZeroShift + 16) & wMask);
    } else {
      wBuffer = (aExpo[eIndex] >>> nonZeroShift) & wMask;
    }

    wBufferLen = wVal;
    wSqr = 0;

    while ( (wBuffer & 1) === 0 ) {
      wBuffer >>>= 1;
      wBufferLen--;
      wSqr++;
    }

    rArray = redscale.copy( wArray[wBuffer], 0, new Int16Array( wArray[wBuffer].length ), 0, wArray[wBuffer].length );

    while ( wSqr-- ) {
      rArray = redscale.modMontgomery( redscale.square( rArray ), oMod, mInvDigit, mLen );
    }

    wShift = nonZeroShift - wVal - 1;

    if ( wShift <= 0 ) {
      wShift += 16;
      eIndex--;
    }

    while ( remainingBits >= wVal ) {
      var eBit = (aExpo[eIndex] >>> wShift) & 1;

      if ( eBit ) {
        nonZeroShift = wShift + 1 - wVal;
        wSqr = 0;

        if ( nonZeroShift < 0 ) {
          wBuffer = ((aExpo[eIndex] << -nonZeroShift) & wMask) & ((aExpo[eIndex - 1] >>> nonZeroShift + 16) & wMask);
        } else {
          wBuffer = (aExpo[eIndex] >>> nonZeroShift) & wMask;
        }

        wBufferLen = wVal;

        while ( (wBuffer & 1) === 0 ) {
          wBuffer >>>= 1;
          wBufferLen--;
          wSqr++;
        }

        while ( wBufferLen-- ) {
          aMontArray = redscale.modMontgomery( redscale.square( aMontArray ), oMod, mInvDigit, mLen );
        }

        rArray = redscale.modMontgomery( redscale.multiply( rArray, wArray[wBuffer] ), oMod, mInvDigit, mLen );

        while ( wSqr-- ) {
          aMontArray = redscale.modMontgomery( redscale.square( aMontArray ), oMod, mInvDigit, mLen );
        }

        wShift -= wVal;

        if ( wShift <= 0 ) {
          wShift += 16;
          eIndex--;
        }
      } else {
        rArray = redscale.modMontgomery( redscale.square( rArray ), oMod, mInvDigit, mLen );

        wShift--;

        if ( wShift <= 0 ) {
          wShift += 16;
          eIndex--;
        }
      }

      wShift += wVal;
    }

    return rArray;
  };

  /**
   * Even Mod Function
   * @param {!Int16Array} aArray
   * @param {!Int16Array} aExpo
   * @param {!number} trailingZeroes
   */
  var evenMod = function( aArray, aExpo, trailingZeroes ) {
    var eArray = new Int16Array( [1] );

    aArray = redscale.modBinary( aArray, trailingZeroes );

    while ( !redscale.isZero( aExpo ) ) {
      if ( redscale.isOdd( aExpo ) ) {
        eArray = redscale.modBinary( redscale.multiply( aArray, eArray ), trailingZeroes );
      }

      aExpo = redscale.bitShiftRight( aExpo, 1 );
      aArray = redscale.modBinary( redscale.square( aArray ), trailingZeroes );
    }

    return eArray;
  };

  if ( !trailingZeroes ) {
    rArray = oddMod( aArray, aSign, aExpo, aMod );
  } else {
    oMod = redscale.bitShiftRight( aMod, trailingZeroes );
    eMod = redscale.bitShiftLeft( new Int16Array( [1] ), trailingZeroes, 0 );

    oResult = oddMod( aArray, aSign, aExpo, oMod );
    eResult = evenMod( aArray, aExpo, trailingZeroes );

    oModInv = redscale.modInverse( oMod, 1, eMod );
    eModInv = redscale.modInverse( eMod, 1, oMod );
  }

  return rArray;
};

/**
 * Mod Pow Garner
 * @param {!Int16Array} cryptArray
 * @param {!Int16Array} nArray
 * @param {!Int16Array} pArray
 * @param {!Int16Array} qArray
 * @param {!Int16Array} secPArray
 * @param {!Int16Array} secQArray
 * @param {!Int16Array} pInvArray
 * @returns {!Int16Array}
 */
redscale.modPowGarner = function( cryptArray, nArray, pArray, qArray, secPArray, secQArray, pInvArray ) {
  var cpArray = redscale.mod( cryptArray, 1, pArray ),
      cqArray = redscale.mod( cryptArray, 1, qArray ),
      mpArray = redscale.modPow( cpArray, 1, secPArray, pArray ),
      mqArray = redscale.modPow( cqArray, 1, secQArray, qArray ),
      mArray;

  if ( redscale.compare( mpArray, mqArray ) !== -1 ) {
    mArray = redscale.mod( redscale.subtract( mqArray, mpArray ), 1, qArray );
  } else {
    mArray = redscale.mod( redscale.subtract( redscale.add( mqArray, pArray ), mpArray ), 1, qArray );
  }

  mArray = redscale.mod( redscale.multiply( mArray, pInvArray ), 1, qArray );
  mArray = redscale.mod( redscale.multiply( mArray, pArray ), 1, nArray );

  return redscale.mod( redscale.add( mArray, mpArray ), 1, nArray );
};

redscale.and = function( aArray, aSign, bArray, bSign ) {

};

redscale.or = function( aArray, aSign, bArray, bSign ) {

};

redscale.xor = function( aArray, aSign, bArray, bSign ) {

};

redscale.not = function( aArray, aSign ) {

};

/**
 * toInt32 - Returns a number equal to the Unsigned 32bit value of
 *     the least significant integers of an array.
 * @param {!Int16Array} aArray
 * @returns {!number}
 */
redscale.toInt32 = function( aArray ) {
  var
  aHigh = aArray[1] || 0,
  aLow = aArray[0] || 0;

  return ((aHigh & redscale.INT16_MASK) * 65536) + (aLow & redscale.INT16_MASK);
};

/**
 * toString - Returns a string representing the precise value of an array and signum.
 * @param {!number} aSigNum
 * @param {!Int16Array} aArray
 * @param {!number} radix
 * @returns {!string}
 */
redscale.toString = function( aSigNum, aArray, radix ) {
  var aRadix = (2 <= radix && radix <= 36) ? radix : 10,
      aString = "",
      dArray = redscale.RADIX_DIVISOR32_INDEX[aRadix],
      remLen = redscale.RADIX_INT32_INDEX[aRadix],
      quotRem = redscale.divide( aArray, dArray ),
      strVal = redscale.toInt32( quotRem[1] ).toString( aRadix );

  while ( !redscale.isZero( quotRem[0] ) ) {
    aString = redscale.ZERO_STRING.slice( 0, (remLen - strVal.length) ) + strVal + aString;
    quotRem = redscale.divide( quotRem[0], dArray );
    strVal = redscale.toInt32( quotRem[1] ).toString( aRadix );
  }

  aString = strVal + aString;

  if ( aSigNum < 0 ) { aString = "-" + aString; }

  return aString;
};

/**
 * toNumber - Returns the closest precision representation possible
 *     of an array and signum as a native JS number.
 *     Precise if Number.isSafeInteger(result).
 * @param {!number} aSigNum
 * @param {!Int16Array} aArray
 * @returns {!number}
 */
redscale.toNumber = function( aSigNum, aArray ) {
  var aLen = aArray.length,
      aVal = aArray[aLen - 1] & redscale.INT16_MASK,
      aIndex;

  if ( aLen > 64 ) { return Infinity * aSigNum; }

  for ( aIndex = aLen - 2; aIndex >= 0; aIndex-- ) {
    aVal *= 65536;
    aVal += aArray[aIndex] & redscale.INT16_MASK;
  }

  return aVal * aSigNum;
};

/**
 * fromString - Returns an array representing the value of the string with the given radix.
 * @param {!string} aString
 * @param {!number} radix
 * @returns {!Int16Array}
 * @throws {Error}
 */
redscale.fromString = function( aString, radix ) {
  var INT16_MASK = redscale.INT16_MASK,
      aStrLen = aString.length,
      aLen = (aStrLen * redscale.RADIX_BIT_INDEX[radix] + 16) >>> 4,
      aArray = new Int16Array( aLen ),
      radixMul = redscale.RADIX_DIVISOR16_INDEX[radix],
      radixLen = redscale.RADIX_INT16_INDEX[radix],
      aStrIndex = 0,
      aStrSlice = (aStrLen % radixLen) || radixLen,
      aVal,
      carry,
      aIndex;

  aVal = parseInt( aString.slice( aStrIndex, aStrSlice ), radix );
  aArray[0] = aVal;

  for ( aStrIndex += aStrSlice; aStrIndex < aStrLen; aStrIndex += radixLen ) {
    aVal = parseInt( aString.slice( aStrIndex, aStrIndex + radixLen ), radix );

    if ( Number.isNaN( aVal ) ) { throw new Error( "RedScale: Is not a number." ) }

    carry = 0;

    for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
      var
        prod = (aArray[aIndex] & INT16_MASK) * radixMul + carry;

      aArray[aIndex] = prod & INT16_MASK;
      carry = prod >>> 16;
    }

    carry = aVal;

    for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
      var
        sum = (aArray[aIndex] & INT16_MASK) + carry;

      aArray[aIndex] = sum & INT16_MASK;
      carry = sum >>> 16;
    }
  }

  return redscale.trimLeadingZeroes( aArray );
};

/**
 * fromNumber - Returns an array representing the value of a number.
 * @param {!number} aNum
 * @returns {!Int16Array}
 */
redscale.fromSafeNumber = function( aNum ) {
  var aArray = new Int16Array(4),
      aIndex = 0;

  while ( aNum !== 0 ) {
    aArray[aIndex++] = aNum % 65536;
    aNum = aNum / 65536;
  }

  return redscale.trimLeadingZeroes( aArray );
};

/**
 * fromExpoNumber - Returns an array representing the value of a number
 *     that is greater than Integer.MAX_SAFE_INTEGER.
 * @param {!number} aNum
 * @returns {!Int16Array}
 */
redscale.fromExpoNumber = function( aNum ) {
  var expNum = aNum.toExponential().match( /[0-9]+([.0-9]+)?/g ),
      numStr = expNum[0].replace( /[.]/, ""),
      numMag = redscale.fromString( numStr, 10 ),
      numExp = parseInt( expNum[1], 10 ),
      numZero = numExp - numStr.length + 1,
      zeroCount = (numZero / 4) | 0,
      aLen = ((numExp + 1) * 3.332 + 32) >>> 4,
      aArray = redscale.copy( numMag, 0, new Int16Array( aLen ), 0, numMag.length ),
      aIndex = 0,
      carry = 0,
      prod;

  while ( zeroCount-- ) {
    for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
      prod = (aArray[aIndex] & redscale.INT16_MASK) * 10000 + carry;

      aArray[aIndex] = prod & redscale.INT16_MASK;
      carry = prod >>> 16;
    }
  }

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    prod = (aArray[aIndex] & redscale.INT16_MASK) * (Math.pow( 10, (numZero % 4) )) + carry;

    aArray[aIndex] = prod & redscale.INT16_MASK;
    carry = prod >>> 16;
  }

  return redscale.trimLeadingZeroes( aArray );
};

/**
 * fromSafeNumber - Returns an array representing the value of a number
 *     this is less than or equal to Integer.MAX_SAFE_INTEGER.
 * @param {!number} aNum
 * @returns {!Int16Array}
 * @throws {Error}
 */
redscale.fromNumber = function( aNum ) {
  if ( !Number.isFinite( aNum ) ) { throw new Error( "RedScale: Number is not finite." )}

  aNum = Math.abs( aNum );

  if ( aNum <= 9007199254740991 ) {
    return redscale.fromSafeNumber( aNum );
  } else {
    return redscale.fromExpoNumber( aNum );
  }
};