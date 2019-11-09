---
display: "No Unused Locals"
---

Report errors on unused local variables.

```ts
const myFunc = () => {
  const onething = 1
  return "Hello"
}
```

Raises with

```sh
ex.ts(2,9): error TS6133: 'onething' is declared but its value is never read.
```

