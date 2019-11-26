---
display: "Import Helpers"
---

For certain downleveling operations, TypeScript uses some helper code for operations like extending class, spreading arrays or objects, and async operations.
By default, these helpers are inserted into files which use them.
This can result in code duplication if the same helper is used in many different modules.

If the `importHelpers` flag is on, these helper functions are instead imported from the [tslib](https://www.npmjs.com/package/tslib) module.
You will need to ensure that the `tslib` module is able to be imported at runtime.
This only affects modules; global script files will not attempt to import modules.

For example, with this TypeScript:

```ts 
export function fn(arr: number[]) {
   const arr2 = [1, ...arr];
}
```

Turning on [`downlevelIteration`](#downlevelIteration) and `importHelpers` is not turned on:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
export function fn(arr: number[]) {
   const arr2 = [1, ...arr];
}
```

Then turning on both [`downlevelIteration`](#downlevelIteration) and `importHelpers`:

```ts twoslasher
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
export function fn(arr: number[]) {
   const arr2 = [1, ...arr];
}
```

### `noEmitHelpers`

Instead of importing helpers with [`importHelpers`](#importHelpers), you can provide implementations in the global scope for the helpers you use and completely turn off emitting of helper functions:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
// @noemithelpers
export function fn(arr: number[]) {
   const arr2 = [1, ...arr];
}
```
