---
display: "Assume Changes Only Affect Direct Dependencies"
oneline: "Have recompiles in projects that use [`incremental`](#incremental) and `watch` mode assume that changes within a file will only affect files directly depending on it."
---

When this option is enabled, TypeScript will avoid rechecking/rebuilding all truly possibly-affected files, and only recheck/rebuild files that have changed as well as files that directly import them.

This can be considered a 'fast & loose' implementation of the watching algorithm, which can drastically reduce incremental rebuild times at the expense of having to run the full build occasionally to get all compiler error messages.
