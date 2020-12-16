---
title: Referência JSDoc
layout: docs
permalink: /pt/docs/handbook/jsdoc-supported-types.html
oneline: Quais JSDoc Javascript baseado em Typescript suporta?
translatable: true
---

A lista abaixo mostra quais construtores são atualmente suportados
quando se usa anotações JSDoc para prover informações de tipo em arquivos Javascript.

Note que tags que não estão explicitamente listadas abaixo (tais como `@async`) ainda não são suportadas.

- `@type`
- `@param` (ou `@arg` ou `@argument`)
- `@returns` (ou `@return`)
- `@typedef`
- `@callback`
- `@template`
- `@class` (ou `@constructor`)
- `@this`
- `@extends` (ou `@augments`)
- `@enum`

#### Extensões `class`

- [Modificadores de Propriedades](#jsdoc-property-modifiers) `@public`, `@private`, `@protected`, `@readonly`

O significado é usualmente o mesmo, ou um superconjunto, do significado da tag descrito em [jsdoc.app](https://jsdoc.app).
O código abaixo descreve as diferenças e demonstra em exemplos a usagem de cada tag.

**Nota:** Você pode usar [o playground para explorar o suporte a JSDoc](/play?useJavaScript=truee=4#example/jsdoc-support).

## `@type`

Você pode usar a tag "@type" para referenciar o nome de um tipo (seja ele primitivo, definido em uma declaração Typescript ou em uma tag JSDoc "@typedef")
Você pode usar a maioria dos tipos JSDoc e qualquer tipo do Typescript, desde [o mais básico como `string`](/docs/handbook/basic-types.html) até [o mais avançado, como tipos condicionais](/docs/handbook/advanced-types.html).

```js twoslash
/**
 * @type {string}
 */
var s;

/** @type {Window} */
var win;

/** @type {PromiseLike<string>} */
var promisedString;

// Você pode especificar um Elemento HTML com propriedades da DOM
/** @type {HTMLElement} */
var myElement = document.querySelector(selector);
element.dataset.myData = "";
```

`@type` pode especificar uma união &mdash; por exemplo, algo pode ser uma string ou um booleano.

```js twoslash
/**
 * @type {(string | boolean)}
 */
var sb;
```

Note que parênteses são opcionais para uniões

```js twoslash
/**
 * @type {string | boolean}
 */
var sb;
```

Você pode especificar tipos de vetores usando uma variedade de sintaxes:

```js twoslash
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var nds;
/** @type {Array<number>} */
var nas;
```

Você também pode especificar tipos de objetos literais.
Por exemplo, um objeto com propriedades 'a' (string) e 'b' (número) usa a seguinte sintaxe:

```js twoslash
/** @type {{ a: string, b: number }} */
var var9;
```

Você pode especificar objetos semelhantes a maps e semelhantes a vetores usando string e assinaturas de índice numérico, usando sintaxe JSDoc padrão ou sintaxe Typescript.

```js twoslash
/**
 * Um objeto semelhante a um map que mapeia propriedades `string` arbitrárias para `number`s.
 *
 * @type {Object.<string, number>}
 */
var stringToNumber;

/** @type {Object.<number, object>} */
var arrayLike;
```

Os dois tipos precedentes são equivalentes aos tipos `{ [x: string]: number }` e `{ [x: number]: any }` do Typescript.
O compilador entende ambas as sintaxes.

Você pode especificar tipos de funções usando sintaxe Typescript ou sintaxe Closure
You can specify function types using either TypeScript or Closure syntax:

```js twoslash
/** @type {function(string, boolean): number} sintaxe Closure */
var sbn;
/** @type {(s: string, b: boolean) => number} sintaxe TypeScript */
var sbn2;
```

Ou você pode usar o tipo não especificado `Function`:

```js twoslash
/** @type {Function} */
var fn7;
/** @type {function} */
var fn6;
```

Outros tipos de Closure também são aceitos:

```js twoslash
/**
 * @type {*} - pode ser o tipo 'any'
 */
var star;
/**
 * @type {?} - tipo desconhecido (o mesmo que 'any')
 */
var question;
```

### Conversões

Typescript pega emprestada a sintaxe de conversão de Closure.
Isso possibilita que você converta um tipo para outro adicionando a tag `@type` antes de qualquer expressão com parênteses.

```js twoslash
/**
 * @type {number | string}
 */
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString);
```

### Importando tipos

Você também pode importar declarações de tipos a partir de outros arquivos usando importação de tipos
Essa sintaxe é especifica do Typescript e difere do uso de JSDoc padrão:

```js twoslash
// @filename: types.d.ts
export type Pet = {
  name: string,
};

// @filename: main.js
/**
 * @param p { import("./types").Pet }
 */
function walk(p) {
  console.log(`Walking ${p.name}...`);
}
```

importação de tipos também pode ser usada em declaração de apelidos de tipos:

```js twoslash
// @filename: types.d.ts
export type Pet = {
  name: string,
};
// @filename: main.js
// ---cut---
/**
 * @typedef { import("./types").Pet } Pet
 */

/**
 * @type {Pet}
 */
var myPet;
myPet.name;
```

importação de tipos pode ser usada para descobrir o tipo de um valor de um módulo se você ainda não sabe o tipo dele, ou se for um tipo longo que é irritante de se digitar:

```js twoslash
// @filename: accounts.d.ts
export const userAccount = {
  name: "Name",
  address: "An address",
  postalCode: "",
  country: "",
  planet: "",
  system: "",
  galaxy: "",
  universe: "",
};
// @filename: main.js
// ---cut---
/**
 * @type {typeof import("./accounts").userAccount }
 */
var x = require("./accounts").userAccount;
```

## `@param` e `@returns`

`@param` usa a mesma sintaxe que a tag `@type`, porém é adicionado o nome do parâmetro.
O parâmetro também pode ser declarado como opcional se for envolvido em colchetes:

```js twoslash
// Parâmetros podem ser declarados numa variedade de formas sintáticas
/**
 * @param {string}  p1 - Um parâmetro do tipo string.
 * @param {string=} p2 - Um parâmetro opcional (sintaxe Closure)
 * @param {string} [p3] - Outro parâmetro opcional (sintaxe JSDoc).
 * @param {string} [p4="test"] - Um parâmetro opcional com um valor padrão
 * @return {string} Este é o resultado
 */
function stringsStringStrings(p1, p2, p3, p4) {
  // TODO
}
```

Da mesma forma para o retorno de uma função:

```js twoslash
/**
 * @return {PromiseLike<string>}
 */
function ps() {}

/**
 * @returns {{ a: string, b: number }} - Pode ser usado '@returns' ou '@return'
 */
function ab() {}
```

## `@typedef`, `@callback`, e `@param`

`@typedef` pode ser usado para definir tipos complexos.
Uma sintaxe similar funciona para `@param`

```js twoslash
/**
 * @typedef {Object} SpecialType - cria um novo tipo chamado 'SpecialType'
 * @property {string} prop1 - uma propriedade string de SpecialType
 * @property {number} prop2 - uma propriedade numérica de SpecialType
 * @property {number=} prop3 - uma propriedade numérica opcional de SpecialType (sintaxe Closure)
 * @prop {number} [prop4] - uma propriedade numérica opcional de SpecialType (sintaxe JSDoc)
 * @prop {number} [prop5=42] - uma propriedade numérica opcional e com valor padrão de SpecialType
 */

/** @type {SpecialType} */
var specialTypeObject;
specialTypeObject.prop3;
```

Na primeira linha, pode se usar tanto `object` como `Object`.

```js twoslash
/**
 * @typedef {object} SpecialType1 - cria um novo tipo chamado 'SpecialType'
 * @property {string} prop1 - uma propriedade string de SpecialType
 * @property {number} prop2 - uma propriedade numérica de SpecialType
 * @property {number=} prop3 - uma propriedade numérica opcional de SpecialType (sintaxe Closure)
 */

/** @type {SpecialType1} */
var specialTypeObject1;
```

`@param` permite uma sintaxe similar para especificações de tipo únicas.
Note que os nomes das propriedades aninhadas têm que serem prefixadas com o nome do parâmetro:

```js twoslash
/**
 * @param {Object} options - O mesmo objecto SpecialType acima
 * @param {string} options.prop1
 * @param {number} options.prop2
 * @param {number=} options.prop3
 * @param {number} [options.prop4]
 * @param {number} [options.prop5=42]
 */
function special(options) {
  return (options.prop4 || 1001) + options.prop5;
}
```

`@callback` é similar a `@typedef`, mas especifica um tipo de uma função ao invés de um tipo de objeto:

```js twoslash
/**
 * @callback Predicate
 * @param {string} data
 * @param {number} [index]
 * @returns {boolean}
 */

/** @type {Predicate} */
const ok = (s) => !(s.length % 2);
```

E é claro, qualquer um desses tipos podem ser declarados usando a sintaxe Typescript em apenas uma linha de `@typedef`:

```js
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
```

## `@template`

Você pode declarar funções genéricas com a tag `@template`:

```js twoslash
/**
 * @template T
 * @param {T} x - Um parâmetro genérico que flui até o tipo de retorno
 * @return {T}
 */
function id(x) {
  return x;
}

const a = id("string");
const b = id(123);
const c = id({});
```

Use vírgula ou múltiplas tags para declarar múltiplos parâmetros de tipo:

```js
/**
 * @template T,U,V
 * @template W,X
 */
```

Você também pode especificar uma restrição de tipo antes do nome do parâmetro.
Apenas o primeiro parâmetro em uma lista sofre a restrição.

```js twoslash
/**
 * @template {string} K - K tem de ser do tipo string
 * @template {{ serious(): string }} Seriousalizable - tem de ter um método serious()
 * @param {K} key
 * @param {Seriousalizable} object
 */
function seriousalize(key, object) {
  // ????
}
```

Declarar classes ou tipos genéricos não é suportado.

## Classes

Classes podem ser declaradas como Classes ES6.

```js twoslash
class C {
  /**
   * @param {number} data
   */
  constructor(data) {
    // Tipos de propriedades podem ser inferidos
    this.name = "foo";

    // ou definidos explicitamente
    /** @type {string | null} */
    this.title = null;

    // ou simplesmente anotados, se a variável for preenchida mais tarde
    /** @type {number} */
    this.size;

    this.initialize(data); // Erro, initialize espera uma string como parâmetro
  }
  /**
   * @param {string} s
   */
  initialize = function (s) {
    this.size = s.length;
  };
}

var c = new C(0);

// C should only be called with new, but
// because it is JavaScript, this is allowed and
// considered an 'any'.
var result = C(1);
```

Ou elas podem também ser declaradas como funções construtoras, como descrito nan próxima seção:

## `@constructor`

O compilador infere funções construtoras baseado nas atribuições da propriedade this, mas você pode fazer com que a checagem seja mais estrita e sugestões sejam melhores se você adicionar a tag `@constructor`:

```js twoslash
// @checkJs
// @errors: 2345 2348
/**
 * @constructor
 * @param {number} data
 */
function C(data) {
  // Tipos de propriedades podem ser inferidos
  this.name = "foo";

  // ou definidos explicitamente
  /** @type {string | null} */
  this.title = null;

  // ou simplesmente anotados, se a variável for preenchida mais tarde
  /** @type {number} */
  this.size;

  this.initialize(data);
}
/**
 * @param {string} s
 */
C.prototype.initialize = function (s) {
  this.size = s.length;
};

var c = new C(0);
c.size;

var result = C(1);
```

> Nota: Mensagens de erro só serão exibidas em bases de código JS com [um JSConfig](/docs/handbook/tsconfig-json.html) e [`checkJs`](/tsconfig#checkJs) habilitado.

Com `@constructor`, o `this` é checado dentro da função construtora `C`, então você terá sugestões para o método `initialize` e verá um erro se passar um número para ele. Seu editor pode exibir um warning se você apenas chamar `C` ao invés de usá-lá como construtor.

Infelizmente, isso significa que funções construtoras que também podem ser chamadas não podem usar `@constructor`.

## `@this`

O compilador usualmente consegue inferir o tipo do `this` quando tem algum contexto para isso. Quando ele não puder, você pode especificar explicitamente o tipo do `this` com `@this`:

```js twoslash
/**
 * @this {HTMLElement}
 * @param {*} e
 */
function callbackForLater(e) {
  this.clientHeight = parseInt(e); // Deve estar ok!
}
```

## `@extends`

Quando classes Javascript extendem uma classe base genérica, não há lugar para especificar o que o parâmetro de tipo deveria ser. A tag `@extends` provém um lugar para aquele parâmetro de tipo:

```js twoslash
/**
 * @template T
 * @extends {Set<T>}
 */
class SortableSet extends Set {
  // ...
}
```

Note que `@extends` funciona apenas com classes. Atualmente, não há forma para uma função construtora extender uma classe.

## `@enum`

A tag `@enum` permite que você crie um objeto literal cujos membros são todos de um tipo especificado. Diferentemente de outros objetos literais em Javascript, ela não permite outros membros.

```js twoslash
/** @enum {number} */
const JSDocState = {
  BeginningOfLine: 0,
  SawAsterisk: 1,
  SavingComments: 2,
};

JSDocState.SawAsterisk;
```

Note que a tag `@enum` é bem diferente e mais simples que a `enum` do TypeScript. Porém, diferentemente das enums do Typescript, `@enum` pode ter qualquer tipo:

```js twoslash
/** @enum {function(number): number} */
const MathFuncs = {
  add1: (n) => n + 1,
  id: (n) => -n,
  sub1: (n) => n - 1,
};

MathFuncs.add1;
```

## Mais exemplos

```js twoslash
class Foo {}
// ---cut---
var someObj = {
  /**
   * @param {string} param1 - Documentos em atribuições de propriedades funcionam
   */
  x: function (param1) {},
};

/**
 * Assim como documentos em atribuições de variáveis
 * @return {Window}
 */
let someFunc = function () {};

/**
 * E métodos de classes
 * @param {string} greeting O cumprimento a ser usado
 */
Foo.prototype.sayHi = (greeting) => console.log("Hi!");

/**
 * E expressões de arrow functions
 * @param {number} x - Um multiplicador
 */
let myArrow = (x) => x * x;

/**
 * O que significa que também funciona para componentes funcionais stateless em JSX também
 * @param {{a: string, b: number}} test - Algum parâmetro
 */
var sfc = (test) => <div>{test.a.charAt(0)}</div>;

/**
 * Um parâmetro pode ser um construtor de classe, usando sintaxe Closure.
 *
 * @param {{new(...args: any[]): object}} C - A classe para ser registrada
 */
function registerClass(C) {}

/**
 * @param {...string} p1 - Um argumento 'rest' (vetor) de strings. (tratado como 'any')
 */
function fn10(p1) {}

/**
 * @param {...string} p1 - Um argumento 'rest' (vetor) de strings. (tratado como 'any')
 */
function fn9(p1) {
  return p1.join();
}
```

## Padrões que são conhecidos por NÃO serem suportados

Referir-se a objetos no espaço de valor como tipo não funciona a não ser que o objeto também crie um tipo, como uma função construtora.

```js twoslash
function aNormalFunction() {}
/**
 * @type {aNormalFunction}
 */
var wrong;
/**
 * Use 'typeof' ao invés da sintaxe anterior:
 * @type {typeof aNormalFunction}
 */
var right;
```

Sinais de igual posteriores a um tipo de propriedade de um objeto literal não especifica uma propriedade opcional:

```js twoslash
/**
 * @type {{ a: string, b: number= }}
 */
var wrong;
/**
 * Use o ponto de interrogação como abaixo para especificar uma propriedade opcional
 * @type {{ a: string, b?: number }}
 */
var right;
```

Tipos anuláveis só tem significado se a opção `strictNullChecks` estiver habilitada:

```js twoslash
/**
 * @type {?number}
 * Com strictNullChecks: true  -- number | null
 * Com strictNullChecks: false -- number
 */
var nullable;
```

Você também pode usar uma união:

```js twoslash
/**
 * @type {number | null}
 * Com strictNullChecks: true  -- number | null
 * Com strictNullChecks: false -- number
 */
var unionNullable;
```

Tipos não-anuláveis não tem significado e são tratados apenas como seu tipo original:

```js twoslash
/**
 * @type {!number}
 * Tem apenas tipo number
 */
var normal;
```

Diferentemente de qualquer sistema de tipo JSDoc, Typescript permite apenas você marcar tipos contendo null ou não.
Não há não nulidade -- se strictNullChecks está habilitada, então `number` não é anulável.
Se está desabilitada, então `number` é anulável.

### Tags não suportadas

Typescript ignora qualquer tag JSDoc não suportada.

As tags seguintes têm issues abertas para serem suportadas:

- `@const` ([issue #19672](https://github.com/Microsoft/TypeScript/issues/19672))
- `@inheritdoc` ([issue #23215](https://github.com/Microsoft/TypeScript/issues/23215))
- `@memberof` ([issue #7237](https://github.com/Microsoft/TypeScript/issues/7237))
- `@yields` ([issue #23857](https://github.com/Microsoft/TypeScript/issues/23857))
- `{@link …}` ([issue #35524](https://github.com/Microsoft/TypeScript/issues/35524))

## Extensões de Classes JS

### Modificadores de propriedades JSDoc

From TypeScript 3.8 onwards, you can use JSDoc to modify the properties in a class. First are the accessibility modifiers: `@public`, `@private`, and `@protected`.
Do Typescript 3.8 para frente, você pode usar JSDoc para modificar as propriedades em uma classe. Primeiramente, apresentamos os modificadores: `@public`, `@private`, and `@protected`.
Essas tags funcionam exatamente como `public`, `private`, e `protected` em Typescript, respectivamente.

```js twoslash
// @errors: 2341
// @ts-check

class Car {
  constructor() {
    /** @private */
    this.identifier = 100;
  }

  printIdentifier() {
    console.log(this.identifier);
  }
}

const c = new Car();
console.log(c.identifier);
```

- `@public` é sempre inferida e pode não ser especificada, mas significa que uma propriedade pode ser alcançada de qualquer lugar.
- `@private` siginifica que a propriedade só pode ser usada dentro da classe que a contém.
- `@protected` means that a property can only be used within the containing class, and all derived subclasses, but not on dissimilar instances of the containing class.
- `@protected` siginifica que a propriedade só pode ser usada dentro da classe que a contém, e todas as subclasses derivadas, mas não em classes dissimilares da classe que a contém.

Depois, também adicionamos o modificador `@readonly` para garantir que a propriedade só recebe uma atribuição durante a sua inicialização.

```js twoslash
// @errors: 2540
// @ts-check

class Car {
  constructor() {
    /** @readonly */
    this.identifier = 100;
  }

  printIdentifier() {
    console.log(this.identifier);
  }
}

const c = new Car();
console.log(c.identifier);
```
