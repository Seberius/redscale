(ns redscale.big-integer)

(deftype BigInteger [sign magnitude]
  Object
  (add [_ y]
    (let [xs (sign)
          ys (.sign y)
          xm (magnitude)
          ym (.magnitude y)
          cm (compare-magnitude xm xs ym ys)
          [zs zm] (add xm xs ym ys cm)]
      (BigNumber. zs zm)))
  (subtract [_ y]
    (let [xs (sign)
          ys (.sign y)
          xm (magnitude)
          ym (.magnitude y)
          cm (compare-magnitude xm xs ym ys)
          [zs zm] (subtract xm xs ym ys cm)]
      (BigNumber. zs zm)))
  (multiply [_ y]
    (let [xs (.sign this)
          ys (.sign y)
          xm (.magnitude this)
          ym (.magnitude y)
          zs (* xs ys)
          zm (multiply xm xs ym ys)]
      (BigNumber. zs zm)))
  (divide [_ y]
    (let [zm (divide-f xm xs ym ys)]
      (BigInteger. zs zm))))