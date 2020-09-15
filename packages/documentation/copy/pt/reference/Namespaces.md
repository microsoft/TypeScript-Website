---
title: Namespaces
layout: docs
permalink: /pt/docs/handbook/namespaces.html
oneline: Como funcionam os Namespaces no TypeScript
translatable: true
---

> **Uma nota sobre Terminologia**
> É importante notar que no TypeScript 1.5, a nomeclatura mudou.
> "Internal modules" agora são "namespaces".
> "External modules" agora são simplesmente módulos, para se alinhar com a terminologia do [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/), (Ou seja, `module X {` agora é equivalente ao `namespace X {`, Preferivelmente)

Essa postagem descreve várias maneiras de organizar seu código usando namespaces (antigamente "internal modules") em TypeScript.
Como mencionamos na nossa nota sobre terminologia, "internal modules" agora são referidos como "namespaces".
Adicionalmente, qualquer lugar em que a palavra `module` seja usada declarando um "internal module", a palavra `namespace` pode e deve ser usada.
Isso evita confundir novos usuários sobrecarregando eles com termos similares.

## Primeiros passos

Vamos começar com um programa que vamos usar como exemplo nessa página.
Nós escrevemos um pequeno conjunto de simples validadores de string, como você talvez escreva para checar se o input do usuário num formulário numa página web ou checar um arquivo com dados fornecido externamente.

## Validadores em um único arquivo

```ts
interface StringValidator {
  isAcceptable(s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
  isAcceptable(s: string) {
    return lettersRegexp.test(s);
  }
}

class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}

// Alguns exemplos
let strings = ["Hello", "98052", "101"];

// Validadores para usar
let validators: { [s: string]: StringValidator } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// Mostrar qual string passou por qual validador
for (let s of strings) {
  for (let name in validators) {
    let isMatch = validators[name].isAcceptable(s);
    console.log(`'${s}' ${isMatch ? "matches" : "does not match"} '${name}'.`);
  }
}
```

## Namespacing

Como nós adicionamos mais validadores, nós queremos ter algum tipo de organização no nosso esquema para manter o controle dos nossos tipos e não se preocupar com colisões de nomes com outros objetos.
Ao invés de colocar vários nomes em um namespace global, vamos encapsular nosso objeto em um namespace.

Nesse exemplo, nós vamos mover todas as entidades relacionadas ao validador em um namespace chamado `Validation`.
Porque nós queremos que as interfaces e classes aqui sejam visiveis fora do namespace, então nós adicionaremos eles com o `export`.
Inversamente, as váriaveis `lettersRegexp` e `numberRegexp` são detalhes de implementação, então nós não vamos exportar elas e não ficarão visíveis para código que fica fora do namespace.
No teste de código no rodapé do arquivo, nós agora precisamos qualificar os tipos dos nomes quando usamos fora do namespace, e.g `Validation LettersOnlyValidator`.

## Validadores Namespaced

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/;
  const numberRegexp = /^[0-9]+$/;

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}

// Alguns exemplos
let strings = ["Hello", "98052", "101"];

// Validadores para usar
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Mostrar qual string passou por qual validador
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```

## Dividindo entre arquivos

Como nossa aplicação cresce, nós vamos dividir o código entre múltiplos arquivos para deixar mais fácil de manter.

## Múltiplos namespaces

Aqui, nós vamos dividir nosso namespace `Validation` em vários arquivos.
Apesar dos arquivos estarem separados, eles podem contribuir com o mesmo namespace e podem ser consumidos como se eles fossem definidos em um único lugar.
Porque existem dependências entre os arquivos, nós vamos adicionar tags de referência para informar o compilador sobre a relação entre os arquivos.
Nosso teste de código não é alterado.

##### Validation.ts

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

##### LettersOnlyValidator.ts

```ts
/// <reference path="Validation.ts" />
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

##### ZipCodeValidator.ts

```ts
/// <reference path="Validation.ts" />
namespace Validation {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

##### Test.ts

```ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Alguns exemplos
let strings = ["Hello", "98052", "101"];

// Validadores para usar
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Mostrar qual string passou por qual validador
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```

Uma vez que há múltiplos arquivos envolvidos, nós precisamos nos certificar que todo código compilado seja carregado.
Há duas maneiras de fazer isso.

Primeiro, nós podemos usar um output concatenado usando a flag `--outFile` para compilar todos os arquivos em um único arquivo JavaScript:

```Shell
tsc --outFile sample.js Test.ts
```

O compilador vai automaticamente ordenar o output do arquivo baseado nas tags de referência presentes nos arquivos. Você pode especificar cada arquivo individualmente:

```Shell
tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

Outra forma, nós podemos usar a compilação por arquivo (padrão) para criar um único arquivo JavaScript para cada arquivo de entrada.
Se múltiplos arquivos JS são criados, nós vamos precisar usar tags `<script>` na nossa página web para carregar cada arquivo criado na ordem apropriada, por exemplo:

##### MyTestPage.html (excerpt)

```html
<script src="Validation.js" type="text/javascript" />
<script src="LettersOnlyValidator.js" type="text/javascript" />
<script src="ZipCodeValidator.js" type="text/javascript" />
<script src="Test.js" type="text/javascript" />
```

## Apelido

Outra forma de trabalhar com `namespaces` é usar `import q = x.y.z` para criar nomes menores para objetos comumente usados.
Para não ficar confuso com a sintaxe `import x = require("name")` para carregar módulos, essa sintaxe simplesmente cria um apelido para um simbolo especifico.
Você pode usar esses tipos de importação (comumente usado como apelidos) para qualquer tipo de identificador, incluindo objetos criados da importação de múltiplos módulos.

```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Mesmo que 'new Shapes.Polygons.Square()'
```

Note que não usamos a palavra-chave `require`; Ao invés disso nós atribuimos diretamente do nome qualificado do simbolo que nós estamos importando.
Isso é similar ao uso do `var`, mas também funciona para significados do tipo e namespace do símbolo importado.
Importante, para valores, `import` é uma referência distinta do simbolo original, então mudanças para um apelido `var` não vai ser refletida na variável original.

## Trabalhando com outras Bibliotecas JavaScript

Para descrever o formato das bibliotecas não escritas em TypeScript, nós precisamos declarar a API que a biblioteca expõe.
Porque a maioria das Bibliotecas JavaScript expõe apenas alguns objetos top-level, namespaces são uma boa forma para representar eles.

Nós chamamos declarações que não definem uma implementação de "ambiente".
Normalmente essas são definidas em arquivos `.d.ts`.
Se você tiver familiaridade com C/C++, você pode pensar como se estes fossem os arquivos `.h`.

## Namespaces de Ambiente

A popular biblioteca D3 define suas funcionalidades em um objeto global chamado `d3`.
Porque essa biblioteca é carregada através de uma tag `<script>` (Ao invés de um módulo carregador), suas declarações usam namespaces para definir seu formato.
Para que o compilador TypeScript veja esse formato, nós usamos uma declaração namespace de ambiente.  
Por exemplo, nós podemos começar escrevendo como segue:

##### D3.d.ts (trecho simplificado)

```ts
declare namespace D3 {
  export interface Selectors {
    select: {
      (selector: string): Selection;
      (element: EventTarget): Selection;
    };
  }

  export interface Event {
    x: number;
    y: number;
  }

  export interface Base extends Selectors {
    event: Event;
  }
}

declare var d3: D3.Base;
```
