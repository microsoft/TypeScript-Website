---
display: "List Emitted Files"
---

Print names of generated files part of the compilation. 
This is useful when you want to use TypeScript as a part of a shell build chain.
This is useful when you are not sure that TypeScript has 
included a file you expected. 

For example:

```
example
├── index.ts
├── package.json
└── tsconfig.json
```

With:

```json
{
  "compilerOptions": {
    "declaration": true,
    "listFiles": true
  }
}
```

Would echo paths like:

```
$ npm run tsc

path/to/example/index.js
path/to/example/index.d.ts
```
