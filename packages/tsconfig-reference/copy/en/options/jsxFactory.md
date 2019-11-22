---
display: "JSX Factory"
---

**Allowed Values**: Any identifier or dotted identifier; default `"React.createElement"`

Changes the function called in `.js` files when compiling JSX Elements.
The most common change is to use `"h"` or `"preact.h"` instead of the default `"React.createElement"` if using `preact`.

This is the same as Babel's `/** @jsx h */` directive.
