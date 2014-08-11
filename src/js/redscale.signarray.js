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
  var abComp;

  if ( aArray.sign === 0 ) {
    aArray.sign = bArray.sign;
    aArray.array = redscale.copy( bArray, 0, new Int16Array( bArray.array.length ), 0, bArray.array.length );

    return bArray;
  }
  if ( bArray.sign === 0 ) { return aArray; }
  if ( aArray.sign === bArray.sign ) {
    aArray.array = redscale.add( aArray.array, bArray.array );
  } else {
    abComp = redscale.compare( aArray.array, bArray.array );

    if ( abComp === 0 ) {
      aArray.sign = 0;
      aArray.array = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      aArray.sign = abComp === aArray.sign ? 1 : -1;
      aArray.array = redscale.subtract( aArray.array, bArray.array );
    } else {
      aArray.sign = abComp === aArray.sign ? 1 : -1;
      aArray.array = redscale.subtract( bArray.array, aArray.array );
    }
  }

  return aArray;
};

/**
 * Signed Subtract
 * @param {!redscale.SignArray} aArray
 * @param {!redscale.SignArray} bArray
 * @returns {!redscale.SignArray}
 */
redscale.SignArray.signSubtract = function( aArray, bArray ) {
  var abComp;

  if ( aArray.sign === 0 ) {
    aArray.sign = bArray.sign * -1;
    aArray.array = redscale.copy( bArray, 0, new Int16Array( bArray.array.length ), 0, bArray.array.length );

    return aArray;
  }
  if ( bArray.sign === 0 ) { return aArray; }
  if ( aArray.sign !== bArray.sign ) {
    aArray.array = redscale.add( aArray.array, bArray.array );
  } else {
    abComp = redscale.compare( aArray.array, bArray.array );

    if ( abComp === 0 ) {
      aArray.sign = 0;
      aArray.array = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      aArray.sign = abComp === aArray.sign ? 1 : -1;
      aArray.array = redscale.subtract( aArray.array, bArray.array );
    } else {
      aArray.sign = abComp === aArray.sign ? 1 : -1;
      aArray.array = redscale.subtract( bArray.array, aArray.array );
    }
  }

  return aArray;
};