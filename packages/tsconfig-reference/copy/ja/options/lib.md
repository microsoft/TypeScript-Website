---
display: "Lib"
oneline: "Include type definitions you know are available in your JavaScript runtime"
---

TypeScriptには組み込みのJS API（例：`Math`）の型定義や、ブラウザーで利用されるAPI（例：`document`）の型定義がデフォルトで組み込まれています。
指定した`target`に合致する新しいJS機能のAPIの型定義もTypeScriptには組み込まれています。例えば、`Map`の定義は`target`が`ES6`かそれよりも新しいときに利用可能です。

いくつかの理由により、これらを変更したい場合があります:

- プログラムはブラウザーで動作させる必要がないため、`"dom"`の型定義が不要である
- 利用している実行環境では特定のJavaScript APIを提供しているが（Polyfillを利用しているかもしれません）、指定されたECMAScriptのすべての構文をサポートしているわけではない
- より上位のECMAScriptバージョンについて、すべてではなく、部分的なPolyfillや実装が利用可能である

### High Level libraries

| Name         | 内容                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ES5`        | ES3とES5のすべての機能を利用するための型定義。                                                                                                    |
| `ES2015`     | ES2015（ES6）で利用可能なAPI - `array.find`、`Promise`、`Proxy`、`Symbol`、`Map`、`Set`、`Reflect`など。                                          |
| `ES6`        | "ES2015"のエイリアス                                                                                                                              |
| `ES2016`     | ES2016で利用可能なAPI - `array.include`など。                                                                                                     |
| `ES7`        | "ES2016"のエイリアス                                                                                                                              |
| `ES2017`     | ES2017で利用可能なAPI - `Object.entries`、`Object.values`、`Atomics`、`SharedArrayBuffer`、`date.formatToParts`、typed arraysなど。               |
| `ES2018`     | ES2018で利用可能なAPI - `async` iterables、`promise.finally`、`Intl.PluralRules`、`rexexp.groups`など。                                           |
| `ES2019`     | ES2019で利用可能なAPI - `array.flat`、`array.flatMap`、`Object.fromEntries`、`string.trimStart`、`string.trimEnd`など。                           |
| `ES2020`     | ES2020で利用可能なAPI - `string.matchAll`など。                                                                                                   |
| `ESNext`     | ESNextで利用可能なAPI - JavaScriptの仕様変遷によって内容は変化します。                                                                            |
| `DOM`        | [DOM](https://developer.mozilla.org/docs/Glossary/DOM)の型定義 - `window`や`document`など。                                                       |
| `WebWorker`  | [WebWorker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers)コンテキストで利用可能なAPI                              |
| `ScriptHost` | [Windows Script Hosting System](https://wikipedia.org/wiki/Windows_Script_Host)のAPI                                                              |

### 個別のライブラリコンポーネント

| Name                      |
| ------------------------- |
| `DOM.Iterable`            |
| `ES2015.Core`             |
| `ES2015.Collection`       |
| `ES2015.Generator`        |
| `ES2015.Iterable`         |
| `ES2015.Promise`          |
| `ES2015.Proxy`            |
| `ES2015.Reflect`          |
| `ES2015.Symbol`           |
| `ES2015.Symbol.WellKnown` |
| `ES2016.Array.Include`    |
| `ES2017.object`           |
| `ES2017.Intl`             |
| `ES2017.SharedMemory`     |
| `ES2017.String`           |
| `ES2017.TypedArrays`      |
| `ES2018.Intl`             |
| `ES2018.Promise`          |
| `ES2018.RegExp`           |
| `ES2019.Array`            |
| `ES2019.Full`             |
| `ES2019.Object`           |
| `ES2019.String`           |
| `ES2019.Symbol`           |
| `ES2020.Full`             |
| `ES2020.String`           |
| `ES2020.Symbol.wellknown` |
| `ESNext.AsyncIterable`    |
| `ESNext.Array`            |
| `ESNext.Intl`             |
| `ESNext.Symbol`           |

もしこのリストが古くなっている場合は、完全なリストを[TypeScript source code](https://github.com/microsoft/TypeScript/tree/master/lib)で読むことができます。
