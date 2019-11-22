---
display: "Allow Unreachable Code"
---

Set to false to disable warnings about unreachable code.
These warnings are only about code which is provably unreachable due to the use of JavaScript syntax, for example:

```ts
function fn(n: number) {
   if (n > 5) {
      return true;
   } else {
      return false;
   }
   return true;
}
```

With `"allowUnreachableCode": false`:

```ts twoslasher
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

This does not affect errors on the basis of code which *appears* to be unreachable due to type analysis.
