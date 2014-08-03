var
INT16_MASK = 0xFFFF,
INT16_UNSIGNED = 0x8000,
INT32_UNSIGNED = 0x80000000,
RADIX_DIVISOR_INDEX = [null, null,
                       [0, 16384],      [-19493, 17734], [0, 16384],      [29589, 18626],  [-10240, 5535],
                       [-25449, 30171], [0, 16384],      [-28343, 5911],  [-13824, 15258], [-9375, 3270],
                       [0, 6561],       [4129, 12447],   [-16128, 22518], [7023, 2607],    [0, 4096],
                       [17777, 6261],   [-17280, 9341],  [26235, 13639],  [16384, 19531],  [28189, 27482],
                       [2624, 1730],    [-9935, 2258],   [0, 2916],       [19025, 3725],   [-20928, 4713],
                       [-28343, 5911],  [4096, 7353],    [18585, 9076],   [-22464, 11123], [15169, 13542],
                       [0, 16384],      [15553, 19706],  [-10176, 23571], [-19175, 28049], [-23552, 922]],
RADIX_REM_INDEX = [null, null,
                   30, 19, 15, 13, 11,
                   11, 10, 9, 9, 8,
                   8,  8,  8, 7, 7,
                   7,  7,  7, 7, 7,
                   6,  6,  6, 6, 6,
                   6,  6,  6, 6, 6,
                   6,  6,  6, 6, 5],
ZERO_STRING = "00000000000000000000000000000";

function isArrayZero( aArray ) {
  return aArray.length === 0;
}

function isArrayOdd( aArray ) {
  return ((aArray[0] || 0) & 1) === 1;
}

function numberLeadingZeroes( int ) {
  var
  zeroCount = 0;

  int &= INT16_MASK;
  if ( int == 0 ) { return 16; }
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
}

function numberTrailingZeroes( int ) {
  return 16 - numberLeadingZeroes( (~ int) & (int - 1) );
}

function arrayNumberLeadingZeroes( aArray, aLen ) {
  var
  aIndex;

  for ( aIndex = aLen - 1; (aIndex >= 0) && (aArray[aIndex] == 0); aIndex-- ) { }

  return ((aLen - 1 - aIndex) << 4) + numberLeadingZeroes( aArray[aIndex] );
}

function arrayNumberTrailingZeroes( aArray, aLen ) {
  var
  aIndex;

  for ( aIndex = 0; (aIndex < (aLen - 1)) && (aArray[aIndex] == 0); aIndex++ ) { }

  return (aIndex << 4) + numberTrailingZeroes( aArray[aIndex] );
}

function trimLeadingZeroes( srcArray, srcLen ) {
  var
  tarArray,
  srcIndex;

  if ( isArrayZero( srcArray ) || (srcArray[srcLen - 1] != 0) ) { return srcArray; }

  for ( srcIndex = (srcLen - 1); (srcIndex >= 0) && (srcArray[srcIndex] == 0); srcIndex-- ) { }

  tarArray = new Int16Array(srcIndex + 1);
  arrayCopy( srcArray, 0, tarArray, 0, srcIndex + 1 );

  return tarArray;
}

function arrayCopy( srcArray, srcStart, tarArray, tarStart, copyLength ) {
  var
  srcIndex = srcStart,
  tarIndex = tarStart,
  srcLimit = srcStart + copyLength;

  for ( ; srcIndex < srcLimit ; srcIndex++, tarIndex++ ) {
    tarArray[tarIndex] = srcArray[srcIndex];
  }

  return tarArray;
}

function arrayBitShiftLeft( srcArray, srcLen, leftShift, leadingZeroes ) {
  var
  intShift = leftShift >>> 4,
  leftBitShift = leftShift & 0xF,
  rightBitShift = 16 - leftBitShift,
  tarLen = srcLen + intShift + leadingZeroes,
  tarArray = new Int16Array(tarLen),
  carry = 0,
  srcIndex,
  tarIndex;

  if ( leftShift == 0 ) { return arrayCopy( srcArray, 0, tarArray, 0, srcLen ); }

  for ( srcIndex = intShift, tarIndex = 0; srcIndex < srcLen; srcIndex++, tarIndex++ ) {
    var srcVal = srcArray[srcIndex] & INT16_MASK;

    tarArray[tarIndex] = ((srcVal << leftBitShift) | carry) & INT16_MASK;
    carry = srcVal >>> rightBitShift;
  }

  if ( tarLen > srcLen ) { tarArray[tarIndex] = carry; }

  return tarArray;
}

