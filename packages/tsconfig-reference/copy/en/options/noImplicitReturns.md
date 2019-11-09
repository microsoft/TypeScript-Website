---
display: "No Implicit Returns"
---

Report error when all code paths in function do not return a value.

```ts
function foo(isError: boolean): string {
  if (isError === true) {
      return undefined;
  }
}
```

```ts
ex.ts(1,41): error TS7030: Not all code paths return a value.
```
