---
display: "Import Helpers"
oneline: "Allow importing helper functions from tslib once per project, instead of including them per-file."
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

Turning on [`downlevelIteration`](#downlevelIteration) and `importHelpers` is still false:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Then turning on both [`downlevelIteration`](#downlevelIteration) and `importHelpers`:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
// @noErrors
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

You can use [`noEmitHelpers`](#noEmitHelpers) when you provide your own implementations of these functions.
