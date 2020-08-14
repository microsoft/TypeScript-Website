---
display: "Prevenir erros de propriedades em excesso"
oneline: "Permitir que propriedades adicionais sejam definidas durante a criação de tipos"
---

Desativa o relatório de erros de propriedades em excesso, como o mostrado no exemplo a seguir:

```ts twoslash
// @errors: 2322
type Point = { x: number; y: number };
const p: Point = { x: 1, y: 3, m: 10 };
```

Esta opção foi adicionada para ajudar as pessoas a migrar para a verificação mais rigorosa de novos objetos literais no [TypeScript 1.6](/docs/handbook/release-notes/typescript-1-6.html#stricter-object-literal-assignment-checks).

Não recomendamos o uso dessa sinalização em uma base de código moderna, você pode prevenir casos únicos em que precise dela usando `// @ts-ignore`.
