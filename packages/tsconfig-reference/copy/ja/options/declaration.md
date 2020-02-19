---
display: "Declaration"
oneline: "Emit d.ts files for referenced files in the project"
---

プロジェクト内のすべてのTypeScriptファイルとJavaScriptファイルについて、`d.ts`ファイルを生成します。
生成された`d.ts`ファイルはモジュールの外部APIを記述する定義ファイルです。
`d.ts`ファイルを用いると、TypeScriptなどのツールは、型指定されていないコードに対して、Intelisenceや正確な型定義を提供できるようになります。

`declaration`を`true`に設定している場合、次のTypeScriptコードに対してコンパイラーを実行すると:

```ts twoslash
export let helloWorld = "hi";
```

次のような`index.js`ファイルが生成されます:

```ts twoslash
// @showEmit
export let helloWorld = "hi";
```

対応する`helloWorld.d.ts`ファイルは次のとおりです:

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export let helloWorld = "hi";
```

JavaScriptファイルに対応する`.d.ts`を利用する場合、[`emitDeclarationOnly`](#emitDeclarationOnly)や[`outDir`](#outDir)を設定することでJavaScriptファイルを上書きしないようにできます。
