---
display: "Inline Sources"
oneline: "Include sourcemap files inside the emitted JavaScript"
---

設定すると、TypeScriptは元の`.ts`ファイルの内容を文字列としてソースマップに埋め込みます。
このオプションは`inlineSourceMap`と同様のケースで有用です。

`sourceMap`または`inlineSourceMap`のいずれかが設定されている必要があります。

例えば、次のTypeScriptについて:

```ts twoslash
const helloWorld = "hi";
console.log(helloWorld);
```

デフォルトでは、次のJavaScriptに変換されます:

```ts twoslasher
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```

`inlineSources`と`inlineSourceMap`を有効にしてビルドすると、
ファイルの末尾にこのファイルのソースマップを含んだコメントが付きます。
このソースマップは元となったソースコードも含んでいるため、[`inlineSourceMap`](#inlineSourceMap)の例とは異なる点に留意してください。

```ts twoslasher
// @inlineSources
// @inlineSourceMap
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```
