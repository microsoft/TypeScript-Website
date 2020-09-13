---
display: "Lista de arquivos"
oneline: "Imprime todos os arquivos lidos durante a compilação"
---

Imprime nomes de arquivos que fazem parte da compilação. Isso é útil quando você não tem certeza de que o TypeScript tem
incluiu um arquivo que você esperava.

Por exemplo:

```
exemplo
├── index.ts
├── package.json
└── tsconfig.json
```

Com:

```json
{
  "compilerOptions": {
    "listFiles": true
  }
}
```

Ecoaria caminhos como::

```
$ npm run tsc
path/to/example/node_modules/typescript/lib/lib.d.ts
path/to/example/node_modules/typescript/lib/lib.es5.d.ts
path/to/example/node_modules/typescript/lib/lib.dom.d.ts
path/to/example/node_modules/typescript/lib/lib.webworker.importscripts.d.ts
path/to/example/node_modules/typescript/lib/lib.scripthost.d.ts
path/to/example/index.ts
```
