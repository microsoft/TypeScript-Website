---
display: "List Files"
oneline: "Print all of the files read during the compilation"
---

コンパイルされるファイル名を出力します。これは、コンパイルしてほしいファイルを TypeScript が対象に含めてくれているかが分からないときに有用です。

例えば、以下のようなときに:

```
example
├── index.ts
├── package.json
└── tsconfig.json
```

以下の設定をすると:

```json tsconfig
{
  "compilerOptions": {
    "listFiles": true
  }
}
```

出力される path は以下のようになります:

```
$ npm run tsc
path/to/example/node_modules/typescript/lib/lib.d.ts
path/to/example/node_modules/typescript/lib/lib.es5.d.ts
path/to/example/node_modules/typescript/lib/lib.dom.d.ts
path/to/example/node_modules/typescript/lib/lib.webworker.importscripts.d.ts
path/to/example/node_modules/typescript/lib/lib.scripthost.d.ts
path/to/example/index.ts
```
