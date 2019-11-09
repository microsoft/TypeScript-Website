---
display: "Import Helpers"
---

For certain downleveling operations, TypeScript uses some helper code for operations like extending class, spreading arrays/objects, and async operations.
By default, these helpers are inserted into files which use them.
This can result in code duplication if the same helper is used in many different modules.

If the `importHelpers` flag is on, these helper functions are instead imported from the [tslib](https://www.npmjs.com/package/tslib) module.
You will need to ensure that the `tslib` module is able to be imported at runtime.
This only affects modules; global script files will not attempt to import modules.

```ts
// @showEmit
// @target: ES5
// @downleveliteration
// --importHelpers off: Spread helper is inserted into the file
// Note: This example also uses --downlevelIteration
export function fn(arr: number[]) {
   const arr2 = [1, ...arr];
}
```

```ts
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
// --importHelpers on: Spread helper is inserted imported from 'tslib'
export function fn(arr: number[]) {
   const arr2 = [1, ...arr];
}
```

### `noEmitHelpers`

Instead of importing helpers with [[importHelpers]], you can provide implementations in the global scope for the helpers you use and completely turn off emitting of helper functions:

```ts
// @showEmit
// @target: ES5
// @downleveliteration
// @noemithelpers

// __spread is assumed to be available
export function fn(arr: number[]) {
   const arr2 = [1, ...arr];
}
```
