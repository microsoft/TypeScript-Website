---
display: "Es Module Interop"
---

Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. 

TypeScript adheres to the EcmaScript standard for modules, which means that a file with exports would have to specifically 
include a `default` export in order to support syntax like `import React from "react"`. This is not that common in 
modules for commonjs. For example, without `esModuleInterop` as true:

```ts
// @checkJs
// @allowJs

// @filename: utilFunctions.js
const getStringLength = (str) => str.length

module.exports = {
  getStringLength 
}

// @filename: index.ts
import utils from "./utilFunctions"

const count = utils.getStringLength("Check JS")
```

This won't work because there isn't a `default` object which you can import. Even though it feels like it should.
For convenience, transpilers like Babel will automatically create a default if one isn't created. Making the module look a bit more like:

```js

// @filename: utilFunctions.js
const getStringLength = (str) => str.length
const allFunctions = {
  getStringLength
}


module.exports = allFunctions
```

 Implies 'allowSyntheticDefaultImports'.
