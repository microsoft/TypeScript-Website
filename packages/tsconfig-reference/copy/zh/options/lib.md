---
display: "库"
oneline: "描述目标运行时环境的声明文件列表。"
---

TypeScript 包括一组默认的内建 JS 接口（例如 `Math`）的类型定义，以及在浏览器环境中存在的对象的类型定义（例如 `document`）。
TypeScript 还包括与你指定的 `target` 选项相匹配的较新的 JS 特性的 API。例如如果`target` 为 `ES6` 或更新的环境，那么 `Map` 的类型定义是可用的。

你可能出于某些原因改变这些：

- 你的程序不运行在浏览器中，因此你不想要 `"dom"` 类型定义。
- 你的运行时平台提供了某些 JavaScript API 对象（也许通过 polyfill），但还不支持某个 ECMAScript 版本的完整语法。
- 你有一些 （但不是全部）对于更高级别的 ECMAScript 版本的 polyfill 或本地实现。

### 高阶库

| 名称         | 内容                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ES5`        | ES3 和 ES5 的核心功能定义                                                                                              |
| `ES2015`     | ES2015 中额外提供的 API (又被称为 ES6) —— `array.find`， `Promise`，`Proxy`，`Symbol`，`Map`，`Set`，`Reflect` 等。               |
| `ES6`        |  ES2015 的别名。                                                                                                                                |
| `ES2016`     | ES2016 中额外提供的 API —— `array.include` 等。                                                                                       |
| `ES7`        |  ES2016 的别名。                                                                                                                                |
| `ES2017`     | ES2017 中额外提供的 API ——  `Object.entries`，`Object.values`，`Atomics`，`SharedArrayBuffer`，`date.formatToParts`，`typed arrays` 等。 |
| `ES2018`     | ES2018 中额外提供的 API ——  `async iterables`，`promise.finally`，`Intl.PluralRules`，`rexexp.groups` 等。                             |
| `ES2019`     | ES2019 中额外提供的 API —— `array.flat`，`array.flatMap`，`Object.fromEntries`，`string.trimStart`，`string.trimEnd` 等。             |
| `ES2020`     | ES2020 中额外提供的 API —— `string.matchAll` 等。                                                                                    |
| `ESNext`     | ESNext 中额外提供的 API —— 随着 JavaScript 的发展，这些会发生变化。                                                       |
| `DOM`        | [DOM](https://developer.mozilla.org/docs/Glossary/DOM) 定义 —— `window`，`document` 等。                                                   |
| `WebWorker`  | [WebWorker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) 上下文中存在的 API。                              |
| `ScriptHost` | [Windows Script Hosting System](https://wikipedia.org/wiki/Windows_Script_Host)   的 API。                                                   |

### 库的各个组件

| 名称                      |
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

此列表有可能会过期，你可以在 [TypeScript 源码中](https://github.com/microsoft/TypeScript/tree/master/lib)查看完整列表。
