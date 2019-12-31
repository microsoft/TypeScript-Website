---
display: "Allow Unused Labels"
oneline: "Error when accidentally creating a label"
---

Set to false to disable warnings about unused labels.

Labels are very rare in JavaScript and typically indicate an attempt to write an object literal:

```ts twoslash
// @errors: 7028
// @allowUnusedLabels: false
function verifyAge(age: number) {
  // Forgot 'return' statement
  if (age > 18) {
    verified: true;
  }
}
```
