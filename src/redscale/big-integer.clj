(ns redscale.big-integer)

;;Helper Functions
(defn long-mask [n]
  (bit-and n (unchecked-long 0xFFFFFFFF)))

(defn unsigned-long-mask [n]
  (bit-xor n (unchecked-long 0x8000000000000000)))

(defn unsigned-int-mask [n]
  (bit-xor n (unchecked-int 0x80000000)))

(defn inc-int-array [array index]
  (aset ^ints array index (unchecked-inc (aget ^ints array index))))

(defn dec-int-array [array index]
  (aset ^ints array index (unchecked-dec (aget ^ints array index))))

(defn inc-long-array [array index]
  (aset ^longs array index (unchecked-inc (aget ^longs array index))))

(defn dec-long-array [array index]
  (aset ^longs array index (unchecked-dec (aget ^longs array index))))

(defn number-leading-zeroes? [n]
  (if (zero? n)
    32
    (let [n-array (long-array 2)]
      (aset ^longs n-array 0 (long-mask n))
      (when (<= (aget ^longs n-array 0) 0x0000FFFF)
        (aset ^longs n-array 0 (bit-shift-left (aget ^longs n-array 0) 16))
        (aset ^longs n-array 1 (+ (aget ^longs n-array 1) 16)))
      (when (<= (aget ^longs n-array 0) 0x00FFFFFF)
        (aset ^longs n-array 0 (bit-shift-left (aget ^longs n-array 0) 8))
        (aset ^longs n-array 1 (+ (aget ^longs n-array 1) 8)))
      (when (<= (aget ^longs n-array 0) 0x0FFFFFFF)
        (aset ^longs n-array 0 (bit-shift-left (aget ^longs n-array 0) 4))
        (aset ^longs n-array 1 (+ (aget ^longs n-array 1) 4)))
      (when (<= (aget ^longs n-array 0) 0x3FFFFFFF)
        (aset ^longs n-array 0 (bit-shift-left (aget ^longs n-array 0) 2))
        (aset ^longs n-array 1 (+ (aget ^longs n-array 1) 2)))
      (when (<= (aget ^longs n-array 0) 0x7FFFFFFF)
        (aset ^longs n-array 1 (+ (aget ^longs n-array 1) 1)))
      (aget ^longs n-array 1))))

(defn number-trailing-zeroes? [n]
  (- 32 (number-leading-zeroes? (bit-and (bit-not n) (unchecked-add n -1)))))

;Assumes non-zero
(defn array-number-trailing-zeroes? [a-array a-len]
  (loop [a-index 0]
    (if (and (< a-index (- a-len 1)) (zero? (aget ^ints a-array a-index)))
      (recur (inc a-index))
      (+ (bit-shift-left a-index 5) (number-trailing-zeroes? (aget ^ints a-array a-index))))))

(defn array-bit-shift-left [src-array src-len left-shift leading-zeroes]
  (let [tar-len (+ src-len leading-zeroes)
        tar-array (int-array tar-len)
        right-shift (- 32 left-shift)]
    (if (zero? left-shift)
      (System/arraycopy src-array 0 tar-array 0 src-len)
      (loop [src-index 0, carry 0]
        (if (< src-index src-len)
          (let [src-val (long-mask (aget ^ints src-array src-index))]
            (aset ^ints tar-array src-index (unchecked-int (bit-or (bit-shift-left src-val left-shift) carry)))
            (recur (unchecked-inc-int src-index) (unsigned-bit-shift-right src-val right-shift)))
          (if (> tar-len src-len)
            (aset ^ints tar-array src-len (unchecked-int carry))))))
    tar-array))

(defn array-bit-shift-right [tar-array tar-len shift-num]
  (if (zero? shift-num)
    tar-array
    (let [left-shift (- 32 shift-num)]
      (loop [tar-index (- tar-len 1), carry 0]
        (when (>= tar-index 0)
          (let [tar-val (long-mask (aget ^ints tar-array tar-index))]
            (aset ^ints tar-array tar-index (unchecked-int (bit-or
                                                             carry
                                                             (unsigned-bit-shift-right tar-val shift-num))))
            (recur (unchecked-dec-int tar-index) (bit-shift-left tar-val left-shift)))))
      tar-array)))

