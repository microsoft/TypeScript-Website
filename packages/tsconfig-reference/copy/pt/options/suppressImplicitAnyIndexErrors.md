---
display: "Prevenir erros de implicit any index"
oneline: "Remove o aviso ao usar índices de string para acessar propriedades desconhecidas"
---

Ativando `suppressImplicitAnyIndexErrors` previne o relato do erros sobre qualquer implícito ao indexar objetos, conforme mostrado no exemplo a seguir:

```ts twoslash
// @noImplicitAny: true
// @suppressImplicitAnyIndexErrors: false
// @strict: true
// @errors: 7053
const obj = { x: 10 };
console.log(obj["foo"]);
```

Usar `suppressImplicitAnyIndexErrors` é uma abordagem bastante extrema. É recomendado usar um comentário `@ts-ignore` ao invés:

```ts twoslash
// @noImplicitAny: true
// @strict: true
const obj = { x: 10 };
// @ts-ignore
console.log(obj["foo"]);
```
