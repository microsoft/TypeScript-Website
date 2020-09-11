---
title: tsconfig.json
layout: docs
permalink: /docs/handbook/tsconfig-json.html
oneline: Learn about how a TSConfig works
translatable: true
---

## Overview

A presença de um arquivo `tsconfig.json` em um diretório, indica que esse diretório é a raiz do projeto Typescript.
O arquivo `tsconfig.json` especifica os arquivos raiz e as configurações necessárias para o compilador compilar o projeto.

Projetos Javascript podem ter um arquivo `jsconfig.json`, que tem quase o mesmo propósito, mas possue algumas flags do compilador relacionadas ao Javascript que já estão habilitadas por padrão.

Um projeto pode ser compilado segindo uma das seguintes maneiras:

## Usando `tsconfig.json` ou `jsconfig.json`

- Invocando o tsc sem arquivos de entrada, nesse caso o compilador procura o arquivo `tsconfig.json` começando no diretório atual e continua em sua sub pastas.
- Invocando o tsc sem arquivos de entrada e a opção de linha de comando `--project` (ou apenas `-p`) que especifica o caminho para o diretório que contem o arquivo `tsconfig.json`, ou o caminho para um aquivo `.json` válido contendo as configurações.

Quando os arquivos e entrada são expecificados por linha de comando, os arquivos `tsconfig.json` são ignorados.

## Exemplo

Exemplo de arquivos `tsconfig.json`:

- Usando a propriedade `"files"`

  ```json tsconfig
  {
    "compilerOptions": {
      "module": "commonjs",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "sourceMap": true
    },
    "files": [
      "core.ts",
      "sys.ts",
      "types.ts",
      "scanner.ts",
      "parser.ts",
      "utilities.ts",
      "binder.ts",
      "checker.ts",
      "emitter.ts",
      "program.ts",
      "commandLineParser.ts",
      "tsc.ts",
      "diagnosticInformationMap.generated.ts"
    ]
  }
  ```

- Usando as propriedades `"include"` e `"exclude"`

  ```json tsconfig
  {
    "compilerOptions": {
      "module": "system",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "outFile": "../../built/local/tsc.js",
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.spec.ts"]
  }
  ```

## Bases TSConfig

Dependendo do ambinete de execução javascript, no qual voçê deseja executar seu código, pode haver uma configuração básica que pode ser usada em [github.com/tsconfig/bases](https://github.com/tsconfig/bases/).
Esses são arquivos `tsconfig.json` que seu projeto se estende o que simplifica o seu `tsconfig.json` ao lidar com o suporte de tempo de execução.

Por exemplo, se você está desenvolvendo um projeto que usa node.js na versão 12 ou maior, então você pode usar o módulo npm [`@tsconfig/node12`](https://www.npmjs.com/package/@tsconfig/node12)

```json tsconfig
{
  "extends": "@tsconfig/node12/tsconfig.json",

  "compilerOptions": {
    "preserveConstEnums": true
  },

  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

Isso permite que seu `tsconfig.json` se concentre nas escolhas únicas para o seu projeto, e não em todas as mecânicas de tempo de execução. Já existem algumas bases tsconfig e esperamos que a comunidade possa adicionar mais para diferentes ambientes.

- [Recommended](https://www.npmjs.com/package/@tsconfig/recommended)
- [Node 10](https://www.npmjs.com/package/@tsconfig/node10)
- [Node 12](https://www.npmjs.com/package/@tsconfig/node12)
- [Deno](https://www.npmjs.com/package/@tsconfig/deno)
- [React Native](https://www.npmjs.com/package/@tsconfig/react-native)
- [Svelte](https://www.npmjs.com/package/@tsconfig/svelte)

## Detalhes

A propriedade `"compilerOptions"` pode ser omitida, casos em que os padroes do compilador são usados. Veja nossa lista completa das [Opções que o compilador suporta](/tsconfig).

## Referências TSConfig

To learn more about the hundreds of configuration options in the [TSConfig Reference](/tsconfig).
Você saber mais sobre as centenas de opçãos de configurações em [Referências TSConfig](/tsconfig)

## Esquema

O esquema `tsconfig.json` pode ser encontardo no[Armazenamento de Esquema JSON](http://json.schemastore.org/tsconfig).