(defn array-int-shift-left [src-array src-len shift-num leading-zeroes]
  (let [tar-array (int-array (+ src-len shift-num leading-zeroes))]
    (System/arraycopy src-array 0 tar-array shift-num src-len)
    tar-array))

(defn array-int-shift-right [src-array src-len shift-num]
  (if-not (zero? shift-num)
    (loop [t-index 0, s-index shift-num]
      (when (< s-index src-len)
        (aset ^ints src-array t-index (aget ^ints src-array s-index))
        (aset ^ints src-array s-index 0)
        (recur (inc t-index) (inc s-index)))))
  src-array)

(defn array-shift-left [src-array src-len shift-num]
  (let [int-shift (unsigned-bit-shift-right shift-num 5)
        bit-shift (bit-and shift-num 0x3F)
        zero-num (number-leading-zeroes? (aget ^ints src-array (dec src-len)))
        tar-array (array-int-shift-left src-array src-len int-shift (if (< zero-num bit-shift) 1 0))]
    (if (zero? bit-shift)
      tar-array
      (array-bit-shift-left tar-array (alength tar-array) bit-shift 0))))

(defn array-shift-right [src-array src-len shift-num]
  (let [int-shift (unsigned-bit-shift-right shift-num 5)
        bit-shift (bit-and shift-num 0x3F)
        tar-array (array-int-shift-right src-array src-len int-shift)]
    (if (zero? bit-shift)
      tar-array
      (array-bit-shift-right tar-array src-len bit-shift))))

;;Knuth Division
(defn div-int64-by-int32 [quotrem a-long b]
  (let [b-long (long-mask b)]
    (case b
      1 (do
          (aset ^longs quotrem 0 (long-mask a-long))
          (aset ^longs quotrem 1 0))
      2 (do
          (aset ^longs quotrem 0 (long-mask (unsigned-bit-shift-right a-long 1)))
          (aset ^longs quotrem 1 (bit-and a-long 1)))
      (if (>= a-long 0)
        (do
          (aset ^longs quotrem 0 (long-mask (quot a-long b-long)))
          (aset ^longs quotrem 1 (long-mask (mod a-long b-long))))
        (let [norm-a (unsigned-bit-shift-right a-long 1)
              norm-b (unsigned-bit-shift-right b-long 1)]
          (aset ^longs quotrem 0 (quot norm-a norm-b))
          (aset ^longs quotrem 1 (bit-or (bit-shift-left (mod norm-a norm-b) 1) (bit-and a-long 1)))
          (if (not= (bit-and b 1) 0)
            (if (<= (aget ^longs quotrem 0) (aget ^longs quotrem 1))
              (aset ^longs quotrem 1 (unchecked-subtract (aget ^longs quotrem 1) (aget ^longs quotrem 0)))
              (if (<= (- (aget ^longs quotrem 0) (aget ^longs quotrem 1)) b-long)
                (do
                  (aset ^longs quotrem 0 (dec-long-array quotrem 0))
                  (aset ^longs quotrem 1 (+ (aget ^longs quotrem 1) (- b-long (aget ^longs quotrem 0)))))
                (do
                  (aset ^longs quotrem 0 (unchecked-subtract (aget ^longs quotrem 0) 2))
                  (aset ^longs quotrem 1 (+ (aget ^longs quotrem 1)
                                           (unchecked-subtract (bit-shift-left b-long 1)
                                             (aget ^longs quotrem 0))))))))
          (aset ^longs quotrem 0 (long-mask (aget ^longs quotrem 0)))
          (aset ^longs quotrem 1 (long-mask (aget ^longs quotrem 1))))))))

