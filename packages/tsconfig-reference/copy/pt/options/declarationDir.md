---
display: "Diretório de declarações"
oneline: "Define o diretório raiz para os arquivos .d.ts"
---

Oferece uma maneira de configurar o diretório raiz para onde os arquivos de declaração são emitidos.

```
exemplo
├── index.ts
├── package.json
└── tsconfig.json
```

com este `tsconfig.json`:

```json tsconfig
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./tipos"
  }
}
```

Colocaria o `d.ts` para o `index.ts` em uma pasta`tipos`:

```
exemplo
├── index.js
├── index.ts
├── package.json
├── tsconfig.json
└── tipos
    └── index.d.ts
```
