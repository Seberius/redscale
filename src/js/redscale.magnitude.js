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
 * @param {Int16Array} aArray
 * @returns {boolean}
 */
redscale.isZero = function( aArray ) {
  return aArray.length === 0;
};

/**
 * isOdd
 * @param {Int16Array} aArray
 * @returns {boolean}
 */
redscale.isOdd = function( aArray ) {
  return ((aArray[0] || 0) & 1) === 1;
};

/**
 * isEven
 * @param {Int16Array} aArray
 * @returns {boolean}
 */
redscale.isEven = function( aArray ) {
  return ((aArray[0] || 0) & 1) === 0;
};

/**
 * Copy - Copies the value from one array to another. Require source array, source starting index,
 * target array, target starting index, and copy length.
 * @param {Int16Array} srcArray
 * @param {number} srcStart
 * @param {Int16Array} tarArray
 * @param {number} tarStart
 * @param {number} copyLength
 * @returns {Int16Array}
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
 * @param {number} aNum
 * @returns {number}
 */
redscale.intLeadingZeroes = function( aNum ) {
  var zeroCount = 0;

  aNum &= redscale.INT16_MASK;
  if ( aNum === 0 ) { return 16; }
  if ( aNum <= 0x00FF ) {
    aNum = aNum << 8;
    zeroCount += 8;
  }
  if ( aNum <= 0x0FFF ) {
    aNum = aNum << 4;
    zeroCount += 4;
  }
  if ( aNum <= 0x3FFF ) {
    aNum = aNum << 2;
    zeroCount += 2;
  }
  if ( aNum <= 0x7FFF ) {
    zeroCount += 1;
  }

  return zeroCount;
};

/**
 * Integer Trailing Zeroes - Counts the trailing zeroes of a native number as if it were a signed 16-bit integer.
 * @param {number} aNum
 * @returns {number}
 */
redscale.intTrailingZeroes = function( aNum ) {
  return 16 - redscale.intLeadingZeroes( (~ aNum) & (aNum - 1) );
};

/**
 * Array Leading Zeroes - Counts the number of zeroes from the most significant bit to the first "on" bit.
 * @param {Int16Array} aArray
 * @param {number} aLen
 * @returns {number}
 */
redscale.numberLeadingZeroes = function( aArray, aLen ) {
  var aIndex;

  for ( aIndex = aLen - 1; (aIndex >= 0) && (aArray[aIndex] === 0); aIndex-- ) { }

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
 * @param {Int16Array} srcArray
 * @returns {Int16Array}
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
 * @param {number} extraZeroes
 * @returns {Int16Array}
 */
redscale.bitShiftLeft = function( srcArray, leftShift, extraZeroes ) {
  var srcLen = srcArray.length,
      intShift = leftShift >>> 4,
      leftBitShift = leftShift & 0xF,
      rightBitShift = 16 - leftBitShift,
      extraShift = (15 - redscale.numberLeadingZeroes( srcArray, srcLen) + leftBitShift) >>> 4,
      tarLen = srcLen + intShift + extraShift + ( extraZeroes ? extraZeroes - extraShift : 0 ),
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
 * Array Bit Shift Left - Shifts the source array left given bits.
 *     Will shrink array to minimum size required.
 * @param {!Int16Array} srcArray
 * @param {!number} rightShift
 * @returns {!Int16Array}
 */
redscale.bitShiftRight = function( srcArray, rightShift ) {
  var srcLen = srcArray.length,
      leadingZeroes = redscale.numberLeadingZeroes( srcArray, srcLen ),
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
      tArray = new Int16Array( sLen ),
      carry = 0,
      sIndex;

  redscale.copy( aArray, 0, sArray, 0, aLen );
  redscale.copy( bArray, 0, tArray, 0, bLen );

  for ( sIndex = 0; sIndex < sLen; sIndex++ ) {
    var sum = (sArray[sIndex] & redscale.INT16_MASK) + (tArray[sIndex] & redscale.INT16_MASK) + carry;
    sArray[sIndex] = sum & redscale.INT16_MASK;
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
 * @param {!Int16Array} bArray
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
  var kLen = ((Math.max( aLen, bLen ) + 1) / 2) | 0,
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

  if ( nArray.length === 1 ) {
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
 * GCD = Returns an array representing the GCD.
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
 * Square - Returns the square of an array.
 * @param {!Int16Array|Array} aArray
 * @returns {!Int16Array}
 */
redscale.square = function( aArray ) {
  var aLen = aArray.length,
      pArray = new Int16Array( aLen ),
      carry = 0,
      prod,
      sum,
      aVal,
      aIndex,
      pIndex;

  var multiplyAddAdd = function( pArray, pIndex, aArray, aIndex, aLen ) {
    var aVal = aArray[aIndex] & redscale.INT16_MASK,
        carry = 0,
        prod;

    for ( ; aIndex < aLen - 1; aIndex++, pIndex++ ) {
      prod = (aArray[aIndex] & redscale.INT16_MASK) * aVal + pArray[pIndex] + carry;
      pArray[pIndex] = prod & redscale.INT16_MASK;
      carry = prod >>> 16;
    }

    while ( carry ) {
      sum = (pArray[pIndex] & redscale.INT16_MASK) + carry;
      pArray[pIndex++] = sum & redscale.INT16_MASK;
      carry = sum >>> 16;
    }
  };

  for ( aIndex = 0, pIndex = 0; aIndex < aLen - 1; aIndex++ ) {
    aVal = aArray[aIndex] & redscale.INT16_MASK;
    prod = aVal * aVal;
    pArray[pIndex++] = (prod >>> 1) & redscale.INT16_MASK;
    pArray[pIndex++] = ((prod >>> 17) | carry) & redscale.INT16_MASK;
    carry = prod << 15;
  }

  for ( aIndex = 0, pIndex = 1; aIndex < aLen - 1; aIndex++, pIndex += 2 ) {
    multiplyAddAdd( pArray, pIndex, aArray, aIndex, aLen );
  }

  redscale.bitShiftLeft( pArray, 1, 0 );
  pArray[0] |= aArray[0] & 1;

  return pArray;
};

/**
 * Power - Returns an array representing aArray raised to the power of expoNum.
 * @param {!Int16Array} aArray
 * @param {number} expoNum
 * @returns {!Int16Array}
 */
redscale.pow = function( aArray, expoNum ) {
  var aZero = redscale.numberTrailingZeroes( aArray ),
      aNorm = redscale.bitShiftRight( aArray, aZero ),
      expoCount = expoNum,
      rArray;

  if ( aNorm.length === 1 && aNorm[0] === 1 ) { return redscale.bitShiftRight( aNorm, aZero * expoNum ); }

  rArray = new Int16Array([1]);

  while ( expoCount ) {
    if ( (expoCount & 1) === 1 ) {
      rArray = redscale.multiply( rArray, aNorm );
      expoCount >>>= 1;
    } else {
      aNorm = redscale.square( aNorm );
      expoCount >>>= 1;
    }
  }

  if ( aZero ) { rArray = redscale.bitShiftLeft( rArray, aZero, 0 ) }

  return rArray;
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

    if ( aVal.isNaN() ) { throw new Error( "RedScale: Is not a number." ) }

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
 * @param aNum
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