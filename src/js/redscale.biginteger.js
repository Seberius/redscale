goog.provide(redscale.biginteger);
goog.provide(redscale.biginteger.BigInteger);

redscale.biginteger.BigInteger = function( signum, magnitude ) {
  this.redscaleType = "BigInteger";
  this.signum = signum;
  this.magnitude = magnitude;
};

redscale.biginteger.BigInteger.prototype.add = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.biginteger.add( this, bVal ) :
         typeof bVal === "number" ? redscale.biginteger.add( this, redscale.biginteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.biginteger.BigInteger.prototype.sub = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.biginteger.subtract( this, bVal ) :
         typeof bVal === "number" ? redscale.biginteger.subtract( this, redscale.biginteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.biginteger.BigInteger.prototype.mul = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.biginteger.multiply( this, bVal ) :
         typeof bVal === "number" ? redscale.biginteger.multiply( this, redscale.biginteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.biginteger.BigInteger.prototype.div = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.biginteger.divide( this, bVal ) :
         typeof bVal === "number" ? redscale.biginteger.divide( this, redscale.biginteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.biginteger.BigInteger.prototype.rem = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.biginteger.remainder( this, bVal ) :
         typeof bVal === "number" ? redscale.biginteger.remailnder( this, redscale.biginteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.biginteger.BigInteger.prototype.toString = function( radix ) {
  return redscale.magnitude.toString( this.signum, this.magnitude, radix );
};

redscale.biginteger.BigInteger.prototype.toNumber = function() {
  return redscale.magnitude.toNumber( this.signum, this.magnitude );
};

redscale.biginteger.BigInteger.fromNumber = function( aNum ) {
  return redscale.biginteger.fromNumber( aNum );
};

redscale.biginteger.add = function( aVal, bVal ) {
  var abComp,
      dSig,
      dMag;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }
  if ( aVal.signum === bVal.signum ) {
    dSig = aVal.signum;
    dMag = redscale.magnitude.add( aVal.magnitude, bVal.magnitude );
  } else {
    abComp = redscale.magnitude.compare( aVal.magnitude, bVal.magnitude );

    if ( abComp === 0 ) {
      dSig = 0;
      dMag = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      dSig = abComp === aVal.signum ? 1 : -1;
      dMag = redscale.magnitude.subtract( aVal.magnitude, bVal.magnitude );
    } else {
      dSig = abComp === aVal.signum ? 1 : -1;
      dMag = redscale.magnitude.subtract( bVal.magnitude, aVal.magnitude );
    }
  }

  return new this.BigInteger( dSig, dMag );
};

redscale.biginteger.subtract = function( aVal, bVal ) {
  var abComp,
      sSig,
      sMag;

  if ( aVal.signum === 0 ) { return bVal; }
  if ( bVal.signum === 0 ) { return aVal; }
  if ( aVal.signum !== bVal.signum ) {
    sSig = aVal.signum;
    sMag = redscale.magnitude.add( aVal.magnitude, bVal.magnitude );
  } else {
    abComp = redscale.magnitude.compare( aVal.magnitude, bVal.magnitude );

    if ( abComp === 0 ) {
      sSig = 0;
      sMag = new Int16Array( 0 );
    } else if ( abComp > 0 ) {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.magnitude.subtract( aVal.magnitude, bVal.magnitude );
    } else {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.magnitude.subtract( bVal.magnitude, aVal.magnitude );
    }
  }

  return new this.BigInteger( sSig, sMag );
};

redscale.biginteger.multiply = function( aVal, bVal ) {
  var pSig,
      pMag;

  if ( aVal.signum === 0 || bVal.signum === 0 ) { return new this.BigInteger( 0, new Int16Array( 0 ) ) }

  pSig = aVal.signum === bVal.signum ? 1 : -1;
  pMag = redscale.magnitude.multiply( aVal.magnitude, bVal.magnitude );

  return new this.BigInteger( pSig, pMag );
};

redscale.biginteger.divide = function( aVal, bVal ) {
  var qSig,
      qMag;

  qMag = redscale.magnitude.divide( aVal.magnitude, bVal.magnitude )[0];
  qSig = qMag.length === 0 ? 0 :
         aVal.signum === bVal.signum ? 1 : -1;

  return new this.BigInteger( qSig, qMag );
};

redscale.biginteger.remainder = function( aVal, bVal ) {
  var qSig,
      qMag;

  qMag = redscale.magnitude.divide( aVal.magnitude, bVal.magnitude )[1];
  qSig = qMag.length === 0 ? 0 : aVal.signum;

  return new this.BigInteger( qSig, qMag );
};

redscale.biginteger.fromNumber = function( aNum ) {
  var aSig = aNum === 0 ? 0 : aNum > 0 ? 1 : -1,
      aMag = redscale.magnitude.fromNumber( aNum * aSig );

  return new this.BigInteger( aSig, aMag );
};