// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
// --importHelpers on: Spread helper is inserted imported from 'tslib'
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
