// @ts-check
// @errors: 2339

/** @param {any[]} arr */
function compact(arr) {
    if (arr.length > 10)
      return arr.trim(0, 10)
    return arr
  }