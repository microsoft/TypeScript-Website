---
display: "允许 JS"
oneline: "允许你的程序包含 JS 文件。使用 checkJS 来检查在这些文件中的错误。"
---

允许 JavaScript 文件在你的工程中被引入，而不是仅仅允许 `.ts` 和 `.tsx` 文件。例如这个 JS 文件：

```js twoslash
// @filename: card.js
export const defaultCardDeck = "Heart";
```

当你引入到一个 TypeScript 文件时将会抛出一个错误：

```ts twoslash
// @errors: 2307
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

当启用 `allowJs` 后它将被正常引入：

```ts twoslash
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @allowJs
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

这个选项是一种可以允许 `.ts` 和 `.tsx` 与现有的 JavaScript 文件共存的方式。可以用于逐步将 TypeScript 文件逐步添加到 JS 工程中。
