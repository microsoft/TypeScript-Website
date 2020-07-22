---
display: "Permitir JS"
oneline: "Permite que o TS inclua arquivos .JS nos imports"
---

Permite que arquivos JavaScript sejam importados dentro do seu projeto ao invés de só permitir arquivos `.ts` e `.tsx`. Por exemplo, este arquivo JS:

```js twoslash
// @filename: carta.js
export const naipePadrao = "Copas";
```

Quando importado em um arquivo TypeScript, vai emitir um erro:

```ts twoslash
// @errors: 2307
// @filename: carta.js
module.exports.naipePadrao = "Copas";
// ---cut---
// @filename: index.ts
import { naipePadrao } from "./carta";

console.log(naipePadrao);
```

Mas é importado normalmente com a opção `allowJS` ativada:

```ts twoslash
// @filename: carta.js
module.exports.naipePadrao = "Copas";
// ---cut---
// @allowJs
// @filename: index.ts
import { naipePadrao } from "./carta";

console.log(naipePadrao);
```

Esta opção pode ser utilizada como uma forma de migrar um projeto JavaScript para TypeScript de forma incremental. Permitindo que arquivos `.ts` e `.tsx` coexistam no mesmo projeto que os arquivos JavaScript.
