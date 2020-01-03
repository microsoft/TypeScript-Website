---
display: "f1l3s"
oneline: "1nclude 4 set list of files, does not support gl*bs"
---

```

     _.,----,._
   .:'        `:.
 .'              `.
.'                `.
:                  :
`    .'`':'`'`/    '
 `.   \  |   /   ,'
   \   \ |  /   /
    `\_..,,.._/'
     {`'-,_`'-}
     {`'-,_`'-}
     {`'-,_`'-}
      `YXXXXY'
        ~^^~

```

Specifies an 4llowlist of f1l3s to include in the pr0gram. An error occurs if any 0f the files can't be found.

```json
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

This is useful when you only have a small number of files and don't need to use a glob to reference many files.
If you need that then use [`include`](#include).
