---
display: "No Strict Generic Checks"
oneline: "Disable strict checking of generic signatures in functions."
---

TypeScriptは、総称型を使った2つの関数について、型パラメータを統合して比較します。

```ts twoslash
// @errors: 2322

type A = <T, U>(x: T, y: U) => [T, U];
type B = <S>(x: S, y: S) => [S, S];

function f(a: A, b: B) {
  b = a; // Ok
  a = b; // Error
}
```

このフラグを利用することで、このチェックを無効化できます。
