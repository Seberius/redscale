goog.provide('redscale.arithmetic');

/**
 * Add - Returns an array representation of the sum.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.arithmetic.add = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      sArray = new Int16Array( Math.max( aLen, bLen ) + 1 ),
      sIndex = 0,
      carry = 0,
      sum;

  redscale.util.copy( aArray, 0, sArray, 0, aLen );

  while ( sIndex < bLen ) {
    sum = (sArray[sIndex] & redscale.util.INT16_MASK) + (bArray[sIndex] & redscale.util.INT16_MASK) + carry;
    sArray[sIndex++] = sum & redscale.util.INT16_MASK;
    carry = sum >>> 16;
  }

  while ( carry ) {
    sum = (sArray[sIndex] & redscale.util.INT16_MASK) + carry;
    sArray[sIndex++] = sum & redscale.util.INT16_MASK;
    carry = sum >>> 16;
  }

  return redscale.util.trimLeadingZeroes( sArray );
};

/**
 * Subtract - Returns an array representation of the difference.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.arithmetic.subtract = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      dArray = new Int16Array( aLen ),
      dIndex = 0,
      carry = 0,
      diff;

  redscale.util.copy( aArray, 0, dArray, 0, aLen );

  while ( dIndex < bLen ) {
    diff = (dArray[dIndex] & redscale.util.INT16_MASK) - (bArray[dIndex] & redscale.util.INT16_MASK) + carry;
    dArray[dIndex++] = diff & redscale.util.INT16_MASK;
    carry = diff >> 16;
  }

  while ( carry ) {
    diff = (dArray[dIndex] & redscale.util.INT16_MASK) + carry;
    dArray[dIndex++] = diff & redscale.util.INT16_MASK;
    carry = diff >> 16;
  }

  return redscale.util.trimLeadingZeroes( dArray );
};

/**
 * Multiply - Returns an array representation of the product.
 * @param {!Int16Array} aArray
 * @param {!Int16Array|[]} bArray
 * @returns {!Int16Array}
 */
redscale.arithmetic.multiply = function( aArray, bArray ) {
  var aLen = aArray.length,
      bLen = bArray.length,
      pArray,
      aIndex;

  if ( aLen === 0 || bLen === 0 ) { return new Int16Array( 0 ); }

  if ( aLen > 120 && bLen > 120 ) { return redscale.arithmetic.multiplyKaratsuba( aArray, aLen, bArray, bLen ); }

  pArray = new Int16Array( aLen + bLen );

  for ( aIndex = 0; aIndex < aLen; aIndex++ ) {
    var carry = 0,
        pIndex,
        bIndex;

    for ( bIndex = 0, pIndex = aIndex; bIndex < bLen; bIndex++, pIndex++ ) {
      var product = (aArray[aIndex] & redscale.util.INT16_MASK) * (bArray[bIndex] & redscale.util.INT16_MASK)
        + (pArray[pIndex] & redscale.util.INT16_MASK) + carry;

      pArray[pIndex] = product & redscale.util.INT16_MASK;
      carry = product >>> 16;
    }

    pArray[aIndex + bLen] = carry;
  }

  return redscale.util.trimLeadingZeroes( pArray );
};

/**
 * Multiply Karatsuba - Returns an array representation of the product.
 * @param {Int16Array} aArray
 * @param {number} aLen
 * @param {Int16Array} bArray
 * @param {number} bLen
 * @returns {Int16Array}
 */
