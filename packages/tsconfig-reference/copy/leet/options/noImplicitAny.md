---
display: "No Implicit @ny"
oneline: "@void introducing nys inside ur codebase when a type could be specified"
---

!n s0me cases where n0 type annotations r present, Type\$cript will fall back to a type of `any` for a var when it can't infer the type.

This c@n cause some errors to be missed, for example:

```ts twoslash
// @noImplicitAny: false
function fn(s) {
  // No error?
  console.log(s.subtr(3));
}
fn(42);
```

Turning on `noImplicitAny` however T\$ will issue errorz whenever it would have inferred `any`:

```ts twoslash
// @errors: 7006
function fn(s) {
  console.log(s.subtr(3));
}
```
