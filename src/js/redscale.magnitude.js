goog.provide('redscale.magnitude');

redscale.magnitude.INT16_MASK = 0xFFFF;
redscale.magnitude.INT16_UNSIGNED = 0x8000;
redscale.magnitude.INT32_UNSIGNED = 0x80000000;
redscale.magnitude.RADIX_DIVISOR32_INDEX =
  [null, null,
    [0, 16384],      [-19493, 17734], [0, 16384],      [29589, 18626],  [-10240, 5535],  [-25449, 30171],
    [0, 16384],      [-28343, 5911],  [-13824, 15258], [-9375, 3270],   [0, 6561],       [4129, 12447],
    [-16128, 22518], [7023, 2607],    [0, 4096],       [17777, 6261],   [-17280, 9341],  [26235, 13639],
    [16384, 19531],  [28189, 27482],  [2624, 1730],    [-9935, 2258],   [0, 2916],       [19025, 3725],
    [-20928, 4713],  [-28343, 5911],  [4096, 7353],    [18585, 9076],   [-22464, 11123], [15169, 13542],
    [0, 16384],      [15553, 19706],  [-10176, 23571], [-19175, 28049], [-23552, 922]];
redscale.magnitude.RADIX_DIVISOR16_INDEX =
  [null, null,
    16384, 19683, 16384, 15625, 7776,  16807, 4096,  6561,  10000, 14641,
    20736, 28561, 2744,  3375,  4096,  4913,  5832,  6859,  8000,  9261,
    10648, 12167, 13824, 15625, 17576, 19683, 21952, 24389, 27000, 29791,
    1024,  1089,  1156,  1225,  1296];
redscale.magnitude.RADIX_INT32_INDEX =
  [null, null,
    30, 19, 15, 13, 11, 11, 10, 9, 9, 8,
    8,  8,  8,  7,  7,  7,  7,  7, 7, 7,
    6,  6,  6,  6,  6,  6,  6,  6, 6, 6,
    6,  6,  6,  6,  5];
redscale.magnitude.RADIX_INT16_INDEX =
  [null, null,
    14, 9, 7, 6, 5, 5, 4, 4, 4, 4,
    4,  4, 3, 3, 3, 3, 3, 3, 3, 3,
    3,  3, 3, 3, 3, 3, 3, 3, 3, 3,
    2,  2, 2, 2, 2];
redscale.magnitude.RADIX_BIT_INDEX =
  [null, null,
    1,     1.585, 2,     2.322, 2.585, 2.808, 3,     3.17,  3.322, 3.46,
    3.585, 3.701, 3.808, 3.907, 4,     4.088, 4.17,  4.248, 4.322, 4.393,
    4.46,  4.524, 4.585, 4.644, 4.701, 4.755, 4.808, 4.858, 4.907, 4.955,
    5,     5.045, 5.088, 5.13,  5.17];
redscale.magnitude.ZERO_STRING = '00000000000000000000000000000';

redscale.magnitude.isZero = function( aArray ) {
  return aArray.length === 0;
};

redscale.magnitude.isOdd = function( aArray ) {
  return ((aArray[0] || 0) & 1) === 1;
};

redscale.magnitude.isEven = function( aArray ) {
  return ((aArray[0] || 0) & 1) === 0;
};

redscale.magnitude.copy = function( srcArray, srcStart, tarArray, tarStart, copyLength ) {
  var srcLimit = srcStart + copyLength;

  for ( ; srcStart < srcLimit ; srcStart++, tarStart++ ) {
    tarArray[tarStart] = srcArray[srcStart];
  }

  return tarArray;
};

redscale.magnitude.intLeadingZeroes = function( int ) {
  var zeroCount = 0;

  int &= this.INT16_MASK;
  if ( int === 0 ) { return 16; }
  if ( int <= 0x00FF ) {
    int = int << 8;
    zeroCount += 8;
  }
  if ( int <= 0x0FFF ) {
    int = int << 4;
    zeroCount += 4;
  }
  if ( int <= 0x3FFF ) {
    int = int << 2;
    zeroCount += 2;
  }
  if ( int <= 0x7FFF ) {
    zeroCount += 1;
  }

  return zeroCount;
};

