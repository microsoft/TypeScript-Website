---
# display: "Declaration Dir"
display: "Declaration Dir"
# oneline: "Set the root directory for d.ts files to go"
oneline: "Atur direktori root untuk file d.ts yang akan dituju"
---

<!-- Offers a way to configure the root directory for where declaration files are emitted. -->
Menawarkan cara untuk mengconfigurasi direktori root tempat file deklarasi dipancarkan.

```
example
├── index.ts
├── package.json
└── tsconfig.json
```

dengan `tsconfig.json`:

```json tsconfig
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./types"
  }
}
```

<!-- Would place the d.ts for the `index.ts` in a `types` folder: -->
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
