---
title: Iteradores e Geradores
layout: docs
permalink: /pt/docs/handbook/iterators-and-generators.html
oneline: Como os Iteradores e Geradores funcionam no TypeScript
translatable: true
---

## Iteráveis

Um objeto é considerado iterável se tiver uma implementação para a propriedade [`Symbol.iterator`](Symbols.html#symboliterator).
Alguns tipos internos como `Array`, `Map`, `Set`, `String`, `Int32Array`, `Uint32Array`, etc. tem sua propriedade `Symbol.iterator` já implementadas.
A função `Symbol.iterator` em um objeto é responsável por retornar a lista de valores para iterar.

## Declarações `for..of`

`for..of` faz um loop em um objeto iterável, invocando a propriedade `Symbol.iterator` no objeto.
Aqui está um loop `for..of` em uma matriz:

```ts
let someArray = [1, "string", false];

for (let entry of someArray) {
  console.log(entry); // 1, "string", false
}
```

### Declarações `for..of` vs. `for..in`

Ambas declarações `for..of` e `for..in` iteram em listas; os valores iterados são diferentes, porém, `for..in` retorna uma lista de _chaves_ no objeto que está sendo iterado, enquanto `for..of` retorna uma lista de _valores_ das propriedades numéricas do objeto que está sendo iterado.

Aqui está um exemplo que demonstra essa distinção:

```ts
let list = [4, 5, 6];

for (let i in list) {
  console.log(i); // "0", "1", "2",
}

for (let i of list) {
  console.log(i); // 4, 5, 6
}
```

Outra distinção é que `for..in` opera em qualquer objeto; ele serve como uma forma de inspecionar propriedades neste objeto.
`for..of` por outro lado, está principalmente interessado em valores de objetos iteráveis. Objetos integrados como propriedade `Map` e `Set` implementam a propriedade `Symbol.iterator` permitindo acesso a valores armazenados.

```ts
let pets = new Set(["Cat", "Dog", "Hamster"]);
pets["species"] = "mammals";

for (let pet in pets) {
  console.log(pet); // "species"
}

for (let pet of pets) {
  console.log(pet); // "Cat", "Dog", "Hamster"
}
```

### Geração de código

#### Visando ES5 E ES3

Ao direcionar um mecanismo compatível com ES5 ou ES3, os iteradores são permitidos apenas em valores do tipo `Array`.
É um erro usar loops `for..of` em valores que não sejam Array, mesmo se esses valores não-Array implementarem a propriedade `Symbol.iterator`.

O compilador irá gerar um loop `for` simples para um loop `for..of`, por exemplo:

```ts
let numbers = [1, 2, 3];
for (let num of numbers) {
  console.log(num);
}
```

será gerado como:

```js
var numbers = [1, 2, 3];
for (var _i = 0; _i < numbers.length; _i++) {
  var num = numbers[_i];
  console.log(num);
}
```

#### Visando ECMAScript 2015 e superior

Ao direcionar um mecanismo compatível com ECMAScipt 2015, o compilador irá gerar loops `for..of` para direcionar a implementação do iterador integrado no mecanismo.
