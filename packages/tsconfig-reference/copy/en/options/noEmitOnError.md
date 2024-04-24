---
display: "No Emit On Error"
oneline: "Disable emitting files if any type checking errors are reported."
---

Do not emit compiler output files like JavaScript source code, source-maps or declarations if any errors were reported.

This defaults to `false`, making it easier to work with TypeScript in a watch-like environment where you may want to see results of changes to your code in another environment before making sure all errors are resolved.
