---
display: "JSX Factory"
oneline: "Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'."
---

Changes the function called in `.js` files when compiling JSX Elements using the classic JSX runtime.
The most common change is to use `"h"` or `"preact.h"` instead of the default `"React.createElement"` if using `preact`.

For example, this TSX file:

```tsx
import { h } from "preact";

const HelloWorld = () => <div>Hello</div>;
```

With `jsxFactory: "h"` looks like:

```tsx twoslash
// @showEmit
// @showEmittedFile: index.js
// @jsxFactory: h
// @noErrors
// @target: esnext
// @module: commonjs

import { h, Fragment } from "preact";

const HelloWorld = () => <div>Hello</div>;
```

This option can be used on a per-file basis too similar to [Babel's `/** @jsx h */` directive](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#custom).

```tsx twoslash
/** @jsx h */
import { h } from "preact";

const HelloWorld = () => <div>Hello</div>;
```

The factory chosen will also affect where the `JSX` namespace is looked up (for type checking information) before falling back to the global one.

If the factory is defined as `React.createElement` (the default), the compiler will check for `React.JSX` before checking for a global `JSX`. If the factory is defined as `h`, it will check for `h.JSX` before a global `JSX`.
