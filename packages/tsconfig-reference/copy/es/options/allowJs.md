---
display: "Permitir JS"
oneline: "Permite incluir archivos .JS en las importaciones de archivos TypeScript."
---

Permite importar archivos JavaScript dentro de su proyecto, en lugar de sólo los archivos `.ts` y `.tsx`. Por ejemplo, este archivo JavaScript:

```js twoslash
// @filename: card.js
export const defaultCardDeck = "Heart";
```

Al ser importado en un archivo de TypeScript se producirá un error:

```ts twoslash
// @errors: 2307
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

Se importa sin problemas cuando se habilita la opción `allowJs`

```ts twoslash
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @allowJs
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

Esta opción puede ser usada como una forma de agregar progresivamente archivos TypeScript en un proyecto JavaScript al permitir los archivos con extensión `.ts` y `.tsx` convivir con los archivos JavaScript existentes.
