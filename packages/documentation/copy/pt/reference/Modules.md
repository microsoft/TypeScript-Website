---
title: Modules
layout: docs
permalink: /pt/docs/handbook/modules.html
oneline: Como módulos funcionam no TypeScript
translatable: true
---

Inciando com ECMAScript 2015, JavaScript possui um conceito de módulos. O TypeScript compartilha deste conceito.

Os Módulos são executados dentro de seu próprio escopo, não no escopo global; isso significa que variáveis, funções, classes, etc. declaradas em um módulo não são visíveis fora do módulo, a menos que sejam explicitamente exportadas utilizando uma das [formas de `export`](#export).
De forma recíproca, para consumir uma variável, função, classe, interface, etc. exportada de um módulo diferente, ela deve ser importada usando uma das [formas de `import`](#import).

Módulos são declarativos; os relacionamentos entre módulos são especificados pelos imports e exports em nível de arquivo.

Módulos importam uns aos outros usando um module loader.
Em tempo de execução, o module loader é responsável por localizar e executar todas as dependências de um módulo antes de executá-lo.
Module loaders conhecidos usados ​​em JavaScript são os loaders de Node.js para [CommonJS](https://wikipedia.org/wiki/CommonJS) módulos e o [RequireJS](http://requirejs.org/) loader para [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) módulos em aplicações web.

Em TypeScript, assim como no ECMAScript 2015, qualquer arquivo contendo um nível superior de `import` ou `export` é considerado um módulo.
Da mesma forma, um arquivo sem qualquer declarações de `import` ou `export` é tratado como um script cujos conteúdos são acessíveis no escopo global (e, portanto, para módulos também).

## Export

## Exportando a declaração

Qualquer declaração (como uma variável, função, classe, alias de tipo ou interface) pode ser exportada adicionando a palavra-chave `export`.

##### StringValidator.ts

```ts
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
```

##### ZipCodeValidator.ts

```ts
import { StringValidator } from "./StringValidator";

export const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
```

## Declarações de Export

As instruções de exportação são úteis quando as exportações precisam ser renomeadas para os consumidores, portanto, o exemplo acima pode ser escrito como:

```ts
class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```

## Re-exports

Freqüentemente, os módulos estendem outros módulos e expõem parcialmente alguns de seus recursos.
Uma reexportação não importa localmente nem introduz uma variável local.

##### ParseIntBasedZipCodeValidator.ts

```ts
export class ParseIntBasedZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && parseInt(s).toString() === s;
  }
}

// Exporta o validador original, mas o renomeia
export { ZipCodeValidator as RegExpBasedZipCodeValidator } from "./ZipCodeValidator";
```

Opcionalmente, um módulo pode envolver um ou mais módulos e combinar todas as suas exportações usando a sintaxe `export * from "module"`.

##### AllValidators.ts

```ts
export * from "./StringValidator"; // exporta a interface 'StringValidator'
export * from "./ZipCodeValidator"; // exporta 'ZipCodeValidator' e a const 'numberRegexp'
export * from "./ParseIntBasedZipCodeValidator"; //  exporta a classe 'ParseIntBasedZipCodeValidator'
// e reexporta 'RegExpBasedZipCodeValidator' como um alias
// da classe 'ZipCodeValidator' do 'ZipCodeValidator.ts'
// módulo.
```

## Import

Importar é tão fácil quanto exportar de um módulo.
A importação de uma declaração exportada é feita usando um dos `import` abaixo:

## Importar um único export de um módulo

```ts
import { ZipCodeValidator } from "./ZipCodeValidator";

let myValidator = new ZipCodeValidator();
```

Imports também podem ser renomeados

```ts
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
let myValidator = new ZCV();
```

## Importa o módulo inteiro em uma única variável, e a usa para acessar os exports do módulo

```ts
import * as validator from "./ZipCodeValidator";
let myValidator = new validator.ZipCodeValidator();
```

## Importa um módulo apenas para efeitos colaterais

Embora não seja uma prática recomendada, alguns módulos configuram estados globais que podem ser usados por outros módulos.
Esses módulos podem não ter exportações, ou o consumidor não está interessado em nenhuma de suas exportações.
Para importar esses módulos, use:

```ts
import "./my-module.js";
```

## Tipos de import

Antes do TypeScript 3.8, você pode importar um tipo usando `import`.
Com o TypeScript 3.8, você pode importar um tipo usando o using a declaração `import`, ou usando `import type`.

```ts
// Reutilizando o mesmo import
import { APIResponseType } from "./api";

// Usando explicitamente o import type
import type { APIResponseType } from "./api";
```

`import type` sempre tem a garantia de ser removido de seu JavaScript, e ferramentas como Babel podem realizar melhores suposições sobre seu código a partir das flags `isolatedModules`.
Você pode ler mais em [3.8 release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports).

## Exports padrões

Cada módulo pode exportar opcionalmente um `default` export.
Exports padrões são marcados com a palavra-chave `default`; e pode existir apenas uma exportação `default` por módulo.
Exportações `default` são importadas usando um diferente modelo de import.

Exportações `default` são realmente úteis.
Por exemplo, uma biblioteca como jQuery pode ter uma exportação padrão do `jQuery` ou `$`, que provavelmente também importaríamos com o nome `$` ou `jQuery`.

##### [JQuery.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/jquery/JQuery.d.ts)

```ts
declare let $: JQuery;
export default $;
```

##### App.ts

```ts
import $ from "jquery";

$("button.continue").html("Próximo passo...");
```

Classes e declarações de funções podem ser criadas diretamente como exportações padrão.
Os nomes de declaração de função e classe de exportação padrão são opcionais.

##### ZipCodeValidator.ts

```ts
export default class ZipCodeValidator {
  static numberRegexp = /^[0-9]+$/;
  isAcceptable(s: string) {
    return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
  }
}
```

##### Test.ts

```ts
import validator from "./ZipCodeValidator";

let myValidator = new validator();
```

ou

##### StaticZipCodeValidator.ts

```ts
const numberRegexp = /^[0-9]+$/;

export default function (s: string) {
  return s.length === 5 && numberRegexp.test(s);
}
```

##### Test.ts

```ts
import validate from "./StaticZipCodeValidator";

let strings = ["Olá", "98052", "101"];

// Use a função validar
strings.forEach((s) => {
  console.log(`"${s}" ${validate(s) ? "combina" : "não combina"}`);
});
```

Exportações `default` também podem ser somente valores:

##### OneTwoThree.ts

```ts
export default "123";
```

##### Log.ts

```ts
import num from "./OneTwoThree";

console.log(num); // "123"
```

## Exporta tudo como x

Com TypeScript 3.8, você pode usar `export * as ns` como uma abreviação para reexportar outro módulo com um nome:

```ts
export * as utilities from "./utilities";
```

Isso pega todas as dependências de um módulo e o torna um campo exportado. Você pode importá-lo assim:

```ts
import { utilities } from "./index";
```

## `export =` e `import = require()`


Ambos CommonJS e AMD geralmente têm o conceito de um objeto `exports` que contém todas as exportações de um módulo.

Eles também suportam substituir o objeto `exports`com um único objeto customizado.
As exportações padrão devem agir como um substituto para esse comportamento; no entanto, os dois são incompatíveis.
TypeScript suporta `export =` para modelar o tradicional fluxo de trabalho entre CommonJS e AMD.

A sintaxe `export =` especifica um único objeto que é exportado do módulo.
Isso pode ser uma classe, interface, namespace, função ou enum.

Quando estiver exportando um módulo usando `export =`, específico do TypeScript `import module = require("module")` precisa ser usado para importar o módulo.

##### ZipCodeValidator.ts

```ts
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export = ZipCodeValidator;
```

##### Test.ts

```ts
import zip = require("./ZipCodeValidator");

// Alguns exemplos para testar
let strings = ["Olá", "98052", "101"];

// Validators para usar
let validator = new zip();

// Mostra cada string que passou em cada validador
strings.forEach((s) => {
  console.log(
    `"${s}" - ${validator.isAcceptable(s) ? "combina" : "não combina"}`
  );
});
```

## Geração de código para Módulos

Dependendo do destino do módulo especificado durante a compilação, o compilador irá gerar o código apropriado para Node.js ([CommonJS](http://wiki.commonjs.org/wiki/CommonJS)), require.js ([AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)), [UMD](https://github.com/umdjs/umd), [SystemJS](https://github.com/systemjs/systemjs), ou [ECMAScript 2015 native modules](http://www.ecma-international.org/ecma-262/6.0/#sec-modules) (ES6) sistemas de carregamento de módulos.
Para mais informações de que o `define`, `require` e `register` chama no código gerado, consulte a documentação de cada carregador de módulo.

Esse exemplo simples mostra como os nomes usados ​​durante a importação e exportação são traduzidos no código de carregamento do módulo.

##### SimpleModule.ts

```ts
import m = require("mod");
export let t = m.something + 1;
```

##### AMD / RequireJS SimpleModule.js

```js
define(["require", "exports", "./mod"], function (require, exports, mod_1) {
  exports.t = mod_1.something + 1;
});
```

##### CommonJS / Node SimpleModule.js

```js
var mod_1 = require("./mod");
exports.t = mod_1.something + 1;
```

##### UMD SimpleModule.js

```js
(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./mod"], factory);
  }
})(function (require, exports) {
  var mod_1 = require("./mod");
  exports.t = mod_1.something + 1;
});
```

##### Sistema SimpleModule.js

```js
System.register(["./mod"], function (exports_1) {
  var mod_1;
  var t;
  return {
    setters: [
      function (mod_1_1) {
        mod_1 = mod_1_1;
      },
    ],
    execute: function () {
      exports_1("t", (t = mod_1.something + 1));
    },
  };
});
```

##### Módulos nativos ECMAScript 2015 SimpleModule.js

```js
import { something } from "./mod";
export var t = something + 1;
```

## Exemplo simples

Abaixo, consolidamos as implementações do Validator usadas nos exemplos anteriores para exportar apenas um único export nomeado de cada módulo.

Para compilar, devemos especificar o destino do módulo na linha de comando. Para Node.js, use `--module commonjs`;
para require.js, use `--module amd`. Por exemplo:

```Shell
tsc --module commonjs Test.ts
```

Quando compilados, cada módulo se tornará um arquivo `.js` separado.
Assim como acontece com as tags de referência, o compilador seguirá as instruções `import` para compilar os arquivos dependentes.

##### Validation.ts

```ts
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
```

##### LettersOnlyValidator.ts

```ts
import { StringValidator } from "./Validation";

const lettersRegexp = /^[A-Za-z]+$/;

export class LettersOnlyValidator implements StringValidator {
  isAcceptable(s: string) {
    return lettersRegexp.test(s);
  }
}
```

##### ZipCodeValidator.ts

```ts
import { StringValidator } from "./Validation";

const numberRegexp = /^[0-9]+$/;

export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
```

##### Test.ts

```ts
import { StringValidator } from "./Validation";
import { ZipCodeValidator } from "./ZipCodeValidator";
import { LettersOnlyValidator } from "./LettersOnlyValidator";

// Alguns exemplos para testar
let strings = ["Olá", "98052", "101"];

// Validators para usar
let validators: { [s: string]: StringValidator } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// Mostra cada string que passou em cada validador
strings.forEach((s) => {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "combina" : "não combina"
      } ${name}`
    );
  }
});
```

## Carregamento de Módulo Opcional e Outros Cenários de Carregamento Avançado

Em alguns casos, você pode querer carregar apenas um módulo sob algumas condições.
No TypeScript, podemos usar o padrão mostrado abaixo para implementar este e outros cenários de carregamento avançado para chamar diretamente os carregadores de módulo sem perder a segurança de tipo.

O compilador detecta se cada módulo é usado no JavaScript emitido.
Se um identificador de módulo é usado apenas como parte de uma anotação de tipo e nunca como uma expressão, nenhuma chamada `require` é emitida para esse módulo.
Essa exclusão de referências não utilizadas é uma boa otimização de desempenho e também permite o carregamento opcional desses módulos.

A ideia central do padrão é que a instrução `import id = require ("...")` nos dá acesso aos tipos expostos pelo módulo.
O carregador de módulo é chamado (por meio do `require`) de forma dinâmica, conforme mostrado nos blocos `if` abaixo.
Isso aproveita a otimização de elisão de referência para que o módulo seja carregado apenas quando necessário.
Para que esse padrão funcione, é importante que o símbolo definido por meio de uma `import` seja usado apenas em posições de tipo (ou seja, nunca em uma posição que seria emitida para o JavaScript).

Para manter a segurança de tipo, podemos usar a palavra-chave `typeof`.
A palavra-chave `typeof`, quando usado em uma posição de tipo, produz o tipo de um valor, neste caso o tipo do módulo.

##### Carregamento de módulo dinâmico em Node.js

```ts
declare function require(moduleName: string): any;

import { ZipCodeValidator as Zip } from "./ZipCodeValidator";

if (needZipValidation) {
  let ZipCodeValidator: typeof Zip = require("./ZipCodeValidator");
  let validator = new ZipCodeValidator();
  if (validator.isAcceptable("...")) {
    /* ... */
  }
}
```

##### Exemplo: Carregamento de Módulo Dinâmico em require.js

```ts
declare function require(
  moduleNames: string[],
  onLoad: (...args: any[]) => void
): void;

import * as Zip from "./ZipCodeValidator";

if (needZipValidation) {
  require(["./ZipCodeValidator"], (ZipCodeValidator: typeof Zip) => {
    let validator = new ZipCodeValidator.ZipCodeValidator();
    if (validator.isAcceptable("...")) {
      /* ... */
    }
  });
}
```

##### Exemplo: Carregamento de módulo dinâmico em System.js

```ts
declare const System: any;

import { ZipCodeValidator as Zip } from "./ZipCodeValidator";

if (needZipValidation) {
  System.import("./ZipCodeValidator").then((ZipCodeValidator: typeof Zip) => {
    var x = new ZipCodeValidator();
    if (x.isAcceptable("...")) {
      /* ... */
    }
  });
}
```

## Trabalhando com outras bibliotecas em JavaScript

Para descrever a forma das bibliotecas não escritas em TypeScript, precisamos declarar a API que a biblioteca expõe.

Chamamos as declarações que não definem uma implementação de "ambiente".
Normalmente, eles são definidos em arquivos `.d.ts`.
Se você está familiarizado com C/C ++, pode pensar neles como arquivos `.h`.
Vejamos alguns exemplos.

## Módulos de ambiente

No Node.js, a maioria das tarefas é realizada carregando um ou mais módulos.
Poderíamos definir cada módulo em seu próprio arquivo `.d.ts` com declarações de exportação de nível superior, mas é mais conveniente gravá-los como um arquivo `.d.ts` maior.
Para fazer isso, usamos uma construção semelhante aos namespaces do ambiente, mas usamos a palavra-chave `module` e o nome entre aspas do módulo que estará disponível para uma importação posterior.
Por exemplo:

##### node.d.ts (trecho simplificado)

```ts
declare module "url" {
  export interface Url {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }

  export function parse(
    urlStr: string,
    parseQueryString?,
    slashesDenoteHost?
  ): Url;
}

declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```

Agora nós podemos chamar `/// <reference>` `node.d.ts` e então carregar os módulso usando `import url = require("url");` ou `import * as URL from "url"`.

```ts
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");
```

### Módulos de ambiente abreviados

Se você não quiser perder tempo escrevendo declarações antes de usar um novo módulo, pode usar uma declaração abreviada para começar mais rapidamente.

##### declarations.d.ts

```ts
declare module "hot-new-module";
```

Todas as importações de um módulo abreviado terão o tipo `any`.

```ts
import x, { y } from "hot-new-module";
x(y);
```

### Declarações curinga de módulo

Alguns carregadores de módulo, como [SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/overview.md#plugin-syntax)
e [AMD](https://github.com/amdjs/amdjs-api/blob/master/LoaderPlugins.md) permitem que conteúdo não JavaScript seja importado.
Normalmente, eles usam um prefixo ou sufixo para indicar a semântica de carregamento especial.
As declarações do módulo curinga podem ser usadas para cobrir esses casos.

```ts
declare module "*!text" {
  const content: string;
  export default content;
}
// Alguns fazem isso ao contrário.
declare module "json!*" {
  const value: any;
  export default value;
}
```

Agora você pode importar coisas que correspondem `"*!text"` ou `"json!*"`.

```ts
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
```

### Módulos UMD

Algumas bibliotecas são projetadas para serem usadas em muitos carregadores de módulo ou sem carregamento de módulo (variáveis ​​globais).
Esses são conhecidos como módulos [UMD](https://github.com/umdjs/umd).
Essas bibliotecas podem ser acessadas por meio de uma importação ou de uma variável global.
Por exemplo:

##### math-lib.d.ts

```ts
export function isPrime(x: number): boolean;
export as namespace mathLib;
```

A biblioteca pode então ser usada como uma importação dentro dos módulos:

```ts
import { isPrime } from "math-lib";
isPrime(2);
mathLib.isPrime(2); // ERRO: não pode usar a definição global de dentro de um módulo
```

Também pode ser usado como uma variável global, mas apenas dentro de um script.
(Um script é um arquivo sem importações ou exportações.)

```ts
mathLib.isPrime(2);
```

## Orientação para a estruturação de módulos

## Exporte o mais próximo possível do nível superior

Os consumidores de seu módulo devem ter o mínimo de atrito possível ao usar as coisas que você exporta.
Adicionar muitos níveis de aninhamento tende a ser complicado, portanto, pense com cuidado sobre como você deseja estruturar as coisas.

Exportar um namespace de seu módulo é um exemplo de adição de muitas camadas de aninhamento.
Embora os namespaces às vezes tenham seus usos, eles adicionam um nível extra de indireção ao usar módulos.
Isso pode se tornar rapidamente um ponto problemático para os usuários e geralmente é desnecessário.

Os métodos estáticos em uma classe exportada têm um problema semelhante - a própria classe adiciona uma camada de aninhamento.
A menos que aumente a expressividade ou a intenção de uma forma claramente útil, considere simplesmente exportar uma função auxiliar.

### Se você é o único exportando uma simples `class` ou `function`, use `export default`

Assim como "exportar próximo ao nível superior" reduz a fricção nos consumidores do seu módulo, o mesmo ocorre com a introdução de uma exportação padrão.
Se o objetivo principal de um módulo é hospedar uma exportação específica, então você deve considerar exportá-lo como uma exportação padrão.
Isso torna a importação e o uso real da importação um pouco mais fácil.
Por exemplo:

#### MyClass.ts

```ts
export default class SomeType {
  constructor() { ... }
}
```

#### MyFunc.ts

```ts
export default function getThing() {
  return "thing";
}
```

#### Consumer.ts

```ts
import t from "./MyClass";
import f from "./MyFunc";
let x = new t();
console.log(f());
```

Isso é ideal para os consumidores. Eles podem nomear seu tipo como quiserem (`t` neste caso) e não precisam fazer nenhum pontilhado excessivo para localizar seus objetos.

### Se você estiver exportando vários objetos, coloque-os todos em um nível superior

#### MyThings.ts

```ts
export class SomeType {
  /* ... */
}
export function someFunc() {
  /* ... */
}
```

Por outro lado, ao importar:

### Liste explicitamente os nomes importados

#### Consumer.ts

```ts
import { SomeType, someFunc } from "./MyThings";
let x = new SomeType();
let y = someFunc();
```

### Use o padrão de importação de namespace se você estiver importando um grande número de coisas

#### MyLargeModule.ts

```ts
export class Dog { ... }
export class Cat { ... }
export class Tree { ... }
export class Flower { ... }
```

#### Consumer.ts

```ts
import * as myLargeModule from "./MyLargeModule.ts";
let x = new myLargeModule.Dog();
```

## Reexportar para estender

Frequentemente, você precisará estender a funcionalidade de um módulo.
Um padrão JS comum é aumentar o objeto original com _extensions_, semelhante a como as extensões JQuery funcionam.
Como mencionamos antes, os módulos não se _mergeiam_ como os objetos de namespace global fariam.
A solução recomendada é _não_ alterar o objeto original, mas sim exportar uma nova entidade que fornece a nova funcionalidade.

Considere uma implementação de calculadora simples definida no módulo `Calculator.ts`.
O módulo também exporta uma função auxiliar para testar a funcionalidade da calculadora, passando uma lista de strings de entrada e escrevendo o resultado no final.

#### Calculator.ts

```ts
export class Calculator {
  private current = 0;
  private memory = 0;
  private operator: string;

  protected processDigit(digit: string, currentValue: number) {
    if (digit >= "0" && digit <= "9") {
      return currentValue * 10 + (digit.charCodeAt(0) - "0".charCodeAt(0));
    }
  }

  protected processOperator(operator: string) {
    if (["+", "-", "*", "/"].indexOf(operator) >= 0) {
      return operator;
    }
  }

  protected evaluateOperator(
    operator: string,
    left: number,
    right: number
  ): number {
    switch (this.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
    }
  }

  private evaluate() {
    if (this.operator) {
      this.memory = this.evaluateOperator(
        this.operator,
        this.memory,
        this.current
      );
    } else {
      this.memory = this.current;
    }
    this.current = 0;
  }

  public handleChar(char: string) {
    if (char === "=") {
      this.evaluate();
      return;
    } else {
      let value = this.processDigit(char, this.current);
      if (value !== undefined) {
        this.current = value;
        return;
      } else {
        let value = this.processOperator(char);
        if (value !== undefined) {
          this.evaluate();
          this.operator = value;
          return;
        }
      }
    }
    throw new Error(`Unsupported input: '${char}'`);
  }

  public getResult() {
    return this.memory;
  }
}

export function test(c: Calculator, input: string) {
  for (let i = 0; i < input.length; i++) {
    c.handleChar(input[i]);
  }

  console.log(`result of '${input}' is '${c.getResult()}'`);
}
```

Aqui está um teste simples para a calculadora usando a função `teste` exposta.

#### TestCalculator.ts

```ts
import { Calculator, test } from "./Calculator";

let c = new Calculator();
test(c, "1+2*33/11="); // escreve 9
```

Agora, para estender isso para adicionar suporte para entrada com números em bases diferentes de 10, vamos criar `ProgrammerCalculator.ts`

#### ProgrammerCalculator.ts

```ts
import { Calculator } from "./Calculator";

class ProgrammerCalculator extends Calculator {
  static digits = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];

  constructor(public base: number) {
    super();
    const maxBase = ProgrammerCalculator.digits.length;
    if (base <= 0 || base > maxBase) {
      throw new Error(`base deve estar entre 0 para ${maxBase} inclusive.`);
    }
  }

  protected processDigit(digit: string, currentValue: number) {
    if (ProgrammerCalculator.digits.indexOf(digit) >= 0) {
      return (
        currentValue * this.base + ProgrammerCalculator.digits.indexOf(digit)
      );
    }
  }
}

// Exporta a nova calculadora estendida como Calculator
export { ProgrammerCalculator as Calculator };

// Além disso, exporta a função auxiliar
export { test } from "./Calculator";
```

o novo módulo `ProgrammerCalculator` exporta uma forma de API semelhante à do módulo `Calculator` original, mas não aumenta nenhum objeto no módulo original.
Aqui está um teste para nossa classe ProgrammerCalculator:

#### TestProgrammerCalculator.ts

```ts
import { Calculator, test } from "./ProgrammerCalculator";

let c = new Calculator(2);
test(c, "001+010="); // escreve 3
```

## Não use namespaces nos módulos

Ao mudar pela primeira vez para uma organização baseada em módulo, uma tendência comum é envolver as exportações em uma camada adicional de namespaces.
Os módulos têm seu próprio escopo e apenas as declarações exportadas são visíveis de fora do módulo.
Com isso em mente, o namespace fornece muito pouco ou nenhum valor ao trabalhar com módulos.

Na frente da organização, os namespaces são úteis para agrupar objetos e tipos relacionados logicamente no escopo global.
Por exemplo, em C#, você encontrará todos os tipos de coleção em System.Collections.
Ao organizar nossos tipos em namespaces hierárquicos, oferecemos uma boa experiência de "descoberta" para usuários desses tipos.
Os módulos, por outro lado, já estão necessariamente presentes em um sistema de arquivos.
Temos que resolvê-los por caminho e nome de arquivo, portanto, há um esquema de organização lógico para usarmos.
Nós podemoso ter uma pasta /collections/generic/ com a lista de módulos nela.

Os namespaces são importantes para evitar conflitos de nomenclatura no escopo global.
Por exemplo, você pode ter `My.Application.Customer.AddForm` e `My.Application.Order.AddForm` -- dois tipos com o mesmo nome, mas um namespace diferente.
Isso, no entanto, não é um problema com módulos.
Dentro de um módulo, não há razão plausível para ter dois objetos com o mesmo nome.
Do lado do consumo, o consumidor de qualquer módulo pode escolher o nome que usará para se referir ao módulo, portanto, conflitos de nomenclatura acidentais são impossíveis.

> Para obter mais discussão sobre módulos e namespaces, acesse [Namespaces e Módulos](/docs/handbook/namespaces-and-modules.html).

## Sinais de alerta

Todos os itens a seguir são sinais de alerta para a estruturação do módulo. Verifique novamente se você não está tentando criar um namespace para seus módulos externos se algum deles se aplicar aos seus arquivos:

- Um arquivo cuja única declaração de nível superior é `export namespace Foo { ... }` (remove `Foo` e move tudo para um nível 'acima')
- Múltiplos arquivos que tem um mesmo `export namespace Foo {` em um nível superior (não pense que eles vão se combinar em um único `Foo`!)
