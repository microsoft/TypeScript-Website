---
display: "Source Map"
---

Enables the generation of [sourcemap files](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map).
These files allow debuggers and other tools to display the original TypeScript source code when actually working with the emitted JavaScript files.
Source map files are emitted as `.js.map` (or `.jsx.map`) files next to the corresponding `.js` output file.

The `.js` files will in turn contain a sourcemap comment to indicate to tools where the files are, for example:

```ts
// helloWorld.ts
export declare const helloWorld = "hi";
```

Compiling with `sourceMap` as `true` creates this JavaScript file:

```js
// helloWorld.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = "hi";
//# sourceMappingURL=// helloWorld.js.map
```

And this also generates this json map:
```json
// helloWorld.js.map
{"version":3,"file":"ex.js","sourceRoot":"","sources":["../ex.ts"],"names":[],"mappings":";;AAAa,QAAA,UAAU,GAAG,IAAI,CAAA"}
```
