goog.provide('redscale.arrays');

/**
 * Int16 Mask
 * @type {number}
 * @const
 */
redscale.arrays.INT16_MASK = 0xFFFF;

/**
 * Int16 Unsigned Mask
 * @type {number}
 * @const
 */
redscale.arrays.INT16_UNSIGNED = 0x8000;

/**
 * Int32 Unsigned Mask
 * @type {number}
 * @const
 */
redscale.arrays.INT32_UNSIGNED = 0x80000000;

/**
 * Int32 Divisor Radix Index
 * @type {Int16Array[]}
 * @const
 */
redscale.arrays.RADIX_DIVISOR32_INDEX =
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
redscale.arrays.RADIX_DIVISOR16_INDEX =
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
redscale.arrays.RADIX_INT32_INDEX =
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
redscale.arrays.RADIX_INT16_INDEX =
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
redscale.arrays.RADIX_BIT_INDEX =
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
redscale.arrays.ZERO_STRING = '00000000000000000000000000000';

/**
 * isZero
 * @param {!Int16Array} aArray
 * @returns {!boolean}
 */
redscale.arrays.isZero = function( aArray ) {
  return aArray.length === 0;
};

/**
 * isOdd
 * @param {!Int16Array} aArray
 * @returns {!boolean}
 */
redscale.arrays.isOdd = function( aArray ) {
  return ((aArray[0] || 0) & 1) === 1;
};

/**
 * isEven
 * @param {!Int16Array} aArray
 * @returns {!boolean}
 */
