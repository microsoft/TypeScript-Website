---
display: "No Unused Parameters"
---

Report errors on unused parameters.

```ts
const myFunc = value => "Hi"
```

Raises with

```sh
ex.ts(1,16): error TS6133: 'value' is declared but its value is never read.
```
