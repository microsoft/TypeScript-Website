---
display: "Source Map"
oneline: "Creates source map files for emitted JavaScript files"
---

[ソースマップファイル](https://developer.mozilla.org/docs/Tools/Debugger/How_to/Use_a_source_map)の生成を有効化します。
これらのファイルにより、出力されたJavaScriptファイルが実際に動作させるときに、デバッガーやその他のツールが元のTypeScriptソースファイルを表示できるようになります。
ソースマップファイルは`.js.map`（または`.jsx.map`）として、対応する`.js`ファイルとともに出力されます。

次の例のように、`.js`ファイルには、外部ツールにソースマップファイルがどこにあるかを示すためのソースマップコメントが含まれるようになります:

```ts
// helloWorld.ts
export declare const helloWorld = "hi";
```

`sourceMap`を`true`に設定してコンパイルすると、次のJavaScriptファイルが生成されます:

```js
// helloWorld.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = "hi";
//# sourceMappingURL=// helloWorld.js.map
```

この設定は次のようなjson形式のマップファイルも生成します:

```json
// helloWorld.js.map
{
  "version": 3,
  "file": "ex.js",
  "sourceRoot": "",
  "sources": ["../ex.ts"],
  "names": [],
  "mappings": ";;AAAa,QAAA,UAAU,GAAG,IAAI,CAAA"
}
```