(defn div-correction [quotrem a-low b-low b-high-long]
  (let [test-prod (unchecked-multiply (long (aget ^longs quotrem 0)) (long (long-mask b-low)))
        test-rem  (bit-or (bit-shift-left (aget ^longs quotrem 1) 32) (long-mask a-low))]
    (when (> (unsigned-long-mask test-prod) (unsigned-long-mask test-rem))
      (dec-long-array quotrem 0)
      (aset ^longs quotrem 1 (unchecked-add (long-mask (aget ^longs quotrem 1)) b-high-long))
      (if (zero? (unsigned-bit-shift-right (aget ^longs quotrem 1) 32))
        (if (> (unsigned-long-mask (unchecked-subtract test-prod (long-mask b-low)))
               (unsigned-long-mask (bit-or (bit-shift-left (long-mask (aget ^longs quotrem 1)) 32) (long-mask a-low))))
          (dec-long-array quotrem 0))))))

(defn div-mul-sub [quotrem a-array b-array q-index b-len]
  (let [carry (long-array 3)]
    (loop [a-index q-index, b-index 0]
      (when (< b-index b-len)
        (aset ^longs carry 0 (unchecked-multiply
                               (unchecked-long (long-mask (aget ^ints b-array b-index)))
                               (unchecked-long (long-mask (aget ^longs quotrem 0)))))
        (aset ^longs carry 1 (unchecked-subtract
                               (unchecked-subtract
                                 (long-mask (aget ^ints a-array a-index))
                                 (long-mask (aget ^longs carry 0)))
                               (long-mask (aget ^longs carry 2))))
        (aset ^ints a-array a-index (unchecked-int (aget ^longs carry 1)))
        (aset ^longs carry 2 (unchecked-subtract
                               (bit-shift-right (aget ^longs carry 0) 32)
                               (bit-shift-right (aget ^longs carry 1) 32)))
        (recur (unchecked-inc a-index) (unchecked-inc b-index))))
    (aset ^longs quotrem 1 (unchecked-subtract
                             (long-mask (aget ^ints a-array (+ q-index b-len)))
                             (long-mask (aget ^longs carry 2))))
    (aset ^ints a-array (+ q-index b-len) (unchecked-int (aget ^longs quotrem 1)))))

(defn div-add [a-array b-array q-index b-len]
  (let [carry (long-array 2)]
    (loop [a-index q-index, b-index 0]
      (when (< b-index b-len)
        (aset ^longs carry 0 (+
                               (long-mask (aget ^ints a-array a-index))
                               (long-mask (aget ^ints b-array b-index))
                               (aget ^longs carry 1)))
        (aset ^ints a-array a-index (unchecked-int (aget ^longs carry 0)))
        (aset ^longs carry 1 (bit-shift-right (aget ^longs carry 0) 32))
        (recur (inc a-index) (inc b-index))))
    (aset ^ints a-array (+ q-index b-len) (unchecked-int
                                            (unchecked-add
                                              (aget ^ints a-array (+ q-index b-len))
                                              (aget ^longs carry 1))))))

(defn divide-f [a-array b-array]
  (let [a-len (alength ^ints a-array)
        b-len (alength ^ints b-array)
        q-len (+ (- a-len b-len) 1)
        norm-a-len (+ a-len 1)
        shift-num (number-leading-zeroes? (aget ^ints b-array (- b-len 1)))
        norm-a-array (array-bit-shift-left a-array a-len shift-num 1)
        norm-b-array (array-bit-shift-left b-array b-len shift-num 0)
        q-array (int-array q-len)
        quotrem (long-array 2)
        b-high (aget ^ints norm-b-array (- b-len 1))
        b-high-long (long-mask b-high)
        b-low (aget ^ints norm-b-array (- b-len 2))]
    (loop [q-index (- q-len 1)
           a-index a-len]
      (when (>= q-index 0)
        (let [a-high (aget ^ints norm-a-array a-index)
              a-med (aget ^ints norm-a-array (- a-index 1))
              a-long (bit-or (bit-shift-left (long a-high) 32) (long-mask a-med))]
          (if (= a-high b-high)
            (do (aset ^longs quotrem 0 -1) (aset ^longs quotrem 1 (+ a-high a-med)))
            (div-int64-by-int32 quotrem a-long b-high))
          (when-not (zero? (aget ^longs quotrem 0))
            (div-correction quotrem (aget ^ints norm-a-array (- a-index 2)) b-low b-high-long)
            (div-mul-sub quotrem norm-a-array norm-b-array q-index b-len)
            (when (< (unchecked-int (aget ^longs quotrem 1)) 0)
              (div-add norm-a-array norm-b-array q-index b-len)
              (dec-long-array quotrem 0))))
        (aset ^ints q-array q-index (unchecked-int (aget ^longs quotrem 0)))
        (recur (dec q-index) (dec a-index))))
    (if-not (zero? shift-num)
      (array-bit-shift-right norm-a-array norm-a-len shift-num))
    (vector q-array norm-a-array)))

