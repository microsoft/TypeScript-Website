---
display: "Out File"
oneline: "Output a single file of all JS files concatenated"
---

設定すると、すべての_グローバルな_（モジュールでない）ファイルは指定した単一の出力ファイルに結合されます。

もし`module`が`system`か`amd`の場合、この単一出力ファイルのグローバルなコンテンツの後ろにすべてのモジュールファイルも結合されます。

Note: `module`が`None`、`System`、`AMD`のいずれかでない限り、`outFile`は使用できません。
このオプションはCommonJSまたはES6 Modulesにバンドルする目的では使用_できません_。
