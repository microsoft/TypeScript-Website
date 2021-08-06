// @annotate: left { "arrowRot": "40 6 4", "textDegree": "-4deg", "top": "0.9rem" } - TypeScript adds natural syntax for providing types
function compact(arr: string[]) {
    if (arr.length > 10)
      return arr.slice(0, 10)
    return arr
}