---
display: "Allow JS"
oneline: "Let TS include .JS files in imports"
---

`.ts`、`.tsx`ファイルだけでなく、JavaScript ファイルをプロジェクトへインポートできるようにします。例えば、次の JS ファイルを:

```js twoslash
// @filename: card.js
export const defaultCardDeck = "Heart";
```

TypeScript のファイルへインポートするとエラーとなるでしょう:

```ts twoslash
// @errors: 2307
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

`allowJs`を付与するとインポートは成功します:

```ts twoslash
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @allowJs
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

このフラグを使うと、`.ts`や`.tsx`ファイルが既存の JavaScript ファイルと共存可能となり、TypeScript ファイルを JS プロジェクトへ徐々に追加できるようになります。
