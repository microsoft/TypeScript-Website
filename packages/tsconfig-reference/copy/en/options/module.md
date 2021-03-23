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

### `None`

```ts twoslash
// @showEmit
// @module: none
// @noErrors
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```
