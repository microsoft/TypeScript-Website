---
display: "No Implicit Returns"
---

Report an error when all code paths in a function do not return a value.

```ts twoslash
// @errors: 2366 2322
function foo(isError: boolean): string {
  if (isError === true) {
      return undefined;
  }
}
```
