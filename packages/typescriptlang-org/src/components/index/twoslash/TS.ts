// twoslash: { themes: ["min-light", "../../../packages/typescriptlang-org/lib/themes/typescript-beta-dark"] }
function compact(arr: string[]) {
  if (arr.length > 10) return arr.slice(0, 10)
  return arr
}
