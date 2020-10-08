---
display: "Paths"
oneline: "A set of locations to look for imports in"
---

`baseUrl`からの相対的な検索場所にインポートを再マッピングするエントリです。`paths`についてより網羅的な記述は[ハンドブック](/docs/handbook/module-resolution.html#path-mapping)に記載されています。

`paths`により、TypeScript がどのように`require`/`import`からインポートを解決すべきかを定義できます。

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": ".", // "paths"を設定する場合、このオプションも設定が必要です。
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // このマッピングは"baseUrl"からの相対パスです。
    }
  }
}
```

この設定は、`import "jquery"`と記述できるようにし、すべての正しい型がローカルから取得されるようになります。

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
        "app/*": ["app/*"],
        "config/*": ["app/_config/*"],
        "environment/*": ["environments/*"],
        "shared/*": ["app/_shared/*"],
        "helpers/*": ["helpers/*"],
        "tests/*": ["tests/*"]
    },
}
```

この例は、TypeScript に対して、ファイルリゾルバーへコードを見つけるためのカスタムプレフィクスによる補助をさせています。
このパターンは、コードベース内で長い相対パスを避けるために利用できます。
