---
display: "ES 模块互操作性"
oneline: "为了便于支持导入 commonjs 模块生成额外的 JS"
---
默认情况下（未设置 `esModuleInterop` 或值为 false），TypeScript 像 ES6 模块一样对待 CommonJS/AMD/UMD。这样的行为有两个被证实的缺陷：

- 形如 `import * as moment from "moment"` 这样的命名空间导入等价于 `const moment = require("moment")`

- 形如 `import moment from "moment"` 这样的默认导入等价于 `const moment = require("moment").default`


这种错误的行为导致了这两个问题：

- ES6 模块规范规定，命名空间导入（`import * as x`）只能是一个对象。TypeScript 把它处理成 `= require("x")` 的行为允许把导入当作一个可调用的函数，这样不符合规范。

- 虽然 TypeScript 准确实现了 ES6 模块规范，但是大多数使用 CommonJS/AMD/UMD 模块的库并没有像 TypeScript 那样严格遵守。

开启 `esModuleInterop` 选项将会修复 TypeScript 转译中的这两个问题。第一个问题通过改变编译器的行为来修复，第二个问题则由两个新的工具函数来解决，它们提供了确保生成的 JavaScript 兼容性的适配层：

```ts
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

当 `esModuleInterop` 未启用：

```ts twoslash
// @noErrors
// @showEmit
// @esModuleInterop: false
// @module: commonjs
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

当启用 `esModuleInterop`：

```ts twoslash
// @noErrors
// @showEmit
// @esModuleInterop
// @module: commonjs
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

_注_：你可以通过启用 [`importHelpers`](#importHelpers) 来让 JS 输出更紧凑：

```ts twoslash
// @noErrors
// @showEmit
// @esModuleInterop
// @importHelpers
// @module: commonjs
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

当启用 `esModuleInterop` 时，将同时启用 [`allowSyntheticDefaultImports`](#allowSyntheticDefaultImports)。