redscale.arrays.isEven = function( aArray ) {
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
redscale.arrays.copy = function( srcArray, srcStart, tarArray, tarStart, copyLength ) {
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
redscale.arrays.intLeadingZeroes = function( aNum ) {
  var zeroCount = 0;

  aNum &= redscale.arrays.INT16_MASK;
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
redscale.arrays.intTrailingZeroes = function( aNum ) {
  var zeroCount = 0;

  aNum &= redscale.arrays.INT16_MASK;
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
redscale.arrays.numberLeadingZeroes = function( aArray ) {
  var aLen = aArray.length,
      aIndex;

  for ( aIndex = aLen - 1; (aIndex > 0) && (aArray[aIndex] === 0); aIndex-- ) { }

  return ((aLen - 1 - aIndex) << 4) + redscale.arrays.intLeadingZeroes( aArray[aIndex] );
};

/**
 * Array Trailing Zeroes - Counts the number of zeroes from the least significant bit to the last "on" bit.
 * @param {!Int16Array} aArray
 * @returns {!number}
 */
redscale.arrays.numberTrailingZeroes = function( aArray ) {
  var aLen = aArray.length,
      aIndex;

  for ( aIndex = 0; (aIndex < (aLen - 1)) && (aArray[aIndex] === 0); aIndex++ ) { }

  return (aIndex << 4) + redscale.arrays.intTrailingZeroes( aArray[aIndex] );
};

/**
 * Trim Leading Zeroes - Takes an array and removes leading zero integers.
 *     Returns source array if there aren't any leading zeroes.
 *     Returns an empty array if all zeroes.
 * @param {!Int16Array} srcArray
 * @returns {!Int16Array}
 */
redscale.arrays.trimLeadingZeroes = function( srcArray ) {
  var srcLen = srcArray.length,
      tarArray,
      srcIndex;

  if ( redscale.arrays.isZero( srcArray ) || (srcArray[srcLen - 1] !== 0) ) { return srcArray; }

  for ( srcIndex = (srcLen - 1); (srcIndex >= 0) && (srcArray[srcIndex] === 0); srcIndex-- ) { }

  tarArray = new Int16Array(srcIndex + 1);
  redscale.arrays.copy( srcArray, 0, tarArray, 0, srcIndex + 1 );

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
redscale.arrays.bitShiftLeft = function( srcArray, leftShift, padZeroes ) {
  var srcLen = srcArray.length,
      intShift = leftShift >>> 4,
      leftBitShift = leftShift & 0xF,
      rightBitShift = 16 - leftBitShift,
      leadingZeroes = redscale.arrays.numberLeadingZeroes( srcArray ),
      extraShift = (15 + leftBitShift - (leadingZeroes & 0xF)) >>> 4,
      tarLen = srcLen + intShift + extraShift - (leadingZeroes >>> 4) + padZeroes,
      tarArray = new Int16Array(tarLen),
      carry = 0,
      srcIndex,
      tarIndex;

  if ( leftShift === 0 ) { return redscale.arrays.copy( srcArray, 0, tarArray, 0, srcLen ); }

  for ( srcIndex = 0, tarIndex = intShift; srcIndex < srcLen; srcIndex++, tarIndex++ ) {
    var srcVal = srcArray[srcIndex] & redscale.arrays.INT16_MASK;

    tarArray[tarIndex] = ((srcVal << leftBitShift) | carry) & redscale.arrays.INT16_MASK;
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
redscale.arrays.bitShiftRight = function( srcArray, rightShift ) {
  var srcLen = srcArray.length,
      leadingZeroes = redscale.arrays.numberLeadingZeroes( srcArray ),
      intShift = rightShift >>> 4,
      rightBitShift = rightShift & 0xF,
      leftBitShift = 16 - rightBitShift,
      tarLen = srcLen - intShift - (rightBitShift + leadingZeroes >>> 4),
      tarArray = new Int16Array( tarLen < 0 ? 0 : tarLen ),
      carry = 0,
      srcIndex,
      tarIndex;

  if ( rightShift === 0 ) { return redscale.arrays.copy( srcArray, 0, tarArray, 0, srcLen ) }

  for ( srcIndex = intShift, tarIndex = 0; tarIndex < tarLen; srcIndex++, tarIndex++ ) {
    carry = (srcArray[srcIndex + 1] << leftBitShift) & redscale.arrays.INT16_MASK;
    tarArray[tarIndex] = ((srcArray[srcIndex] & redscale.arrays.INT16_MASK) >>> rightBitShift) | carry;
  }

  return tarArray;
};

/**
 * Compare - Compares two arrays. Returns 1 if a is larger, -1 if b is larger, and 0 if they are equal.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!number}
 */
redscale.arrays.compare = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      aIndex;

  if ( aLen > bLen ) { return 1; }
  if ( aLen < bLen ) { return -1; }

  for ( aIndex = aLen - 1; aIndex >= 0; aIndex-- ) {
    var aVal = (aArray[aIndex] & redscale.arrays.INT16_MASK),
        bVal = (bArray[aIndex] & redscale.arrays.INT16_MASK);

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
redscale.arrays.add = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      sArray = new Int16Array( Math.max( aLen, bLen ) + 1 ),
      sIndex = 0,
      carry = 0,
      sum;

  redscale.arrays.copy( aArray, 0, sArray, 0, aLen );

  while ( sIndex < bLen ) {
    sum = (sArray[sIndex] & redscale.arrays.INT16_MASK) + (bArray[sIndex] & redscale.arrays.INT16_MASK) + carry;
    sArray[sIndex++] = sum & redscale.arrays.INT16_MASK;
    carry = sum >>> 16;
  }

  while ( carry ) {
    sum = (sArray[sIndex] & redscale.arrays.INT16_MASK) + carry;
    sArray[sIndex++] = sum & redscale.arrays.INT16_MASK;
    carry = sum >>> 16;
  }

  return redscale.arrays.trimLeadingZeroes( sArray );
};

/**
 * Subtract - Returns an array representation of the difference.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.arrays.subtract = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      dArray = new Int16Array( aLen ),
      dIndex = 0,
      carry = 0,
      diff;

  redscale.arrays.copy( aArray, 0, dArray, 0, aLen );

  while ( dIndex < bLen ) {
    diff = (dArray[dIndex] & redscale.arrays.INT16_MASK) - (bArray[dIndex] & redscale.arrays.INT16_MASK) + carry;
    dArray[dIndex++] = diff & redscale.arrays.INT16_MASK;
    carry = diff >> 16;
  }

  while ( carry ) {
    diff = (dArray[dIndex] & redscale.arrays.INT16_MASK) + carry;
    dArray[dIndex++] = diff & redscale.arrays.INT16_MASK;
    carry = diff >> 16;
  }

  return redscale.arrays.trimLeadingZeroes( dArray );
};

/**
 * Multiply - Returns an array representation of the product.
 * @param {!Int16Array} aArray
 * @param {!Int16Array|[]} bArray
 * @returns {!Int16Array}
 */
redscale.arrays.multiply = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      pArray,
      aIndex;

  if ( aLen > 120 && bLen > 120 ) { return redscale.arrays.multiplyKaratsuba( aArray, aLen, bArray, bLen )}

  pArray = new Int16Array( aLen + bLen );

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    var carry = 0,
        pIndex,
        bIndex;

    for ( bIndex = 0, pIndex = aIndex; bIndex < bLen; bIndex++, pIndex++ ) {
      var product = (aArray[aIndex] & redscale.arrays.INT16_MASK) * (bArray[bIndex] & redscale.arrays.INT16_MASK)
                  + (pArray[pIndex] & redscale.arrays.INT16_MASK) + carry;

      pArray[pIndex] = product & redscale.arrays.INT16_MASK;
      carry = product >>> 16;
    }

    pArray[aIndex + bLen] = carry;
  }

  return redscale.arrays.trimLeadingZeroes( pArray );
};

/**
 * Multiply Karatsuba - Returns an array representation of the product.
 * @param {Int16Array} aArray
 * @param {number} aLen
 * @param {Int16Array} bArray
 * @param {number} bLen
 * @returns {Int16Array}
 */
redscale.arrays.multiplyKaratsuba = function( aArray, aLen, bArray, bLen ) {
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
    redscale.arrays.copy( aArray, kLen, highArray, 0, aLen - kLen );

    return highArray;
  };

  var lowNum = function( aArray, aLen, kLen ) {
    var lowArray;

    if ( aLen <= kLen) { return aArray; }

    lowArray = new Int16Array( kLen );
    redscale.arrays.copy( aArray, 0, lowArray, 0, kLen );

    return redscale.arrays.trimLeadingZeroes( lowArray );
  };

  aHigh = highNum( aArray, aLen, kLen );
  aLow = lowNum( aArray, aLen, kLen );
  bHigh = highNum( bArray, bLen, kLen );
  bLow = lowNum( bArray, bLen, kLen );

  prodHigh = redscale.arrays.multiply( aHigh, bHigh );
  prodLow = redscale.arrays.multiply( aLow, bLow );
  prodHighLow = redscale.arrays.multiply( redscale.arrays.add( aHigh, aLow ), redscale.arrays.add( bHigh, bLow ) );

  return redscale.arrays.add(
           redscale.arrays.bitShiftLeft(
             redscale.arrays.add(
               redscale.arrays.bitShiftLeft( prodHigh, 16 * kLen, 0 ),
               redscale.arrays.subtract(
                 redscale.arrays.subtract( prodHighLow, prodHigh ),
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
redscale.arrays.divideBy1n = function( nArray, nLen, dArray ) {
  var shiftNum,
      dInt32,
      qArray,
      quot,
      rem,
      nIndex;

  if ( nLen === 1 ) {
    quot = ((nArray[0] & redscale.arrays.INT16_MASK) / (dArray[0] & redscale.arrays.INT16_MASK)) | 0;
    rem = (nArray[0] & redscale.arrays.INT16_MASK) % (dArray[0] & redscale.arrays.INT16_MASK);

    return [new Int16Array( [quot] ), new Int16Array( rem === 0 ? 0 : [rem] )]
  }

  dInt32 = dArray[0] & redscale.arrays.INT16_MASK;
  shiftNum = redscale.arrays.intLeadingZeroes( dInt32 );
  qArray = new Int16Array( nLen );
  rem = nArray[nLen - 1] & redscale.arrays.INT16_MASK;

  if ( rem >= dInt32 ) {
    qArray[nLen - 1] = (rem / dInt32) & redscale.arrays.INT16_MASK;
    rem = (rem % dInt32) & redscale.arrays.INT16_MASK;
  }

  for ( nIndex = nLen - 2; nIndex >= 0; nIndex-- ) {
    var nVal = (rem * 65536) + (nArray[nIndex] & redscale.arrays.INT16_MASK);

    qArray[nIndex] = (nVal / dInt32) & redscale.arrays.INT16_MASK;
    rem = (nVal % dInt32) & redscale.arrays.INT16_MASK;
  }

  if ( shiftNum > 0 ) { rem %= dInt32 }

  return [redscale.arrays.trimLeadingZeroes( qArray ), new Int16Array( rem === 0 ? 0 : [rem] )];
};

/**
 * Knuth Division - Returns an Array of Arrays representing the quotient and remainder.
 * @param {!Int16Array} nArray
 * @param {!number} nLen
 * @param {!Int16Array} dArray
 * @param {!number} dLen
 * @returns {!Int16Array[]}
 */
redscale.arrays.divideKnuth = function( nArray, nLen, dArray, dLen ) {
  var INT16_MASK = redscale.arrays.INT16_MASK,
      qLen = nLen - dLen + 1,
      shiftNum = redscale.arrays.intLeadingZeroes( dArray[dLen - 1] ),
      aArray = redscale.arrays.bitShiftLeft( nArray, shiftNum, 1 ),
      bArray = redscale.arrays.bitShiftLeft( dArray, shiftNum, 0 ),
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

  return [redscale.arrays.trimLeadingZeroes( qArray ), redscale.arrays.bitShiftRight( aArray, shiftNum )];
};

/**
 * Divide - Returns an Array of Arrays representing the quotient and remainder.
 * @param {!Int16Array} nArray
 * @param {!Int16Array} dArray
 * @returns {!Int16Array[]}
 */
redscale.arrays.divide = function( nArray, dArray ) {
  var nLen = nArray.length,
      dLen = dArray.length,
      ndComp = redscale.arrays.compare( nArray, dArray );

  if ( redscale.arrays.isZero( dArray ) ) { throw new Error( "Division by zero." ) }
  if ( redscale.arrays.isZero( nArray ) ) { return [new Int16Array( 0 ), new Int16Array( 0 )]; }
  if ( ndComp === 0 ) { return [new Int16Array( [1] ), new Int16Array( 0 )]; }
  if ( ndComp === -1 ) { return [new Int16Array( 0 ), new Int16Array( nArray )]; }
  if ( dLen === 1 ) { return redscale.arrays.divideBy1n( nArray, nLen, dArray ); }

  return redscale.arrays.divideKnuth( nArray, nLen, dArray, dLen );
};

/**
 * Binary GCD - Returns an array representing the GCD.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.arrays.binaryGCD = function( aArray, bArray ) {
  var aZero = redscale.arrays.numberTrailingZeroes( aArray ),
      bZero = redscale.arrays.numberTrailingZeroes( bArray ),
      shiftNum = Math.min( aZero, bZero ),
      temp;

  aArray = redscale.arrays.bitShiftRight( aArray, aZero );
  bArray = redscale.arrays.bitShiftRight( bArray, bZero );

  while ( !redscale.arrays.isZero( bArray ) ) {
    var abComp;

    if ( !redscale.arrays.isOdd( bArray ) ) {
      bArray = redscale.arrays.bitShiftRight( bArray, redscale.arrays.numberTrailingZeroes( bArray ) );
    } else {
      abComp = redscale.arrays.compare( aArray, bArray );

      if ( abComp === 1 ) {
        temp = redscale.arrays.subtract( aArray, bArray );
        aArray = bArray;
        bArray = temp;
      } else {
        bArray = redscale.arrays.subtract( bArray, aArray );
      }
    }
  }

  return redscale.arrays.bitShiftLeft( aArray, shiftNum, 0 );
};

/**
 * GCD - Returns an array representing the GCD.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.arrays.gcd = function( aArray, bArray ) {
  var temp;

  while ( Math.abs( aArray.length - bArray.length ) > 1 && !redscale.arrays.isZero( bArray ) ) {
    temp = redscale.arrays.divide( aArray, bArray );
    aArray = bArray;
    bArray = temp[1];
  }

  if ( redscale.arrays.isZero( bArray ) ) { return aArray; }

  return redscale.arrays.binaryGCD( aArray, bArray );
};

/**
 * Lowest Common Multiple
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.arrays.lcm = function( aArray, bArray ) {
  return redscale.arrays.multiply( redscale.arrays.divide( redscale.arrays.gcd( aArray, bArray ), aArray)[0], bArray );
};

/**
 * Square - Returns the square of an array.
 * @param {!Int16Array|Array} aArray
 * @returns {!Int16Array}
 */
redscale.arrays.square = function( aArray ) {
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
    var aVal = aArray[aIndex++] & redscale.arrays.INT16_MASK,
        carry = 0,
        prod;

    for ( ; aIndex < aLen; aIndex++, pIndex++ ) {
      prod = (aArray[aIndex] & redscale.arrays.INT16_MASK) * aVal +
             (pArray[pIndex] & redscale.arrays.INT16_MASK) + carry;
      pArray[pIndex] = prod & redscale.arrays.INT16_MASK;
      carry = prod >>> 16;
    }

    while ( carry ) {
      sum = (pArray[pIndex] & redscale.arrays.INT16_MASK) + carry;
      pArray[pIndex++] = sum & redscale.arrays.INT16_MASK;
      carry = sum >>> 16;
    }

    return carry;
  };

  if ( redscale.arrays.isZero( aArray ) ) { return new Int16Array( 0 ); }

  if ( aLen > 120 ) { return redscale.arrays.squareKaratsuba( aArray, aLen ) }

  for ( aIndex = aLen - 1, pIndex = pLen - 1; aIndex >= 0; aIndex-- ) {
    aVal = aArray[aIndex] & redscale.arrays.INT16_MASK;
    prod = aVal * aVal;
    pArray[pIndex--] = ((prod >>> 17) | carry) & redscale.arrays.INT16_MASK;
    pArray[pIndex--] = (prod >>> 1) & redscale.arrays.INT16_MASK;
    carry = (prod << 15) & 0xFFFF;
  }

  for ( aIndex = 0, pIndex = 1; aIndex < aLen; aIndex++, pIndex += 2 ) {
    multiplyAddAdd( pArray, pIndex, aArray, aIndex, aLen );
  }

  pArray = redscale.arrays.bitShiftLeft( pArray, 1, 0 );
  pArray[0] |= aArray[0] & 1;

  return pArray;
};

/**
 * Square:Karatsuba
 * @param {!Int16Array} aArray
 * @param {!number} aLen
 * @returns {!Int16Array}
 */
redscale.arrays.squareKaratsuba = function( aArray, aLen ) {
  var kLen = (aLen + 1) >>> 1,
      aHigh,
      aLow,
      aHighSqr,
      aLowSqr;

  var highNum = function( aArray, aLen, kLen ) {
    var highArray;

    if ( aLen <= kLen ) { return new Int16Array( 0 ); }

    highArray = new Int16Array( aLen - kLen );
    redscale.arrays.copy( aArray, kLen, highArray, 0, aLen - kLen );

    return highArray;
  };

  var lowNum = function( aArray, aLen, kLen ) {
    var lowArray;

    if ( aLen <= kLen) { return aArray; }

    lowArray = new Int16Array( kLen );
    redscale.arrays.copy( aArray, 0, lowArray, 0, kLen );

    return redscale.arrays.trimLeadingZeroes( lowArray );
  };

  aHigh = highNum( aArray, aLen, kLen );
  aLow = lowNum( aArray, aLen, kLen );
  aHighSqr = redscale.arrays.square( aHigh );
  aLowSqr = redscale.arrays.square( aLow );

  return redscale.arrays.add(
           redscale.arrays.bitShiftLeft(
             redscale.arrays.add(
               redscale.arrays.bitShiftLeft( aHighSqr, kLen * 16, 0 ),
               redscale.arrays.subtract(
                 redscale.arrays.square( redscale.arrays.add( aHigh, aLow) ),
                 redscale.arrays.add( aHighSqr, aLowSqr ))), kLen * 16, 0 ),
           aLowSqr );
};

/**
 * Power - Returns an array representing aArray raised to the power of expoNum.
 * @param {!Int16Array} aArray
 * @param {number} expoNum
 * @returns {!Int16Array}
 */
redscale.arrays.pow = function( aArray, expoNum ) {
  var aZero = redscale.arrays.numberTrailingZeroes( aArray ),
      aNorm = new Int16Array( aArray ),
      expoCount = expoNum,
      rArray;

  if ( aNorm.length === 1 && aNorm[0] === 1 ) { return redscale.arrays.bitShiftRight( aNorm, aZero * expoNum ); }

  rArray = new Int16Array([1]);

  while ( expoCount ) {
    if ( (expoCount & 1) === 1 ) {  rArray = redscale.arrays.multiply( rArray, aNorm ); }

    expoCount >>>= 1;

    if ( expoCount ) { aNorm = redscale.arrays.square( aNorm ); }
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
redscale.arrays.mod = function( aArray, aSign, bArray ) {
  var rArray = redscale.arrays.divide( aArray, bArray )[1],
      rSign = redscale.arrays.isZero( rArray ) ? 0 : aSign;

  if (rSign === -1 ) {
    rArray = redscale.arrays.subtract( bArray, rArray );
  }

  return rArray;
};

/**
 * Mod Binary Power of 2
 * @param {!Int16Array} aArray
 * @param {!number} aMod
 * @returns {!Int16Array}
 */
redscale.arrays.modBinary = function( aArray, aMod ) {
  var aLen = aArray.length * 16,
      aZero = redscale.arrays.numberLeadingZeroes( aArray ),
      aInt = (aMod >>> 4) + 1,
      aBit = aMod & 0xF,
      rArray;

  if ( (aLen - aZero) <= aMod ) {
    return aArray;
  }

  rArray = redscale.arrays.copy( aArray, 0 , new Int16Array( aInt ), 0, aInt );
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
redscale.arrays.modMontgomery = function( aArray, mArray, mInvDigit, mLen ) {
  var aLen = aArray.length,
      aIndex;

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    var result = redscale.arrays.multiply( aArray[aIndex], mInvDigit )[0];

    aArray = redscale.arrays.add( aArray, redscale.arrays.bitShiftRight( redscale.arrays.multiply( mArray, [result] ), 16 * aIndex ) );
  }

  aArray = redscale.arrays.bitShiftRight( aArray, mLen );

  while ( redscale.arrays.compare( aArray, mArray ) !== -1 ) {
    aArray = redscale.arrays.subtract( aArray, mArray );
  }

  return aArray;
};

/**
 * Mod Inverse
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} mArray
 * @returns {!Int16Array}
 */
redscale.arrays.modInverse = function( aArray, aSign, mArray ) {
  var mNorm = new Int16Array( mArray ),
      aNorm = new Int16Array( aArray ),
      mSigned = new redscale.arrays.SignArray( 1, mArray ),
      bVal = new redscale.arrays.SignArray( 0, new Int16Array( 0 ) ),
      dVal = new redscale.arrays.SignArray( 1, new Int16Array( [1] ) );

  while( !redscale.arrays.isZero( mNorm ) ) {
    while ( redscale.arrays.isEven( mNorm ) ) {
      mNorm = redscale.arrays.bitShiftRight( mNorm, 1 );

      if ( redscale.arrays.isOdd( bVal.array ) ) {
        bVal = redscale.arrays.SignArray.signSubtract( bVal, mSigned );
      }

      bVal.array = redscale.arrays.bitShiftRight( bVal.array, 1 );

      if ( !bVal.array.length ) {
        bVal.sign = 0;
      }
    }

    while ( redscale.arrays.isEven( aNorm ) ) {
      aNorm = redscale.arrays.bitShiftRight( aNorm, 1 );

      if ( redscale.arrays.isOdd( dVal.array ) ) {
        dVal = redscale.arrays.SignArray.signSubtract( dVal, mSigned );
      }

      dVal.array = redscale.arrays.bitShiftRight( dVal.array, 1 );

      if ( !dVal.array.length ) {
        dVal.sign = 0;
      }
    }

    if ( redscale.arrays.compare( mNorm, aNorm ) >= 0 ) {
      mNorm = redscale.arrays.subtract( mNorm, aNorm );
      bVal = redscale.arrays.SignArray.signSubtract( bVal, dVal );
    } else {
      aNorm = redscale.arrays.subtract( aNorm, mNorm );
      dVal = redscale.arrays.SignArray.signSubtract( dVal, bVal );
    }
  }

  if ( dVal.sign < aSign ) {
    redscale.arrays.SignArray.signAdd( dVal, mSigned );
  } else if ( dVal.sign > aSign ) {
    redscale.arrays.SignArray.signSubtract( dVal, mSigned );
  }

  return dVal.array;
};

/**
 * Mod Inverse Int16
 * @param {!number} aVal
 * @returns {!number}
 */
redscale.arrays.modInverseInt16 = function( aVal ) {
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
 * @param {!number} aExpoSign
 * @param {!Int16Array} aMod
 * @returns {!Int16Array}
 */
redscale.arrays.modPow = function( aArray, aSign, aExpo, aExpoSign, aMod ) {
  var aLen = aArray.length,
      eLen = aExpo.length;

  if ( eLen > 1 || aLen * aExpo[0] > 256 ) {
    return redscale.arrays.modPowMontgomery( aArray, aSign, aExpo, aExpoSign, aMod );
  } else {
    return redscale.arrays.modPowStandard( aArray, aSign, aExpo, aExpoSign, aMod );
  }
};

/**
 * Mod Pow Standard
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} aExpo
 * @param {!number} aExpoSign
 * @param {!Int16Array} aMod
 * @returns {!Int16Array}
 */
redscale.arrays.modPowStandard = function( aArray, aSign, aExpo, aExpoSign, aMod ) {
  var eLen = aExpo.length,
      eLeadingZeroes = redscale.arrays.intLeadingZeroes( aExpo[eLen - 1] ),
      eBits = (eLen * 16) - eLeadingZeroes,
      eShift = 16 - eLeadingZeroes,
      eIndex = eLen - 1,
      eVal,
      rArray;

  aArray = redscale.arrays.mod( aArray, 1, aMod );
  rArray = redscale.arrays.copy( aArray, 0, new Int16Array( aArray.length ), 0, aArray.length );

  eBits--;
  eShift--;

  if ( eShift < 0 ) {
    eShift += 16;
    eIndex--;
  }

  while ( eBits !== 0 ) {
    eVal = (aExpo[eIndex] >>> eShift) & 1;

    rArray = redscale.arrays.mod( redscale.arrays.square( rArray ), 1, aMod );

    if ( eVal === 1 ) {
      rArray = redscale.arrays.mod( redscale.arrays.multiply( rArray, aArray ), 1, aMod );
    }

    eBits--;
    eShift--;

    if ( eShift < 0 ) {
      eShift += 16;
      eIndex--;
    }
  }

  if ( aSign < 0 ) {
    rArray = redscale.arrays.subtract( aMod, rArray );
  }

  if ( aExpoSign < 0 ) {
    rArray = redscale.arrays.modInverse( rArray, 1, aMod );
  }

  return rArray;
};

/**
 * Mod Pow Montgomery
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} aExpo
 * @param {!number} aExpoSign
 * @param {!Int16Array} aMod
 * @returns {!Int16Array}
 */
redscale.arrays.modPowMontgomery = function( aArray, aSign, aExpo, aExpoSign, aMod ) {
  var trailingZeroes = redscale.arrays.numberTrailingZeroes( aMod ),
      oMod,
      eMod,
      oResult,
      eResult,
      oModInv,
      eModInv,
      oProd,
      eProd,
      rArray;

  /**
   * Odd Mod Function
   * @param {!Int16Array} aArray
   * @param {!number} aSign
   * @param {!Int16Array} aExpo
   * @param {!Int16Array} oMod
   */
  var oddMod = function( aArray, aSign, aExpo, oMod ) {
    var mInvDigit = new Int16Array( redscale.arrays.modInverseInt16( -oMod[0] ) ),
        eLen = aExpo.length,
        mLen = oMod.length,
        aMontArray = redscale.arrays.bitShiftLeft( aArray, mLen * 16, 0 ),
        eIndex,
        wIndex,
        wVal = eLen < 8 ? 1 : eLen < 32 ? 2 : eLen < 128 ? 3 : eLen < 512 ? 4 : eLen < 1536 ? 5 : 6,
        wLen = 1 << wVal,
        wMask = wLen - 1,
        wLeadingZeroes = redscale.arrays.intLeadingZeroes( aExpo[eLen - 1] ),
        wBits = (eLen * 16) - wLeadingZeroes,
        wArray = new Array( wLen ),
        wBuffer,
        wBufferLen,
        wShift,
        wSqr,
        nonZeroShift,
        rArray;

    wArray[1] = redscale.arrays.modMontgomery( aMontArray, oMod, mInvDigit, mLen );
    wArray[2] = redscale.arrays.modMontgomery( redscale.arrays.square( wArray[1] ), oMod, mInvDigit, mLen );

    for ( wIndex = 3; wIndex < wLen; wIndex += 2 ) {
      wArray[wIndex] =
        redscale.arrays.modMontgomery(
          redscale.arrays.multiply( wArray[wIndex - 2], wArray[2]), oMod, mInvDigit, mLen );
    }

    nonZeroShift = 16 - wLeadingZeroes - wVal;
    eIndex = eLen - 1;

    if ( nonZeroShift < 0 ) {
      wBuffer = ((aExpo[eIndex] << -nonZeroShift) & wMask) & ((aExpo[eIndex - 1] >>> nonZeroShift + 16) & wMask);
    } else {
      wBuffer = (aExpo[eIndex] >>> nonZeroShift) & wMask;
    }

    wSqr = 0;

    while ( (wBuffer & 1) === 0 ) {
      wBuffer >>>= 1;
      wSqr++;
    }

    rArray = redscale.arrays.copy( wArray[wBuffer], 0, new Int16Array( mLen ), 0, mLen );

    while ( wSqr-- ) {
      rArray = redscale.arrays.modMontgomery( redscale.arrays.square( rArray ), oMod, mInvDigit, mLen );
    }

    wShift = nonZeroShift - wVal - 1;
    wBits -= wVal;

    if ( wShift <= 0 ) {
      wShift += 16;
      eIndex--;
    }

    while ( wBits >= wVal ) {
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
        wSqr = 0;

        while ( (wBuffer & 1) === 0 ) {
          wBuffer >>>= 1;
          wBufferLen--;
          wSqr++;
        }

        while ( wBufferLen-- ) {
          rArray = redscale.arrays.modMontgomery( redscale.arrays.square( rArray ), oMod, mInvDigit, mLen );
        }

        rArray = redscale.arrays.modMontgomery( redscale.arrays.multiply( rArray, wArray[wBuffer] ), oMod, mInvDigit, mLen );

        while ( wSqr-- ) {
          rArray = redscale.arrays.modMontgomery( redscale.arrays.square( rArray ), oMod, mInvDigit, mLen );
        }

        wShift -= wVal;
        wBits -= wVal;

        if ( wShift <= 0 ) {
          wShift += 16;
          eIndex--;
        }
      } else {
        rArray = redscale.arrays.modMontgomery( redscale.arrays.square( rArray ), oMod, mInvDigit, mLen );

        wShift--;
        wBits--;

        if ( wShift <= 0 ) {
          wShift += 16;
          eIndex--;
        }
      }
    }

    if ( wBits ) {
      wMask = (1 << wBits) - 1;
      wBuffer = wArray[0] & wMask;

      while ( wBits-- ) {
        rArray = redscale.arrays.modMontgomery( redscale.arrays.square( rArray ), oMod, mInvDigit, mLen );
      }

      rArray = redscale.arrays.modMontgomery( redscale.arrays.multiply( rArray, wArray[wBuffer] ), oMod, mInvDigit, mLen );
    }

    rArray = redscale.arrays.modMontgomery( rArray, oMod, mInvDigit, mLen );

    return rArray;
  };

  /**
   * Even Mod Function
   * @param {!Int16Array} aArray
   * @param {!Int16Array} aExpo
   * @param {!number} trailingZeroes
   */
  var evenMod = function( aArray, aExpo, trailingZeroes ) {
    var eLen = aExpo.length,
        eLeadingZeroes = redscale.arrays.intLeadingZeroes( aExpo[eLen - 1] ),
        eBits = (eLen * 16) - eLeadingZeroes,
        eShift = 16 - eLeadingZeroes,
        eIndex = eLen - 1,
        eVal,
        rArray;

    aArray = redscale.arrays.modBinary( aArray, trailingZeroes );
    rArray = redscale.arrays.copy( aArray, 0, new Int16Array( aArray.length ), 0, aArray.length );

    eBits--;
    eShift--;

    if ( eShift < 0 ) {
      eShift += 16;
      eIndex--;
    }

    while ( eBits !== 0 ) {
      eVal = (aExpo[eIndex] >>> eShift) & 1;

      rArray = redscale.arrays.modBinary( redscale.arrays.square( rArray ), trailingZeroes );

      if ( eVal === 1 ) {
        rArray = redscale.arrays.modBinary( redscale.arrays.multiply( rArray, aArray ), trailingZeroes );
      }

      eBits--;
      eShift--;

      if ( eShift < 0 ) {
        eShift += 16;
        eIndex--;
      }
    }

    return rArray;
  };

  if ( !trailingZeroes ) {
    rArray = oddMod( aArray, aSign, aExpo, aMod );
  } else {
    oMod = redscale.arrays.bitShiftRight( aMod, trailingZeroes );
    eMod = redscale.arrays.bitShiftLeft( new Int16Array( [1] ), trailingZeroes, 0 );

    oResult = oddMod( aArray, aSign, aExpo, oMod );
    eResult = evenMod( aArray, aExpo, trailingZeroes );

    oModInv = redscale.arrays.modInverse( oMod, 1, eMod );
    eModInv = redscale.arrays.modInverse( eMod, 1, oMod );

    oProd = redscale.arrays.multiply( redscale.arrays.multiply( oResult, eMod ), eModInv );
    eProd = redscale.arrays.multiply( redscale.arrays.multiply( eResult, oMod ), oModInv );

    rArray = redscale.arrays.mod( redscale.arrays.add( oProd, eProd ), 1, aMod )
  }

  if ( aExpoSign < 0 ) {
    rArray = redscale.arrays.modInverse( rArray, 1, aMod );
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
redscale.arrays.modPowGarner = function( cryptArray, nArray, pArray, qArray, secPArray, secQArray, pInvArray ) {
  var cpArray = redscale.arrays.mod( cryptArray, 1, pArray ),
      cqArray = redscale.arrays.mod( cryptArray, 1, qArray ),
      mpArray = redscale.arrays.modPow( cpArray, 1, secPArray, 1, pArray ),
      mqArray = redscale.arrays.modPow( cqArray, 1, secQArray, 1, qArray ),
      mArray;

  if ( redscale.arrays.compare( mpArray, mqArray ) !== -1 ) {
    mArray = redscale.arrays.mod( redscale.arrays.subtract( mqArray, mpArray ), 1, qArray );
  } else {
    mArray = redscale.arrays.mod( redscale.arrays.subtract( redscale.arrays.add( mqArray, pArray ), mpArray ), 1, qArray );
  }

  mArray = redscale.arrays.mod( redscale.arrays.multiply( mArray, pInvArray ), 1, qArray );
  mArray = redscale.arrays.mod( redscale.arrays.multiply( mArray, pArray ), 1, nArray );

  return redscale.arrays.mod( redscale.arrays.add( mArray, mpArray ), 1, nArray );
};

redscale.arrays.and = function( aArray, aSign, bArray, bSign ) {

};

redscale.arrays.or = function( aArray, aSign, bArray, bSign ) {

};

redscale.arrays.xor = function( aArray, aSign, bArray, bSign ) {

};

redscale.arrays.not = function( aArray, aSign ) {

};

/**
 * toInt32 - Returns a number equal to the Unsigned 32bit value of
 *     the least significant integers of an array.
 * @param {!Int16Array} aArray
 * @returns {!number}
 */
redscale.arrays.toInt32 = function( aArray ) {
  var
  aHigh = aArray[1] || 0,
  aLow = aArray[0] || 0;

  return ((aHigh & redscale.arrays.INT16_MASK) * 65536) + (aLow & redscale.arrays.INT16_MASK);
};

/**
 * toString - Returns a string representing the precise value of an array and signum.
 * @param {!number} aSigNum
 * @param {!Int16Array} aArray
 * @param {!number} radix
 * @returns {!string}
 */
redscale.arrays.toString = function( aSigNum, aArray, radix ) {
  var aRadix = (2 <= radix && radix <= 36) ? radix : 10,
      aString = "",
      dArray = redscale.arrays.RADIX_DIVISOR32_INDEX[aRadix],
      remLen = redscale.arrays.RADIX_INT32_INDEX[aRadix],
      quotRem = redscale.arrays.divide( aArray, dArray ),
      strVal = redscale.arrays.toInt32( quotRem[1] ).toString( aRadix );

  while ( !redscale.arrays.isZero( quotRem[0] ) ) {
    aString = redscale.arrays.ZERO_STRING.slice( 0, (remLen - strVal.length) ) + strVal + aString;
    quotRem = redscale.arrays.divide( quotRem[0], dArray );
    strVal = redscale.arrays.toInt32( quotRem[1] ).toString( aRadix );
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
redscale.arrays.toNumber = function( aSigNum, aArray ) {
  var aLen = aArray.length,
      aVal = aArray[aLen - 1] & redscale.arrays.INT16_MASK,
      aIndex;

  if ( aLen > 64 ) { return Infinity * aSigNum; }

  for ( aIndex = aLen - 2; aIndex >= 0; aIndex-- ) {
    aVal *= 65536;
    aVal += aArray[aIndex] & redscale.arrays.INT16_MASK;
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
redscale.arrays.fromString = function( aString, radix ) {
  var INT16_MASK = redscale.arrays.INT16_MASK,
      aStrLen = aString.length,
      aLen = (aStrLen * redscale.arrays.RADIX_BIT_INDEX[radix] + 16) >>> 4,
      aArray = new Int16Array( aLen ),
      radixMul = redscale.arrays.RADIX_DIVISOR16_INDEX[radix],
      radixLen = redscale.arrays.RADIX_INT16_INDEX[radix],
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

  return redscale.arrays.trimLeadingZeroes( aArray );
};

/**
 * fromNumber - Returns an array representing the value of a number.
 * @param {!number} aNum
 * @returns {!Int16Array}
 */
redscale.arrays.fromSafeNumber = function( aNum ) {
  var aArray = new Int16Array(4),
      aIndex = 0;

  while ( aNum !== 0 ) {
    aArray[aIndex++] = aNum % 65536;
    aNum = aNum / 65536;
  }

  return redscale.arrays.trimLeadingZeroes( aArray );
};

/**
 * fromExpoNumber - Returns an array representing the value of a number
 *     that is greater than Integer.MAX_SAFE_INTEGER.
 * @param {!number} aNum
 * @returns {!Int16Array}
 */
redscale.arrays.fromExpoNumber = function( aNum ) {
  var expNum = aNum.toExponential().match( /[0-9]+([.0-9]+)?/g ),
      numStr = expNum[0].replace( /[.]/, ""),
      numMag = redscale.arrays.fromString( numStr, 10 ),
      numExp = parseInt( expNum[1], 10 ),
      numZero = numExp - numStr.length + 1,
      zeroCount = (numZero / 4) | 0,
      aLen = ((numExp + 1) * 3.332 + 32) >>> 4,
      aArray = redscale.arrays.copy( numMag, 0, new Int16Array( aLen ), 0, numMag.length ),
      aIndex = 0,
      carry = 0,
      prod;

  while ( zeroCount-- ) {
    for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
      prod = (aArray[aIndex] & redscale.arrays.INT16_MASK) * 10000 + carry;

      aArray[aIndex] = prod & redscale.arrays.INT16_MASK;
      carry = prod >>> 16;
    }
  }

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    prod = (aArray[aIndex] & redscale.arrays.INT16_MASK) * (Math.pow( 10, (numZero % 4) )) + carry;

    aArray[aIndex] = prod & redscale.arrays.INT16_MASK;
    carry = prod >>> 16;
  }

  return redscale.arrays.trimLeadingZeroes( aArray );
};

/**
 * fromSafeNumber - Returns an array representing the value of a number
 *     this is less than or equal to Integer.MAX_SAFE_INTEGER.
 * @param {!number} aNum
 * @returns {!Int16Array}
 * @throws {Error}
 */
redscale.arrays.fromNumber = function( aNum ) {
  if ( !Number.isFinite( aNum ) ) { throw new Error( "RedScale: Number is not finite." )}

  aNum = Math.abs( aNum );

  if ( aNum <= 9007199254740991 ) {
    return redscale.arrays.fromSafeNumber( aNum );
  } else {
    return redscale.arrays.fromExpoNumber( aNum );
  }
};