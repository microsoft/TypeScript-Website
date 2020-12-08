---
display: "模块"
oneline: "模块代码生成。"
---

设置程序的模块系统。在 <a href='/docs/handbook/modules.html'>模块</a> 参考页面获取更多信息。你很可能要用 `"CommonJS"`。

改变 `module` 可能会影响 [`moduleResolution`](#moduleResolution)，它也有 [一个参考页](/docs/handbook/module-resolution.html)。

下面是这个文件的一些输出例子：

```ts twoslash
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `CommonJS`

```ts twoslash
// @showEmit
// @module: commonjs
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `UMD`

```ts twoslash
// @showEmit
// @module: umd
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `AMD`

```ts twoslash
// @showEmit
// @module: amd
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `System`

```ts twoslash
// @showEmit
// @module: system
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `ESNext`

```ts twoslash
// @showEmit
// @module: esnext
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `ES2020`

```ts twoslash
// @showEmit
// @module: es2020
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

### `None`

```ts twoslash
// @showEmit
// @module: none
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```
