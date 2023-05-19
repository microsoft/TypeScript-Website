---
display: "TS Build Info File"
oneline: "The file to store `.tsbuildinfo` incremental build information in."
---

This setting lets you specify a file for storing incremental compilation information as a part of composite projects which enables faster
building of larger TypeScript codebases. You can read more about composite projects [in the handbook](/docs/handbook/project-references.html).

By default it is in the same folder as your emitted JavaScript and has a `.tsbuildinfo` file extension.
The default file name is based on the `outFile` option or your tsconfig file name.
