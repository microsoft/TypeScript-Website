---
display: "List Emitted Files"
oneline: "Print the names of emitted files after a compile"
---

コンパイルされ、生成されたファイル名をターミナルに出力します。

このフラグは2つのケースで有用です:

- 後続のコマンドでファイル名が処理されるターミナルのビルドチェーンの一部としてTypeScriptをトランスパイルしたいとき
- TypeScriptがコンパイルしてほしいファイルを対象に含めているか分からず、[対象ファイル設定](#Project_Files_0)を部分的にデバッグしたいとき

例えば、以下のようなときに:

```
example
├── index.ts
├── package.json
└── tsconfig.json
```

以下の設定をすると:

```json
{
  "compilerOptions": {
    "declaration": true,
    "listFiles": true
  }
}
```

以下のようなpathを出力します:

```
$ npm run tsc

path/to/example/index.js
path/to/example/index.d.ts
```

通常、成功するとTypeScriptは何も出力しない状態に戻ります。
