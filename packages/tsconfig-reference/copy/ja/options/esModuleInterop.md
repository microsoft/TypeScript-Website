---
display: "ES Module Interop"
oneline: "Emit additional JS to ease support for importing commonjs modules"
---

すべてのインポートに対して Namespace オブジェクトを生成することによって、CommonJS と ES Modules 間で相互運用可能なコードを出力します。

TypeScript は EcmaScript のモジュール標準に準拠しています。
つまり、`import React from "react"`のような構文をサポートするには、そのファイルに具体的な`default` export が含まれている必要があります。
CommonJS のモジュールでは、このエクスポートの方法は稀です。`esModuleInterop`が true でなければ:

```ts twoslash
// @errors: 1259 1192
// @checkJs
// @allowJs
// @allowSyntheticDefaultImports
// @filename: utilFunctions.js
// @noImplicitAny: false
const getStringLength = (str) => str.length;

module.exports = {
  getStringLength,
};

// @filename: index.ts
import utils from "./utilFunctions";

const count = utils.getStringLength("Check JS");
```

インポート可能なオブジェクトに`default`が無いため、このコードは動作しないでしょう。このコードが動作するように見えたとしても、です。
Babel のようなトランスパイラは、利便のために default が存在しない場合に自動で作成します。モジュールを次のようにするのです:

```js
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
const allFunctions = {
  getStringLength,
};

module.exports = allFunctions;
```

このコンパイラフラグを有効化すると、[`allowSyntheticDefaultImports`](#allowSyntheticDefaultImports)も有効化されます。
