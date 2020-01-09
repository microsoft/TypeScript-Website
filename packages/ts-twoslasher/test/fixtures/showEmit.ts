// @showEmit
// @target: ES5
// @downleveliteration

// --importHelpers on: Spread helper will be imported from 'tslib'

export function fn(arr: number[]) {
  const arr2 = [1, ...arr]
}
