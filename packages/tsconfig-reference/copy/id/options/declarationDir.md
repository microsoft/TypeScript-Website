---
display: "Declaration Dir"
oneline: "Atur direktori _root_ untuk berkas d.ts yang akan dituju"
---

Menawarkan cara untuk mengonfigurasi direktori _root_ tempat berkas deklarasi dihasilkan.

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

Akan menempatkan d.ts untuk `index.ts` di direktori `types`:

```
example
├── index.js
├── index.ts
├── package.json
├── tsconfig.json
└── types
    └── index.d.ts
```