redscale.magnitude.intTrailingZeroes = function( int ) {
  return 16 - this.intLeadingZeroes( (~ int) & (int - 1) );
};

redscale.magnitude.numberLeadingZeroes = function( aArray, aLen ) {
  var aIndex;

  for ( aIndex = aLen - 1; (aIndex >= 0) && (aArray[aIndex] === 0); aIndex-- ) { }

  return ((aLen - 1 - aIndex) << 4) + this.intLeadingZeroes( aArray[aIndex] );
};

redscale.magnitude.numberTrailingZeroes = function( aArray, aLen ) {
  var aIndex;

  for ( aIndex = 0; (aIndex < (aLen - 1)) && (aArray[aIndex] === 0); aIndex++ ) { }

  return (aIndex << 4) + this.intTrailingZeroes( aArray[aIndex] );
};

redscale.magnitude.trimLeadingZeroes = function( srcArray ) {
  var srcLen = srcArray.length,
      tarArray,
      srcIndex;

  if ( this.isZero( srcArray ) || (srcArray[srcLen - 1] !== 0) ) { return srcArray; }

  for ( srcIndex = (srcLen - 1); (srcIndex >= 0) && (srcArray[srcIndex] === 0); srcIndex-- ) { }

  tarArray = new Int16Array(srcIndex + 1);
  this.copy( srcArray, 0, tarArray, 0, srcIndex + 1 );

  return tarArray;
};

redscale.magnitude.bitShiftLeft = function( srcArray, leftShift, extraZeroes ) {
  var srcLen = srcArray.length,
      intShift = leftShift >>> 4,
      leftBitShift = leftShift & 0xF,
      rightBitShift = 16 - leftBitShift,
      extraShift = (15 - this.numberLeadingZeroes( srcArray, srcLen) + leftBitShift) >>> 4,
      tarLen = srcLen + intShift + extraShift + ( extraZeroes ? extraZeroes - extraShift : 0 ),
      tarArray = new Int16Array(tarLen),
      carry = 0,
      srcIndex,
      tarIndex;

  if ( leftShift === 0 ) { return this.copy( srcArray, 0, tarArray, 0, srcLen ); }

  for ( srcIndex = 0, tarIndex = intShift; srcIndex < srcLen; srcIndex++, tarIndex++ ) {
    var srcVal = srcArray[srcIndex] & this.INT16_MASK;

    tarArray[tarIndex] = ((srcVal << leftBitShift) | carry) & this.INT16_MASK;
    carry = srcVal >>> rightBitShift;
  }

  if ( tarLen > srcLen ) { tarArray[tarIndex] = carry; }

  return tarArray;
};

redscale.magnitude.bitShiftRight = function( srcArray, rightShift ) {
  var srcLen = srcArray.length,
      leadingZeroes = this.numberLeadingZeroes( srcArray, srcLen ),
      intShift = rightShift >>> 4,
      rightBitShift = rightShift & 0xF,
      leftBitShift = 16 - rightBitShift,
      tarLen = srcLen - intShift - (rightBitShift + leadingZeroes >>> 4),
      tarArray = new Int16Array( tarLen < 0 ? 0 : tarLen ),
      carry = 0,
      srcIndex,
      tarIndex;

  if ( rightShift === 0 ) { return this.copy( srcArray, 0, tarArray, 0, srcLen ) }

  for ( srcIndex = intShift, tarIndex = 0; tarIndex < tarLen; srcIndex++, tarIndex++ ) {
    carry = (srcArray[srcIndex + 1] << leftBitShift) & this.INT16_MASK;
    tarArray[tarIndex] = ((srcArray[srcIndex] & this.INT16_MASK) >>> rightBitShift) | carry;
  }

  return tarArray;
};

