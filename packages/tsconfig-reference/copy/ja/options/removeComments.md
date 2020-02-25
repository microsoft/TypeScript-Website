---
display: "Remove Comments"
oneline: "Remove comments in TypeScript from appearing in JavaScript"
---

TypeScriptファイルをJavaScriptへ変換するときに、すべてのコメントを除去します。デフォルト値は`false`です。

例えば、次のJSDocコメントを持つTypeScriptファイルに対して:

```ts
/** ポルトガル語に翻訳された'Hello world' */
export const helloWorldPTBR = "Olá Mundo";
```

`removeComments`が`true`であるとき、次のようになります:

```ts twoslash
// @showEmit
// @removeComments: true
/** ポルトガル語に翻訳された'Hello world' */
export const helloWorldPTBR = "Olá Mundo";
```

`removeComments`が設定されていない・または`false`であるときは次のようになります:

```ts twoslash
// @showEmit
// @removeComments: false
/** ポルトガル語に翻訳された'Hello world' */
export const helloWorldPTBR = "Olá Mundo";
```

つまり、コメントはJavaScriptコードに表示されるようになります。
