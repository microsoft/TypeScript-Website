---
display: "Suppress Implicit Any Index Errors"
---

> ❌ **Discouraged:** This flag is provided for backward compatibility. Consider using `@ts-ignore` instead.

This disables reporting of implicit `any` warnings when indexing into objects, such as shown in the following example

```ts
const obj = { x: 10 };
console.log(obj["foo"]);
```
