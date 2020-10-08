---
display: "Files"
oneline: "Include a set list of files, does not support globs"
---

プログラムに含めるファイルの許可リストを指定します。ファイルが見つからない場合、エラーが発生します。

```json tsconfig
{
  "compilerOptions": {},
  "files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts",
    "parser.ts",
    "utilities.ts",
    "binder.ts",
    "checker.ts",
    "tsc.ts"
  ]
}
```

このオプションは、プロジェクトが少数のファイルから構成されていて、グロブパターンを必要としない場合で有用です。
グロブパターンが必要な場合、[`include`](#include)を利用してください。
