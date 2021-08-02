// twoslash: { themes: ["min-dark", "min-light"] }
// @errors: 2339
// @ts-check

/** @param {any[]} arr */
function compact(arr) {
  if (arr.length > 10) return arr.trim(0, 10)
  return arr
}
