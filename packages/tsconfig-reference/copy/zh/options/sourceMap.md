---
display: "Source Map"
oneline: "为生成的 JavaScript 文件生成 source map 文件。"
---

启用生成 [sourcemap files](https://developer.mozilla.org/docs/Tools/Debugger/How_to/Use_a_source_map)。
这些文件允许调试器和其他工具在使用实际生成的 JavaScript 文件时，显示原始的 TypeScript 代码。
Source map 文件以 `.js.map` （或 `.jsx.map`）文件的形式被生成到相应的 `.js` 文件输出旁。

`.js` 文件将会包含一个 sourcemap 注释，以向外部工具表明文件在哪里。例如：

```ts
// helloWorld.ts
export declare const helloWorld = "hi";
```

在将 `sourceMap` 设置为 `true` 的情况下编译，会生成如下 JavaScript 文件：

```js
// helloWorld.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = "hi";
//# sourceMappingURL=// helloWorld.js.map
```

并且会生成这个 json 格式的 sourcemap

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
