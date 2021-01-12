---
display: "Declaration Dir"
oneline: "Especifica el directorio de salida para archivos de declaración generados."
---

Ofrece una manera de configurar el directorio raíz donde los archivos de declaración son emitidos.

```
ejemplo
├── index.ts
├── package.json
└── tsconfig.json
```

con `tsconfig.json`:

```json tsconfig
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./types"
  }
}
```

Colocaría el archivo d.ts para `index.ts` en una carpeta `types`:

```
ejemplo
├── index.js
├── index.ts
├── package.json
├── tsconfig.json
└── types
    └── index.d.ts
```
