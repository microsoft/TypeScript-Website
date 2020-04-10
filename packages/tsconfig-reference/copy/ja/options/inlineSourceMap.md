---
display: "Inline Source Map"
oneline: "Include sourcemap files inside the emitted JavaScript"
---

設定すると、TypeScript はソースマップを`.js.map`ファイルへ出力するのではなく、ソースマップの内容を`.js`ファイルに埋め込みます。
この結果、JS ファイルはより大きくなりますが、いくつかのシナリオにおいては便利です。
例えば、`.map`ファイルの提供が許可されていない web サーバーで JS ファイルをデバッグしたい、という場合です。

このオプションは、[`sourceMap`](#sourceMap)とは互いに排他的にです。

例えば、次の TypeScript は:

```ts
const helloWorld = "hi";
console.log(helloWorld);
```

次の JavaScript に変換されます:

```ts twoslash
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```

`inlineSourceMap`を有効にしてビルドすると、
ファイルの末尾にこのファイルのソースマップを含んだコメントが出力されます。

```ts twoslash
// @inlineSourceMap
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```
