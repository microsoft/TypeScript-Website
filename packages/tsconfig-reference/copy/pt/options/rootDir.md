---
display: "Diretório Raiz"
oneline: "Define o diretório raiz dos seus arquivos fonte"
---

**Padrão**: O caminho mais longo em comum entre todos os arquivos que não são de declaração. Se `composite` está definido, o padrão será o diretório contendo o arquivo `tsconfig.json`.

Quando TypeScript compila os arquivos, ele mantém a estrutura dos diretório de saída igual a dos diretório de entrada.

Por exemplo, suponhamos que você tenha alguns arquivos de entrada:

```
MeuProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
├── types.d.ts
```

O valor inferido para `rootDir` é o caminho mais longo em comum entre todos os arquivos que não são de declaração, que neste caso é `core/`.

Se o seu `outDir` fosse `dist`, TypeScript escreveria esta árvore:

```
MeuProj
├── dist
│   ├── a.js
│   ├── b.js
│   ├── sub
│   │   ├── c.js
```

Contudo, você pode ter a intenção de que `core` seja parte da estrutura do diretório de saída.
Ao definir `rootDir: "."` em `tsconfig.json`, TypeScript escreveria esta árvore:

```
MeuProj
├── dist
│   ├── core
│   │   ├── a.js
│   │   ├── b.js
│   │   ├── sub
│   │   │   ├── c.js
```

Importante, a opção `rootDir` **não altera quais arquivos se tornam parte da compilação**, pois não há interação com `include`, `exclude`, ou com a propriedade `files` em `tsconfig.json`.

Note que TypeScript nunca irá escrever um arquivo de saída em um diretório fora de `outDir`, e nunca irá pular a emissão de um arquivo.
Por este motivo, `rootDir` também impõe que todos arquivos que precisam ser emitidos estejam abaixo do caminho `rootDir`.

Por exemplo, digamos que você tivesse esta árvore:

```
MeuProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
├── ajudantes.ts
```

Seria um erro especificar `rootDir` como `core` _e_ `include` como `*`, porque estaria sendo criado um arquivo (`ajudantes.ts`) que precisaria ser emitido _fora_ do `outDir` (i.e. `../ajudantes.js`).
