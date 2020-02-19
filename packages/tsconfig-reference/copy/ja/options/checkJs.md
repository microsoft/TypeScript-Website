---
display: "Check JS"
oneline: "Run the type checker on .js files in your project"
---

`allowJs`と連携動作します。`checkJs`が有効化されている場合、JavaScriptファイル内のエラーが報告されるようになります。
これは、プロジェクトに含まれるすべてのJavaScriptファイルの先頭で`// @ts-check`を付与することと等価です。

例えば、TypeScriptの`parseFloat`定義から、次の例は誤ったJavaScriptです。

```js
// parseFloatはstringのみを受け付けます
module.exports.pi = parseFloat(3.124);
```

このファイルがTypeScriptのモジュールにインポートされた場合:

```ts twoslash
// @allowJs
// @filename: constants.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```

いかなるエラーも報告されません。しかし、もし`checkJs`を有効化すれば、JavaScriptファイルで発生したエラーメッセージを受け取れるようになります。

```ts twoslash
// @errors: 2345
// @allowjs: true
// @checkjs: true
// @filename: constants.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```
