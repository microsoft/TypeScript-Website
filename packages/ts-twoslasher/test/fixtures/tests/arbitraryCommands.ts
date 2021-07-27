// The testing infra has set up `annotate` to be a customTag

// @annotate - left - You can use JSDoc comments to provide type information to your editor
function compact(arr: string[]) {
  if (arr.length > 10) return arr.length
  // @annotate - right - You can use JSDoc comments to provide type information to your editor
  return arr
}
