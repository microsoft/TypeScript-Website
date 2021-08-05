// @ts-check
// @errors: 2339

/** @param {any[]} arr */
// @annotate: left { "arrowRot": "44 18 -3", "textDegree": "1deg" } - Using JSDoc to give type information
function compact(arr) {
    if (arr.length > 10)
      return arr.trim(0, 10)
// @annotate: right { "arrowRot": "-64 1 2", "textDegree": "3deg" } - Now TS has found a bad call. Arrays have slice, not trim.
    return arr
  }