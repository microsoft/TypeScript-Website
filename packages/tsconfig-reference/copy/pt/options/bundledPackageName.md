---
display: "Nome de pacote agrupado"
oneline: "Fornece um nome para arquivos UMD .d.ts agrupados"
---

Quando você mistura [`declaration`](#declaration) e [`outFile`](#outFile) o .d.ts resultante precisa saber qual é o nome raiz do módulo, dessa forma os caminhos podem ser internamente resolvidos de forma correta.

Por exemplo, este projeto:

```ts twoslash
// @filename: projectRoot/index.ts
export * from "./nested/base";

// @filename: projectRoot/nested/base.ts
export const a = "123";
```

Com o seguinte `tsconfig.json`:

```json tsconfig
{
  "compilerOptions": {
    "outFile": "index.js",
    "declaration": true,
    "module": "amd",
    "bundledPackageName": "hello"
  }
}
```

Criaria este `index.d.ts` onde os módulos internos resolvem de acordo com o nome de `bundledPackageName`:

```ts twoslash
// @filename: projectRoot/index.ts
export * from "./nested/base";

// @filename: projectRoot/nested/base.ts
export const a = "123";
// @bundledPackageName: hello
// @module: amd
// @outfile: index.js
// @declaration: true
// @showEmit
// @showEmittedFile: index.d.ts
```
