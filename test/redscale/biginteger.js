describe( 'BigInteger', function() {
  var BigInt1,
      BigInt2,
      BigInt3,
      BigInt4;

  beforeEach( function() {
    BigInt1 = redscale.BigInteger.fromString( '98273492047204782098749032' );
    BigInt2 = redscale.BigInteger.fromString( '146464168059804875308365404' );
    BigInt3 = redscale.BigInteger.fromString( '544368789746413540798406790' );
    BigInt4 = redscale.BigInteger.fromString( '1654797498406469877097046314094960434064658749870');
  });

  it( 'add', function() {
    expect( BigInt1.add( BigInt2 ).toString() )
      .toBe( '244737660107009657407114436' );
  });

  it( 'subtract', function() {
    expect( BigInt1.subtract( BigInt4 ).toString() )
      .toBe( '-1654797498406469877096948040602913229282560000838' );
  });

  it( 'multiply', function() {
    expect( BigInt2.multiply( BigInt4 ).toString() )
      .toBe( '242368538911549894418875072976739710516719982745415685227995473775797497480' );
  });

  it( 'divide', function() {
    expect( BigInt4.divide( BigInt3 ).toString() )
      .toBe( '3039846386449402727062' );
  });

  it( 'remainder', function() {
    expect( BigInt4.remainder( BigInt3 ).toString() )
      .toBe( '67130286792085853841198890' );
  });

  it( "fromString", function() {
    expect( BigInt3.toString() )
      .toBe( '544368789746413540798406790' );
  });
});