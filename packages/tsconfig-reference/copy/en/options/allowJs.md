---
display: "Allow JS"
---

Allow JavaScript files to be imported inside your project, instead of just `.ts` and `.tsx` files. For example, this JS file:

```js twoslasher
// @filename: card.js
export const defaultCardDeck = "Heart"
```

When imported into a TypeScript file will raise an error:

```ts twoslasher
// @errors: 2307
// @filename: card.js
module.exports.defaultCardDeck = "Heart"

// ---cut---

// @filename index.ts
import { defaultCardDeck } from "./card"

console.log(defaultCardDeck)
```

Imports fine with `allowJs` enabled:

```ts twoslasher
// @filename: card.js
/// <reference types="node" />

module.exports.defaultCardDeck = "Heart"

// ---cut---
// @allowJs
// @filename: index.ts
import { defaultCardDeck } from "./card"

console.log(defaultCardDeck)
```

This flag can be used as a way to incrementally add TypeScript files into JS projects.
