---
display: "Declaration Dir"
oneline: "Atur direktori root untuk file d.ts yang akan dituju"
---

Menawarkan cara untuk mengonfigurasi direktori root tempat file deklarasi dipancarkan.

```
example
├── index.ts
├── package.json
└── tsconfig.json
```

dengan `tsconfig.json`;

```json tsconfig
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./types"
  }
}
```

Akan menempatkan d.ts untuk `index.ts` di folder` types`:

```
example
├── index.js
├── index.ts
├── package.json
├── tsconfig.json
└── types
    └── index.d.ts
```