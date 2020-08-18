---
display: "Sem Verificações Genéricas Estritas"
oneline: "Desativa a verificação estrita de assinaturas genéricas em funções."
---

O TypeScript unificará os parâmetros de tipo ao comparar duas funções genéricas.

```ts twoslash
// @errors: 2322

type A = <T, U>(x: T, y: U) => [T, U];
type B = <S>(x: S, y: S) => [S, S];

function f(a: A, b: B) {
  b = a; // Ok
  a = b; // Erro
}
```

Esta flag pode ser usada para remover essa verificação.
