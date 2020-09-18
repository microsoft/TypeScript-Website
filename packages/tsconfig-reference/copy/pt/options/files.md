---
display: "Arquivos"
oneline: "Inclui uma lista de arquivos, não suporta globs"
---

Especifica uma lista de arquivos permitidos para incluir no programa. Um erro ocorre se qualquer um dos arquivos não puder ser encontrado.

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

Esta opção é útil quando você tem uma quantia pequena de arquivos e não precisa utilizar um glob para se referir a diversos arquivos.
Se você precisa utilizar glob, então use [`include`](#include).
