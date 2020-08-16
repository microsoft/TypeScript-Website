---
display: "Remover internal"
oneline: "Remove as declarações que têm '@internal' em seus comentários JSDoc"
---

Não emite declarações para códigos que tenham uma anotação `@internal` em seu comentário JSDoc.
Esta é uma opção interna do compilador; use por sua conta em risco, porque o compilador não verifica se o resultado é válido.
Se você estiver procurando por uma ferramenta para lidar com níveis adicionais de visibilidade dentro de seus arquivos `d.ts`, veja o [api-extractor](https://api-extractor.com).

```ts twoslash
/**
 * Dias disponíveis na semana
 * @internal
 */
export const diasNaSemana = 7;

/** Calcule quanto alguém ganha em uma semana */
export function salarioSemanal(porDia: number) {
  return diasNaSemana * porDia;
}
```

Com a opção definida como `false` (padrão):

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
/**
 * Dias disponíveis na semana
 * @internal
 */
export const diasNaSemana = 7;

/** Calcule quanto alguém ganha em uma semana */
export function salarioSemanal(porDia: number) {
  return diasNaSemana * porDia;
}
```

Com `stripInternal` definido como `true` o `d.ts` emitido será editado.

```ts twoslash
// @stripinternal
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
/**
 * Dias disponíveis na semana
 * @internal
 */
export const diasNaSemana = 7;

/** Calcule quanto alguém ganha em uma semana */
export function selarioSemanal(porDia: number) {
  return diasNaSemana * porDia;
}
```

A JavaScript emitido ainda é o mesmo.
