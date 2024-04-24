---
display: "Suppress Implicit Any Index Errors"
oneline: "Suppress [`noImplicitAny`](#noImplicitAny) errors when indexing objects that lack index signatures."
---

Turning `suppressImplicitAnyIndexErrors` on suppresses reporting the error about implicit anys when indexing into objects, as shown in the following example:

```ts twoslash
// @noImplicitAny: true
// @suppressImplicitAnyIndexErrors: false
// @strict: true
// @errors: 7053
const obj = { x: 10 };
console.log(obj["foo"]);
```

Using `suppressImplicitAnyIndexErrors` is quite a drastic approach. It is recommended to use a `@ts-ignore` comment instead:

```ts twoslash
// @noImplicitAny: true
// @strict: true
const obj = { x: 10 };
// @ts-ignore
console.log(obj["foo"]);
```