;; Multiplication
(defn multiply-f [a-array b-array]
  (let [a-len (int (alength ^ints a-array))
        b-len (int (alength ^ints b-array))
        p-array (int-array (+ a-len b-len))
        carry (long-array 1)]
    (loop [a-index 0]
      (when (< a-index a-len)
        (aset ^longs carry 0 0)
        (loop [b-index 0
               p-index a-index]
          (if (< b-index b-len)
            (let [prod (+
                         (unchecked-multiply
                            (unchecked-long (long-mask (aget ^ints a-array a-index)))
                            (unchecked-long (long-mask (aget ^ints b-array b-index))))
                         (bit-and (aget ^ints p-array p-index) (long 0xFFFFFFFF))
                         (aget ^longs carry 0))]
              (aset ^ints p-array p-index (unchecked-int (long-mask prod)))
              (aset ^longs carry (unsigned-bit-shift-right prod 32))
              (recur (inc b-index) (inc p-index)))))
        (aset ^ints p-array (+ a-index b-len) (unchecked-int (aget ^longs carry 0)))
        (recur (inc a-index))))
    p-array))

;;Addition
(defn add-f [a-array b-array]
  (let [a-len (int (alength ^ints a-array))
        b-len (int (alength ^ints b-array))
        s-len (int (+ (max a-len b-len) 1))
        t-array (int-array s-len)
        s-array (int-array s-len)]
    (System/arraycopy a-array 0 t-array 0 a-len)
    (System/arraycopy b-array 0 s-array 0 b-len)
    (loop [s-index 0
           carry 0]
      (when (< s-index s-len)
        (let [sum (+
                    (long-mask (aget ^ints t-array s-index))
                    (long-mask (aget ^ints s-array s-index))
                    carry)]
          (aset ^ints s-array s-index (unchecked-int sum))
          (recur (unchecked-inc-int s-index) (unsigned-bit-shift-right sum 32)))))
    s-array))

;;Subtraction
(defn subtract-f [a-array b-array]
  (let [a-len (alength ^ints a-array)
        b-len (alength ^ints b-array)
        d-array (int-array a-len)
        carry (long-array 1)]
    (System/arraycopy a-array 0 d-array 0 a-len)
    (loop [b-index 0]
      (if (< b-index b-len)
        (let [diff (+
                     (unchecked-subtract
                       (long-mask (aget ^ints d-array b-index))
                       (long-mask (aget ^ints b-array b-index)))
                     (aget ^longs carry 0))]
          (aset ^ints d-array b-index (unchecked-int diff))
          (aset ^longs carry 0 (bit-shift-right diff 32))
          (recur (inc b-index)))))
    (loop [d-index b-len]
      (when (< d-index a-len)
        (let [diff (+ (long-mask (aget ^ints d-array d-index)) (aget ^longs carry 0))]
          (aset ^ints d-array d-index diff)
          (aset ^longs carry 0 (bit-shift-right diff 32))
          (recur (inc d-index)))))
    d-array))

;;Binary GCD