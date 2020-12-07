---
display: "检查 JS"
oneline: "在经过类型检查的 JavaScript 中报告错误。"
---

与 `allowJs` 配合使用，当 `checkJs` 被启用时，JavaScript 文件中会报告错误。也就是相当于在项目中所有 JavaScript 文件顶部包含 `// @ts-check`。

例如，根据 TypeScript 自带的 `parseFloat` 类型定义，这是不正确的 JavaScript：

```js
// parseFloat 仅接受一个字符串作为参数
module.exports.pi = parseFloat(3.124);
```

当引入到一个 TypeScript 模块：

```ts twoslash
// @allowJs
// @filename: constants.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```

你将不会得到任何错误。但是如果你开启了 `checkJs` 选项，那么你可以从 JavaScript 文件中得到错误信息。

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
