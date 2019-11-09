---
display: "Out File"
---

If specified, all *global* (non-module) files will be concatenated into the single output file specified.

If `module` is `system` or `amd`, all module files will also be concatenated into this file after all global content.

Note: `outFile` cannot be used unless `module` is `None`, `System`, or `AMD`.
This option *cannot* be used to bundle CommonJS or ES6 modules.
