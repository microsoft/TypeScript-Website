---
display: "No Implicit Any"
oneline: "Enable error reporting for expressions and declarations with an implied `any` type."
---

In some cases where no type annotations are present, TypeScript will fall back to a type of `any` for a variable when it cannot infer the type.

This can cause some errors to be missed, for example:

```ts twoslash
// @noImplicitAny: false
function fn(s) {
  // No error?
  console.log(s.subtr(3));
}
fn(42);
```

Turning on `noImplicitAny` however TypeScript will issue an error whenever it would have inferred `any`:

```ts twoslash
// @errors: 7006
function fn(s) {
  console.log(s.subtr(3));
}
```
