---
display: "Incluir"
oneline: "Arquivos ou padrões a serem incluídos neste projeto"
---

Especifica um array de nomes de arquivos ou padrões a serem incluídos no programa.
Esses nomes de arquivo são resolvidos em relação ao diretório que contém o arquivo tsconfig.json.

```json
{
  "include": ["src/**/*", "tests/**/*"]
}
```

Isso incluirá:

<!-- TODO: #135
```diff
  .
- ├── scripts
- │   ├── lint.ts
- │   ├── update_deps.ts
- │   └── utils.ts
+ ├── src
+ │   ├── client
+ │   │    ├── index.ts
+ │   │    └── utils.ts
+ │   ├── server
+ │   │    └── index.ts
+ ├── tests
+ │   ├── app.test.ts
+ │   ├── utils.ts
+ │   └── tests.d.ts
- ├── package.json
- ├── tsconfig.json
- └── yarn.lock
``` -->

```
.
├── scripts                ⨯
│   ├── lint.ts            ⨯
│   ├── update_deps.ts     ⨯
│   └── utils.ts           ⨯
├── src                    ✓
│   ├── client             ✓
│   │    ├── index.ts      ✓
│   │    └── utils.ts      ✓
│   ├── server             ✓
│   │    └── index.ts      ✓
├── tests                  ✓
│   ├── app.test.ts        ✓
│   ├── utils.ts           ✓
│   └── tests.d.ts         ✓
├── package.json
├── tsconfig.json
└── yarn.lock
```

`include` e `exclude` suporta caracteres curinga para criar padrões globais:

- `*` corresponde a zero ou mais caracteres (excluindo separadores de diretório)
- `?` corresponde a qualquer caractere (excluindo separadores de diretório)
- `**/` corresponde a qualquer diretório aninhado a qualquer nível

Se um padrão global não incluir uma extensão de arquivo, apenas os arquivos com extensões compatíveis serão incluídos (por exemplo: `.ts`, `.tsx`, e `.d.ts` por padrão, com `.js` e `.jsx` se `allowJs` for definido como verdadeiro).
