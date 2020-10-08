---
display: "Permite notaciones sin utilizar"
oneline: "Muestra un error cuando accidentalmente se crea una notación"
---

Al configurarse como falsa, deshabilita las advertencias acerca de notaciones sin usar.

Las notaciones son muy raras en JavaScript y tipicamente indican un intento por escribir un objeto literal:

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
