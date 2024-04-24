---
display: "Out File"
oneline: "Specify a file that bundles all outputs into one JavaScript file. If [`declaration`](#declaration) is true, also designates a file that bundles all .d.ts output."
---

If specified, all _global_ (non-module) files will be concatenated into the single output file specified.

If `module` is `system` or `amd`, all module files will also be concatenated into this file after all global content.

Note: `outFile` cannot be used unless `module` is `None`, `System`, or `AMD`.
This option _cannot_ be used to bundle CommonJS or ES6 modules.