function arrayBitShiftRight( srcArray, srcLen, rightShift ) {
  var
  intShift = rightShift >>> 4,
  rightBitShift = rightShift & 0xF,
  leftBitShift = 16 - rightBitShift,
  leadingZeroes = arrayNumberLeadingZeroes( srcArray, srcLen ),
  extraShift = (rightShift + leadingZeroes) >>> 4,
  tarLen = srcLen - intShift - extraShift,
  tarArray = new Int16Array( tarLen ),
  carry = ((srcArray[tarLen + intShift] << leftBitShift) & INT16_MASK) || 0,
  srcIndex,
  tarIndex;

  if ( rightShift == 0 ) { return arrayCopy( srcArray, 0, tarArray, 0, srcLen ) }

  for ( srcIndex = tarLen + intShift - 1, tarIndex = tarLen - 1; tarIndex >= 0; srcIndex--, tarIndex-- ) {
    var srcVal = srcArray[srcIndex] & INT16_MASK;

    tarArray[tarIndex] = (srcVal >>> rightBitShift) | carry;
    carry = (srcVal << leftBitShift) & INT16_MASK;
  }

  return tarArray;
}

function arrayCompare ( aArray, aLen, bArray, bLen ) {
  var
  aIndex;

  if ( aLen > bLen ) { return 1; }
  if ( aLen < bLen ) { return -1; }

  for ( aIndex = aLen - 1; aIndex >= 0; aIndex-- ) {
    var
    aVal = aArray[aIndex],
    bVal = bArray[aIndex];

    if ( aVal != bVal ) {
      if ( aVal > bVal ) { return 1; } else { return -1; }
    }
  }

  return 0;
}

// Addition
function arrayAdd( aArray, aLen, bArray, bLen ) {
  var
  sLen = Math.max( aLen, bLen ) + 1,
  sArray = new Int16Array( sLen ),
  tArray = new Int16Array( sLen ),
  carry = 0,
  sIndex;

  arrayCopy( aArray, 0, sArray, 0, aLen );
  arrayCopy( bArray, 0, tArray, 0, bLen );

  for ( sIndex = 0; sIndex < sLen; sIndex++ ) {
    var sum = (sArray[sIndex] & INT16_MASK) + (tArray[sIndex] & INT16_MASK) + carry;
    sArray[sIndex] = sum & INT16_MASK;
    carry = sum >>> 16;
  }

  return trimLeadingZeroes( sArray, sLen );
}

// Subtraction
function arraySubtract( aArray, aLen, bArray, bLen ) {
  var
  dArray = new Int16Array( aLen ),
  carry = 0,
  bIndex,
  dIndex;

  arrayCopy( aArray, 0, dArray, 0, aLen );

  for ( bIndex = 0; bIndex < bLen; bIndex++ ) {
    var diff = (dArray[bIndex] & INT16_MASK) - (bArray[bIndex] & INT16_MASK) + carry;
    dArray[bIndex] = diff & INT16_MASK;
    carry = diff >> 16;
  }

  for ( dIndex = bLen; dIndex < aLen; dIndex++ ) {
    var diff = (dArray[dIndex] & INT16_MASK) + carry;
    dArray[dIndex] = diff & INT16_MASK;
    carry = diff >> 16;
  }

  return trimLeadingZeroes( dArray, aLen );
}

// Multiplication
function arrayMultiply( aArray, aLen, bArray, bLen ) {
  var
  pLen = aLen + bLen,
  pArray = new Int16Array( pLen ),
  aIndex;

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    var
    carry = 0,
    pIndex,
    bIndex;

    for ( bIndex = 0, pIndex = aIndex; bIndex < bLen; bIndex++, pIndex++ ) {
      var
      product = (aArray[aIndex] & INT16_MASK) * (bArray[bIndex] & INT16_MASK) + (pArray[pIndex] & INT16_MASK) + carry;

      pArray[pIndex] = product & INT16_MASK;
      carry = product >>> 16;
    }

    pArray[aIndex + bLen] = carry;
  }

  return trimLeadingZeroes( pArray, pLen );
}

