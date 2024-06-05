---
display: "Module"
oneline: "Specify what module code is generated."
---

Sets the module system for the program. See the [theory behind TypeScript’s `module` option](/docs/handbook/modules/theory.html#the-module-output-format) and [its reference page](/docs/handbook/modules/reference.html#the-module-compiler-option) for more information. You very likely want `"nodenext"` for modern Node.js projects and `preserve` or `esnext` for code that will be bundled.

Changing `module` affects [`moduleResolution`](#moduleResolution) which [also has a reference page](/docs/handbook/modules/reference.html#the-moduleresolution-compiler-option).

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

#### `ES2015`/`ES6`/`ES2020`/`ES2022`

```ts twoslash
// @showEmit
// @module: es2015
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

In addition to the base functionality of `ES2015`/`ES6`, `ES2020` adds support for [dynamic `import`s](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import), and [`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta) while `ES2022` further adds support for [top level `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await).

#### `node16`/`nodenext`

Available from 4.7+, the `node16` and `nodenext` modes integrate with Node's [native ECMAScript Module support](https://nodejs.org/api/esm.html). The emitted JavaScript uses either `CommonJS` or `ES2020` output depending on the file extension and the value of the `type` setting in the nearest `package.json`. Module resolution also works differently. You can learn more in the [handbook](/docs/handbook/esm-node.html) and [Modules Reference](/docs/handbook/modules/reference.html#node16-nodenext).

#### `preserve`

In `--module preserve` ([added](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#support-for-require-calls-in---moduleresolution-bundler-and---module-preserve) in TypeScript 5.4), ECMAScript imports and exports written in input files are preserved in the output, and CommonJS-style `import x = require("...")` and `export = ...` statements are emitted as CommonJS `require` and `module.exports`. In other words, the format of each individual import or export statement is preserved, rather than being coerced into a single format for the whole compilation (or even a whole file).

```ts twoslash
// @showEmit
// @module: preserve
// @noErrors
import { valueOfPi } from "./constants";
import constants = require("./constants");

export const piSquared = valueOfPi * constants.valueOfPi;
```

While it’s rare to need to mix imports and require calls in the same file, this `module` mode best reflects the capabilities of most modern bundlers, as well as the Bun runtime.

> Why care about TypeScript’s `module` emit with a bundler or with Bun, where you’re likely also setting `noEmit`? TypeScript’s type checking and module resolution behavior are affected by the module format that it _would_ emit. Setting `module` gives TypeScript information about how your bundler or runtime will process imports and exports, which ensures that the types you see on imported values accurately reflect what will happen at runtime or after bundling.

#### `None`

```ts twoslash
// @showEmit
// @module: none
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```
