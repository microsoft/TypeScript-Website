---
display: "ES Module Interop"
oneline: "Emit additional JS to ease support for importing commonjs modules"
---

すべてのインポートに対してNamespaceオブジェクトを生成することによって、CommonJSとES Modules間で相互運用可能なコードを出力します。

TypeScriptはEcmaScriptのモジュール標準に準拠しています。
つまり、`import React from "react"`のような構文をサポートするには、そのファイルに具体的な`default` exportが含まれている必要があります。
CommonJSのモジュールでは、このエクスポートの方法は稀です。`esModuleInterop`がtrueでなければ:

```ts twoslash
// @checkJs
// @allowJs
// @allowSyntheticDefaultImports
// @filename: utilFunctions.js
// @noImplicitAny: false
const getStringLength = str => str.length;

module.exports = {
  getStringLength
};

// @filename: index.ts
import utils from "./utilFunctions";

const count = utils.getStringLength("Check JS");
```

インポート可能なオブジェクトに`default`が無いため、このコードは動作しないでしょう。このコードが動作するように見えたとしても、です。
Babelのようなトランスパイラは、利便のためにdefaultが存在しない場合に自動で作成します。モジュールを次のようにするのです:

```js
// @filename: utilFunctions.js
const getStringLength = str => str.length;
const allFunctions = {
  getStringLength
};

module.exports = allFunctions;
```

このコンパイラフラグを有効化すると、[`allowSyntheticDefaultImports`](#allowSyntheticDefaultImports)も有効化されます。
