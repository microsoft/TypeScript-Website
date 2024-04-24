---
display: "No Strict Generic Checks"
oneline: "Disable strict checking of generic signatures in function types."
---

TypeScript will unify type parameters when comparing two generic functions.

```ts twoslash
// @errors: 2322

type A = <T, U>(x: T, y: U) => [T, U];
type B = <S>(x: S, y: S) => [S, S];

function f(a: A, b: B) {
  b = a; // Ok
  a = b; // Error
}
```

This flag can be used to remove that check.
