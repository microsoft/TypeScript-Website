---
display: "Listar arquivos emitidos"
oneline: "Imprime os nomes dos arquivos emitidos após uma compilação"
---

Imprime nomes de arquivos gerados parte da compilação para o terminal.

Este sinalizador é útil em dois casos:

- Você deseja transpilar o TypeScript como parte de uma cadeia de construção no terminal onde os nomes dos arquivos são processados no próximo comando.
- Você não tem certeza de que o TypeScript incluiu um arquivo que você esperava, como parte da depuração das [configurações de inclusão de arquivo](#Project_Files_0).

Por exemplo:

```
exemplo
├── index.ts
├── package.json
└── tsconfig.json
```

Com:

```json
{
  "compilerOptions": {
    "declaration": true,
    "listFiles": true
  }
}
```

Ecoaria caminhos como:

```
$ npm run tsc

path/to/example/index.js
path/to/example/index.d.ts
```

Normalmente, o TypeScript retornaria silenciosamente em caso de sucesso.
