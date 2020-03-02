---
display: "Inline Source Map"
oneline: "Include sourcemap files inside the emitted JavaScript"
---

設定すると、TypeScriptはソースマップを`.js.map`ファイルへ出力するのではなく、ソースマップの内容を`.js`ファイルに埋め込みます。
この結果、JSファイルはより大きくなりますが、いくつかのシナリオにおいては便利です。
例えば、`.map`ファイルの提供が許可されていないwebサーバーでJSファイルをデバッグしたい、という場合です。

このオプションは、[`sourceMap`](#sourceMap)とは互いに排他的にです。

例えば、次のTypeScriptは:

```ts
const helloWorld = "hi";
console.log(helloWorld);
```

次のJavaScriptに変換されます:

```ts twoslasher
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```

`inlineSourceMap`を有効にしてビルドすると、
ファイルの末尾にこのファイルのソースマップを含んだコメントが出力されます。

```ts twoslasher
// @inlineSourceMap
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```
