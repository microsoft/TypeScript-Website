---
display: "Arquivos"
oneline: "Incluir uma lista definida de arquivos, não suporta globs"
---

Especifica uma lista de permissão de arquivos para incluir no programa. Ocorre um erro se algum dos arquivos não puder ser encontrado.

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

Isso é útil quando você possui apenas um pequeno número de arquivos e não precisa usar um glob para fazer referência
a muitos arquivos. Se você precisar, use [`include`](#include).