// Knuth Division
function divInt32ByInt16( aInt32, bInt16 ) {
  var
  bInt32 = bInt16 & INT16_MASK,
  quot,
  rem;

  if ( bInt16 == 1 ) {
    quot = aInt32 & INT16_MASK;
    rem = 0;
  } else if ( bInt16 == 2 ) {
    quot = (aInt32 >>> 1) & INT16_MASK;
    rem = aInt32 & 1;
  } else if ( aInt32 >= 0 ) {
    quot = (aInt32 / bInt32) | 0;
    rem = aInt32 % bInt32;
  } else {
    quot = ((aInt32 >>> 1) / (bInt32 >>> 1)) | 0;
    rem = aInt32 - (bInt32 * quot);

    for ( ; rem < 0; rem += bInt32 ) { quot-- }
    for ( ; rem >= bInt32; rem -= bInt32 ) { quot++ }
  }

  return (rem << 16) | (quot & INT16_MASK);
}

function divCorrection( quot, rem, aLow, bLow, bHighInt32 ) {
  var
  testProd = quot * (bLow & INT16_MASK),
  testRem = (rem << 16) | (aLow & INT16_MASK);

  if ( (testProd ^ INT32_UNSIGNED) > (testRem ^ INT32_UNSIGNED) ) {
    quot--;
    rem += bHighInt32;

    testProd -= (bLow & INT16_MASK);
    testRem = (rem << 16) | (aLow & INT16_MASK);
    if ( ((rem >>> 16) == 0) && ((testProd ^ INT32_UNSIGNED) > (testRem ^ INT32_UNSIGNED)) ) {
      quot--;
    }
  }

  return (rem << 16) | (quot & INT16_MASK);
}

function divMulSub( quot, aArray, bArray, qIndex, bLen ) {
  var
  carry = 0,
  aIndex,
  bIndex;

  for ( aIndex = qIndex, bIndex = 0; bIndex < bLen; aIndex++, bIndex++ ) {
    var
    prod = (bArray[bIndex] & INT16_MASK) * (quot & INT16_MASK),
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
    var
    sum = (aArray[aIndex] & INT16_MASK) + (bArray[bIndex] & INT16_MASK) + carry;

    aArray[aIndex] = sum & INT16_MASK;
    carry = sum >> 16;
  }

  aArray[aIndex] += carry;

  return carry;
}

function arrayDivide( nArray, nLen, dArray, dLen ) {
  var
  qLen = nLen - dLen + 1,
  aLen = nLen + 1,
  shiftNum = numberLeadingZeroes( dArray[dLen - 1] ),
  aArray = arrayBitShiftLeft( nArray, nLen, shiftNum, 1 ),
  bArray = arrayBitShiftLeft( dArray, dLen, shiftNum, 0 ),
  qArray = new Int16Array( qLen ),
  bHigh = bArray[dLen - 1],
  bHighInt32 = bHigh & INT16_MASK,
  bLow = bArray[dLen - 2],
  qIndex,
  aIndex;

  for ( qIndex = qLen - 1, aIndex = nLen; qIndex >= 0; qIndex--, aIndex-- ) {
    var
    aHigh = aArray[aIndex],
    aMed = aArray[aIndex - 1],
    aInt32 = ((aHigh & INT16_MASK) << 16) | (aMed & INT16_MASK),
    candidateQuotRem = 0,
    quot,
    rem;

    if ( aHigh == bHigh ) {
      quot = -1;
      rem = aHigh + aMed;
    } else {
      candidateQuotRem = divInt32ByInt16( aInt32, bHigh );
      quot = candidateQuotRem & INT16_MASK;
      rem = candidateQuotRem >>> 16;
    }

    if ( quot != 0 ) {
      quot = divCorrection( quot, rem, aArray[aIndex - 2], bLow, bHighInt32 ) & INT16_MASK;
      rem = divMulSub( quot, aArray, bArray, qIndex, dLen );

      if ( rem < 0 ) {
        divAdd( aArray, bArray, qIndex, dLen );
        quot--;
      }
    }

    qArray[qIndex] = quot;
  }

  return [trimLeadingZeroes( qArray, qLen ), arrayBitShiftRight( aArray, aLen, shiftNum )];
}

