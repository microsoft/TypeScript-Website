---
display: "Allow Synthetic Default Imports"
oneline: "Allow 'import x from y' when a module doesn't have a default export"
---

`allowSyntheticDefaultImports`をtrueに設定すると、次のようなインポートが可能になります:

```ts
import React from "react";
```

下記のようにする必要はありません:

```ts
import * as React from "react";
```

モジュールがdefault exportを**指定していなくても**利用可能です。

このオプションはTypeScriptが出力するJavaScriptへは影響しません。型チェックにのみ影響があります。
このオプションにより、モジュールのdefault exportを自然に扱えるようにする追加コードが出力されている環境では、TypeScriptとBabelの挙動が揃います。
