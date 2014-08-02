(defproject redscale "0.1.0"
  :description "Red Scale: A BigInteger, BigDecimal and Ratio library for ClojureScript."
  :url "http://example.com/FIXME"

  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2280"]]

  :plugins [[lein-cljsbuild "1.0.3"]]

  :source-paths ["src"]

  :cljsbuild { 
    :builds [{:id "redscale"
              :source-paths ["src/cljs"]
              :compiler {
                :output-to "redscale.js"
                :output-dir "out"
                :optimizations :none
                :source-map true}}]})
