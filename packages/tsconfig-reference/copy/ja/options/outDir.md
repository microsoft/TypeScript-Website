---
display: "Out Dir"
oneline: "Set an output folder for all emitted files"
---

設定すると、`.js`ファイル（`.d.ts`や`.js.map`ファイルも同様）がこのディレクトリ内に出力されます。
元のソースファイルのディレクトリ構造は保存されます。結果のルート構造が意図どおりでない場合は、[rootDir](#rootDir)を参照してください。

設定しない場合、`.js`ファイルは`.ts`ファイルを作成したのと同じディレクトリに出力されます。

```sh
$ tsc

example
├── index.js
└── index.ts
```

次のような`tsconfig.json`の場合:

```json
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

この設定で`tsc`を実行すると、ファイルは指定された`dist`フォルダに生成されます。

```sh
$ tsc

example
├── dist
│   └── index.js
├── index.ts
└── tsconfig.json
```
