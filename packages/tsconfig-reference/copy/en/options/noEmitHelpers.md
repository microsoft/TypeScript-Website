---
display: "No Emit Helpers"
oneline: "Disable generating custom helper functions like `__extends` in compiled output."
---

Instead of importing helpers with [`importHelpers`](#importHelpers), you can provide implementations in the global scope for the helpers you use and completely turn off emitting of helper functions.

For example, using this `async` function in ES5 requires a `await`-like function and `generator`-like function to run:

```ts twoslash
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```

Which creates quite a lot of JavaScript:

```ts twoslash
// @showEmit
// @target: ES5
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```

Which can be switched out with your own globals via this flag:

```ts twoslash
// @showEmit
// @target: ES5
// @noEmitHelpers
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```
