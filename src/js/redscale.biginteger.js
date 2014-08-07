goog.provide(redscale.BigInteger);

redscale.BigInteger = function( signum, magnitude ) {
  this.redscaleType = "BigInteger";
  this.signum = signum;
  this.magnitude = magnitude;
};

redscale.BigInteger.prototype.add = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.add( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.add( this, redscale.BigInteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.BigInteger.prototype.sub = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.subtract( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.subtract( this, redscale.BigInteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.BigInteger.prototype.mul = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.multiply( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.multiply( this, redscale.BigInteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.BigInteger.prototype.div = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.divide( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.divide( this, redscale.BigInteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.BigInteger.prototype.rem = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.remainder( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.remainder( this, redscale.BigInteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.BigInteger.prototype.divRem = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.divideRem( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.divideRem( this, redscale.BigInteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.BigInteger.prototype.gcd = function( bVal ) {
  return bVal.redscaleType === "BigInteger" ? redscale.BigInteger.gcd( this, bVal ) :
         typeof bVal === "number" ? redscale.BigInteger.gcd( this, redscale.BigInteger.fromNumber( bVal ) ) :
         function() { throw new TypeError( "Not a number." ); };
};

redscale.BigInteger.prototype.toString = function( radix ) {
  return redscale.magnitude.toString( this.signum, this.magnitude, radix );
};

redscale.BigInteger.prototype.ofValue = function() {
  return redscale.magnitude.toNumber( this.signum, this.magnitude );
};

redscale.BigInteger.prototype.toNumber = function() {
  return redscale.magnitude.toNumber( this.signum, this.magnitude );
};

redscale.BigInteger.prototype.negate = function() {
  return new redscale.BigInteger( this.signum * -1, this.magnitude );
};

redscale.BigInteger.prototype.abs = function() {
  return this.signum === -1 ? this.negate() : this;
};

redscale.BigInteger.ZERO = function() {
  return new this( 0, new Int16Array( 0 ) );
};

redscale.BigInteger.ONE = function() {
  return new this( 1, new Int16Array( [1] ) );
};

redscale.BigInteger.fromString = function( aStr, radix ) {
  var aRadix = radix ? radix : 10,
      aStrMag = aStr.match( /[a-z0-9]+/i ),
      leadingZeroes,
      aSig,
      aMag;

  if ( aStrMag.length === 0 ) { throw new Error( "Zero length number." ) }

  leadingZeroes = aStr.match( /[0]/ );

  if ( leadingZeroes.length === aStrMag.length ) { return this.ZERO() }

  aMag = redscale.magnitude.fromString( aStrMag.slice( leadingZeroes.length ), aRadix );
  aSig = aStr.indexOf( "-" ) === 0 ? -1 : 1;

  return new this( aSig, aMag );
};

redscale.BigInteger.fromNumber = function( aNum ) {
  var aSig = aNum === 0 ? 0 : aNum > 0 ? 1 : -1,
      aMag = redscale.magnitude.fromNumber( aNum * aSig );

  return new this( aSig, aMag );
};

redscale.BigInteger.add = function( aVal, bVal ) {
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

  return new this( dSig, dMag );
};

redscale.BigInteger.subtract = function( aVal, bVal ) {
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

  return new this( sSig, sMag );
};

redscale.BigInteger.multiply = function( aVal, bVal ) {
  var pSig,
      pMag;

  if ( aVal.signum === 0 || bVal.signum === 0 ) { return new this.BigInteger( 0, new Int16Array( 0 ) ) }

  pSig = aVal.signum === bVal.signum ? 1 : -1;
  pMag = redscale.magnitude.multiply( aVal.magnitude, bVal.magnitude );

  return new this( pSig, pMag );
};

redscale.BigInteger.divide = function( aVal, bVal ) {
  var qSig,
      qMag;

  qMag = redscale.magnitude.divide( aVal.magnitude, bVal.magnitude )[0];
  qSig = qMag.length === 0 ? 0 :
         aVal.signum === bVal.signum ? 1 : -1;

  return new this( qSig, qMag );
};

redscale.BigInteger.remainder = function( aVal, bVal ) {
  var rSig,
      rMag;

  rMag = redscale.magnitude.divide( aVal.magnitude, bVal.magnitude )[1];
  rSig = rMag.length === 0 ? 0 : aVal.signum;

  return new this( rSig, rMag );
};

// Divide and Remainder - returns an array containing a quotient BigInteger and remainder BigInteger
redscale.BigInteger.divideRem = function( aVal, bVal ) {
  var qSig,
      rSig,
      qMag,
      rMag,
      quotRem;

  quotRem = redscale.magnitude.divide( aVal.magnitude, bVal.magnitude );
  qMag = quotRem[0];
  qSig = qMag.length === 0 ? 0 :
         aVal.signum === bVal.signum ? 1 : -1;
  rMag = quotRem[1];
  rSig = rMag.length === 0 ? 0 : aVal.signum;

  return [new this( qSig, qMag ), new this( rSig, rMag )];
};

redscale.BigInteger.gcd = function( aVal, bVal ) {
  var gMag;

  if ( aVal.signum === 0 ) { return bVal.abs() }
  if ( bVal.signum === 0 ) { return aVal.abs() }

  gMag = redscale.magnitude.gcd( aVal.magnitude, bVal.magnitude );

  return new this( 1, gMag );
};