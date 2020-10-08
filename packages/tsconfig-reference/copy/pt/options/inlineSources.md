---
display: "Origens Embutidas"
oneline: "Incluir arquivos de mapa de origem dentro do JavaScript emitido"
---

Quando definido o TypeScript incluirá o conteúdo original do arquivo `.ts` como uma string incorporada no mapa de origem.
Isso geralmente é util nos mesmos casos que `inlineSourceMap`.

Requer `sourceMap` ou` inlineSourceMap` para ser definido.

Por exemplo, com este TypeScript:

```ts twoslash
const helloWorld = "hi";
console.log(helloWorld);
```

Por padrão, converte para este JavaScript:

```ts twoslash
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```

Em seguida, habilite a compilação com `inlineSources` e` inlineSourceMap` habilitados, há um comentário na parte inferior do arquivo que inclui
um mapa de origem para o arquivo.
Observe que o final é diferente do exemplo em [`inlineSourceMap`](#inlineSourceMap) porque o mapa-fonte agora contém o código-fonte original também.

```ts twoslash
// @inlineSources
// @inlineSourceMap
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```
