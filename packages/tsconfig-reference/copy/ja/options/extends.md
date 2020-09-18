---
display: "Extends"
oneline: "Inherit options for a TSConfig"
---

`extends`の値は、別の継承対象の設定ファイルへのパスを含む文字列です。
Node.js におけるモジュール解決の流儀が用いられます。

ベースとなるファイルからの設定が最初に読み込まれ、続いて継承ファイルの設定によってオーバーライドされます。設定ファイル内のすべての相対パスは、元の設定ファイルを起点として解決されます。

継承した設定ファイルの`files`、`include`および`exclude`はベースとなる設定ファイルの内容を*上書き*します。
また、継承における循環参照は許容されません。

##### 例

`configs/base.json`:

```json tsconfig
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

`tsconfig.json`:

```json tsconfig
{
  "extends": "./configs/base",
  "files": ["main.ts", "supplemental.ts"]
}
```

`tsconfig.nostrictnull.json`:

```json tsconfig
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "strictNullChecks": false
  }
}
```
