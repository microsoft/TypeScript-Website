---
display: "Allow Unused Labels"
---

Disables warnings about unused labels.
Labels are very rare in JavaScript and typically indicate an attempt to write an object literal:

```ts
// @allowUnusedLabels: false
function f(a: number) {
   // Forgot 'return' statement!
   if (a > 10)
   {
       m: 0
   }
}
```
