var INT16_MASK = 0xFFFF;
var INT32_UNSIGNED = 0x80000000;

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

function isArrayZero( aArray ) {
  return aArray.length == 0;
}

function arrayNumberTrailingZeroes( aArray, aLen ) {
  var
  aIndex;

  for ( aIndex = 0; (aIndex < (- aLen 1)) && (aArray[aIndex] == 0); aIndex++ ) { }

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

  for ( srcIndex = 0, tarIndex = intShift; srcIndex < srcLen; srcIndex++, tarIndex ) {
    var srcVal = srcArray[srcIndex] & INT16_MASK;

    tarArray[tarIndex] = ((srcVal << leftShift) | carry) & INT16_MASK;
    carry = srcVal >>> rightShift;
  }

  if ( tarLen > srcLen ) { tarArray[tarIndex] = carry; }

  return tarArray;
}

function arrayBitShiftRight( srcArray, srcLen, rightShift ) {
  var
  intShift = rightShift >>> 4,
  rightBitShift = rightShift & 0xF,
  leftBitShift = 16 - rightBitShift,
  extraShift = (rightShift + leadingZeroes( srcArray[srcLen - 1] )) >>> 4,
  tarLen = srcLen - intShift - extraShift,
  tarArray = new Int16Array( tarLen ),
  carry = 0,
  srcIndex,
  tarIndex;

  if ( rightShift == 0 ) { return arrayCopy( srcArray, 0, tarArray, 0, srcLen ) }

  for ( srcIndex = intShift, tarIndex = 0; tarIndex < tarLen; srcIndex++, tarIndex ) {
    var srcVal = srcArray[srcIndex] & INT16_MASK;

    tarArray[tarIndex] = ((srcVal >>> rightShift) | carry) & INT16_MASK;
    carry = srcVal << leftShift;
  }

  return tarArray;
}

function addArray( aArray, aLen, bArray, bLen ) {
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

  return sArray;
}

function subtractArray( aArray, aLen, bArray, bLen ) {
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

  return dArray;
}

function multiplyArray( aArray, aLen, bArray, bLen ) {
  var
  pArray = new Int16Array( aLen + bLen ),
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

  return pArray;
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
    if ( ((rem >>> 16) = 0) && ((testProd ^ INT32_UNSIGNED) > (testRem ^ INT32_UNSIGNED)) ) {
      quot--;
    }
  }

  return quot & INT16_MASK;
}

function divMulSub( quot, aArray, bArray, qIndex, bLen ) {
  var
  carry = 0,
  aIndex,
  bIndex;

  for ( aIndex = qIndex, bIndex = 0; bIndex < bLen; aIndex++, bIndex++ ) {
    var
    prod = (bArray[bIndex] & INT16_MASK) * (quot & INT16_MASK),
    diff = (aArray & INT16_MASK) - (prod & INT16_MASK) - (carry & INT16_MASK);

    aArray[aIndex] = diff & INT16_MASK;
    carry = ((prod >> 16) & INT16_MASK) - ((diff >> 16) & INT16_MASK);
  }

  aArray[aIndex] = ((aArray[aIndex] & INT16_MASK) - (carry & INT16_MASK)) & INT16_MASK;

  return aArray;
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

  return aArray;
}

function divideArray( nArray, nLen, dArray, dLen ) {
  var
  qLen = nLen - dLen + 1,
  aLen = nLen + 1,
  shiftNum = numberLeadingZeroes( dArray[dLen - 1] ),
  aArray = arrayBitShiftLeft( nArray, nLen, shiftNum, 1 ),
  bArray = arrayBitShiftLeft( dArray, dLen, shiftNum, 0 ),
  qArray = new Int16Array( qLen ),
  bHigh = bArray[bLen - 1],
  bHighInt32 = bHigh & INT16_MASK,
  bLow = bArray[bLen - 2],
  quot,
  rem,
  qIndex,
  aIndex;

  for ( qIndex = qLen - 1, aIndex = nLen; qIndex >= 0; qIndex--, aIndex-- ) {
    var
    aHigh = aArray[aIndex],
    aMed = aArray[aIndex - 1],
    aInt32 = ((aHigh & INT16_MASK) << 16) | (aMed & INT16_MASK)
    candidateQuotRem;

    if ( aHigh == bHigh ) {
      quot = -1;
      rem = aHigh + aMed;
    } else {
      candidateQuotRem = divInt32ByInt16( aInt32, bHigh );
      quot = candidateQuotRem & INT16_MASK;
      rem = candidateQuotRem >>> 16;
    }

    if ( quot != 0 ) {
      divCorrection( quot, rem, aLow, bLow, bHighInt32 );
      divMulSub( quot, aArray, bArray, qIndex, dLen );

      if ( rem < 0 ) {
        divAdd( aArray, bArray, qIndex, dLen );
        quot--;
      }
    }
  }

  return [trimLeadingZeroes( qArray, qLen ), arrayBitShiftRight( aArray, aLen, shiftNum )];
}

// GCD
function arrayBinaryGCD( aArray, bArray ) {}

function arrayGCD( aArray, bArray )