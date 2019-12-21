---
display: "JSX Factory"
---

Changes the function called in `.js` files when compiling JSX Elements.
The most common change is to use `"h"` or `"preact.h"` instead of the default `"React.createElement"` if using `preact`.

This is the same as [Babel's `/** @jsx h */` directive](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#custom).
