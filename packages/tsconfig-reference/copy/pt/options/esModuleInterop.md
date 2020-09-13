---
display: "Interoperabilidade de Módulo ES"
oneline: "Emite JS adicional para dar suporte ao importar módulos commonjs"
---

Permite interoperabilidade de emição entre Módulos CommonJS e ES através da criação de namespaces para todas as importações.

TypeScript adere ao padrão EcmaScript para módulos, o que significa que um arquivo com exportações teria que especificamente incluir uma exportação `default` para dar suporte à sintaxes como `import React from "react"`.
Este padrão de exportação é raro em módulos para CommonJS. Por exemplo, sem `esModuleInterop` como true:

```ts twoslash
// @checkJs
// @allowJs
// @allowSyntheticDefaultImports
// @filename: utilitarios.js
// @noImplicitAny: false
const obterTamanhoDaString = (str) => str.length;

module.exports = {
  obterTamanhoDaString,
};

// @filename: index.ts
import utils from "./utilitarios";

const count = utils.obterTamanhoDaString("Checagem JS");
```

Isto não vai funcionar porque não existe um objeto `default` o qual você pode importar. Apesar de parecer que deveria.
Por conveniência, transpiladores como Babel vão criar um default automaticamente se não encontrarem um existente. Fazendo com que o módulo se pareça um pouco mais com isto:

```js
// @filename: utilitarios.js
const obterTamanhoDaString = (str) => str.length;
const todasAsFuncoes = {
  obterTamanhoDaString,
};

module.exports = todasAsFuncoes;
```

Ativando esta flag no compilador, a opção [`allowSyntheticDefaultImports`](#allowSyntheticDefaultImports) também será habilitada.