redscale.magnitude.compare = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      aIndex;

  if ( aLen > bLen ) { return 1; }
  if ( aLen < bLen ) { return -1; }

  for ( aIndex = aLen - 1; aIndex >= 0; aIndex-- ) {
    var aVal = (aArray[aIndex] & this.INT16_MASK),
        bVal = (bArray[aIndex] & this.INT16_MASK);

    if ( aVal !== bVal ) {
      if ( aVal > bVal ) { return 1; } else { return -1; }
    }
  }

  return 0;
};

// Addition
redscale.magnitude.add = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      sLen = Math.max( aLen, bLen ) + 1,
      sArray = new Int16Array( sLen ),
      tArray = new Int16Array( sLen ),
      carry = 0,
      sIndex;

  this.copy( aArray, 0, sArray, 0, aLen );
  this.copy( bArray, 0, tArray, 0, bLen );

  for ( sIndex = 0; sIndex < sLen; sIndex++ ) {
    var sum = (sArray[sIndex] & this.INT16_MASK) + (tArray[sIndex] & this.INT16_MASK) + carry;
    sArray[sIndex] = sum & this.INT16_MASK;
    carry = sum >>> 16;
  }

  return this.trimLeadingZeroes( sArray );
};

// Subtraction
redscale.magnitude.subtract = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = aArray.length,
      dArray = new Int16Array( aLen ),
      carry = 0,
      bIndex,
      dIndex,
      diff;

  this.copy( aArray, 0, dArray, 0, aLen );

  for ( bIndex = 0; bIndex < bLen; bIndex++ ) {
    diff = (dArray[bIndex] & this.INT16_MASK) - (bArray[bIndex] & this.INT16_MASK) + carry;
    dArray[bIndex] = diff & this.INT16_MASK;
    carry = diff >> 16;
  }

  for ( dIndex = bLen; dIndex < aLen; dIndex++ ) {
    diff = (dArray[dIndex] & this.INT16_MASK) + carry;
    dArray[dIndex] = diff & this.INT16_MASK;
    carry = diff >> 16;
  }

  return this.trimLeadingZeroes( dArray );
};

// Multiplication
redscale.magnitude.multiply = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      pArray = new Int16Array( aLen + bLen ),
      aIndex;

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    var carry = 0,
        pIndex,
        bIndex;

    for ( bIndex = 0, pIndex = aIndex; bIndex < bLen; bIndex++, pIndex++ ) {
      var product = (aArray[aIndex] & this.INT16_MASK) * (bArray[bIndex] & this.INT16_MASK)
                  + (pArray[pIndex] & this.INT16_MASK) + carry;

      pArray[pIndex] = product & this.INT16_MASK;
      carry = product >>> 16;
    }

    pArray[aIndex + bLen] = carry;
  }

  return this.trimLeadingZeroes( pArray );
};

//Divide by 1n
redscale.magnitude.divideBy1n = function( nArray, nLen, dArray ) {
  var shiftNum,
      dInt32,
      qArray,
      quot,
      rem,
      nIndex;

  if ( nArray.length === 1 ) {
    quot = ((nArray[0] & this.INT16_MASK) / (dArray[0] & this.INT16_MASK)) | 0;
    rem = (nArray[0] & this.INT16_MASK) % (dArray[0] & this.INT16_MASK);

    return [new Int16Array( [quot] ), new Int16Array( rem === 0 ? 0 : [rem] )]
  }

  dInt32 = dArray[0] & this.INT16_MASK;
  shiftNum = this.intLeadingZeroes( dInt32 );
  qArray = new Int16Array( nLen );
  rem = nArray[nLen - 1] & this.INT16_MASK;

  if ( rem >= dInt32 ) {
    qArray[nLen - 1] = (rem / dInt32) & this.INT16_MASK;
    rem = (rem % dInt32) & this.INT16_MASK;
  }

  for ( nIndex = nLen - 2; nIndex >= 0; nIndex-- ) {
    var nVal = (rem * 65536) + (nArray[nIndex] & this.INT16_MASK);

    qArray[nIndex] = (nVal / dInt32) & this.INT16_MASK;
    rem = (nVal % dInt32) & this.INT16_MASK;
  }

  if ( shiftNum > 0 ) { rem %= dInt32 }

  return [this.trimLeadingZeroes( qArray ), new Int16Array( rem === 0 ? 0 : [rem] )];
};

