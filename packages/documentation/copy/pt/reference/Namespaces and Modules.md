---
title: Namespaces e Módulos
layout: docs
permalink: /pt/docs/handbook/namespaces-and-modules.html
oneline: Como organizar o código em TypeScript através de módulos ou namespaces
translatable: true
---

Este post descreve as várias formas de organizar seu código usando módulos e namespaces no TypeScript.
Abordaremos também alguns tópicos avançados sobre como usar namespaces e módulos, e algumas armadilhas comuns ao usá-los no TypeScrypt.

Veja a documentação de [Módulos](/docs/handbook/modules.html) para mais informações sobre os módulos do ES.
Veja a documentação de [Namespaces](/pt/docs/handbook/namespaces.html) para mais informações sobre os namespaces do Typescript. 

Nota: Em versões _muito_ antigas do TypeScript, namespaces eram chamados de 'Módulos Internos' (ou 'Internal Modules', em inglês).

## Usando Módulos

Módulos podem conter código e declarações.

Os módulos também dependem de um carregador de módulos (como CommonJs/Require.js) ou um ambiente que suporta módulos ES.
Módulos fornecem melhor reutilização de código, isolamento mais forte e melhor suporte a ferramentas para empacotamento.

Também é importante notar que, para aplicações Node.js, moódulos são o padrão e **nós recomendamos módulos em vez de namespaces em códigos modernos**.

Começando pelo ECMAScript 2015, módulos são parte nativa da linguagem e devem ser suportados por todas as implementações de engine compatíveis.
Dessa forma, para novos projetos, módulos seriam o mecanismo recomendado para organização de código.

## Usando Namespaces

Os Namespaces são uma forma específica do TypeScript para organizar código.
Namespaces são simplesmente objetos JavaScript nomeados no namespace global.
Isso torna os namespaces uma construção muito simples de usar.
Ao contrário dos módulos, eles podem atingir múltiplos arquivos, e podem ser concatenados usando `--outFile`.
Namespaces podem ser uma boa maneira de estruturar seu código em uma aplicação Web, com todas as dependências incluídas como tags `<script>` em sua página HTML.

Assim como toda poluição do namespace global, pode ser difícil identificar dependências de componentes, especialmente em uma aplicação grande.

## Armadilhas de Namespaces e Módulos

Nesta seção descreveremos várias armadilhas comuns no uso de namespaces e módulos e como evitá-las.

## `/// <reference>`-ando um módulo

Um erro comum é tentar usar a sintaxe `/// <reference ... />` para se referir a um de módulo, em vez de usar a instrução `import`.
Para entender a distinção, primeiro precisamos entender como o compilador pode localizar as informações de tipo com base no caminho de um `import` (e.g. os `...` em `import x from "...";`, `import x = require("...");`, etc.).

O compilador tentará encontrar um `.ts`, `.tsx`, e depois um `.d.ts` com o caminho apropriado.
Se o arquivo específico não puder ser encontrado, então o compilador procurará por uma _declaração de módulo de ambiente_.
Lembre-se de que eles precisam ser declarados em um arquivo `.d.ts`.


- `meusModulos.d.ts`

  ```ts
  // Em um arquivo .d.ts ou arquivo .ts que não é um módulo:
  declare module "AlgumModulo" {
    export function fn(): string;
  }
  ```

- `meuOutroModulo.ts`

  ```ts
  /// <reference path="meusModulos.d.ts" />
  import * as m from "AlgumModulo";
  ```

A tag de referência aqui nos permite localizar o arquivo de declaração que contém a declaração para o módulo de ambiente.
É assim que o arquivo `node.d.ts` que vários dos exemplos do TypeScript usam é consumido. 

## Namespacing Desnecessário

Se você estiver convertendo um programa de namespaces para módulos, pode ser fácil acabar com um arquivo que se parece com este:

- `formas.ts`

  ```ts
  export namespace Formas {
    export class Triangulo {
      /* ... */
    }
    export class Quadrado {
      /* ... */
    }
  }
  ```

O módulo de nível superior aqui `Formas` agrupa `Triangulo` e `Quadrado` sem motivo.
Isso é confuso e irritante para os consumidores de seu módulo:

- `consumidorDeFormas.ts`

  ```ts
  import * as formas from "./formas";
  let t = new formas.Formas.Triangulo(); // formas.Formas?
  ```

Uma característica chave de módulos em TypeScript é que dois módulos diferentes nunca contribuirão com nomes para o mesmo escopo.
Como o consumidor de um módulo decide qual nome atribuir a ele, não há a necessidade de proativamente agrupar os simbolos exportados em um namespace.

Para reiterar por que você não deve tentar atribuir um namespace ao conteúdo do seu módulo, a ideia geral do namespacing é fornecer o agrupamento lógico de construções e evitar colisão de nomes.
Como o arquivo de módulo em si já é um agrupamento lógico, e seu nome de nível superior é definido pelo código que o importa, é desnecessário usar uma camada adicional de módulo para objetos exportados.

Aqui está um exemplo revisado:

- `formas.ts`

  ```ts
  export class Triangulo {
    /* ... */
  }
  export class Quadrado {
    /* ... */
  }
  ```

- `consumidorDeFormas.ts`

  ```ts
  import * as formas from "./formas";
  let t = new formas.Triangulo();
  ```


## Trade-offs de Módulos

Assim como existe uma correspondência de um-para-um entre arquivos JS e módulos, TypeScript tem uma correspondência de um-para-um entre arquivos fonte de módulos e seus arquivos JS emitidos.
Um efeito disso é que não é possível concatenar múltiplos arquivos fonte de módulos dependendo do sistema de módulos que você deseja.
Por exemplo, você não pode apenas usar a opção `outFile` ao direcionar `commonjs` ou `umd`, mas com TypeScript 1.8 e posterior, [é possível](./release-notes/typescript-1-8.html#concatenate-amd-and-system-modules-with---outfile) usar `outFile` ao direcionar `amd` ou `system`.
