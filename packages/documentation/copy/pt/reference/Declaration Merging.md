---
title: Fusão de Declarações
layout: docs
permalink: /pt/docs/handbook/declaration-merging.html
oneline: Como a fusão de namespaces e interfaces funciona
translatable: true
---

## Introdução

Alguns dos conceitos únicos em Typescript descrevem a forma de um objeto Javascript ao nível de tipo.
Um exemplo que é especialmente único do Typescript é o conceito de 'fusão de declarações'.
Entender este conceito vai lhe dar uma vantagem quando trabalhando com Javascript existente.
Ele também abre portas para mais coneceitos de abstração avançados.

Para os propósitos deste artigo, "fusão de declarações" significa que o compilador funde duas declarações separadas que têm o mesmo nome em apenas uma definição.
Essa definição fundida tem as funcionalidades de ambas as declarações originais.
Qualquer número de declarações podem ser fundidas, não está limitada a apenas duas declarações.

## Conceitos Básicos

Em Typescript, uma declaração cria entidades em pelo menos um destes três grupos: namespace, tipo, ou valor.
Criação de declarações de namespace criam um namespace, que contém nomes que são acessados usando uma notação de ponto.
Declarações de criação de tipo fazem apeans isto: criam um tipo que é visível na forma declarada e ligado ao nome dado.
Por último, declarações de criação de valor criam valores que são visíveis na saída Javascript.

| Tipo da Declaração | Namespace | Tipo | Valor |
| ------------------ | :-------: | :--: | :---: |
| Namespace          |     X     |      |   X   |
| Class              |           |  X   |   X   |
| Enum               |           |  X   |   X   |
| Interface          |           |  X   |       |
| Type Alias         |           |  X   |       |
| Function           |           |      |   X   |
| Variable           |           |      |   X   |

Entender o que é criado com cada declaração vai te ajudar a entender o que é fundido quando você performa uma fusão de declarações.

## Fundindo Interfaces

O mais simples, e talvez o mais comum, tipo de fusão de declaração é a fusão de interfaces.
No nível mais básico, a fusão automaticamente junta os membros de ambas as declarações em apenas uma interface com o mesmo nome.

```ts
interface Box {
  height: number;
  width: number;
}

interface Box {
  scale: number;
}

let box: Box = { height: 5, width: 6, scale: 10 };
```

Membros da interface que não são funções devem ter nomes únicos.
Se eles não forem únicos, devem ser do mesmo tipo.
O compilador irá indicar um erro se a interface declarar um membro não-função do mesmo nome, mas de tipo diferente.

Para membros função, cada função do mesmo nome é tratada como descrevendo uma sobrecarga da mesma função.
Também é importante observar que, no caso da interface `A` se fundir com a interface `A` posterior, a segunda interface terá uma precedência maior que a primeira.

Isto é, no exemplo:

```ts
interface Cloner {
  clone(animal: Animal): Animal;
}

interface Cloner {
  clone(animal: Sheep): Sheep;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}
```

As três interfaces vão ser fundidas para criar uma única declaração como a seguir:

```ts
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

Note que os elementos de cada grupo mantem a mesma ordem, mas os grupos em si são fundidos com os conjuntos de sobrecarga posteriores ordenados primeiro.

Uma exceção à essa regra são assinaturas especializadas.
Se uma assinatura tem um parâmetro cujo tipo seja um tipo de literal de string único (e.g. não uma união de literais de string) então ele será levado ao topo da sua lista de sobrecarga fundida.

Por exempo, as seguintes interfaces vão se fundir:

```ts
interface Document {
  createElement(tagName: any): Element;
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
  createElement(tagName: string): HTMLElement;
  createElement(tagName: "canvas"): HTMLCanvasElement;
}
```

O resultado da declaração fundida de `Document` será o seguinte:

```ts
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}
```

## Fundindo Namespaces

Similar às interfaces, namespaces de mesmo nome terão seus membros fundidos.
Já que namespaces criam ambos um namespace e um valor, precisamos entender como os dois se fundem.

Para fundir namespaces, definições de tipo de interfaces exportadas declaradas em cada namespace são elas mesmas fundidas, formando um único namespace com declarações de interface fundidas dentro dele.

Para fundir o valor do namespace, em cada lugar de declaração, se um namespace já existe com aquele nome, ele é extendido por meio da adição dos membros exportados do segundo namespace ao primeiro já existente.

A fusão de declaração de `Animals` neste exemplo:

```ts
namespace Animals {
  export class Zebra {}
}

namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Dog {}
}
```

é equivalente a:

```ts
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }

  export class Zebra {}
  export class Dog {}
}
```

Esse modelo de fusão de namespaces é um ponto de começo útil, mas também precisamos entender o que acontece com membros não exportados.
Membros não exportados são visíveis apenas no namespace original (não fundido). Isso significa que depois da fusão, membros fundidos que vieram de outro namespace não podem ver membros não exportados.

Podemos ver isso mais claramente neste exemplo:

```ts
namespace Animal {
  let haveMuscles = true;

  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}

namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles; // Erro, porque haveMuscles não é acessível aqui
  }
}
```

Por `haveMuscles` não ser exportado, apenas a função `animalsHaveMuscles` que compartilha o mesmo namespace não fundido pode ver o símbolo.
A função `doAnimalsHaveMuscles`, mesmo que seja parte do namespace fundido `Animal` não pode ver este membro não exportado.


## Fundindo Namespaces com Classes, Funções, e Enums

Namespaces são flexíveis a ponto de também se fundir com outros tipos de declarações.
Para tal, a declaração do namespace deve seguir a declaração com que será fundido. As declarações resultantes têm propriedades de ambos os tipos de declaração.
Typescript usa essa capacidade apra modelar alguns dos padrões em JavaScript assim como outras linguagens de programação

## Fundindo Namespaces com Classes

Isso dá ao usuário uma forma de descrever suas classes internas.

```ts
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}
```

A visibilidade para membros fundidos é a mesma descrita na seção [Fundindo Namespaces](./declaration-merging.html#merging-namespaces), então nós devemos exportar a classe `AlbumLabel` para que a classe fundida seja capaz de visualizá-la.
O resultado final é uma classe gerenciada dentro de outra classe.
Você também pode usar namespaces para adicionar mais membros estáticos a uma classe existente.

Em adição ao padrão de classes internas, você também pode ser familiar com a prática JavaScript de criar uma função e então extender a função por meio de adição de propriedades a ela.
O TypeScript usa a fusão de declarações para construir definições como essas em uma forma de tipo segura.

```ts
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}

console.log(buildLabel("Sam Smith"));
```

Similarmente, namesapces podem ser usados para extender enums com membros estáticos:

```ts
enum Color {
  red = 1,
  green = 2,
  blue = 4,
}

namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == "yellow") {
      return Color.red + Color.green;
    } else if (colorName == "white") {
      return Color.red + Color.green + Color.blue;
    } else if (colorName == "magenta") {
      return Color.red + Color.blue;
    } else if (colorName == "cyan") {
      return Color.green + Color.blue;
    }
  }
}
```

## Fusões Desencorajadas

Nem todas as fusões são permitidas no TypeScript.
Atualmente, classes não podem se fundir com outras classes ou variáveis.
Para mais informações em simular a fusão de classes, veja a seção de [Mixins em TypeScript](/docs/handbook/mixins.html)

## Aumento de Módulos

Ainda que módulos JavaScript não suportem fusões, você pode alterar objetos existentes por meio da importação e atualização deles.
Olhemos para um exemplo de Observable:

```ts
// observable.ts
export class Observable<T> {
  // ... implementação deixada como exercício para o leitor ...
}

// map.ts
import { Observable } from "./observable";
Observable.prototype.map = function (f) {
  // ... outro exercicio para o leitor
};
```

Isso funciona perfeitamente em TypeScript também, mas o compilador não sabe sobre `Observable.prototype.map`.
Você pode usar aumento de módulos para informar o compilador sobre isso:

```ts
// observable.ts
export class Observable<T> {
  // ... implementação deixada como exercício para o leitor ...
}

// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function (f) {
  // ... outro exercicio para o leitor
};

// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number>;
o.map((x) => x.toFixed());
```

O nome do módulo é resolvido da mesma forma que os especificadores de módulo em `import`/`export`.
Veja [Módulos](/docs/handbook/modules.html) para mais informações.
Então as declarações em um aumento são fundidas como se tivessem sido declaradas no mesmo arquivo que o original.

Entretando, há duas limitações para se lembrar:

3. Você não pode declarar novas declarações de alto nível no aumento -- apenas mudanças para declarações existentes.
4. Default exports não podem ser aumentados também, apenas named exports (já que você precisa aumentar um export por seu nome, e `default` é uma palavra reservada - veja [#14080](https://github.com/Microsoft/TypeScript/issues/14080) para detalhes)

## Aumento Global

Você também pode adicionar declarações ao escopo global a partir de um módulo isolado:

```ts
// observable.ts
export class Observable<T> {
  // ... ainda sem implementação ...
}

declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}

Array.prototype.toObservable = function () {
  // ...
};
```

Aumentos globais têm o mesmo comportamento e limites que os aumentos de módulos.
