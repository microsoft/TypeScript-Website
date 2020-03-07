---
display: "Allow JS"
oneline: "Let TS include .JS files in imports"
---

Allow JavaScript files to be imported inside your project, instead of just `.ts` and `.tsx` files. For example, this JS file:

```js twoslasher
// @filename: card.js
export const defaultCardDeck = "Heart";
```

When imported into a TypeScript file will raise an error:

```ts twoslasher
// @errors: 2307
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

Imports fine with `allowJs` enabled:

```ts twoslasher
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---π
// @allowJs
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

This flag can be used as a way to incrementally add TypeScript files into JS projects by allowing the `.ts` and `.tsx` files to live along-side existing JavaScript files.
