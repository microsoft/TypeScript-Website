---
display: "Allow JS"
oneline: "Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files."
---

Allow JavaScript files to be imported inside your project, instead of just `.ts` and `.tsx` files. For example, this JS file:

```js twoslash
// @filename: card.js
export const defaultCardDeck = "Heart";
```

When imported into a TypeScript file will raise an error:

```ts twoslash
// @errors: 2307
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

Imports fine with `allowJs` enabled:

```ts twoslash
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @allowJs
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

This flag can be used as a way to incrementally add TypeScript files into JS projects by allowing the `.ts` and `.tsx` files to live along-side existing JavaScript files.

It can also be used along-side [`declaration`](#declaration) and [`emitDeclarationOnly`](#emitDeclarationOnly) to [create declarations for JS files](/docs/handbook/declaration-files/dts-from-js.html).
