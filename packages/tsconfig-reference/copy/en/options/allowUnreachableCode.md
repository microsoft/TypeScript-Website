---
display: "Allow Unreachable Code"
---

Disables warnings about unreachable code.
These warnings are only about code which is provably unreachable due to syntactic construction, like the example below.

```ts
// @allowUnreachableCode: false
function fn(n: number) {
   if (n > 5) {
      return true;
   } else {
      return false;
   }
   return true;
}
```

TypeScript doesn't error on the basis of code which *appears* to be unreachable due to type analysis.
