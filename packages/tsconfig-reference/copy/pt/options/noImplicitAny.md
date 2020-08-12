---
display: "Sem 'Any' Implícito"
oneline: "Evita introduzir 'anys' dentro de sua base de código quando um tipo puder ser especificado"
---

Em alguns casos, onde nenhuma anotação de tipo está presente, o TypeScript retornará o tipo `any` para uma variável, quando não puder inferir o tipo.

Isto pode fazer com que alguns erros sejam omitidos, por exemplo:

```ts twoslash
// @noImplicitAny: false
function fn(s) {
  // Nenhum erro?
  console.log(s.subtr(3));
}
fn(42);
```

Ativando `noImplicitAny` no entanto, o TypeScript irá emitir um erro sempre que inferir `any`:

```ts twoslash
// @errors: 7006
function fn(s) {
  console.log(s.subtr(3));
}
```
