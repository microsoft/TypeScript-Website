---
display: "JSX Factory"
oneline: "The JSX factory function to use when targeting React JSX emit, e.g. 'React.createElement' or 'h'"
---

Changes the function called in `.js` files when compiling JSX Elements.
The most common change is to use `"h"` or `"preact.h"` instead of the default `"React.createElement"` if using `preact`.

This option can be used on a per-file basis too similar to [Babel's `/** @jsx h */` directive](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#custom).
