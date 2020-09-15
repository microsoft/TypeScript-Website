---
title: Símbolos (Symbols)
layout: docs
permalink: /pt/docs/handbook/symbols.html
oneline: Usando o símbolo primitivo do JavaScript no TypeScript
translatable: true
---

Começando com ECMAScript 2015, `symbol` é um tipo de dados primitivo, igual ao `number` e `string`.

Valores do tipo `symbol` são criados pela chamada do construtor `Symbol`.

```ts
let sym1 = Symbol();

let sym2 = Symbol("key"); // string opcional
```

Simbolos são imutáveis e únicos.

```ts
let sym2 = Symbol("key");
let sym3 = Symbol("key");

sym2 === sym3; // false, symbols são únicos
```

Igual as strings, símbolos podem ser usados como chaves para propriedades de objetos.

```ts
const sym = Symbol();

let obj = {
  [sym]: "value",
};

console.log(obj[sym]); // "value"
```

Símbolos podem também ser combinados com declarações de propriedade computadas para declarar propriedades de objeto e membros de classe.

```ts
const getClassNameSymbol = Symbol();

class C {
  [getClassNameSymbol]() {
    return "C";
  }
}

let c = new C();
let className = c[getClassNameSymbol](); // "C"
```

## Símbolos bem conhecidos

Em adição aos símbolos definidos pelo usuário, existem símbolos internos, bem conhecidos.
Símbolos internos são usados para representar comportamentos internos das linguagem.

Aqui temos uma lista de símbolos do tipo well-known:

## `Symbol.hasInstance`

Um método que determina se um objeto de um construtor reconhece um objeto como um das instâncias construtoras. Chamados pela semântica do operador instanceof.

## `Symbol.isConcatSpreadable`

Um valor Booleano indicando que um objeto deve ser planificado para o seu array de elementos pelo Array.prototype.concat.

## `Symbol.iterator`

Um método que retorna o iterador padrão para um objeto. Chamado pela semântica da declaração do for-of.

## `Symbol.match`

Um método de expressão regular que compara a expressão regular contra uma string. Chamada pelo método `String.prototype.match`

## `Symbol.replace`

Um método de expressão regular que substitui substrings que combinam com uma string. Chamado pelo método `String.prototype.replace`.

## `Symbol.search`

Um método de expressão regular que retorna o índice dentro de uma string que condiz com a expressão regular. Chamado pelo método`String.prototype.search`.

## `Symbol.species`

Uma propriedade com valor de função que é a função construtora que é usada para criar objetos derivados.

## `Symbol.split`

Uma método de expressão regular que divide uma string em índices que condizem com a expressão regular. Chamada pelo método `String.prototype.split`

## `Symbol.toPrimitive`

Um método que converte um objeto em um valor primitivo correspondente. Chamado pelo operação abstrata `ToPrimitive`.

## `Symbol.toStringTag`

Uma valor de string que é usado na criação de uma descrição de string padrão de um objeto. Chamado pelo método built-in `Object.prototype.toString`.

## `Symbol.unscopables`

Um Objeto cujo os próprios nomes são nomes de propriedade que são excluídos da ligação de ambiente dos objetos associados.
