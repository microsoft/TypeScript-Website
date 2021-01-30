---
display: "List Files"
oneline: "Print all of the files read during the compilation."
---

컴파일 일부의 파일 이름을 출력합니다. 이 기능은 TypeScript에 예상한 파일이 포함되어 있는지 확실하지 않을 때 유용합니다.

예를들면:

```
example
├── index.ts
├── package.json
└── tsconfig.json
```

다음과 같습니다:

```json tsconfig
{
  "compilerOptions": {
    "listFiles": true
  }
}
```

echo paths는 다음과 같습니다:

```
$ npm run tsc
path/to/example/node_modules/typescript/lib/lib.d.ts
path/to/example/node_modules/typescript/lib/lib.es5.d.ts
path/to/example/node_modules/typescript/lib/lib.dom.d.ts
path/to/example/node_modules/typescript/lib/lib.webworker.importscripts.d.ts
path/to/example/node_modules/typescript/lib/lib.scripthost.d.ts
path/to/example/index.ts
```

TypeScript 4.2 버전을 사용할 경우 [`explainFiles`](#explainFiles)을 참조하십시오. 파일이 추가된 이유에 대한 설명 또한 제공합니다.
