---
display: "Declaration Dir"
---

Let's you change the root directory for where declaration files to be written.

```
example
├── index.ts
├── package.json
└── tsconfig.json
```

with this `tsconfig.json`:

```json
{
      "compilerOptions": {
        "declaration": true,
        "declarationDir": "./types"
    }
}
```

Would place the d.ts for the `index.ts` in a folder `types`:

```
example
├── index.js
├── index.ts
├── package.json
├── tsconfig.json
└── types
    └── index.d.ts
```
