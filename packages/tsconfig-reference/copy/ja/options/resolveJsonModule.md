---
display: "Resolve JSON Module"
oneline: "Allow importing .json files"
---

'.json'拡張子のファイルをモジュールとしてインポートできるようにします。Nodeのプロジェクトで一般的に利用されている手法です。
このオプションは、`import`時に静的なJSONの構造から型を生成します。

デフォルトでは、TypeScriptはJSONファイルの解決をサポートしていません:

```ts
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

このオプションを有効にするとJSONのインポートが可能となり、JSONファイルの型を検査できるようになります。

```ts
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
