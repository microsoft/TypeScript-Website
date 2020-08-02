---
display: "Interoperabilidade de Módulo ES"
oneline: "Emite JS adicional para dar suporte ao importar módulos commonjs"
---

Permite interoperabilidade de emição entre Módulos CommonJS e ES através da criação de objetos namespace para todas as importações.

TypeScript adere ao padrão EcmaScript para módulos, o que significa que um arquivo com exportações teria que especificamente
incluir uma exportação `default` para dar suporte à sintaxes como `import React from "react"`.
Este padrão de exportação é raro em módulos para CommonJS. Por exemplo, sem `esModuleInterop` como true:

```ts twoslash
// @checkJs
// @allowJs
// @allowSyntheticDefaultImports
// @filename: utilFunctions.js
// @noImplicitAny: false
const getStringLength = (str) => str.length;

module.exports = {
  getStringLength,
};

// @filename: index.ts
import utils from "./utilFunctions";

const count = utils.getStringLength("Check JS");
```

Isto não vai funcionar porque não existe um objeto `default` o qual você pode importar. Apesar de parecer que deveria.
Por conveniência, transpiladores como Babel vão criar um default automaticamente se não encontrarem um existente. Fazendo com que o módulo se pareça um pouco mais com isto:

```js
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
const allFunctions = {
  getStringLength,
};

module.exports = allFunctions;
```

Ativando esta flag no compilador também vai habilitar [`allowSyntheticDefaultImports`](#allowSyntheticDefaultImports).