redscale.arithmetic.multiplyKaratsuba = function( aArray, aLen, bArray, bLen ) {
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
    redscale.util.copy( aArray, kLen, highArray, 0, aLen - kLen );

    return highArray;
  };

  var lowNum = function( aArray, aLen, kLen ) {
    var lowArray;

    if ( aLen <= kLen) { return aArray; }

    lowArray = new Int16Array( kLen );
    redscale.util.copy( aArray, 0, lowArray, 0, kLen );

    return redscale.util.trimLeadingZeroes( lowArray );
  };

  aHigh = highNum( aArray, aLen, kLen );
  aLow = lowNum( aArray, aLen, kLen );
  bHigh = highNum( bArray, bLen, kLen );
  bLow = lowNum( bArray, bLen, kLen );

  prodHigh = redscale.arithmetic.multiply( aHigh, bHigh );
  prodLow = redscale.arithmetic.multiply( aLow, bLow );
  prodHighLow = redscale.arithmetic.multiply( redscale.arithmetic.add( aHigh, aLow ), redscale.arithmetic.add( bHigh, bLow ) );

  return redscale.arithmetic.add(
    redscale.bitwise.bitShiftLeft(
      redscale.arithmetic.add(
        redscale.bitwise.bitShiftLeft( prodHigh, 16 * kLen, 0 ),
        redscale.arithmetic.subtract(
          redscale.arithmetic.subtract( prodHighLow, prodHigh ),
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
redscale.arithmetic.divideBy1n = function( nArray, nLen, dArray ) {
  var shiftNum,
      dInt32,
      qArray,
      quot,
      rem,
      nIndex;

  if ( nLen === 1 ) {
    quot = ((nArray[0] & redscale.util.INT16_MASK) / (dArray[0] & redscale.util.INT16_MASK)) | 0;
    rem = (nArray[0] & redscale.util.INT16_MASK) % (dArray[0] & redscale.util.INT16_MASK);

    return [new Int16Array( [quot] ), new Int16Array( rem === 0 ? 0 : [rem] )]
  }

  dInt32 = dArray[0] & redscale.util.INT16_MASK;
  shiftNum = redscale.util.intLeadingZeroes( dInt32 );
  qArray = new Int16Array( nLen );
  rem = nArray[nLen - 1] & redscale.util.INT16_MASK;

  if ( rem >= dInt32 ) {
    qArray[nLen - 1] = (rem / dInt32) & redscale.util.INT16_MASK;
    rem = (rem % dInt32) & redscale.util.INT16_MASK;
  }

  for ( nIndex = nLen - 2; nIndex >= 0; nIndex-- ) {
    var nVal = (rem * 65536) + (nArray[nIndex] & redscale.util.INT16_MASK);

    qArray[nIndex] = (nVal / dInt32) & redscale.util.INT16_MASK;
    rem = (nVal % dInt32) & redscale.util.INT16_MASK;
  }

  if ( shiftNum > 0 ) { rem %= dInt32 }

  return [redscale.util.trimLeadingZeroes( qArray ), new Int16Array( rem === 0 ? 0 : [rem] )];
};

/**
 * Knuth Division - Returns an Array of Arrays representing the quotient and remainder.
 * @param {!Int16Array} nArray
 * @param {!number} nLen
 * @param {!Int16Array} dArray
 * @param {!number} dLen
 * @returns {!Int16Array[]}
 */
redscale.arithmetic.divideKnuth = function( nArray, nLen, dArray, dLen ) {
  var INT16_MASK = redscale.util.INT16_MASK,
      qLen = nLen - dLen + 1,
      shiftNum = redscale.util.intLeadingZeroes( dArray[dLen - 1] ),
      aArray = redscale.bitwise.bitShiftLeft( nArray, shiftNum, 1 ),
      bArray = redscale.bitwise.bitShiftLeft( dArray, shiftNum, 0 ),
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

  return [redscale.util.trimLeadingZeroes( qArray ), redscale.bitwise.bitShiftRight( aArray, shiftNum )];
};

/**
 * Divide - Returns an Array of Arrays representing the quotient and remainder.
 * @param {!Int16Array} nArray
 * @param {!Int16Array} dArray
 * @returns {!Int16Array[]}
 */
redscale.arithmetic.divide = function( nArray, dArray ) {
  var nLen = nArray.length,
      dLen = dArray.length,
      ndComp = redscale.util.compare( nArray, dArray );

  if ( redscale.util.isZero( dArray ) ) { throw new Error( "Division by zero." ) }
  if ( redscale.util.isZero( nArray ) ) { return [new Int16Array( 0 ), new Int16Array( 0 )]; }
  if ( ndComp === 0 ) { return [new Int16Array( [1] ), new Int16Array( 0 )]; }
  if ( ndComp === -1 ) { return [new Int16Array( 0 ), new Int16Array( nArray )]; }
  if ( dLen === 1 ) { return redscale.arithmetic.divideBy1n( nArray, nLen, dArray ); }

  return redscale.arithmetic.divideKnuth( nArray, nLen, dArray, dLen );
};

/**
 * Binary GCD - Returns an array representing the GCD.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.arithmetic.binaryGCD = function( aArray, bArray ) {
  var aZero = redscale.util.numberTrailingZeroes( aArray ),
      bZero = redscale.util.numberTrailingZeroes( bArray ),
      shiftNum = Math.min( aZero, bZero ),
      temp;

  aArray = redscale.bitwise.bitShiftRight( aArray, aZero );
  bArray = redscale.bitwise.bitShiftRight( bArray, bZero );

  while ( !redscale.util.isZero( bArray ) ) {
    var abComp;

    if ( !redscale.util.isOdd( bArray ) ) {
      bArray = redscale.bitwise.bitShiftRight( bArray, redscale.util.numberTrailingZeroes( bArray ) );
    } else {
      abComp = redscale.util.compare( aArray, bArray );

      if ( abComp === 1 ) {
        temp = redscale.arithmetic.subtract( aArray, bArray );
        aArray = bArray;
        bArray = temp;
      } else {
        bArray = redscale.arithmetic.subtract( bArray, aArray );
      }
    }
  }

  return redscale.bitwise.bitShiftLeft( aArray, shiftNum, 0 );
};

/**
 * GCD - Returns an array representing the GCD.
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.arithmetic.gcd = function( aArray, bArray ) {
  var temp;

  while ( Math.abs( aArray.length - bArray.length ) > 1 && !redscale.util.isZero( bArray ) ) {
    temp = redscale.arithmetic.divide( aArray, bArray );
    aArray = bArray;
    bArray = temp[1];
  }

  if ( redscale.util.isZero( bArray ) ) { return aArray; }

  return redscale.arithmetic.binaryGCD( aArray, bArray );
};

/**
 * Lowest Common Multiple
 * @param {!Int16Array} aArray
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.arithmetic.lcm = function( aArray, bArray ) {
  return redscale.arithmetic.multiply( redscale.arithmetic.divide( redscale.arithmetic.gcd( aArray, bArray ), aArray)[0], bArray );
};

/**
 * Square - Returns the square of an array.
 * @param {!Int16Array|Array} aArray
 * @returns {!Int16Array}
 */
redscale.arithmetic.square = function( aArray ) {
  var aLen = aArray.length,
      pLen = aLen * 2,
      pArray = new Int16Array( pLen ),
      carry = 0,
      prod,
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
    var aVal = aArray[aIndex++] & redscale.util.INT16_MASK,
        carry = 0,
        prod,
        sum;

    while ( aIndex < aLen ) {
      prod = (aArray[aIndex++] & redscale.util.INT16_MASK) * aVal +
             (pArray[pIndex] & redscale.util.INT16_MASK) + carry;
      pArray[pIndex++] = prod & redscale.util.INT16_MASK;
      carry = prod >>> 16;
    }

    while ( carry ) {
      sum = (pArray[pIndex] & redscale.util.INT16_MASK) + carry;
      pArray[pIndex++] = sum & redscale.util.INT16_MASK;
      carry = sum >>> 16;
    }

    return carry;
  };

  if ( redscale.util.isZero( aArray ) ) { return new Int16Array( 0 ); }

  if ( aLen > 120 ) { return redscale.arithmetic.squareKaratsuba( aArray, aLen ) }

  for ( aIndex = aLen - 1, pIndex = pLen - 1; aIndex >= 0; aIndex-- ) {
    aVal = aArray[aIndex] & redscale.util.INT16_MASK;
    prod = aVal * aVal;
    pArray[pIndex--] = ((prod >>> 17) | carry) & redscale.util.INT16_MASK;
    pArray[pIndex--] = (prod >>> 1) & redscale.util.INT16_MASK;
    carry = (prod << 15) & 0xFFFF;
  }

  for ( aIndex = 0, pIndex = 1; aIndex < aLen; aIndex++, pIndex += 2 ) {
    multiplyAddAdd( pArray, pIndex, aArray, aIndex, aLen );
  }

  pArray = redscale.bitwise.bitShiftLeft( pArray, 1, 0 );
  pArray[0] |= aArray[0] & 1;

  return pArray;
};

/**
 * Square:Karatsuba
 * @param {!Int16Array} aArray
 * @param {!number} aLen
 * @returns {!Int16Array}
 */
redscale.arithmetic.squareKaratsuba = function( aArray, aLen ) {
  var kLen = (aLen + 1) >>> 1,
      aHigh,
      aLow,
      aHighSqr,
      aLowSqr;

  var highNum = function( aArray, aLen, kLen ) {
    var highArray;

    if ( aLen <= kLen ) { return new Int16Array( 0 ); }

    highArray = new Int16Array( aLen - kLen );
    redscale.util.copy( aArray, kLen, highArray, 0, aLen - kLen );

    return highArray;
  };

  var lowNum = function( aArray, aLen, kLen ) {
    var lowArray;

    if ( aLen <= kLen) { return aArray; }

    lowArray = new Int16Array( kLen );
    redscale.util.copy( aArray, 0, lowArray, 0, kLen );

    return redscale.util.trimLeadingZeroes( lowArray );
  };

  aHigh = highNum( aArray, aLen, kLen );
  aLow = lowNum( aArray, aLen, kLen );
  aHighSqr = redscale.arithmetic.square( aHigh );
  aLowSqr = redscale.arithmetic.square( aLow );

  return redscale.arithmetic.add(
    redscale.bitwise.bitShiftLeft(
      redscale.arithmetic.add(
        redscale.bitwise.bitShiftLeft( aHighSqr, kLen * 16, 0 ),
        redscale.arithmetic.subtract(
          redscale.arithmetic.square( redscale.arithmetic.add( aHigh, aLow) ),
          redscale.arithmetic.add( aHighSqr, aLowSqr ))), kLen * 16, 0 ),
    aLowSqr );
};

/**
 * Power - Returns an array representing aArray raised to the power of expoNum.
 * @param {!Int16Array} aArray
 * @param {number} expoNum
 * @returns {!Int16Array}
 */
redscale.arithmetic.pow = function( aArray, expoNum ) {
  var aZero = redscale.util.numberTrailingZeroes( aArray ),
      aNorm = new Int16Array( aArray ),
      expoCount = expoNum,
      rArray;

  if ( aNorm.length === 1 && aNorm[0] === 1 ) { return redscale.bitwise.bitShiftRight( aNorm, aZero * expoNum ); }

  rArray = new Int16Array([1]);

  while ( expoCount ) {
    if ( (expoCount & 1) === 1 ) {  rArray = redscale.arithmetic.multiply( rArray, aNorm ); }

    expoCount >>>= 1;

    if ( expoCount ) { aNorm = redscale.arithmetic.square( aNorm ); }
  }

  return rArray;
};