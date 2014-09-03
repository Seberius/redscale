goog.provide('redscale.util');

/**
 * Int16 Mask
 * @type {number}
 * @const
 */
redscale.util.INT16_MASK = 0xFFFF;

/**
 * Int16 Unsigned Mask
 * @type {number}
 * @const
 */
redscale.util.INT16_UNSIGNED = 0x8000;

/**
 * Int32 Unsigned Mask
 * @type {number}
 * @const
 */
redscale.util.INT32_UNSIGNED = 0x80000000;

/**
 * Int32 Divisor Radix Index
 * @type {Int16Array[]}
 * @const
 */
redscale.util.RADIX_DIVISOR32_INDEX =
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
redscale.util.RADIX_DIVISOR16_INDEX =
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
redscale.util.RADIX_INT32_INDEX =
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
redscale.util.RADIX_INT16_INDEX =
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
redscale.util.RADIX_BIT_INDEX =
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
redscale.util.ZERO_STRING = '00000000000000000000000000000';

/**
 * isZero
 * @param {!Int16Array} aArray
 * @returns {!boolean}
 */
redscale.util.isZero = function( aArray ) {
  return aArray.length === 0;
};

/**
 * isOdd
 * @param {!Int16Array} aArray
 * @returns {!boolean}
 */
redscale.util.isOdd = function( aArray ) {
  return ((aArray[0] || 0) & 1) === 1;
};

/**
 * isEven
 * @param {!Int16Array} aArray
 * @returns {!boolean}
 */
