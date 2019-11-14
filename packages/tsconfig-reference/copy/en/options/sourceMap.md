---
display: "Source Map"
---

Enables the generation of [sourcemap files](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map).
These files allow debuggers and other tools to display the original TypeScript source code when actually working with the emitted JavaScript files.
Source map files are emitted as `.js.map` (or `.jsx.map`) files next to the corresponding `.js` output file.

The `.js` files will in turn contain a sourcemap comment to indicate to tools where the files are:
```js
//# sourceMappingURL=main.js.map
```
