---
title: tsconfig.json
layout: docs
permalink: /pt/docs/handbook/tsconfig-json.html
oneline: Aprenda sobre como o TSConfig funciona
translatable: true
---

## Visão geral

A presença de um arquivo `tsconfig.json` em um diretório, indica que esse diretório é a raiz do projeto Typescript.
O arquivo `tsconfig.json` especifica os arquivos raiz e as configurações de compilação necessárias para o projeto.

Projetos JavaScript podem ter um arquivo `jsconfig.json`, que tem quase o mesmo propósito, mas possui algumas flags do compilador relacionadas ao JavaScript que já estão habilitadas por padrão.

Um projeto pode ser compilado seguindo uma das seguintes maneiras:

## Usando `tsconfig.json` ou `jsconfig.json`

- Invocando o `tsc` sem os arquivos de entrada, nesse caso o compilador procura o arquivo `tsconfig.json` começando no diretório atual e continua em suas sub pastas.
- Invocando o `tsc` sem os arquivos de entrada e a opção de linha de comando `--project` (ou apenas `-p`) que especifica o caminho para o diretório que contém o arquivo `tsconfig.json`, ou o caminho para um arquivo `.json` válido contendo as configurações.

Quando os arquivos de entrada são especificados por linha de comando, os arquivos `tsconfig.json` são ignorados.

# Exemplo

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

## Configurações Básicas

Dependendo do ambiente de execução JavaScript, no qual você deseja executar seu código, pode haver uma configuração básica que pode ser usada em [github.com/tsconfig/bases](https://github.com/tsconfig/bases/).
Esses são arquivos `tsconfig.json` que seu projeto pode estender, o que simplifica o seu `tsconfig.json` ao já lidarem com o suporte de tempo de execução.

Por exemplo, se você está desenvolvendo um projeto que usa Node.js na versão 12 ou mais recente, então você pode usar o módulo npm [`@tsconfig/node12`](https://www.npmjs.com/package/@tsconfig/node12)

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

Isso permite que seu `tsconfig.json` se concentre nas escolhas únicas para o seu projeto, e não em todas as mecânicas de tempo de execução. Já existem algumas tsconfig básicas e esperamos que a comunidade possa adicionar mais para diferentes ambientes.

- [Recomendado](https://www.npmjs.com/package/@tsconfig/recommended)
- [Node 10](https://www.npmjs.com/package/@tsconfig/node10)
- [Node 12](https://www.npmjs.com/package/@tsconfig/node12)
- [Deno](https://www.npmjs.com/package/@tsconfig/deno)
- [React Native](https://www.npmjs.com/package/@tsconfig/react-native)
- [Svelte](https://www.npmjs.com/package/@tsconfig/svelte)

## Detalhes

A propriedade `"compilerOptions"` pode ser omitida, casos em que os padrões do compilador são usados. Veja nossa lista completa das [Opções que o compilador suporta](/pt/tsconfig).

## Referências TSConfig

Você pode saber mais sobre as centenas de opções de configurações em [Referências TSConfig](/pt/tsconfig).

## Esquema

O esquema `tsconfig.json` pode ser encontrado no [Armazenamento de Esquema JSON](http://json.schemastore.org/tsconfig).