redscale.util.isEven = function( aArray ) {
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
redscale.util.copy = function( srcArray, srcStart, tarArray, tarStart, copyLength ) {
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
redscale.util.intLeadingZeroes = function( aNum ) {
  var zeroCount = 0;

  aNum &= redscale.util.INT16_MASK;
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
redscale.util.intTrailingZeroes = function( aNum ) {
  var zeroCount = 0;

  aNum &= redscale.util.INT16_MASK;
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
redscale.util.numberLeadingZeroes = function( aArray ) {
  var aLen = aArray.length,
      aIndex;

  for ( aIndex = aLen - 1; (aIndex > 0) && (aArray[aIndex] === 0); aIndex-- ) { }

  return ((aLen - 1 - aIndex) << 4) + redscale.util.intLeadingZeroes( aArray[aIndex] );
};

/**
 * Array Trailing Zeroes - Counts the number of zeroes from the least significant bit to the last "on" bit.
 * @param {!Int16Array} aArray
 * @returns {!number}
 */
redscale.util.numberTrailingZeroes = function( aArray ) {
  var aLen = aArray.length,
      aIndex;

  for ( aIndex = 0; (aIndex < (aLen - 1)) && (aArray[aIndex] === 0); aIndex++ ) { }

  return (aIndex << 4) + redscale.util.intTrailingZeroes( aArray[aIndex] );
};

/**
 * Trim Leading Zeroes - Takes an array and removes leading zero integers.
 *     Returns source array if there aren't any leading zeroes.
 *     Returns an empty array if all zeroes.
 * @param {!Int16Array} srcArray
 * @returns {!Int16Array}
 */
redscale.util.trimLeadingZeroes = function( srcArray ) {
  var srcLen = srcArray.length,
      tarArray,
      srcIndex;

  if ( redscale.util.isZero( srcArray ) || (srcArray[srcLen - 1] !== 0) ) { return srcArray; }

  for ( srcIndex = (srcLen - 1); (srcIndex >= 0) && (srcArray[srcIndex] === 0); srcIndex-- ) { }

  tarArray = new Int16Array(srcIndex + 1);
  redscale.util.copy( srcArray, 0, tarArray, 0, srcIndex + 1 );

  return tarArray;
};

/**
 * Compare - Compares two arrays. Returns 1 if a is larger, -1 if b is larger, and 0 if they are equal.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!number}
 */
redscale.util.compare = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      aIndex;

  if ( aLen > bLen ) { return 1; }
  if ( aLen < bLen ) { return -1; }

  for ( aIndex = aLen - 1; aIndex >= 0; aIndex-- ) {
    var aVal = (aArray[aIndex] & redscale.util.INT16_MASK),
        bVal = (bArray[aIndex] & redscale.util.INT16_MASK);

    if ( aVal !== bVal ) {
      if ( aVal > bVal ) { return 1; } else { return -1; }
    }
  }

  return 0;
};

/**
 * toInt32 - Returns a number equal to the Unsigned 32bit value of
 *     the least significant integers of an array.
 * @param {!Int16Array} aArray
 * @returns {!number}
 */
redscale.util.toInt32 = function( aArray ) {
  var
    aHigh = aArray[1] || 0,
    aLow = aArray[0] || 0;

  return ((aHigh & redscale.util.INT16_MASK) * 65536) + (aLow & redscale.util.INT16_MASK);
};

/**
 * toString - Returns a string representing the precise value of an array and signum.
 * @param {!number} aSigNum
 * @param {!Int16Array} aArray
 * @param {!number} radix
 * @returns {!string}
 */
redscale.util.toString = function( aSigNum, aArray, radix ) {
  var aRadix = (2 <= radix && radix <= 36) ? radix : 10,
      aString = "",
      dArray = redscale.util.RADIX_DIVISOR32_INDEX[aRadix],
      remLen = redscale.util.RADIX_INT32_INDEX[aRadix],
      quotRem = redscale.arithmetic.divide( aArray, dArray ),
      strVal = redscale.util.toInt32( quotRem[1] ).toString( aRadix );

  while ( !redscale.util.isZero( quotRem[0] ) ) {
    aString = redscale.util.ZERO_STRING.slice( 0, (remLen - strVal.length) ) + strVal + aString;
    quotRem = redscale.arithmetic.divide( quotRem[0], dArray );
    strVal = redscale.util.toInt32( quotRem[1] ).toString( aRadix );
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
redscale.util.toNumber = function( aSigNum, aArray ) {
  var aLen = aArray.length,
      aVal = aArray[aLen - 1] & redscale.util.INT16_MASK,
      aIndex;

  if ( aLen > 64 ) { return Infinity * aSigNum; }

  for ( aIndex = aLen - 2; aIndex >= 0; aIndex-- ) {
    aVal *= 65536;
    aVal += aArray[aIndex] & redscale.util.INT16_MASK;
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
redscale.util.fromString = function( aString, radix ) {
  var INT16_MASK = redscale.util.INT16_MASK,
      aStrLen = aString.length,
      aLen = (aStrLen * redscale.util.RADIX_BIT_INDEX[radix] + 16) >>> 4,
      aArray = new Int16Array( aLen ),
      radixMul = redscale.util.RADIX_DIVISOR16_INDEX[radix],
      radixLen = redscale.util.RADIX_INT16_INDEX[radix],
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

  return redscale.util.trimLeadingZeroes( aArray );
};

/**
 * fromNumber - Returns an array representing the value of a number.
 * @param {!number} aNum
 * @returns {!Int16Array}
 */
redscale.util.fromSafeNumber = function( aNum ) {
  var aArray = new Int16Array(4),
      aIndex = 0;

  while ( aNum !== 0 ) {
    aArray[aIndex++] = aNum % 65536;
    aNum = aNum / 65536;
  }

  return redscale.util.trimLeadingZeroes( aArray );
};

/**
 * fromExpoNumber - Returns an array representing the value of a number
 *     that is greater than Integer.MAX_SAFE_INTEGER.
 * @param {!number} aNum
 * @returns {!Int16Array}
 */
redscale.util.fromExpoNumber = function( aNum ) {
  var expNum = aNum.toExponential().match( /[0-9]+([.0-9]+)?/g ),
      numStr = expNum[0].replace( /[.]/, ""),
      numMag = redscale.util.fromString( numStr, 10 ),
      numExp = parseInt( expNum[1], 10 ),
      numZero = numExp - numStr.length + 1,
      zeroCount = (numZero / 4) | 0,
      aLen = ((numExp + 1) * 3.332 + 32) >>> 4,
      aArray = redscale.util.copy( numMag, 0, new Int16Array( aLen ), 0, numMag.length ),
      aIndex = 0,
      carry = 0,
      prod;

  while ( zeroCount-- ) {
    for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
      prod = (aArray[aIndex] & redscale.util.INT16_MASK) * 10000 + carry;

      aArray[aIndex] = prod & redscale.util.INT16_MASK;
      carry = prod >>> 16;
    }
  }

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    prod = (aArray[aIndex] & redscale.util.INT16_MASK) * (Math.pow( 10, (numZero % 4) )) + carry;

    aArray[aIndex] = prod & redscale.util.INT16_MASK;
    carry = prod >>> 16;
  }

  return redscale.util.trimLeadingZeroes( aArray );
};

/**
 * fromSafeNumber - Returns an array representing the value of a number
 *     this is less than or equal to Integer.MAX_SAFE_INTEGER.
 * @param {!number} aNum
 * @returns {!Int16Array}
 * @throws {Error}
 */
redscale.util.fromNumber = function( aNum ) {
  if ( !Number.isFinite( aNum ) ) { throw new Error( "RedScale: Number is not finite." )}

  aNum = Math.abs( aNum );

  if ( aNum <= 9007199254740991 ) {
    return redscale.util.fromSafeNumber( aNum );
  } else {
    return redscale.util.fromExpoNumber( aNum );
  }
};