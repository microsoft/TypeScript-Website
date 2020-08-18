---
title: Criação de arquivos .d.ts a partir de arquivos .js
layout: docs
permalink: /docs/handbook/declaration-files/dts-from-js.html
oneline: "Como adicionar geração d.ts a projetos JavaScript"
translatable: true
---

[Com o TypeScript 3.7](/docs/handbook/release-notes/typescript-3-7.html#--declaration-and---allowjs),
TypeScript adicionou suporte para gerar arquivos .d.ts de JavaScript usando a sintaxe JSDoc.

Essa configuração significa que você pode ter a experiência de editor de editores habilitados para TypeScript sem portar seu projeto para TypeScript ou ter que manter arquivos .d.ts em sua base de código.
TypeScript suporta a maioria das tags JSDoc, você pode encontrar [a referência aqui](/docs/handbook/type-checking-javascript-files.html#supported-jsdoc).

## Configurando seu projeto para emitir arquivos .d.ts

Para adicionar a criação de arquivos `.d.ts` em seu projeto, você precisará realizar até quatro etapas:

- Adicione TypeScript às suas dependências de desenvolvimento
- Adicione um `tsconfig.json` para configurar o TypeScript
- Execute o compilador TypeScript para gerar os arquivos `d.ts` correspondentes para arquivos JS
- (opcional) Edite seu `package.json` para fazer referência aos tipos

### Adicionando TypeScript

Você pode aprender como fazer isso em nossa [página de instalação](/download).

### TSConfig

O TSConfig é um arquivo json5 que configura ambos os sinalizadores do compilador e declara onde encontrar os arquivos.
Neste caso, você vai querer um arquivo como o seguinte:

```json5
{
  // Change this to match your project
  include: ["src/**/*"],

  compilerOptions: {
    // Tells TypeScript to read JS files, as
    // normally they are ignored as source files
    allowJs: true,
    // Generate d.ts files
    declaration: true,
    // This compiler run should
    // only output d.ts files
    emitDeclarationOnly: true,
    // Types should go into this directory.
    // Removing this would place the .d.ts files
    // next to the .js files
    outDir: "dist",
  },
}
```

Você pode aprender mais sobre as opções na [referência tsconfig](/reference).
Uma alternativa ao uso de um arquivo TSConfig é a CLI, este é o mesmo comportamento de um comando CLI.

```sh
npx typescript src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## Execute o compilador

Você pode aprender como fazer isso em nossa [página de instalação](/download).
Você quer ter certeza de que esses arquivos estão incluídos em seu pacote se você tiver os arquivos `.gitignore` em seu projeto.

## Editando o package.json

TypeScript replica a resolução do nó para módulos em um `package.json`, com uma etapa adicional para localizar arquivos `.d.ts`.
A grosso modo, a resolução verificará primeiro o campo opcional `"types"`, depois o campo `"main"` e, finalmente, tentará `index.d.ts` na raiz.

| Package.json              | Localização do padrão .d.ts      |
| :------------------------ | :----------------------------- |
| No "types" field          | checks "main", then index.d.ts |
| "types": "main.d.ts"      | main.d.ts                      |
| "types": "./dist/main.js" | ./main/main.d.ts               |

If absent, then "main" is used

| Package.json             | Localização do padrão .d.ts |
| :----------------------- | :------------------------ |
| No "main" field          | index.d.ts                |
| "main":"index.js"        | index.d.ts                |
| "main":"./dist/index.js" | ./dist/index.d.ts         |

## Dicas

Se você gostaria de escrever testes para seus arquivos `.d.ts`, tente [tsd](https://github.com/SamVerschueren/tsd).
