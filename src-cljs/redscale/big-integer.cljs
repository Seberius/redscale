(ns redscale.big-integer)

(defn big-integer
  ([n]
   (big-integer n 10))
  ([n ^Number radix]
   (let [s (str n)
         r (int radix)])))

(defn number-char? [s]
  (re-find #"\d" s))

(defn get-decimal-index [s]
  (let [si (.indexOf s ".")
        slen (count s)]
    (if (= si -1)
      si
      (- slen si))))

(defn str->magnitude [s]
  (let [mstr (filter number-char? (map str s))]
    (mapv #(Integer/parseInt %) mstr)))

(defn get-sign [s]
  (let [x (first s)]
    (cond
      (= s "0") 0
      (= x \-)  -1
      :else     1)))

(defn parse-big-int [s]
  (let [mag   (str->magnitude s)
        index (get-decimal-index s)
        sign  (get-sign s)]
    [sign mag index]))

(defn- add-big-integers [x y]
  (let [xs (.sign x)
        ys (.sign y)
        xm (.magnitude x)
        ym (.magnitude y)
        zs (* xs ys)
        zm (add-vectors xm ym)]
    (BigNumber. zs (trim-zero zm))))

(defn number-char? [s]
  (re-find #"\d" s))

(defn trim-zeroes [v]
  (loop [t v
         i (peek t)]
    (if (= i 0)
      (recur (pop t) (peek (pop t)))
      t)))

(defn str->magnitude [s]
  (let [mstr (filter number-char? (map str s))]
    (reverse (mapv #(Integer/parseInt %) mstr))))

(defn get-sign [s]
  (let [x (first s)]
    (if (= x \-)
      -1
      1)))

(defn parse-big-int [s]
  (let [mag   (str->magnitude s)
        sign  (get-sign s)]
    (BigNumber. sign mag)))

(defn map-longest
  [f default & colls]
  (lazy-seq
   (when (some seq colls)
     (cons
      (apply f (map #(if (seq %) (first %) default) colls))
      (apply map-longest f default (map rest colls))))))

;General Arithmetic
(defn- compare-magnitude [xm xs ym ys]
  (let [xlen (count xm)
        ylen (count ym)]
    (cond
      (= xm ym)     (if (not= xs ys) 0, 1)
      (> xlen ylen) 1
      (< xlen ylen) -1
      (= xlen ylen) (loop [i (dec xlen)]
                      (if (>= i 0)
                        (let [xi (nth xm i)
                              yi (nth ym i)]
                          (cond
                            (< xi yi) -1
                            (> xi yi) 1
                            :else (recur (dec i))))
                        0)))))


;Addition
(defn- adding [x y]
  (let [value (+ x y)]
    (list (quot value 10) (mod value 10))))

(defn- add-vectors [m1 m2]
  (let [[c m] (apply map list (map-longest adding 0 m1 m2))]
    (trim-zeroes (mapv last (map-longest adding 0 (conj c 0) m)))))

(defn- add [xm xs ym ys cm]
  (let [cs (* xs cm)]
    (cond
      (= xs 0)  [ys ym]
      (= ys 0)  [xs xm]
      (= xs ys) [xs (add-vectors xm ym)]
      (= cm 0)  [0 [0]]
      (> cm 0)  [cs (subtract-vectors xm ym)]
      :else     [cs (subtract-vectors ym xm)])))

(defn f-addition [this y]
  (let [xs (.sign this)
        ys (.sign y)
        xm (.magnitude this)
        ym (.magnitude y)
        cm (compare-magnitude xm xs ym ys)
        [zs zm] (add xm xs ym ys cm)]
    (BigNumber. zs zm)))


;Subtraction
(defn- subtracting [x y]
  (let [value (- x y)]
    (if (< value 0)
      (list 1 (+ value 10))
      (list 0 value))))

(defn- subtract-vectors [m1 m2]
  (let [[b m] (apply map list (map-longest subtracting 0 m1 m2))]
    (trim-zeroes (mapv last (map-longest subtracting 0 m (concat [0] b))))))

(defn- subtract [xm xs ym ys cm]
  (let [cs (* xs cm)]
    (cond
      (= xs 0)     [(* ys -1) ym]
      (= ys 0)     [xs xm]
      (not= xs ys) [xs (add-vectors xm ym)]
      (= cm 0)     [0 [0]]
      (> cm 0)     [cs (subtract-vectors xm ym)]
      :else        [cs (subtract-vectors ym xm)])))

(defn f-subtraction [this y]
  (let [xs (.sign this)
        ys (.sign y)
        xm (.magnitude this)
        ym (.magnitude y)
        cm (compare-magnitude xm xs ym ys)
        [zs zm] (subtract xm xs ym ys cm)]
    (BigNumber. zs zm)))


;Multiplication
(defn- carry-zero? [c]
  (= '(0) (distinct c)))

(defn- concat-zeroes [m i]
  (concat (take i (repeat 0)) m))

(defn- shift-magnitudes [v]
  (map concat-zeroes v (range)))

(defn- shift-carry [c]
  (conj c 0))

(defn- add-carry [& vs]
  (apply map list (map adding (apply map-longest + 0 vs))))

(defn- parse-carry [v]
  (let [sv (shift-magnitudes v)]
    (apply add-carry sv)))

(defn- reduce-vectors [m]
  (let [cm (parse-carry m)]
    (loop [[carry magnitude] cm]
      (if (carry-zero? carry)
        (into [] magnitude)
        (recur (add-carry (shift-carry carry) magnitude))))))

(defn- multiplying [m1 m2]
  (for [v1 m1]
    (for [v2 m2]
      (* v1 v2))))

(defn- multiply-vectors [xm ym]
  (trim-zeroes (reduce-vectors (multiplying xm ym))))

(defn- multiply [xm xs ym ys]
  (cond
    (or (= xs 0)
        (= ys 0)) [0]
    :else         (multiply-vectors xm ym)))

(defn f-multiplication [this y]
  (let [xs (.sign this)
        ys (.sign y)
        xm (.magnitude this)
        ym (.magnitude y)
        zs (* xs ys)
        zm (multiply xm xs ym ys)]
    (BigNumber. zs zm)))


;Big Integer
(defprotocol IValueOf
  (-valueOf [this]))

(defprotocol IArithmetic
  (-addition [this y])
  (-subtraction [this y])
  (-multiplication [this y]))

(deftype BigNumber [^Number sign magnitude]
  IValueOf
  (-valueOf [this]
    (apply str (if (< sign 0) "-" "") (reverse magnitude)))

  IArithmetic
  (-addition [this y]
    (let [xs (sign)
          ys (.sign y)
          xm (magnitude)
          ym (.magnitude y)
          cm (compare-magnitude xm xs ym ys)
          [zs zm] (add xm xs ym ys cm)]
      (BigNumber. zs zm)))
  (-subtraction [this y]
    (let [xs (sign)
          ys (.sign y)
          xm (magnitude)
          ym (.magnitude y)
          cm (compare-magnitude xm xs ym ys)
          [zs zm] (subtract xm xs ym ys cm)]
      (BigNumber. zs zm)))
  (-multiplication [this y]
    (let [xs (.sign this)
          ys (.sign y)
          xm (.magnitude this)
          ym (.magnitude y)
          zs (* xs ys)
          zm (multiply xm xs ym ys)]
      (BigNumber. zs zm))))

;; Testing
(defn- multiply [xm xs ym ys]
  (cond
    (or (= xs 0)
      (= ys 0)) [0]
    :else         (multiply-vectors xm ym)))

(defn multiplying [x y]
  (let [value (* x y)]
    (list (quot value 10) (mod value 10))))

(defn- multiply-distribute [m1 m2]
  (map (fn [x] (apply map-longest + 0 x))
    (map shift
      (map (fn [v1] (apply map list (map #(multiplying v1 %) m2))) m1))))

(defn shift [[x y]]
  (list (conj x 0) y))

(defn multiply-vectors [m1 m2]
  (let [z (multiply-shift-vectors (multiply-distribute m1 m2))]
    (apply add-vectors z)))

(defn f-multiplication [this y]
  (let [xs (.sign this)
        ys (.sign y)
        xm (.magnitude this)
        ym (.magnitude y)
        zs (* xs ys)
        zm (multiply xm xs ym ys)]
    (BigNumber. zs zm)))

(defn add-vectors [& args]
  (let [[c m] (apply map list (apply map-longest adding 0 args))]
    (trim-zeroes (mapv last (map-longest adding 0 (conj c 0) m)))))

(defn adding [& nums]
  (let [value (apply + nums)]
    (list (quot value 10) (mod value 10))))

(defn- shift-carry [c]
  (conj c 0))

(defn- carry-zero? [c]
  (= '(0) (distinct c)))

(defn- add-carry [& vs]
  (apply map list (map adding (apply map-longest + 0 vs))))

(defn- parse-carry [v]
  (let [sv (multiply-shift-vectors v)]
    (apply add-carry sv)))

(defn- distribute [m1 m2]
  (for [v1 m1]
    (for [v2 m2]
      (* v1 v2))))

(defn- reduce-vectors [m]
  (let [cm (parse-carry m)]
    (loop [[carry magnitude] cm]
      (if (carry-zero? carry)
        (into [] magnitude)
        (recur (add-carry (shift-carry carry) magnitude))))))

(defn- multiply-vectors [xm ym]
  (trim-zeroes (reduce-vectors (distribute xm ym))))

(defn- multiply-shift-vectors [v]
  (loop [mv (reverse (into () v))
         nv (list)
         n (peek mv)
         i 0]
    (if (nil? n)
      nv
      (recur
        (pop mv)
        (conj nv (into [] (concat (take i (repeat 0)) n)))
        (peek (pop mv))
        (inc i)))))