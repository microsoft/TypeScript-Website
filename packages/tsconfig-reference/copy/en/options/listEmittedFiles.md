---
display: "List Emitted Files"
oneline: "Print the names of emitted files after a compilation."
---

Print names of generated files part of the compilation to the terminal.

This flag is useful in two cases:

- You want to transpile TypeScript as a part of a build chain in the terminal where the filenames are processed in the next command.
- You are not sure that TypeScript has included a file you expected, as a part of debugging the [file inclusion settings](#Project_Files_0).

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

Normally, TypeScript would return silently on success.
