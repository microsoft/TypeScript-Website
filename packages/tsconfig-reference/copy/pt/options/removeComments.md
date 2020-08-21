---
display: "Remover Comentários"
oneline: "Remove comentários do TypeScript para não aparecer no JavaScript"

---

Remove todos os comentários do TypeScript ao converter para JavaScript. O padrão é `false`.

Por exemplo, esse documento TypeScript que tem um comentário JSDoc:

```ts
/** Tradução de 'Hello World' para português. */
export const helloWorldPTBR = "Olá Mundo";
```

Quando `removeComments` é definido para `true`:

```ts twoslash
// @showEmit
// @removeComments: true
/** Tradução de 'Hello World' para português. */
export const helloWorldPTBR = "Olá Mundo";
```

Sem a opção `removeComments` ou com ela definida para `false`:

```ts twoslash
// @showEmit
// @removeComments: false
/** Tradução de 'Hello World' para português. */
export const helloWorldPTBR = "Olá Mundo";
```

Isso significa que seu comentário vai aparecer no código JavaScript.
