goog.provide('redscale.SignArray');

/**
 * Signed Array
 * @param {!number} sign
 * @param {Int16Array} array
 * @constructor
 */
redscale.SignArray = function( sign, array ) {
  this.sign = sign;
  this.array = array;
};

/**
 * Signed Add
 * @param {!redscale.SignArray} aArray
 * @param {!redscale.SignArray} bArray
 * @returns {!redscale.SignArray}
 */
redscale.SignArray.signAdd = function( aArray, bArray ) {
  var abComp,
      sSign,
      sArray;

  if ( aArray.sign === 0 ) { return bArray; }
  if ( bArray.sign === 0 ) { return aArray; }
  if ( aArray.sign === bArray.sign ) {
    sSign = aArray.sign;
    sArray = redscale.add( aArray.array, bArray.array );
  } else {
    abComp = redscale.compare( aArray.array, bArray.array );

    if ( abComp === 0 ) {
      sSign = 0;
      sArray = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      sSign = abComp === aArray.sign ? 1 : -1;
      sArray = redscale.subtract( aArray.array, bArray.array );
    } else {
      sSign = abComp === aArray.sign ? 1 : -1;
      sArray = redscale.subtract( bArray.array, aArray.array );
    }
  }

  return new redscale.SignArray( sSign, sArray );
};

/**
 * Signed Subtract
 * @param {!redscale.SignArray} aArray
 * @param {!redscale.SignArray} bArray
 * @returns {!redscale.SignArray}
 */
redscale.SignArray.signSubtract = function( aArray, bArray ) {
  var abComp,
      dSign,
      dArray;

  if ( aArray.array === 0 ) { return bArray; }
  if ( bArray.array === 0 ) { return aArray; }
  if ( aArray.array !== bArray.array ) {
    dSign = aArray.sign;
    dArray = redscale.add( aArray.array, bArray.array );
  } else {
    abComp = redscale.compare( aArray.array, bArray.array );

    if ( abComp === 0 ) {
      dSign = 0;
      dArray = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      dSign = abComp === aArray.sign ? 1 : -1;
      dArray = redscale.subtract( aArray.array, bArray.array );
    } else {
      dSign = abComp === aArray.sign ? 1 : -1;
      dArray = redscale.subtract( bArray.array, aArray.array );
    }
  }

  return new redscale.SignArray( dSign, dArray );
};