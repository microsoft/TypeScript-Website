---
title: Projetos JS utilizando TypeScript
layout: docs
permalink: /pt/docs/handbook/intro-to-js-ts.html
oneline: Como adicionar verificação de tipo a arquivos JavaScript usando TypeScript
translatable: true
---

O sistema de tipos no TypeScript tem diferentes níveis de rigidez ao trabalhar com uma base de código:

- Um sistema de tipo baseado apenas em inferência com código JavaScript
- Tipagem incremental em JavaScript [via JSDoc](/docs/handbook/jsdoc-supported-types.html)
- Usando `// @ts-check` em um arquivo JavaScript
- Código TypeScript
- TypeScript com [`strict`](/tsconfig#strict) habilitado

Cada etapa representa um movimento em direção a um sistema de tipo mais seguro, mas nem todo projeto precisa desse nível de verificação.

## TypeScript com JavaScript

Isso ocorre quando você usa um editor que usa TypeScript para fornecer ferramentas como autocompletar, pular para o símbolo e ferramentas de refatoração como renomear.
A [página inicial](/) possui uma lista de editores que possuem plugins TypeScript.

## Fornecimento de dicas de tipo em JS via JSDoc

Em um arquivo `.js`, os tipos geralmente podem ser inferidos. Quando os tipos não podem ser inferidos, eles podem ser especificados usando a sintaxe JSDoc.

As anotações JSDoc vêm antes de uma declaração ser usada para definir o tipo dessa declaração. Por exemplo:

```js twoslash
/** @type {number} */
var x;

x = 0; // OK
x = false; // OK?!
```

Você pode encontrar a lista completa de padrões JSDoc suportados [em tipos suportados de JSDoc](/docs/handbook/jsdoc-supported-types.html).

## `@ts-check`

A última linha do exemplo de código anterior geraria um erro no TypeScript, mas não o faz por padrão em um projeto JS.
Para habilitar erros em seus arquivos JavaScript, adicione: `// @ts-check` à primeira linha em seus arquivos `.js` para que o TypeScript o indique como um erro.

```js twoslash
// @ts-check
// @errors: 2322
/** @type {number} */
var x;

x = 0; // OK
x = false; // Not OK
```

Se você tem muitos arquivos JavaScript aos quais deseja adicionar erros, pode passar a usar um [`jsconfig.json`](/docs/handbook/tsconfig-json.html).
Você pode pular a verificação de alguns arquivos adicionando um comentário `// @ts-nocheck` aos arquivos.

O TypeScript pode oferecer erros dos quais você discorda; nesses casos, você pode ignorar os erros em linhas específicas adicionando `// @ts-ignore` ou`// @ts-expect-error` na linha anterior.

```js twoslash
// @ts-check
/** @type {number} */
var x;

x = 0; // OK
// @ts-expect-error
x = false; // Not OK
```

Para saber mais sobre como o JavaScript é interpretado pelo TypeScript, leia [Como TS Checa tipos de JS](/docs/handbook/type-checking-javascript-files.html)
