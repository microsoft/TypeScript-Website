---
display: "Files"
oneline: "Include a set list of files, does not support globs"
---

프로그램에 포함할 파일 허용 목록을 지정합니다. 파일을 찾지 못하면 오류가 발생합니다.

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

파일 수가 적어 파일 참조에 glob을 사용할 필요가 없을 때 유용합니다. 필요한 경우 [`include`](#include)을 사용합니다.
