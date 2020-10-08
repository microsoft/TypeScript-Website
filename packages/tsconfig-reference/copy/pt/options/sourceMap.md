---
display: "Mapas de código"
oneline: "Cria mapas de código para os arquivos JavaScript emitidos"

---

Permite a geração de [mapas de código](https://developer.mozilla.org/pt-PT/docs/Tools/Debugger/How_to/Use_a_source_map). Esses arquivos permitem que depuradores e outras ferramentas exibam o código fonte TypeScript original ao trabalhar com os arquivos JavaScript emitidos. Mapas de código são emitidos como arquivos `js.map` (ou `jsx.map`) ao lado dos arquivos de saída `.js` correspondentes.

Os arquivos `.js` recebem um container com comentários do mapa de código, indicando para as ferramentas externas onde os arquivos estão. Por exemplo:

```ts
// helloWorld.ts
export declare const helloWorld = "Olá";
```

Compilando com o `sourceMap` configurado como `true`, a criação do arquivo JavaScript seguirá assim:

```js
// helloWorld.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = "Olá";
//# sourceMappingURL=// helloWorld.js.map
```

E isso irá gerar o seguinte arquivo json do mapa:

```json
// helloWorld.js.map
{
  "version": 3,
  "file": "ex.js",
  "sourceRoot": "",
  "sources": ["../ex.ts"],
  "names": [],
  "mappings": ";;AAAa,QAAA,UAAU,GAAG,IAAI,CAAA"
}
```
