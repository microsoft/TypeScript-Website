---
display: "Sem 'Use Strict' Implícito"
oneline: "Desabilita 'use strict' na emissão JS"
---

Você não deveria precisar disso. Por padrão, ao emitir um arquivo de módulo para um destino não ES6, o TypeScript emite um prólogo `"use strict";` no topo do arquivo.
Esta configuração desabilita o prólogo.

```ts twoslash
// @showEmit
// @target: ES3
// @module: AMD
// @noImplicitUseStrict
// @alwaysStrict: false
export function fn() {}
```

```ts twoslash
// @showEmit
// @target: ES3
// @module: AMD
export function fn() {}
```
