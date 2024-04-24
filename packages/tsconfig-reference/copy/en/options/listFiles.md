---
display: "List Files"
oneline: "Print all of the files read during the compilation."
---

Print names of files part of the compilation. This is useful when you are not sure that TypeScript has
included a file you expected.

For example:

```
example
├── index.ts
├── package.json
└── tsconfig.json
```

With:

```json tsconfig
{
  "compilerOptions": {
    "listFiles": true
  }
}
```

Would echo paths like:

```
$ npm run tsc
path/to/example/node_modules/typescript/lib/lib.d.ts
path/to/example/node_modules/typescript/lib/lib.es5.d.ts
path/to/example/node_modules/typescript/lib/lib.dom.d.ts
path/to/example/node_modules/typescript/lib/lib.webworker.importscripts.d.ts
path/to/example/node_modules/typescript/lib/lib.scripthost.d.ts
path/to/example/index.ts
```

Note if using TypeScript 4.2, prefer [`explainFiles`](#explainFiles) which offers an explanation of why a file was added too.
