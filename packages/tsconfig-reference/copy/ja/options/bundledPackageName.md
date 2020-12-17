---
display: "bundledPackageName"
oneline: "Provides a name for bundled UMD .d.ts files"
---

[`declaration`](#declaration)と[`outFile`](#outFile)を組み合わせた場合、生成される`.d.ts`ファイルはモジュールのルート名を知る必要があります。その結果、パスを内部的に正しく解決することができます。

例えば、次のプロジェクトについて:

```ts twoslash
// @filename: projectRoot/index.ts
export * from "./nested/base";

// @filename: projectRoot/nested/base.ts
export const a = "123";
```

`tsconfig.json`が以下の通りであるとします:

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

内部モジュールが`bundledPackageName`の名前に応じて解決された次の`index.d.ts`が作成されます:

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
