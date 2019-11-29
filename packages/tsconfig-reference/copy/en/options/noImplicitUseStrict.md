---
display: "No Implicit Use Strict"
---

 You shouldn't need this. By default, when emitting a module file to a non-ES6 target, TypeScript emits a `"use strict";` prologue at the top of the file.
This setting disables that.

```ts twoslash
// @showEmit
// @target: ES3
// @module: AMD
// @noImplicitUseStrict
export function fn() { }
```

```ts twoslash
// @showEmit
// @target: ES3
// @module: AMD
export function fn() { }
```
