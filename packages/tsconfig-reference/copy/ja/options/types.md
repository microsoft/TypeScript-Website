---
display: "Types"
oneline: "Used to create an allowlist of types to be included in the compile"
---

デフォルトでは、すべての_表示されている_"`@types`"パッケージがコンパイル時にインクルードされます。
プロジェクトを囲んでいる任意のフォルダの`node_modules/@types`内のパッケージが_表示されている_とみなされます。
例えば、`./node_modules/@types/`、`../node_modules/@types/`、`../../node_modules/@types/`に存在するパッケージが該当します。

`types`を設定すると、リストに列挙したパッケージのみがインクルードされます。例えば:

```json
{
  "compilerOptions": {
    "types": ["node", "lodash", "express"]
  }
}
```

この`tsconfig.json`ファイルは、`./node_modules/@types/node`と`./node_modules/@types/lodash`と`./node_modules/@types/express`_のみ_をインクルードするようになります。
`node_modules/@types/*`配下にある他のパケージはインクルードされません。

この機能は[`typeRoots`](#typeRoots)と違い、インクルードしたいtypesパッケージだけを厳密に指定できます。一方、[`typeRoots`](#typeRoots)は必要としている特定のフォルダを指定できます。
