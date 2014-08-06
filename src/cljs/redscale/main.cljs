(ns redscale.main)

(defprotocol IPrecisionMath
  (add [this b])
  (sub [this b])
  (mul [this b])
  (div [this b])
  (gcd [this b]))

(extend-protocol IPrecisionMath
  BigInteger
  (add [this b] )
  (sub [this b] )
  (mul [this b] )
  (div [this b] )
  Ratio
  (add [this b] )
  (sub [this b] )
  (mul [this b] )
  (div [this b] )
  Number
  (add [this b] )
  (sub [this b] )
  (mul [this b] )
  (div [this b] ))