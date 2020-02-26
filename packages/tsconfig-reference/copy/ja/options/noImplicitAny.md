---
display: "No Implicit Any"
oneline: "Avoid introducing anys inside your codebase when a type could be specified"
---

いくつかの型アノテーションが存在しないケースにおいて、TypeScriptは変数の型が推論できないときに、`any`型へフォールバックします。

このため、エラーを見逃す可能性があります。例えば:

```ts twoslash
// @noImplicitAny: false
function fn(s) {
  // エラーにならない？
  console.log(s.subtr(3));
}
fn(42);
```

ただし、`noImplicitAny`を有効化すると、TypeScriptは型が`any`に推論されるときは常にエラーを発生させます:

```ts twoslash
// @errors: 7006
function fn(s) {
  console.log(s.subtr(3));
}
```
