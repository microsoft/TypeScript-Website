---
display: "Suppress Implicit Any Index Errors"
oneline: "Remove the warning when using string indexes to access unknown properties"
---

`suppressImplicitAnyIndexErrors`を有効化すると、次の例に示すようなオブジェクトへインデックスアクセスしたときの暗黙的anyについてのエラーが抑止されます:

```ts twoslash
// @noImplicitAny: true
// @suppressImplicitAnyIndexErrors: false
// @strict: true
// @errors: 7053
const obj = { x: 10 };
console.log(obj["foo"]);
```

`suppressImplicitAnyIndexErrors`はかなり影響の大きい方法です。代わりに`@ts-ignore`コメントの利用を推奨します:

```ts twoslash
// @noImplicitAny: true
// @strict: true
const obj = { x: 10 };
// @ts-ignore
console.log(obj["foo"]);
```
