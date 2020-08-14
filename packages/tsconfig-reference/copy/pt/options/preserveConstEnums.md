---
display: "Mantenha Enums Constantes"
oneline: "Não apague as declarações `const enum` no código gerado"
---

Não apague as declarações `const enum` em seu código gerado. `const enum` provê uma maneira de reduzir a quantidade de memória utilizada por sua aplicação em tempo de execução emitindo o valor do enum ao invés de sua referência.

Por exemplo nesse código TypeScript:

```ts twoslash
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3
}

const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

O comportamento padrão `const enum` é converter qualquer `Album.Something` para o número literal correspondente, além de remover a referência do enum do JavaScript completamente.

```ts twoslash
// @showEmit
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3
}

const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

Com a opção `preserveConstEnums` definida como `true`, o `enum` existe em tempo de execução e os números ainda são emitidos.

```ts twoslash
// @preserveConstEnums: true
// @showEmit
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3
}

const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

Isso essencialmente faz com que `const enums` seja uma funcionalidade apenas do código-fonte.
