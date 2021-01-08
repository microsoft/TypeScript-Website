---
title: Mixins
layout: docs
permalink: /pt/docs/handbook/mixins.html
oneline: Usando o padrão Mixin com TypeScript
translatable: true
---

Junto com as hierarquias OO tradicionais, outra maneira popular de construir classes a partir de componentes reutilizáveis ​​é construí-los combinando classes parciais mais simples.
Você pode estar familiarizado com a ideia de mixins ou traits para linguagens como Scala, e o padrão também alcançou alguma popularidade na comunidade JavaScript.

## Como funciona um Mixin?

O padrão depende do uso de Genéricos com herança de classe para estender uma classe base.
O melhor suporte mixin do TypeScript é feito por meio do padrão de expressão de classe.
Você pode ler mais sobre como esse padrão funciona em [JavaScript aqui](https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/).

Para começar, precisaremos de uma classe que terá o mixin aplicado em cima de:

```ts twoslash
class Sprite {
  nome = "";
  x = 0;
  y = 0;

  constructor(nome: string) {
    this.nome = nome;
  }
}
```

Então você precisa de um tipo e uma função de fábrica que retorne uma expressão de classe estendendo a classe base.

```ts twoslash
// Para começar, precisamos de um tipo que usaremos para estender
// outras classes de. A principal responsabilidade é declarar
// que o tipo que está sendo passado é uma classe.

type Construtor = new (...args: any[]) => {};

// Este mixin adiciona uma propriedade de escala, com getters e setters
// para alterá-lo com uma propriedade privada encapsulada:

function Escala<TBase extends Construtor>(Base: TBase) {
  return class Dimensionamento extends Base {
    // Mixins não podem declarar propriedades privadas/protegidas
    // entretanto, você pode usar campos privados ES2020
    _escala = 1;

    setEscala(escala: number) {
      this._escala = escala;
    }

    get escala(): number {
      return this._escala;
    }
  };
}
```

Com tudo isso configurado, você pode criar uma classe que representa a classe base com mixins aplicados:

```ts twoslash
class Sprite {
  nome = "";
  x = 0;
  y = 0;

  constructor(nome: string) {
    this.nome = nome;
  }
}
type Construtor = new (...args: any[]) => {};
function Escala<TBase extends Construtor>(Base: TBase) {
  return class Dimensionamento extends Base {
    // Mixins não podem declarar propriedades privadas/protegidas
    // entretanto, você pode usar campos privados ES2020
    _escala = 1;

    setEscala(escala: number) {
      this._escala = escala;
    }

    get escala(): number {
      return this._escala;
    }
  };
}
// ---cortar---
// Componha uma nova classe da classe Sprite,
// com o aplicador Mixin Escala:
const SpriteOitoBits = Escala(Sprite);

const abanoSprite = new SpriteOitoBits("Passaro");
abanoSprite.setEscala(0.8);
console.log(abanoSprite.escala);
```

## Mixins restritos

Na forma acima, o mixin não tem nenhum conhecimento básico da classe, o que pode dificultar a criação do design que você deseja.

Para modelar isso, modificamos o tipo de construtor original para aceitar um argumento genérico.

```ts twoslash
// Este era nosso construtor anterior:
type Construtor = new (...args: any[]) => {};
// Agora usamos uma versão genérica que pode aplicar uma restrição em
// a classe a qual este mixin é aplicado
type Construtor<T = {}> = new (...args: any[]) => T;
```

Isso permite a criação de classes que funcionam apenas com classes de base restritas:

```ts twoslash
type GConstrutor<T = {}> = new (...args: any[]) => T;
class Sprite {
  nome = "";
  x = 0;
  y = 0;

  constructor(nome: string) {
    this.nome = nome;
  }
}
// ---corte---
type Posicionavel = GConstrutor<{ setPos: (x: number, y: number) => void }>;
type Spritable = GConstrutor<typeof Sprite>;
type Loggable = GConstrutor<{ impressao: () => void }>;
```

Então você pode criar mixins que só funcionam quando você tem uma base particular para construir:

```ts twoslash
type GConstrutor<T = {}> = new (...args: any[]) => T;
class Sprite {
  nome = "";
  x = 0;
  y = 0;

  constructor(nome: string) {
    this.nome = nome;
  }
}
type Posicionavel = GConstrutor<{ setPos: (x: number, y: number) => void }>;
type Spritable = GConstrutor<typeof Sprite>;
type Loggable = GConstrutor<{ impressao: () => void }>;
// ---cortar---

function Saltavel<TBase extends Posicionavel>(Base: TBase) {
  return class Saltavel extends Base {
    saltar() {
      // Este mixin só funcionará se for passado uma base
      // classe que tem setPos definido por causa da
      // Restrição posicionável.
      this.setPos(0, 20);
    }
  };
}
```

## Padrão Alternativo

As versões anteriores deste documento recomendavam uma maneira de escrever mixins em que você criava o tempo de execução e as hierarquias de tipo separadamente e depois os mesclava no final:

```ts twoslash
// @strict: false
// Cada mixin é uma classe ES tradicional
class Saltavel {
  saltar() {}
}

class Abaixavel  {
  abaixar() {}
}

// Incluindo a base
class Sprite {
  x = 0;
  y = 0;
}

// Então você cria uma interface que mescla
// os mixins esperados com o mesmo nome de sua base
interface Sprite extends Saltavel, Abaixavel {}
// Aplique os mixins na classe base via
// JS em tempo de execução
aplicarMixins(Sprite, [Saltavel, Abaixavel]);

let jogador = new Sprite();
jogador.saltar();
console.log(jogador.x, jogador.y);

// Isso pode estar em qualquer lugar em sua base de código:
function aplicarMixins(derivadoCtor: any, construtores: any[]) {
  construtores.forEach((baseCtor) => {
    Object.obterNomesDePropriedade(baseCtor.prototype).forEach((nome) => {
      Object.defineProperty(
        derivedCtor.prototype,
        nome,
        Object.obterNomesDePropriedade(baseCtor.prototype, nome)
      );
    });
  });
}
```

Esse padrão depende menos do compilador e mais da sua base de código para garantir que o tempo de execução e o sistema de tipos sejam mantidos corretamente em sincronia.

## Restrições

O padrão mixin é suportado nativamente dentro do compilador TypeScript por análise de fluxo de código.
Existem alguns casos em que você pode atingir as bordas do suporte nativo.

#### Decoradores e Mixins [`#4881`](https://github.com/microsoft/TypeScript/issues/4881)

Você não pode usar decoradores para fornecer mixins por meio de análise de fluxo de código:

```ts twoslash
// @experimentalDecorators
// @errors: 2339
// Uma função decoradora que replica o padrão mixin:
const Pausavel = (alvo: typeof Jogador) => {
  return class Pausavel extends alvo {
    deveCongelar = false;
  };
};

@Pausavel
class Jogador {
  x = 0;
  y = 0;
}

// A classe Jogador não tem o tipo de decorador mesclado:
const jogador = new Jogador();
jogador.deveCongelar;

// Se o aspecto do tempo de execução pode ser replicado manualmente via
// composição de tipo ou fusão de interface.
type JogadorCongelado = typeof Jogador & { deveCongelar: boolean };

const jogadorDois = (new Jogador() as unknown) as JogadorCongelado;
jogadorDois.deveCongelar;
```

#### Mixins de propriedade estática [`#17829`](https://github.com/microsoft/TypeScript/issues/17829)

Mais uma pegadinha do que uma restrição.
O padrão de expressão de classe cria singletons, portanto, não podem ser mapeados no sistema de tipos para suportar diferentes tipos de variáveis.

Você pode contornar isso usando funções para retornar suas classes que diferem com base em um genérico:

```ts twoslash
function base<T>() {
  class Base {
    static prop: T;
  }
  return Base;
}

function derivado<T>() {
  class Derivado extends base<T>() {
    static outraProp: T;
  }
  return Derivado;
}

class Spec extends Derivado<string>() {}

Spec.prop; // string
Spec.anotherProp; // string
```
