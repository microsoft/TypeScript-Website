---
display: "Mapa de origem embutido"
oneline: "Incluir arquivos de mapa de origem dentro do JavaScript emitido"
---

Quando definido, em vez de escrever um arquivo `.js.map` para fornecer mapas de origem, o TypeScript irá embutir o conteúdo do mapa de origem nos arquivos`.js`.
Embora isso resulte em arquivos JS maiores, pode ser conveniente em alguns cenários.
Por exemplo, você pode querer depurar arquivos JS em um servidor web que não permite que arquivos `.map` sejam servidos.

Mutuamente exclusivo com [`sourceMap`](#sourceMap).

Por exemplo, com este TypeScript:

```ts
const helloWorld = "hi";
console.log(helloWorld);
```

Converte para este JavaScript:

```ts twoslash
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```

Em seguida, habilite a construção com `inlineSourceMap` habilitado, há um comentário na parte inferior do arquivo que inclui um mapa de origem para o arquivo.

```ts twoslash
// @inlineSourceMap
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```
