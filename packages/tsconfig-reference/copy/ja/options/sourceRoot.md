---
display: "Source Root"
oneline: "Sets the root path for debuggers to find the reference source code"
---

相対的なソースコードの場所の代わりに、デバッガがTypeScriptのファイルを探索すべき場所を明示します。
この文字列は、パスやURLを使用できるソースマップの中で、文字列そのままの値として処理されます:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "sourceRoot": "https://my-website.com/debug/source/"
  }
}
```

上記の設定は、`index.js`は`https://my-website.com/debug/source/index.ts`にソースコードがある、ということを宣言しています。
