---
display: "No Implicit Any"
---

> ✅ We strongly recommend enabling this in all codebases

**Default**: `false`, unless `strict` is set

In some cases where no type annotations are present, TypeScript will fall back to a type of `any` for a variable.
This can cause some errors to be missed:

```ts
// @noImplicitAny: false
function fn(s) {
   // No error?
   console.log(s.subtr(3))
}
fn(42);
```

When `noImplicitAny` is set, TypeScript will issue an error whenever it would have inferred `any`:
```ts
function fn(s) {
   console.log(s.subtr(3))
}
```
