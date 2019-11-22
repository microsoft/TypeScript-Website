---
display: "Allow JS"
---

Allow JavaScript files to be imported inside your project, instead of just `.ts` and `.tsx` files. For example, this JS file:

```js twoslasher
// @filename card.js
export const defaultCardDeck = "Heart"
```

When imported into a TypeScript file will raise an error:

```ts twoslasher
// @filename card.js
export const defaultCardDeck = "Heart"

// ---cut---

// @filename index.ts
import { defaultCardDeck } from "./card"

console.log(defaultCardDeck)
```

Imports fine with `allowJs` enabled

```ts twoslasher
// @filename card.js
export const defaultCardDeck = "Heart"

// ---cut---
// @allowJs
// @filename index.ts
import { defaultCardDeck } from "./card"

console.log(defaultCardDeck)
```

Raises an error without `allowJs`:

```sh
index.ts(1,28): error TS7016: Could not find a declaration file for module './message'. '/message.js' implicitly has an 'any' type.
```

This flag can be used as a way to incrementally add TypeScript files into JS projects.
