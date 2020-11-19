---
display: "TS Build Info File"
oneline: "Specify the folder for .tsbuildinfo incremental compilation files."
---

This setting lets you specify a file for storing incremental compilation information as a part of composite projects which enables faster
building of larger TypeScript codebases. You can read more about composite projects [in the handbook](/docs/handbook/project-references.html).

This option offers a way to configure the place where TypeScript keeps track of the files it stores on the disk to
indicate a project's build state &mdash; by default, they are in the same folder as your emitted JavaScript.
