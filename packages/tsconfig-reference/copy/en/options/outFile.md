---
display: "Out File"
oneline: "Deprecated setting. Use a bundler instead."
---

This option is removed in TypeScript 6.0 and later.
Use a bundler like esbuild, Rollup, Vite, or webpack instead.

In earlier TypeScript versions, specifying this option concatenated all _global_ (non-module) files into the single output file specified.

If `module` was `system` or `amd`, all module files were also concatenated into this file after all global content.

This option could not be used to bundle CommonJS or ES6 modules.
