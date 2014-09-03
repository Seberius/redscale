goog.provide('redscale.modular');

/**
 * Mod
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} bArray
 * @returns {!Int16Array}
 */
redscale.modular.mod = function( aArray, aSign, bArray ) {
  var rArray = redscale.arithmetic.divide( aArray, bArray )[1],
      rSign = redscale.util.isZero( rArray ) ? 0 : aSign;

  if (rSign === -1 ) {
    rArray = redscale.arithmetic.subtract( bArray, rArray );
  }

  return rArray;
};

/**
 * Mod Binary Power of 2
 * @param {!Int16Array} aArray
 * @param {!number} mLen
 * @returns {!Int16Array}
 */
redscale.modular.modBinary = function( aArray, mLen ) {
  var aLen = aArray.length * 16,
      aZero = redscale.util.numberLeadingZeroes( aArray ),
      aInt = (mLen >>> 4) + 1,
      aBit = mLen & 0xF,
      rArray;

  if ( (aLen - aZero) <= mLen ) {
    return aArray;
  }

  rArray = redscale.util.copy( aArray, 0 , new Int16Array( aInt ), 0, aInt );
  rArray[aInt - 1] &= (1 << (16 - aBit)) - 1;

  return rArray;
};

/**
 * Mod Montgomery
 * @param {!Int16Array} aArray
 * @param {!Int16Array} mArray
 * @param {!number} mInvDigit
 * @param {!number} mLen
 * @returns {!Int16Array}
 */
