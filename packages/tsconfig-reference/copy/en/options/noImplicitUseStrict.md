---
display: "No Implicit Use Strict"
oneline: "Disable adding 'use strict' directives in emitted JavaScript files."
---

You shouldn't need this. By default, when emitting a module file to a non-ES6 target, TypeScript emits a `"use strict";` prologue at the top of the file.
This setting disables the prologue.