// Knuth Division
redscale.magnitude.divideKnuth = function( nArray, nLen, dArray, dLen ) {
  var INT16_MASK = this.INT16_MASK,
      qLen = nLen - dLen + 1,
      shiftNum = this.intLeadingZeroes( dArray[dLen - 1] ),
      aArray = this.bitShiftLeft( nArray, shiftNum, 1 ),
      bArray = this.bitShiftLeft( dArray, shiftNum, 0 ),
      qArray = new Int16Array( qLen ),
      bHigh = bArray[dLen - 1],
      bLow = bArray[dLen - 2],
      bVal = ((bHigh & INT16_MASK) * 65536) + (bLow & INT16_MASK),
      qIndex,
      aIndex;

  function divMulSub( quot, aArray, bArray, qIndex, bLen ) {
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
  }

  function divAdd( aArray, bArray, qIndex, bLen ) {
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
  }

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

  return [this.trimLeadingZeroes( qArray ), this.bitShiftRight( aArray, shiftNum )];
};

//Divide
redscale.magnitude.divide = function( nArray, dArray ) {
  var nLen = nArray.length,
      dLen = dArray.length,
      ndComp = this.compare( nArray, nLen, dArray, dLen );

  if ( this.isZero( dArray ) ) { throw new Error( "Division by zero." ) }
  if ( this.isZero( nArray ) ) { return [new Int16Array( 0 ), new Int16Array( 0 )]; }
  if ( ndComp === 0 ) { return [new Int16Array( [1] ), new Int16Array( 0 )]; }
  if ( ndComp === -1 ) { return [new Int16Array( 0 ), new Int16Array( nArray )]; }
  if ( dLen === 1 ) { return this.divideBy1n( nArray, nLen, dArray ); }

  return this.divideKnuth( nArray, nLen, dArray, dLen );
};

// GCD
redscale.magnitude.binaryGCD = function( aArray, bArray ) {
  var aZero = this.numberTrailingZeroes( aArray ),
      bZero = this.numberTrailingZeroes( bArray ),
      shiftNum = Math.min( aZero, bZero ),
      temp;

  aArray = this.bitShiftRight( aArray, aZero );
  bArray = this.bitShiftRight( bArray, bZero );

  while ( !this.isZero( bArray ) ) {
    var aLen = aArray.length,
        bLen = bArray.length,
        abComp;

    if ( !this.isOdd( bArray ) ) {
      bArray = this.bitShiftRight( bArray, this.numberTrailingZeroes( bArray, bLen ) );
    } else {
      abComp = this.compare( aArray, aLen, bArray, bLen );

      if ( abComp === 1 ) {
        temp = this.subtract( aArray, bArray );
        aArray = bArray;
        bArray = temp;
      } else {
        bArray = this.subtract( bArray, aArray );
      }
    }
  }

  return this.bitShiftLeft( aArray, shiftNum, 0 );
};

redscale.magnitude.gcd = function( aArray, bArray ) {
  var temp;

  while ( Math.abs( aArray.length - bArray.length ) > 1 ) {
    temp = this.divide( aArray, bArray );
    aArray = bArray;
    bArray = temp[1];
  }

  return this.binaryGCD( aArray, bArray );
};

//toString
redscale.magnitude.toInt32 = function( aArray ) {
  var
  aHigh = aArray[1] || 0,
  aLow = aArray[0] || 0;

  return ((aHigh & this.INT16_MASK) << 16) | (aLow & this.INT16_MASK);
};

