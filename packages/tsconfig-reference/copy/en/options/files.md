---
display: "Files"
oneline: "Include a list of files. This does not support glob patterns, as opposed to [`include`](#include)."
---

Specifies an allowlist of files to include in the program. An error occurs if any of the files can't be found.

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

This is useful when you only have a small number of files and don't need to use a glob to reference many files.
If you need that then use [`include`](#include).
