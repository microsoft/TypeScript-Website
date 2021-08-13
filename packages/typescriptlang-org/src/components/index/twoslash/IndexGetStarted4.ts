// @annotate: left { "arrowRot": "40deg -5px -5px", "textDegree": "-4deg", "top": "0.9rem" } - TypeScript adds natural syntax for providing types
function compact(arr: string[]) {
  if (arr.length > 10)
    return arr.slice(0, 10)
  return arr
}