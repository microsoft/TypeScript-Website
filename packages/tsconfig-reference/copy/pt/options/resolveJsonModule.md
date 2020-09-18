---
display: "Resolução de módulo JSON"
oneline: "Permite importar arquivos .json."
---

Permite importar módulos com um uma extensão '.json', que é uma prática comum em projetos node. Isso inclui gerar um arquivo `import` baseado na forma estática do JSON.

O TypeScript não suporta a resolução de arquivos JSON por padrão:

```ts twoslash
// @errors: 2732
// @filename: settings.json
{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
// @filename: index.ts
import settings from "./settings.json";

settings.debug === true;
settings.dry === 2;
```

Ativar essa opção permite importar JSON e validar os tipos nesse arquivo JSON.

```ts twoslash
// @errors: 2367
// @resolveJsonModule
// @module: commonjs
// @moduleResolution: node
// @filename: settings.json
{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
// @filename: index.ts
import settings from "./settings.json";

settings.debug === true;
settings.dry === 2;
```
