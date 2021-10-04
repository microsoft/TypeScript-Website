---
display: "Module"
oneline: "Specify what module code is generated."
---

Sets the module system for the program. See the <a href='/docs/handbook/modules.html'>Modules</a> reference page for more information. You very likely want `"CommonJS"` for node projects.

Changing `module` affects [`moduleResolution`](#moduleResolution) which [also has a reference page](/docs/handbook/module-resolution.html).

Here's some example output for this file:

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
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `UMD`

```ts twoslash
// @showEmit
// @module: umd
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `AMD`

```ts twoslash
// @showEmit
// @module: amd
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `System`

```ts twoslash
// @showEmit
// @module: system
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `ESNext`

```ts twoslash
// @showEmit
// @module: esnext
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `ES2020`

```ts twoslash
// @showEmit
// @module: es2020
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `ES2015`/`ES6`

```ts twoslash
// @showEmit
// @module: es2015
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

If you are wondering about the difference between `ES2015` (aka `ES6`) and `ES2020`, `ES2020` adds support for dynamic `import`s, and `import.meta`.

#### `node12`/`nodenext`

```ts twoslash
// @showEmit
// @module: node12
// @noErrors
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

Introduced in TypeScript 4.5, `node12` and `nodenext` declare support for Node's ECMAScript Module Support. The emitted JavaScript is the same as `ES2020` which is the same `import`/`export` syntax in the TypeScript file. You can learn more in the [4.5 release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/).

#### `None`

```ts twoslash
// @showEmit
// @module: none
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```
