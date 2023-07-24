// twoslash: { themes: ["min-dark", "../../../packages/typescriptlang-org/src/components/index/twoslash/homepage"] }
// @errors: 2339
// @ts-check

/** @param {any[]} arr */
function compact(arr) {
  if (arr.length > 10) return arr.trim(0, 10)
  return arr
}
