---
display: "Allow Unused Labels"
oneline: "Disable error reporting for unused labels."
---

When:

- `undefined` (default) provide suggestions as warnings to editors
- `true` unused labels are ignored
- `false` raises compiler errors about unused labels

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
