---
display: "Strict Bind Call Apply"
oneline: "Check that the arguments for `bind`, `call`, and `apply` methods match the original function."
---

When set, TypeScript will check that the built-in methods of functions `call`, `bind`, and `apply` are invoked with correct argument for the underlying function:

```ts twoslash
// @strictBindCallApply: true
// @errors: 2345

// With strictBindCallApply on
function fn(x: string) {
  return parseInt(x);
}

const n1 = fn.call(undefined, "10");

const n2 = fn.call(undefined, false);
```

Otherwise, these functions accept any arguments and will return `any`:

```ts twoslash
// @strictBindCallApply: false

// With strictBindCallApply off
function fn(x: string) {
  return parseInt(x);
}

// Note: No error; return type is 'any'
const n = fn.call(undefined, false);
```
