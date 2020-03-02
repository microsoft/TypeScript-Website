---
display: "Type Roots"
oneline: "locations where TypeScript should look for type definitions"
---

デフォルトでは、_表示されている_すべての"`@types`"パッケージがコンパイル時にインクルードされます。
プロジェクトを囲んでいる任意のフォルダの`node_modules/@types`内のパッケージが_表示されている_とみなされます。
例えば、`./node_modules/@types/`、`../node_modules/@types/`、`../../node_modules/@types/`に存在するパッケージが該当します。

`typeRoots`を設定すると、`typeRoots`配下のパッケージ_のみ_がインクルードされます。例えば:

```json
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"]
  }
}
```

この設定ファイルは、`./typings`と`./vendor/types`以下の_すべての_パッケージがインクルードされ、`./node_modules/@types`のパッケージはインクルードされません。
パスはすべて、`tsconfig.json`からの相対パスです。
