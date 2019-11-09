---
display: 'No Fallthrough Cases In Switch'
---

Report errors for fallthrough cases in switch statement.
Ensures that any non-empty case inside a switch statement includes either `break` or `return`.
This means you won't accidentally ship a case fallthrough bug.

```ts
const a: number = 6

switch (a) {
  case 0:
    console.log('even')
  case 1:
    console.log('odd')
    break
}
```

returns


```sh
ex.ts(4,3): error TS7029: Fallthrough case in switch.
```
