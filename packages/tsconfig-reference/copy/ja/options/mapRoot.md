---
display: "Map Root"
oneline: "Set an external root for sourcemaps"
---

生成された場所情報を利用するのではなく、デバッガがマップファイルを探索すべき場所を明示します。
この文字列はソースマップの中で、文字列そのままの値として処理されます。例えば:

```json tsconfig
{
  "compilerOptions": {
    "sourceMap": true,
    "mapRoot": "https://my-website.com/debug/sourcemaps/"
  }
}
```

この設定は、`index.js`は`https://my-website.com/debug/sourcemaps/index.js.map`にソースマップがあることを宣言しています。
