// @errors: 2304
// @noImplicitAny: false
// @ts-check
// @annotate: left { "arrowRot": "44deg 7px -11px", "textDegree": "-3deg", "top": "1.3rem" } - Adding this to a JS file shows errors in your editor

function compact(arr) {
// @annotate: right { "arrowRot": "-60deg 1px 2px", "textDegree": "3deg", "top": "5.7rem" } - Discovered a type - the param is arr, not orr!
  if (orr.length > 10)
    return arr.trim(0, 10)
  return arr
}