---
display: "No Emit"
oneline: "Disable emitting files from a compilation."
---

Do not emit compiler output files like JavaScript source code, source-maps or declarations.

This makes room for another tool like [Babel](https://babeljs.io), or [swc](https://github.com/swc-project/swc) to handle converting the TypeScript file to a file which can run inside a JavaScript environment.

You can then use TypeScript as a tool for providing editor integration, and as a source code type-checker.
