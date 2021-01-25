---
title: Checando tipos de arquivos JavaScript
layout: docs
permalink: /pt/docs/handbook/type-checking-javascript-files.html
oneline: Como adicionar checagem de tipos a arquivos JavaScript usando Typescript
---

Aqui estão algumas diferenças notáveis em como a checagem de tipo funciona em arquivos `.js` comparados com arquivos `.ts`.

## Propriedades são inferidas de atribuições no corpo das classes

ES2015 não tem meios de declaração de propriedades em uma classe. Propriedades são atribuídas dinamicamente, assim como objetos literais.

Em um arquivo `.js`, o compilador infere propriedades a partir da atribuição das mesmas dentro de um corpo de uma classe.
O tipo de uma propriedade é o tipo dado no construtor, a não ser que não seja definido lá ou o tipo no construtor for undefined ou null.
Neste caso, o tipo é uma união dos tipos de todos os valores que estão do lado direito dessas atribuições.
Propriedades definidas no construtor são sempre assumidas existentes, enquanto as que foram definidas apenas em métodos, getters ou setters são consideradas opcionais.

```js twoslash
// @checkJs
// @errors: 2322
class C {
  constructor() {
    this.constructorOnly = 0;
    this.constructorUnknown = undefined;
  }
  method() {
    this.constructorOnly = false;
    this.constructorUnknown = "plunkbat"; // ok, construtorUnknown é uma string | undefined
    this.methodOnly = "ok"; // ok, mas methodOnly também pode ser undefined
  }
  method2() {
    this.methodOnly = true; // também ok, methodOnly's type é string | boolean | undefined
  }
}
```

Se propriedades nunca forem declaradas no corpo da classe, elas são consideradas desconhecidas (com o tipo unknown).
Se sua classe tem propriedades que são apenas lidas, adicione e então anote uma declaraçao no construtor com JSDoc para especificação de tipo.
Você não precisa nem atribuir um valor a ela se for inicializada posteriormente.

```js twoslash
// @checkJs
// @errors: 2322
class C {
  constructor() {
    /** @type {number | undefined} */
    this.prop = undefined;
    /** @type {number | undefined} */
    this.count;
  }
}

let c = new C();
c.prop = 0; // OK
c.count = "string";
```

## Funções construtoras são equivalentes a classes

Antes do ES2015, Javascript usava funções construtoras ao invés de classes.
O compilador suporta esse padrão e entende que funções construtoras são equivalentes a Classes do ES2015.
As regras de inferência de propriedades funcionam exatamente da mesma forma.

```js twoslash
// @checkJs
// @errors: 2683 2322
function C() {
  this.constructorOnly = 0;
  this.constructorUnknown = undefined;
}
C.prototype.method = function () {
  this.constructorOnly = false;
  this.constructorUnknown = "plunkbat"; // OK, o tipo é string | undefined
};
```

## CommonJS modules são suportados

Em um arquivo `.js`, TypeScript entende o formato de módulo CommonJS.
Atribuiçoes a `exports` e `modules.exports` são reconhecidas como declarações de exportação.
Similarmente, chamadas de função `require` são reconhecidas como importações de módulos. Por exemplo:

```js
// o mesmo que `import module "fs"`
const fs = require("fs");

// o mesmo que `export funcion readFile`
module.exports.readFile = function (f) {
  return fs.readFileSync(f);
};
```

O suporte de módulo em Javascript é muito mais flexível sinteticamente que o suporte de módulo de TypeScript.
Muitas das combinações de atribuições e declarações são suportadas.

## Classes, funções, e object literals são namespaces

Classes sao namespaces em arquivos `.js`.
Isso pode ser usado para aninhar classes, por exemplo:

```js twoslash
class C {}
C.D = class {};
```

E para código pre-ES2015, pode ser usado para simular métodos estáticos:

```js twoslash
function Outer() {
  this.y = 2;
}

Outer.Inner = function () {
  this.yy = 2;
};

Outer.innter();
```

Também pode ser usado para criar namespaces simples:

```js twoslash
var ns = {};
ns.C = class {};
ns.func = function () {};

ns;
```

Outras variantes são permitidas também:

```js twoslash
// IIFE
var ns = (function (n) {
  return n || {};
})();
ns.CONST = 1;

// defaulting to global
var assign =
  assign ||
  function () {
    // code goes here
  };
assign.extra = 1;
```

## Objetos literais são abertos

Em um arquivo `.ts`, um objeto literal que inicializa uma declaração de variável dá o seu tipo para a declaração.
Nenhum membro novo que não foi especificado na declaração pode ser adicionado.
Essas regras são relaxadas em um arquivo `.js`; objetos literais tem um tipo aberto (uma assinatura de índice) que permite adicionar e procurar propriedades que não foram adicionadas originalmente.
Por exemplo:

```js twoslash
var obj = { a: 1 };
obj.b = 2; // Permitido
```

Objetos literais se comportam como se tivessem uma assinatura de índice `[x:string]: any` que permite que sejam tratados como maps abertos ao invés de objetos fechados.

Assim como outros comportamentos especiais do JS, esse comportamento pode ser mudado adicionando um tipo JSDoc para a variável. Por exemplo:

```js twoslash
// @checkJs
// @errors: 2339
/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2;
```

## Inicializadores null, undefined e arrays vazios são do tipo any ou any[]

Qualquer variável, parâmetro ou propriedade que é inicializado com null ou undefined terão tipo any, mesmo que a checagem estrita de null esteja habilitada.
Qualquer variável, parâmetro ou propriedade que é inicializada com [] terá tipo any[], mesmo que a checagem estrita de null esteja habiltada.
A única exceção é para propriedades que tem múltiplos inicializadores como descrito acima.

```js twoslash
function Foo(i = null) {
  if (!i) i = 1;
  var j = undefined;
  j = 2;
  this.l = [];
}

var foo = new Foo();
foo.l.push(foo.i);
foo.l.push("end");
```

## Parâmetros de funções são opcionais por padrão

Uma vez que não há uma forma de especificar opcionalidade em parâmetros de funções em Javascript pre-ES2015, todas os parâmetros de funções são considerados opcionais.
Chamadas com menos argumentos que a quantidade declarada na função são permitidas.

É importante notar que é um erro chamar funções com mais argumentos do que declarados.

Por exemplo:

```js twoslash
// @checkJs
// @strict: false
// @errors: 7006 7006 2554
function bar(a, b) {
  console.log(a + " " + b);
}

bar(1); // OK, segundo argumento considerado opcional
bar(1, 2);
bar(1, 2, 3); // Erro, argumentos em excesso
```

Funções anotadas com JSDoc são excluídas dessa regra.
Use a sintaxe de parâmetro opcional JSDoc (`[` `]`) para expressar opcionalidade. e.g.:

```js twoslash
/**
 * @param {string} [somebody] - O nome de alguém.
 */
function sayHello(somebody) {
  if (!somebody) {
    somebody = "John Doe";
  }
  console.log("Hello " + somebody);
}

sayHello();
```

## Declarações de parâmetros var-args são inferidos do uso de `arguments`

Uma função que tem uma referência à referência `arguments` é considerada tendo parâmetros var-arg (i.e. `(...arg: any[]) => any`). Use a sintaxe de var-arg JSDoc para especificar o tipo destes argumentos.

```js twoslash
/** @param {...number} args */
function sum(/* numbers */) {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
```

## Tipos de parâmetros não especificados tem como padrão `any`

Uma vez que não há sintaxe natual para especificar tipos de parâmetros genéricos em Javascript, um tipo de parâmetro não especificado tem como padrão `any`.

### Em uma cláusula extends

Por exemplo, `React.Component` é definido para ter dois parâmetros específicos, `Props` e `State`.
Em um arquivo `.js`, não há forma legal de especificar esses parâmetros na cláusula extends. Por padrão o tipo dos argumentos será `any`:

```js
import { Component } from "react";

class MyComponent extends Component {
  render() {
    this.props.b; // Permitido, já que this.props tem o tipo any
  }
}
```

Use o JSDoc `@arguments` para especificar os tipos explicitamente. Por exemplo:

```js
import { Component } from "react";

/**
 * @augments {Component<{a: number}, State>}
 */
class MyComponent extends Component {
  render() {
    this.props.b; // Erro: b não existe em {a: number}
  }
}
```

### Em referências JSDoc

Um tipo de argumento não especificado em JSDoc tem como padrão any

```js twoslash
/** @type{Array} */
var x = [];

x.push(1); // OK
x.push("string"); // OK, x é do tipo Array<any>

/** @type{Array.<number>} */
var y = [];

y.push(1); // OK
y.push("string"); // Erro, string não é atribuível a number
```

### Em chamadas de função

Uma chamada para uma função genérica usa os argumentos para inferir o tipo dos parâmetros. As vezes este processo falha ao inferir qualquer tipo, principalmente por causa da falta de fontes de inferência; nesses casos, o tipo dos parâmetros será `any`. Por exemplo:

```js
var p = new Promise((resolve, reject) => {
  reject();
});

p; // Promise<any>;
```

Para aprender todas as features disponíveis em JSDoc, veja [a referência](/docs/handbook/jsdoc-supported-types.html)
