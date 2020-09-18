---
title: Decoradores
layout: docs
permalink: /pt/docs/handbook/Decorators.html
oneline: Visão geral dos Decoradores no TypeScript
translatable: true
---

## Introdução

Com a introdução das Classes no TypeScript e ES6, agora existem certos cenários que requerem recursos adicionais para dar suporte à anotação ou modificação de classes e membros da classe.
Decoradores fornecem uma maneira de adicionar anotações e uma sintaxe de metaprogramação para declarações de classe e membros.
Decoradores são uma [proposta de estágio 2](https://github.com/tc39/proposal-decorators) para JavaScript e estão disponíveis como um recurso experimental do TypeScript.

> NOTA&emsp; Decoradores são um recurso experimental que podem mudar em versões futuras.

Para habilitar o suporte experimental para os Decoradores, você deve habilitar a opção do compilador `experimentalDecorators` na linha de comando ou em seu `tsconfig.json`:

**Linha de Comando**:

```shell
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**:

```json  tsconfig
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

## Decoradores

Um _Decorador_ é um tipo especial de declaração que pode ser anexado a uma [declaração de classe](#decoradores-de-classes), [métodos](#decoradores-de-métodos), [acessor](#decoradores-de-acessos), [propriedades](#decoradores-de-propriedades), ou [parâmetros](#decoradores-de-parâmetros).
Decoradores usam a forma `@expressão`, onde `expressão` deve ser avaliada como uma função que será chamada em tempo de execução com informações sobre a declaração decorada.

Por exemplo, dado o decorador `@selado`, podemos escrever a função `selado` da seguinte forma:

```ts
function selado(alvo) {
  // executa algo com o alvo...
}
```

> NOTA&emsp; Você pode ver um exemplo mais detalhado de um decorator em [Decoradores de Classes](#decoradores-de-classes), abaixo

## Fábrica de Decoradores

Se quisermos personalizar como um decorador é aplicado a uma declaração, podemos escrever uma fábrica de decoradores.
Uma _Fábrica de Decoradores_ é simplesmente uma função que retorna a expressão que será chamada pelo decorador em tempo de execução.

Podemos escrever uma fábrica de decoradores da seguinte maneira:

```ts
function cor(valor: string) {
  // isso é uma fábrica de decoradores
  return function (alvo) {
    // este é o decorador
    // executa algo com 'alvo' e 'valor' ...
  };
}
```

> NOTA&emsp; Você pode ver um exemplo mais detalhado de uma fábrica de decoradores em [Decoradores de Métodos](#decoradores-de-métodos), abaixo.

## Composição de Decoradores

Vários decoradores podem ser aplicados a uma declaração, como nos exemplos a seguir:

- Em uma única linha:

  ```ts
  @f @g x
  ```

- Em diversas linhas:

  ```ts
  @f
  @g
  x
  ```

Quando vários decoradores se aplicam a uma única declaração, sua avaliação é semelhante a
[composição de funções em matemática](http://wikipedia.org/wiki/Function_composition). Neste modelo, ao compor as funções _f_ e _g_, o composto resultante (_f_ ∘ _g_)(_x_) é equivalente a _f_(_g_(_x_)).

Assim, as etapas a seguir são executadas ao avaliar vários decoradores em uma única declaração no TypeScript:

1. As expressões para cada decorador são avaliadas de cima para baixo.
2. Os resultados são chamados como funções de baixo para cima.

Se fôssemos usar [fábrica de decoradores](#fábrica-de-decoradores), podemos observar esta ordem de avaliação com o seguinte exemplo:

```ts
function f() {
  console.log("f(): avaliada");
  return function (
    alvo,
    chaveDePropriedade: string,
    descritor: descritorDePropriedade
  ) {
    console.log("f(): chamada");
  };
}

function g() {
  console.log("g(): avaliada");
  return function (
    alvo,
    chaveDePropriedade: string,
    descritor: descritorDePropriedade
  ) {
    console.log("g(): chamada");
  };
}

class C {
  @f()
  @g()
  method() {}
}
```

Que imprimiria esta saída no console:

```shell
f(): avaliada
g(): avaliada
g(): chamada
f(): chamada
```

## Avaliação de Decoradores

Há uma ordem bem definida para como os decoradores aplicados a várias declarações, dentro de uma classe, são aplicados:

1. _Decoradores de Parâmetros_, seguido por _Mêtodo_, _Decoradores de Acesso_ ou _Decoradores de Propriedades_ são aplicados para cada membro da instância.
2. _Decoradores de Parâmetros_, seguido por _Mêtodo_, _Decoradores de Acesso_ ou _Decoradores de Propriedades_ são aplicados para cada membro estático.
3. _Decoradores de Parâmetros_ são aplicados para o construtor.
4. _Decoradores de classe_ são aplicados para a classe.

## Decoradores de Classes

O _Decorador de Classe_ é declarado antes de uma declaração de classe.
O decorador de classe é aplicado ao construtor da classe e pode ser usado para observar, modificar ou substituir uma definição de classe.
Um decorador de classe não pode ser usado em um arquivo de declaração, ou em qualquer outro contexto de ambiente (como em uma classe `declare`).

A expressão para o decorador de classe será chamada como uma função em tempo de execução, com o construtor da classe decorada como seu único argumento.

Se o decorador da classe retornar um valor, ele substituirá a declaração da classe pela função construtora fornecida.

> NOTA&nbsp; Se você decidir retornar uma nova função de construtor, deve tomar cuidado para manter o protótipo original.
> A lógica que aplica decoradores em tempo de execução **não** fará isso por você.

A seguir está um exemplo de um decorador de classe (`@selada`) aplicado a classe `Recepcionista`

```ts
@selada
class Recepcionista {
  recepcionista: string;
  constructor(mensagem: string) {
    this.cumprimento = mensagem;
  }
  cumprimentar() {
    return "Olá, " + this.cumprimento;
  }
}
```

Podemos definir o decorador `@selado` usando a seguinte declaração de função:

```ts
function selado(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

Quando `@selado` é executado, ele irá selar o construtor e seu protótipo.

A seguir, temos um exemplo de como substituir o construtor.

```ts
function decoradorDeClasse<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    novaPropriedade = "nova propriedade";
    ola = "sobrepor";
  };
}

@decoradorDeClasse
class Recepcionista {
  propriedade = "propriedade";
  ola: string;
  constructor(m: string) {
    this.ola = m;
  }
}

console.log(new Recepcionista("mundo"));
```

## Decoradores de Métodos

Um _Decorador de Método_ é declarado imediatamente antes de uma declaração de método.
O decorador é aplicado ao _Descritor de Propriedade_ para o método e pode ser usado para observar, modificar ou substituir uma definição de método.
Um decorador de método não pode ser usado em um arquivo de declaração, em uma sobrecarga ou em qualquer outro contexto de ambiente (como em uma classe `declare`).

A expressão para o decorador de método será chamada como uma função em tempo de execução, com os três argumentos a seguir:

1. A função construtora da classe para um membro estático ou o protótipo da classe para um membro de instância.
2. O nome do membro
3. O _Descritor de Propriedade_ para o membro.

> NOTA&emsp; O _Descritor de Propriedade_ será `indefinido` se o destino do seu script for menor que `ES5`.

Se o decorador do método retornar um valor, ele será usado como o _Descritor de Propriedade_ para o método.

> NOTA&emsp; O valor de retorno é ignorado se o destino do script for menor que `ES5`.

A seguir está um exemplo de um decorador de método (`@enumeravel`) aplicado a um método na classe `Recepcionista`:

```ts
class Recepcionista {
  recepcionista: string;
  constructor(mensagem: string) {
    this.recepcionista = mensagem;
  }

  @enumeravel(false)  
  cumprimentar() {
    return "Olá, " + this.recepcionista;
  }
}
```

Podemos definir o decorador `@enumeravel` usando a seguinte declaração de função:

```ts
function enumeravel(valor: boolean) {
  return function (
    alvo: any,
    chaveDePropriedade: string,
    descritor: DescritorDePropriedade
  ) {
    descritor.enumeravel = valor;
  };
}
```

O decorador `@enumeravel(false)` aqui é uma [fábrica de decoradores](#fábrica-de-decoradores).
Quando o decorador `@enumeravel(false)` é chamado, ele modifica a propriedade `enumeravel` do descritor de propriedade.

## Decoradores de Acesso

Um _Decorador de Acesso_ é declarado antes de uma declaração de acesso.
O Decorador de Acesso é aplicado ao _Descritor de Propriedades_ do acessador e pode ser usado para observar, modificar ou substituir as definições de um acesso.
Um Decorador de Acesso não pode ser usado em um arquivo de declaração ou em qualquer outro contexto de ambiente (como em uma classe `declare`).

> NOTA&emsp; O TypeScript não permite decorar os acessadores `get` e` set` para um único membro.
> Em vez disso, todos os decoradores do membro devem ser aplicados ao primeiro acessador especificado na ordem do documento.
> Isso ocorre porque os decoradores se aplicam a um _Descritor de Propriedades_, que combina os acessadores `get` e `set`, não a cada declaração separadamente.

A expressão para o Decorador de Acesso será chamada como uma função em tempo de execução, com os três seguintes argumentos:

1. A função construtora da classe para um membro estático ou o protótipo da classe para um membro de instância.
2. O nome do membro.
3. O _Descritor de Propriedade_ do membro.

> NOTA&emsp; O _Descriptor de Propriedade_ será `undefined` se o destino do seu script for menor que `ES5`.

Se o Decorador de Acesso retornar um valor, ele será usado como o _Descritor de Propriedade_ para o membro.

> NOTA&emsp; O valor de retorno é ignorado se o destino do script for menor que `ES5`.

A seguir está um exemplo de um Decorador de Acesso (`@configuravel`) aplicado a um membro da classe `Ponto`:

```ts
class Ponto {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configuravel(false)
  get x() {
    return this._x;
  }

  @configuravel(false)
  get y() {
    return this._y;
  }
}
```

Podemos definir o decorador `@configuravel` usando a seguinte declaração de função:

```ts
function configuravel(valor: boolean) {
  return function (
    alvo: any,
    chaveDePropriedade: string,
    descritor: DescritorDePropriedade
  ) {
    descritor.configurable = valor;
  };
}
```

## Decoradores de Propriedades

Um _Decorador de Propriedade_ é declarado antes de uma declaração de propriedade.
Um decorador de propriedade não pode ser usado em um arquivo de declaração ou em qualquer outro contexto de ambiente (como em uma classe `declare`).

A expressão para o Decorador de Propriedade será chamada como uma função em tempo de execução, com os dois argumentos a seguir:

1. A função construtora da classe para um membro estático ou o protótipo da classe para um membro de instância.
2. O nome do membro.

> NOTA&emsp; Um _Descritor de Propriedade_ não é fornecido como um argumento para um decorador de propriedade devido a como os decoradores de propriedade são inicializados no TypeScript.
> Isso ocorre porque não existe atualmente nenhum mecanismo para descrever uma propriedade de instância ao definir membros de um protótipo e nenhuma maneira de observar ou modificar o inicializador de uma propriedade. O valor de retorno também é ignorado.
> Dessa forma, um decorador de propriedade só pode ser usado para observar que uma propriedade de um nome específico foi declarada para uma classe.

Podemos usar essas informações para registrar metadados sobre a propriedade, como no exemplo a seguir:

```ts
class Recepcionista {
  @formato("Olá, %s")
  cumprimento: string;

  constructor(mensagem: string) {
    this.cumprimento = mensagem;
  }
  cumprimentar() {
    let formatoString = obterFormato(this, "cumprimento");
    return formatoString.replace("%s", this.cumprimento);
  }
}
```

Podemos então definir o decorador `@formato` e as funções `obterFormato` usando as seguintes declarações de função:

```ts
import "reflect-metadata";

const formatoMetadataKey = Symbol("format");

function formato(formatoString: string) {
  return Reflect.metadata(formatoMetadataKey, formatoString);
}

function obterFormato(alvo: any, chaveDePropriedade: string) {
  return Reflect.getMetadata(formatoMetadataKey, alvo, chaveDePropriedade);
}
```

O decorador `@formato (" Olá,% s ")` aqui é uma [fábrica de decoradores](#fábrica-de-decoradores).
Quando `@formato (" Olá,% s ")` é chamado, ele adiciona uma entrada de metadados para a propriedade usando a função `Reflect.metadata` da biblioteca` reflet-metadata`.
Quando `obterFormato` é chamado, ele lê o valor dos metadados para o formato.

> NOTA&emsp; Este exemplo requer a biblioteca `reflect-metadata`.
> Veja [Metadados](#metadados) para mais informações sobre a biblioteca `reflet-metadata`.

## Decoradores de Parâmetros

Um _Decorador de Parâmetro_ é declarado antes de uma declaração de parâmetro.
O decorador de parâmetro é aplicado à função para um construtor de classe ou declaração de método.
Um decorador de parâmetro não pode ser usado em um arquivo de declaração, uma sobrecarga ou em qualquer outro contexto de ambiente (como em uma classe `declare`).

A expressão para o decorador de parâmetro será chamada como uma função em tempo de execução, com os três argumentos a seguir:

1. A função construtora da classe para um membro estático ou o protótipo da classe para um membro de instância.
2. O nome do membro.
3. O índice ordinal do parâmetro na lista de parâmetros da função.

> NOTA&emsp; Um decorador de parâmetro só pode ser usado para observar que um parâmetro que foi declarado em um método.

O valor de retorno do decorador de parâmetro é ignorado.

A seguir está um exemplo de um decorador de parâmetro (`@obrigatorio`) aplicado ao parâmetro de um membro da classe `Recepcionista`:

```ts
class Recepcionista {
  cumprimento: string;

  constructor(mensagem: string) {
    this.cumprimento = mensagem;
  }

  @validar
  cumprimentar(@obrigatorio nome: string) {
    return "Olá " + nome + ", " + this.cumprimento;
  }
}
```

Podemos então definir os decoradores `@obrigatorio` e` @validar` usando as seguintes declarações de função:

```ts
import "reflect-metadata";

const chaveDeMetodosNecessaria = Symbol("obrigatorio");

function obrigatorio(
  alvo: Object,
  chaveDePropriedade: string | symbol,
  indiceDeParametro: number
) {
  let parametrosNecessariosExistentes: number[] =
    Reflect.getOwnMetadata(chaveDeMetodosNecessaria, alvo, chaveDePropriedade) || [];
  parametrosNecessariosExistentes.push(indiceDeParametro);
  Reflect.defineMetadata(
    chaveDeMetodosNecessaria,
    parametrosNecessariosExistentes,
    alvo,
    chaveDePropriedade
  );
}

function validar(
  alvo: any,
  nomeDaPropriedade: string,
  descritor: DescritorDePropriedadeTipada<Function>
) {
  let método = descritor.value;
  descritor.value = function () {
    let parametrosObrigatorios: number[] = Reflect.getOwnMetadata(
      chaveDeMetodosNecessaria,
      alvo,
      nomeDaPropriedade
    );
    if (parametrosObrigatorios) {
      for (let indiceDeParametro of parametrosObrigatorios) {
        if (
          indiceDeParametro >= arguments.length ||
          arguments[indiceDeParametro] === undefined
        ) {
          throw new Error("Argumento obrigatório ausente.");
        }
      }
    }
    
    return method.apply(this, arguments);
  };
}
```

O decorador `@obrigatorio` adiciona uma entrada de metadados que marca o parâmetro como necessário.
O decorador `@validar` então envolve o método` cumprimentar` existente em uma função que valida os argumentos antes de invocar o método original.

> NOTA&emsp; Este exemplo requer a biblioteca `reflect-metadata`.
> Veja [Metadados](#metadados) para mais informações sobre a biblioteca `reflet-metadata`.

## Metadados

Alguns exemplos usam a biblioteca `reflet-metadata` que adiciona um polyfill para uma [API de metadados experimental](https://github.com/rbuckton/ReflectDecorators).
Esta biblioteca ainda não faz parte do padrão ECMAScript (JavaScript).
No entanto, assim que decoradores forem oficialmente adotados como parte do padrão ECMAScript, essas extensões serão propostas para adoção.

Você pode instalar esta biblioteca via npm:

```shell
npm i reflect-metadata --save
```

O TypeScript inclui suporte experimental para a emissão de certos tipos de metadados para declarações que possuem decoradores.
Para habilitar este suporte experimental, você deve definir a opção do compilador `emitDecoratorMetadata` na linha de comando ou em seu` tsconfig.json`:

**Linha de Comando**:

```shell
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
```

**tsconfig.json**:

```json tsconfig
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Quando habilitado, contanto que a biblioteca `reflet-metadata` tenha sido importada, informações adicionais de tipo de tempo de design serão expostas no tempo de execução.

Podemos ver isso em ação no seguinte exemplo:

```ts
import "reflect-metadata";

class Ponto {
  x: number;
  y: number;
}

class Linha {
  private _p0: Ponto;
  private _p1: Ponto;

  @validar
  set p0(valor: Ponto) {
    this._p0 = valor;
  }
  get p0() {
    return this._p0;
  }

  @validar
  set p1(valor: Ponto) {
    this._p1 = valor;
  }
  get p1() {
    return this._p1;
  }
}

function validar<T>(
  alvo: any,
  chaveDePropriedade: string,
  descritor: DescritorDePropriedadeTipada<T>
) {
  let set = descritor.set;
  descritor.set = function (valor: T) {
    let type = Reflect.getMetadata("design:type", alvo, chaveDePropriedade);
    if (!(valor instanceof type)) {
      throw new TypeError("Tipo inválido.");
    }
    set.call(alvo, valor);
  };
}
```

O compilador TypeScript injetará informações de tipo em tempo de design usando o decorador `@Reflect.metadata`.
Você pode considerá-lo o equivalente ao seguinte TypeScript:

```ts
class Linha {
  private _p0: Ponto;
  private _p1: Ponto;

  @validar
  @Reflect.metadata("design:type", Ponto)
  set p0(valor: Ponto) {
    this._p0 = valor;
  }
  get p0() {
    return this._p0;
  }

  @validar
  @Reflect.metadata("design:type", Ponto)
  set p1(valor: Ponto) {
    this._p1 = valor;
  }
  get p1() {
    return this._p1;
  }
}
```

> NOTA&emsp; Os metadados do Decorator são um recurso experimental e podem apresentar alterações importantes em versões futuras.
