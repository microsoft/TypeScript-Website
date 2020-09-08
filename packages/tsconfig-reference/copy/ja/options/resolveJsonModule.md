---
display: "Resolve JSON Module"
oneline: "Allow importing .json files"
---

'.json'拡張子のファイルをモジュールとしてインポートできるようにします。Node のプロジェクトで一般的に利用されている手法です。
このオプションは、`import`時に静的な JSON の構造から型を生成します。

デフォルトでは、TypeScript は JSON ファイルの解決をサポートしていません:

```ts twoslash
// @errors: 2732
// @filename: settings.json
{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
// @filename: index.ts
import settings from "./settings.json";

settings.debug === true;
settings.dry === 2;
```

このオプションを有効にすると JSON のインポートが可能となり、JSON ファイルの型を検査できるようになります。

```ts twoslash
// @errors: 2367
// @resolveJsonModule
// @module: commonjs
// @moduleResolution: node
// @filename: settings.json
{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
// @filename: index.ts
import settings from "./settings.json";

settings.debug === true;
settings.dry === 2;
```
