---
display: "允许合成默认导入"
oneline: "当模块没有默认导入时，允许 'import x from y'"
---

当设置为 true， 并且模块**没有**显式指定默认导出时，`allowSyntheticDefaultImports` 可以让你这样写导入：

```ts
import React from "react";
```

而不是：

```ts
import * as React from "react";
```

例如：`allowSyntheticDefaultImports` 不为 true 时：

```ts twoslash
// @errors: 1259 1192
// @checkJs
// @allowJs
// @esModuleInterop: false
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

这段代码会引发一个错误，因为没有“default”对象可以导入，即使你认为应该有。
为了使用方便，Babel 这样的转译器会在没有默认导出时自动为其创建，使模块看起来更像：

```js
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
const allFunctions = {
  getStringLength,
};

module.exports = allFunctions;
module.exports.default = allFunctions;
```

本选项不会影响 TypeScript 生成的 JavaScript，它仅对类型检查起作用。当你使用 Babel 生成额外的默认导出，从而使模块的默认导出更易用时，本选项可以让 TypeScript 的行为与 Babel 一致。
