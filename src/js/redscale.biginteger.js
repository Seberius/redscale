goog.provide(redscale.biginteger);
goog.provide(redscale.biginteger.BigInteger);

redscale.biginteger.BigInteger = function BigInteger( signum, magnitude ) {
  this.redscaleType = "BigInteger";
  this.signum = signum;
  this.magnitude = magnitude;
};

redscale.biginteger.BigInteger.prototype.add = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.biginteger.add( this, bVal ) :
         bVal.redscaleType === "Ratio" ? redscale.ratio.add( this.toRatio(), bVal ) :
         typeof bVal === "number" ? redscale.biginteger.add( this, redscale.biginteger.fromNumber( bVal ) ) :
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
      sSig,
      sMag;

  if ( bVal.signum === 0 ) { return aVal; }
  if ( aVal.signum === 0 ) { return bVal; }
  if ( aVal.signum === bVal.signum ) {
    sSig = aVal.signum;
    sMag = redscale.magnitude.add( aVal.magnitude, bVal.magnitude );
  } else {
    abComp = redscale.magnitude.compare( aVal.magnitude, bVal.magnitude );

    if ( abComp === 0 ) {
      sSig = 0;
      sMag = new Int16Array(0);
    } else if ( abComp > 0 ) {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.magnitude.subtract( aVal.magnitude, bVal.magnitude )
    } else {
      sSig = abComp === aVal.signum ? 1 : -1;
      sMag = redscale.magnitude.subtract( bVal.magnitude, aVal.magnitude )
    }
  }

  return new this.BigInteger( sSig, sMag );
};

redscale.biginteger.fromNumber = function( aNum ) {
  var aSig = aNum === 0 ? 0 : aNum > 0 ? 1 : -1,
      aMag = redscale.magnitude.fromNumber( aNum * aSig );

  return new this.BigInteger( aSig, aMag );
};