---
display: "Allow JS"
oneline: "Let TS include .JS files in imports"
---

`.ts`、`.tsx`ファイルだけでなく、JavaScriptファイルをプロジェクトへインポートできるようにします。例えば、次のJSファイルを:

```js twoslasher
// @filename: card.js
export const defaultCardDeck = "Heart";
```

TypeScriptのファイルへインポートするとエラーとなるでしょう:

```ts twoslasher
// @errors: 2307
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

`allowJs`を付与するとインポートは成功します:

```ts twoslasher
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @allowJs
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

このフラグを使うと、`.ts`や`.tsx`ファイルが既存のJavaScriptファイルと共存可能となり、TypeScriptファイルをJSプロジェクトへ徐々に追加できるようになります。
