---
display: "Inline Source Map"
---

When set, instead of writing out a `.js.map` file to provide source maps, TypeScript will embed the source map content in the `.js` files.
Although this results in larger JS files, it can be convenient in some scenarios.
For example, you might want to debug JS files on a webserver that doesn't allow `.map` files to be served.

Mutually exclusive with `sourceMap`.
