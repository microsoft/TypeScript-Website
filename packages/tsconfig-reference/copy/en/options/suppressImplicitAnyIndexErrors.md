---
display: "Suppress Implicit Any Index Errors"
---

This disables the reporting of implicit `any` warnings when indexing into objects, when `noImplicitAny` is enabled as shown in the following example:

```ts twoslash
// @noImplicitAny: true
// @strict: true
// @errors: 7053
const obj = { x: 10 };
console.log(obj["foo"]);
```

Using `suppressImplicitAnyIndexErrors` is quite a drastic approach, it is recommended that you consider using a `@ts-ignore` instead:

```ts twoslash
// @noImplicitAny: true
// @strict: true
const obj = { x: 10 };
// @ts-ignore
console.log(obj["foo"]);
```
