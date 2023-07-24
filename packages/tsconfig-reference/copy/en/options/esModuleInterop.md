---
display: "ES Module Interop"
oneline: "Emit additional JavaScript to ease support for importing CommonJS modules. This enables [`allowSyntheticDefaultImports`](#allowSyntheticDefaultImports) for type compatibility."
---

By default (with `esModuleInterop` false or not set) TypeScript treats CommonJS/AMD/UMD modules similar to ES6 modules. In doing this, there are two parts in particular which turned out to be flawed assumptions:

- a namespace import like `import * as moment from "moment"` acts the same as `const moment = require("moment")`

- a default import like `import moment from "moment"` acts the same as `const moment = require("moment").default`

This mis-match causes these two issues:

- the ES6 modules spec states that a namespace import (`import * as x`) can only be an object, by having TypeScript
  treating it the same as `= require("x")` then TypeScript allowed for the import to be treated as a function and be callable. That's not valid according to the spec.

- while accurate to the ES6 modules spec, most libraries with CommonJS/AMD/UMD modules didn't conform as strictly as TypeScript's implementation.

Turning on `esModuleInterop` will fix both of these problems in the code transpiled by TypeScript. The first changes the behavior in the compiler, the second is fixed by two new helper functions which provide a shim to ensure compatibility in the emitted JavaScript:

```ts
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

With `esModuleInterop` disabled:

```ts twoslash
// @noErrors
// @showEmit
// @esModuleInterop: false
// @module: commonjs
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

With `esModuleInterop` set to `true`:

```ts twoslash
// @noErrors
// @showEmit
// @esModuleInterop
// @module: commonjs
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

_Note_: The namespace import `import * as fs from "fs"` only accounts for properties which [are owned](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) (basically properties set on the object and not via the prototype chain) on the imported object. If the module you're importing defines its API using inherited properties, you need to use the default import form (`import fs from "fs"`), or disable `esModuleInterop`.

_Note_: You can make JS emit terser by enabling [`importHelpers`](#importHelpers):

```ts twoslash
// @noErrors
// @showEmit
// @esModuleInterop
// @importHelpers
// @module: commonjs
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

Enabling `esModuleInterop` will also enable [`allowSyntheticDefaultImports`](#allowSyntheticDefaultImports).
