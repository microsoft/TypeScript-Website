---
display: "Allow Synthetic Default Imports"
---

When set to true, `allowSyntheticDefaultImports` let's you write an import like:

```ts
import React from "react"
```

instead of:

```ts
import * as React from "react"
```

When the module **does not** specify a default export.

This does not affect the JavaScript emitted by TypeScript, it only for the type checking. 
This option brings the behavior of TypeScript in-line with Babel, where extra code is emitted to make using a default export of a module more ergonomic.