//Divide
function divide( nArray, dArray ) {
  var
  nLen = nArray.length,
  dLen = dArray.length,
  ndComp = arrayCompare( nArray, nLen, dArray, dLen );

  if ( isArrayZero( dArray ) ) { throw new Error( "Division by zero."; ) }
  if ( isArrayZero( nArray ) ) { return [new Int16Array( 0 ), new Int16Array( 0 )]; }
  if ( ndComp === 0 ) { return [new Int16Array( [1] ), new Int16Array( 0 )]; }
  if ( ndComp === -1 ) { return [new Int16Array( 0 ), new Int16Array( nArray )]; }

  return arrayDivide( nArray, nLen, dArray, dLen );
}

// GCD
function arrayBinaryGCD( aArray, aLen, bArray, bLen ) {
  var
  aZero = arrayNumberTrailingZeroes( aArray, aLen ),
  bZero = arrayNumberTrailingZeroes( bArray, bLen ),
  shiftNum = Math.max( aZero, bZero ),
  aArray = arrayBitShiftRight( aArray, aLen, aZero ),
  bArray = arrayBitShiftRight( bArray, bLen, bZero );

  function binaryGCD ( aArray, bArray ) {
    var
    aLen = aArray.length,
    bLen = bArray.length
    abComp;

    if ( !isArrayOdd( aArray ) ) {
      return binaryGCD( aArray, arrayBitShiftRight( bArray, arrayNumberTrailingZeroes( aArray, aLen )));
    }

    abComp = arrayCompare( aArray, aLen, bArray, bLen );

    if ( abComp === 0 ) { return aArray; }
    if ( abComp === 1 ) {
      return binaryGCD( bArray, arraySubtract( aArray, aLen, bArray, bLen ));
    } else {
      return binaryGCD( aArray, arraySubtract( bArray, bLen, aArray, aLen ));
    }
  }

  return binaryGCD( aArray, bArray );
}

function arrayGCD( aArray, bArray ) {
  function gcd( aArray, bArray ) {
    var
    aLen = aArray.length,
    bLen = bArray.length;

    if (Math.abs( aLen - bLen ) > 1) {
      return gcd( bArray, arrayDivide( aArray, aLen, bArray, bLen ));
    } else {
      return arrayBinaryGCD( aArray, aLen, bArray, bLen );
    }
  }

  return gcd( aArray, bArray );
}

//toString
function arrayToInt32( aArray ) {
  var
  aHigh = aArray[1] || 0,
  aLow = aArray[0] || 0;

  return ((aHigh & INT16_MASK) << 16) | (aLow & INT16_MASK);
}

function arrayToString( aSigNum, aArray, radix ) {
  var
  dArray = RADIX_DIVISOR_INDEX[radix],
  remNum = RADIX_REM_INDEX[radix],
  aString = "";

  function toString( aArray, aString ) {
    var
    quotRem = arrayDivide( aArray, a.length, dArray, 2 ),
    strVal = arrayToInt32( quotRem[1] ).toString(radix);

    if ( !isArrayZero( quotRem[0] )) {
      aString = ZERO_STRING.slice(0, (RADIX_REM_INDEX - strVal.length)) + strVal + aString;

      return toString( quotRem[0], aString );
    } else {
      aString = strVal + aString;

      if ( aSigNum < 0 ) { aString = "-" + aString; }

      return aString;
    }
  }

  return toString( aArray, aString );
}

function arrayToNumber( aSigNum, aArray ) {
  var
  aLen = aArray.length,
  aVal = aArray[aLen - 1] & INT16_MASK,
  aIndex;

  if ( aLen > 64 ) { return Infinity * aSigNum; }

  for ( aIndex = aLen - 2; aIndex >= 0; aIndex-- ) {
    aVal *= 65536;
    aVal += aArray[aIndex] & INT16_MASK;
  }

  aVal *= aSigNum;

  return aVal;
}