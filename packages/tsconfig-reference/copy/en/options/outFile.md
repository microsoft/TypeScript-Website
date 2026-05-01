---
display: "Out File"
oneline: "Deprecated setting. Use a bundler instead."
---

This option is deprecated in TypeScript 6.0 and later.
Use a bundler like esbuild, Rollup, Vite, or webpack instead.

If specified, all _global_ (non-module) files will be concatenated into the single output file specified.

If `module` is `system` or `amd`, all module files will also be concatenated into this file after all global content.

Note: `outFile` cannot be used unless `module` is `None`, `System`, or `AMD`.
This option _cannot_ be used to bundle CommonJS or ES6 modules.
