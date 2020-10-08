---
display: "Diretório de saída"
oneline: "Defina uma pasta de saída para todos os arquivos emitidos"
---

Se especificado, os arquivos `.js` (como o `.d.ts`, e `.js.map`, etc.) serão emitidos para este diretório.
A estrutura de diretório dos arquivos de origem originais é preservada; consulte [rootDir](#rootDir) se a raiz calculada não for o que você pretendia.

Se não for especificado, os arquivos `.js` serão emitidos no mesmo diretório que os arquivos` .ts` de onde foram gerados:

```sh
$ tsc

exemplo
├── index.js
└── index.ts
```

Com um `tsconfig.json` como este:

```json
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

Executar `tsc` com essas configurações move os arquivos para a pasta `dist` especificada:

```sh
$ tsc

exemplo
├── dist
│   └── index.js
├── index.ts
└── tsconfig.json
```
