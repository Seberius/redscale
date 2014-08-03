(ns redscale.main)

(defprotocol IPrecisionMath
  (add [this b])
  (subtract [this b])
  (multiply [this b])
  (divide [this b])
  (gcd [this b]))

(deftype BigInteger [sign magnitude maglen]
  Object
  (to-string [this radix] (redscale.magnitude/arrayToString sign magnitude radix))
  (of-value [this] this)
  (to-number [this] (redscale.magnitude/arrayToNumber sign magnitude))
  IPrecisionMath
  (add [this b] )
  (subtract [this b] )
  (multiply [this b] )
  (divide [this b] ))