redscale.magnitude.toString = function( aSigNum, aArray, radix ) {
  var dArray = this.RADIX_DIVISOR32_INDEX[radix],
      remLen = this.RADIX_INT32_INDEX[radix],
      aString = "",
      quotRem = this.divide( aArray, dArray ),
      strVal = this.toInt32( quotRem[1] ).toString( radix );

  while ( !this.isZero( quotRem[0] ) ) {
    aString = this.ZERO_STRING.slice( 0, (remLen - strVal.length) ) + strVal + aString;
    quotRem = this.divide( quotRem[0], dArray );
    strVal = this.toInt32( quotRem[1] ).toString( radix );
  }

  aString = strVal + aString;

  if ( aSigNum < 0 ) { aString = "-" + aString; }

  return aString;
};

redscale.magnitude.toNumber = function( aSigNum, aArray ) {
  var aLen = aArray.length,
      aVal = aArray[aLen - 1] & this.INT16_MASK,
      aIndex;

  if ( aLen > 64 ) { return Infinity * aSigNum; }

  for ( aIndex = aLen - 2; aIndex >= 0; aIndex-- ) {
    aVal *= 65536;
    aVal += aArray[aIndex] & this.INT16_MASK;
  }

  aVal *= aSigNum;

  return aVal;
};

redscale.magnitude.fromString = function( aString, radix ) {
  var INT16_MASK = this.INT16_MASK,
      aStrLen = aString.length,
      aLen = (aStrLen * this.RADIX_BIT_INDEX[radix] + 16) >>> 4,
      aArray = new Int16Array( aLen ),
      radixMul = this.RADIX_DIVISOR16_INDEX[radix],
      radixLen = this.RADIX_INT16_INDEX[radix],
      aStrIndex = 0,
      aStrSlice = (aStrLen % radixLen) || radixLen,
      aVal,
      carry,
      aIndex;

  aVal = parseInt( aString.slice( aStrIndex, aStrSlice ), radix );
  aArray[0] = aVal;

  for ( aStrIndex += aStrSlice; aStrIndex < aStrLen; aStrIndex += radixLen ) {
    aVal = parseInt( aString.slice( aStrIndex, aStrIndex + radixLen ), radix );

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

  return this.trimLeadingZeroes( aArray );
};

//fromNumber - Expects aNum <= Number.MAX_SAFE_INTEGER
redscale.magnitude.fromSafeNumber = function( aNum ) {
  var aArray = new Int16Array(4),
      aIndex = 0;

  while ( aNum !== 0 ) {
    aArray[aIndex++] = aNum % 65536;
    aNum = aNum / 65536;
  }

  return this.trimLeadingZeroes( aArray );
};

redscale.magnitude.fromExpoNumber = function( aNum ) {
  var INT16_MASK = this.INT16_MASK,
      expNum = aNum.toExponential().match( /\d+(\.\d+)?/g ),
      numStr = expNum[0].replace( /\./g, ""),
      numMag = this.fromString( numStr, 10 ),
      numExp = parseInt( expNum[1], 10 ),
      numZero = numExp - numStr.length + 1,
      zeroCount = (numZero / 4) | 0,
      aLen = ((numExp + 1) * 3.332 + 32) >>> 4,
      aArray = this.copy( numMag, 0, new Int16Array( aLen ), 0, numMag.length ),
      aIndex = 0,
      carry = 0,
      prod;

  while ( zeroCount-- ) {
    for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
      prod = (aArray[aIndex] & INT16_MASK) * 10000 + carry;

      aArray[aIndex] = prod & INT16_MASK;
      carry = prod >>> 16;
    }
  }

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    prod = (aArray[aIndex] & INT16_MASK) * (Math.pow( 10, (numZero % 4))) + carry;

    aArray[aIndex] = prod & INT16_MASK;
    carry = prod >>> 16;
  }

  return this.trimLeadingZeroes( aArray );
};

redscale.magnitude.fromNumber = function( aNum ) {
  if ( !Number.isFinite( aNum ) ) { throw new Error( "RedScale: Number is not finite." )}

  if ( aNum <= 9007199254740991 ) {
    return this.fromSafeNumber( aNum );
  } else {
    return this.fromExpoNumber( aNum );
  }
};