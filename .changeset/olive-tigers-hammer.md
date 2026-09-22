---
"@typescript/vfs": patch
---

Skip the localStorage feature detect in Node so importing the package no longer emits an ExperimentalWarning on Node 26