redscale.modular.modMontgomery = function( aArray, mArray, mInvDigit, mLen ) {
  var aIndex = 0,
      result;

  while ( aIndex < mLen ) {
    result = (aArray[aIndex] * mInvDigit) & redscale.util.INT16_MASK;
    result = redscale.bitwise.bitShiftLeft( redscale.arithmetic.multiply( mArray, result === 0 ? [] : [result] ), 16 * aIndex, 0 );

    aArray = redscale.arithmetic.add( aArray, result );

    aIndex++;
  }

  aArray = redscale.bitwise.bitShiftRight( aArray, mLen * 16 );

  while ( redscale.util.compare( aArray, mArray ) !== -1 ) {
    aArray = redscale.arithmetic.subtract( aArray, mArray );
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
redscale.modular.modInverse = function( aArray, aSign, mArray ) {
  var mNorm = new Int16Array( mArray ),
      aNorm = new Int16Array( aArray ),
      mSigned = new redscale.SignArray( 1, mArray ),
      bVal = new redscale.SignArray( 0, new Int16Array( 0 ) ),
      dVal = new redscale.SignArray( 1, new Int16Array( [1] ) );

  while( !redscale.util.isZero( mNorm ) ) {
    while ( redscale.util.isEven( mNorm ) ) {
      mNorm = redscale.bitwise.bitShiftRight( mNorm, 1 );

      if ( redscale.util.isOdd( bVal.array ) ) {
        bVal = redscale.SignArray.signSubtract( bVal, mSigned );
      }

      bVal.array = redscale.bitwise.bitShiftRight( bVal.array, 1 );

      if ( !bVal.array.length ) {
        bVal.sign = 0;
      }
    }

    while ( redscale.util.isEven( aNorm ) ) {
      aNorm = redscale.bitwise.bitShiftRight( aNorm, 1 );

      if ( redscale.util.isOdd( dVal.array ) ) {
        dVal = redscale.SignArray.signSubtract( dVal, mSigned );
      }

      dVal.array = redscale.bitwise.bitShiftRight( dVal.array, 1 );

      if ( !dVal.array.length ) {
        dVal.sign = 0;
      }
    }

    if ( redscale.util.compare( mNorm, aNorm ) >= 0 ) {
      mNorm = redscale.arithmetic.subtract( mNorm, aNorm );
      bVal = redscale.SignArray.signSubtract( bVal, dVal );
    } else {
      aNorm = redscale.arithmetic.subtract( aNorm, mNorm );
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
redscale.modular.modInverseInt16 = function( aVal ) {
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
redscale.modular.modPow = function( aArray, aSign, aExpo, aExpoSign, aMod ) {
  var aLen = aArray.length,
      eLen = aExpo.length,
      rArray;

  if ( eLen === 0 || redscale.util.compare( aArray, [1] ) === 0 ) {
    return redscale.util.compare( aMod, [1] ) === 0 ? new Int16Array( 0 ) : new Int16Array( [1] );
  }

  if ( aLen === 0 && aExpoSign >= 0 ) {
    return new Int16Array(0);
  }

  if ( aSign < 0 || redscale.util.compare( aArray, aMod ) >= 0 ) {
    aArray = redscale.modular.mod( aArray, aSign, aMod );
  }

  if ( eLen > 1 ) {
    rArray = redscale.modular.modPowMontgomery( aArray, aSign, aExpo, aMod );
  } else {
    rArray = redscale.modular.modPowStandard( aArray, aSign, aExpo, aMod );
  }

  if ( aExpoSign < 0 ) {
    rArray = redscale.modular.modInverse( rArray, 1, aMod );
  }

  return rArray;
};

/**
 * Mod Pow Standard
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} aExpo
 * @param {!Int16Array} aMod
 * @returns {!Int16Array}
 */
redscale.modular.modPowStandard = function( aArray, aSign, aExpo, aMod ) {
  var eLen = aExpo.length,
      eLeadingZeroes = redscale.util.intLeadingZeroes( aExpo[eLen - 1] ),
      eBits = (eLen * 16) - eLeadingZeroes,
      eShift = 16 - eLeadingZeroes - 1,
      eIndex = eLen - 1,
      eVal,
      rArray;

  aArray = redscale.modular.mod( aArray, 1, aMod );
  rArray = redscale.util.copy( aArray, 0, new Int16Array( aArray.length ), 0, aArray.length );

  eBits--;
  eShift--;

  if ( eShift < 0 ) {
    eShift += 16;
    eIndex--;
  }

  while ( (eBits !== 0) ) {
    eVal = (aExpo[eIndex] >>> eShift) & 1;

    rArray = redscale.modular.mod( redscale.arithmetic.square( rArray ), 1, aMod );

    if ( eVal === 1 ) {
      rArray = redscale.modular.mod( redscale.arithmetic.multiply( rArray, aArray ), 1, aMod );
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

/**
 * Mod Pow Montgomery
 * @param {!Int16Array} aArray
 * @param {!number} aSign
 * @param {!Int16Array} aExpo
 * @param {!Int16Array} aMod
 * @returns {!Int16Array}
 */
redscale.modular.modPowMontgomery = function( aArray, aSign, aExpo, aMod ) {
  var trailingZeroes = redscale.util.numberTrailingZeroes( aMod ),
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
    var mInvDigit = redscale.modular.modInverseInt16( -oMod[0] ),
        eLen = aExpo.length,
        mLen = oMod.length,
        aMontArray = redscale.modular.mod( redscale.bitwise.bitShiftLeft( aArray, mLen * 16, 0 ), aSign, oMod ),
        eIndex,
        wIndex,
        wVal = eLen < 8 ? 1 : eLen < 32 ? 2 : eLen < 128 ? 3 : eLen < 512 ? 4 : eLen < 1536 ? 5 : 6,
        wLen = 1 << wVal,
        wMask = wLen - 1,
        wLeadingZeroes = redscale.util.intLeadingZeroes( aExpo[eLen - 1] ),
        wBits = (eLen * 16) - wLeadingZeroes,
        wArray = new Array( wLen ),
        wBuffer,
        wBufferLen,
        wShift,
        wSqr,
        nonZeroShift,
        rArray;

    wArray[1] = redscale.modular.modMontgomery( aMontArray, oMod, mInvDigit, mLen );
    wArray[2] = redscale.modular.modMontgomery( redscale.arithmetic.square( wArray[1] ), oMod, mInvDigit, mLen );

    for ( wIndex = 3; wIndex < wLen; wIndex += 2 ) {
      wArray[wIndex] =
        redscale.modular.modMontgomery(
          redscale.arithmetic.multiply( wArray[wIndex - 2], wArray[2]), oMod, mInvDigit, mLen );
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

    rArray = redscale.util.copy( wArray[wBuffer], 0, new Int16Array( mLen ), 0, mLen );

    while ( wSqr-- ) {
      rArray = redscale.modular.modMontgomery( redscale.arithmetic.square( rArray ), oMod, mInvDigit, mLen );
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
          rArray = redscale.modular.modMontgomery( redscale.arithmetic.square( rArray ), oMod, mInvDigit, mLen );
        }

        rArray = redscale.modular.modMontgomery( redscale.arithmetic.multiply( rArray, wArray[wBuffer] ), oMod, mInvDigit, mLen );

        while ( wSqr-- ) {
          rArray = redscale.modular.modMontgomery( redscale.arithmetic.square( rArray ), oMod, mInvDigit, mLen );
        }

        wShift -= wVal;
        wBits -= wVal;

        if ( wShift <= 0 ) {
          wShift += 16;
          eIndex--;
        }
      } else {
        rArray = redscale.modular.modMontgomery( redscale.arithmetic.square( rArray ), oMod, mInvDigit, mLen );

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
      wBuffer = aExpo[0] & wMask;

      while ( wBits-- ) {
        rArray = redscale.modular.modMontgomery( redscale.arithmetic.square( rArray ), oMod, mInvDigit, mLen );
      }

      rArray = redscale.modular.modMontgomery( redscale.arithmetic.multiply( rArray, wArray[wBuffer] ), oMod, mInvDigit, mLen );
    }

    rArray = redscale.modular.modMontgomery( rArray, oMod, mInvDigit, mLen );

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
        eLeadingZeroes = redscale.util.intLeadingZeroes( aExpo[eLen - 1] ),
        eBits = (eLen * 16) - eLeadingZeroes,
        eShift = 16 - eLeadingZeroes,
        eIndex = eLen - 1,
        eVal,
        rArray;

    aArray = redscale.modular.modBinary( aArray, trailingZeroes );
    rArray = redscale.util.copy( aArray, 0, new Int16Array( aArray.length ), 0, aArray.length );

    eBits--;
    eShift--;

    if ( eShift < 0 ) {
      eShift += 16;
      eIndex--;
    }

    while ( eBits !== 0 ) {
      eVal = (aExpo[eIndex] >>> eShift) & 1;

      rArray = redscale.modular.modBinary( redscale.arithmetic.square( rArray ), trailingZeroes );

      if ( eVal === 1 ) {
        rArray = redscale.modular.modBinary( redscale.arithmetic.multiply( rArray, aArray ), trailingZeroes );
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
    oMod = redscale.bitwise.bitShiftRight( aMod, trailingZeroes );
    eMod = redscale.bitwise.bitShiftLeft( new Int16Array( [1] ), trailingZeroes, 0 );

    oResult = oddMod( aArray, aSign, aExpo, oMod );
    eResult = evenMod( aArray, aExpo, trailingZeroes );

    oModInv = redscale.modular.modInverse( oMod, 1, eMod );
    eModInv = redscale.modular.modInverse( eMod, 1, oMod );

    oProd = redscale.arithmetic.multiply( redscale.arithmetic.multiply( oResult, eMod ), eModInv );
    eProd = redscale.arithmetic.multiply( redscale.arithmetic.multiply( eResult, oMod ), oModInv );

    rArray = redscale.modular.mod( redscale.arithmetic.add( oProd, eProd ), 1, aMod )
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
redscale.modular.modPowGarner = function( cryptArray, nArray, pArray, qArray, secPArray, secQArray, pInvArray ) {
  var cpArray = redscale.modular.mod( cryptArray, 1, pArray ),
      cqArray = redscale.modular.mod( cryptArray, 1, qArray ),
      mpArray = redscale.modular.modPow( cpArray, 1, secPArray, 1, pArray ),
      mqArray = redscale.modular.modPow( cqArray, 1, secQArray, 1, qArray ),
      mArray;

  if ( redscale.util.compare( mpArray, mqArray ) !== -1 ) {
    mArray = redscale.modular.mod( redscale.arithmetic.subtract( mqArray, mpArray ), 1, qArray );
  } else {
    mArray = redscale.modular.mod( redscale.arithmetic.subtract( redscale.arithmetic.add( mqArray, pArray ), mpArray ), 1, qArray );
  }

  mArray = redscale.modular.mod( redscale.arithmetic.multiply( mArray, pInvArray ), 1, qArray );
  mArray = redscale.modular.mod( redscale.arithmetic.multiply( mArray, pArray ), 1, nArray );

  return redscale.modular.mod( redscale.arithmetic.add( mArray, mpArray ), 1, nArray );
};