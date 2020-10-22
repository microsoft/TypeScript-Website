---
title: Compatibilidade de Tipos
layout: docs
permalink: /pt/docs/handbook/type-compatibility.html
oneline: Como checagem de tipos funciona em TypeScript
translatable: true
---

Compatibilidade de tipos no Typescript é baseado em subtipagem estrutural.
Tipagem estrutural é um forma de relacionar tipos baseado exclusivamente em seus membros.
Isso vai de encontro com a tipagem nominal.
Considere o código a seguir:

```ts
interface Nomeado {
  nome: string;
}

class Pessoa {
  nome: string;
}

let p: Nomeado;
// OK, por causa da tipagem estrutural
p = new Pessoa();
```
Em linguagens nominalmente tipadas como C# ou Java, o código equivalente seria um erro porque a classe `Pessoa` não se descreve explícitamente como sendo um implementador da interface `Nomeado`.

O sistema de tipagem estrutural TypeScript foi projetado baseado em como o código Javascript é tipicamente escrito.
Por que o Javascript faz uso amplo de objetos anônimos como funções de expressões e literais de objetos, é muito mais natural representar os tipos de relacionamentos encontrados em bibliotecas JavaScript com um sistema de tipo estrutural do que um tipo nominal.

## Uma nota sobre Solidez

O sistema de tipos TypeScript permite certas operações, que não poderiam ser conhecidas em tempo de compilação, a serem seguras.
Quando um sistema de tipos tem essa propriedade, fica dito não ser "sólido" (_sound_). Os locais onde Typescript permite comportamento não sólido foram considerados cuidadosamente, e ao decorrer desse documento iremos explicar onde eles ocorrem e os cenários motivadores por trás deles. 

## Começando

A regra básica para tipagem estrutural do TypeScript é que `x` é compatível com `y` se `y` tem ao menos o mesmo numero de membros de `x`. Por exemplo:

```ts
interface Nomeado {
  nome: string;  
}

let x: Nomeado;
// o tipo inferido de y é { nome: string; localizacao: string; }
let y = { nome: "Alice", localizacao: "Acre" };
x = y;
```

Para verificar quando `y` pode ser atribuído a `x`, o compilador checa cada propriedade de `x` para encontrar uma propriedade compatível em  `y`.
Nesse caso, `y` precisa ter um membro chamado `nome` que é uma string. Tendo feito, então a atribuição é permitida.

A mesma regra para atribuição é usada ao verificar chamadas dos argumentos da função:

```ts
function cumprimenta(n: Nomeado) {
  console.log("Olá, " + n.nome);
}
cumprimenta(y); // OK
```

Perceba que `y` tem uma propriedade `localizacao` extra, mas isso não cria um erro.
Apenas membros do tipo alvo (`Nomeado` nesse caso) são considerados ao checar por compatibilidade.

Esse processo de comparação ocorre recursivamente, explorando o tipo de cada membro e sub-membro.

## Comparando duas funções

Enquanto comparar tipos primitivos é relativamente simples, a questão de quais tipos de funções deveriam ser consideradas compatíveis é um pouco mais difícil. Vamos começar com um exemplo básico de duas funções que diferem apenas em sua lista de parâmetros:

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Erro
```

Para verificar se `x` é atribuível a `y`, primeiro olhamos a lista de parâmetros.
Cada parâmetro em `x` precisa ter um parâmetro correspondente em `y`com um tipo compatível.
Perceba que o nome dos parâmetros não são considerados, apenas seus tipos.
Nesse caso, cada parâmetro de `x` tem um parâmetro correspondente compatível em `y`, então a atribuição é permitida.

A segunda atribuição é um erro, porque `y` tem um segundo parâmetro requerido que `x` não tem, então a atribuição não é permitida.

Você pode estar se perguntando por quê permitimos parâmetros 'descartáveis' como no exemplo `y = x`.
O motivo para essa atribuição ser permitida é que, ignorar parâmetros extras de funções, na verdade, é bem comum no JavaScript.
Por exemplo, `Array#forEach` provém tres parâmetros para a função de callback: os elementos do array, seus index e o array.
Mesmo assim, é muito útil prover um callback que usa apenas o primeiro parâmetro:

```ts
let itens = [1, 2, 3];

// Não força esses parâmetros extras
itens.forEach((item, index, array) => console.log(item));

// Deveria ser OK!
itens.forEach((item) => console.log(item));
```

Agora vamos olhar como os tipos retornados são tratados usando duas funções que diferem apenas em seu tipo retornado:

```ts
let x = () => ({ nome: "Alice" });
let y = () => ({ nome: "Alice", localizacao: "Acre" });

x = y; // OK
y = x; // Erro, porque falta a propriedade localizacao em x()
```

O sistema de tipos força que o retorno da função fonte seja um subtipo do tipo retornado da função alvo.

## Parâmetro de Função Bivariado

Ao comparar os tipos de parâmetros de funções, a atribuição tem sucesso se o parâmetro fonte é atribuível ao parâmetro alvo, ou vice versa.
Isso é não sólido pois pode ser dada a uma função chamadora uma função que retorna um tipo mais especializado, mas invoca a função com um tipo menos especializado. 
Na pratica, esse tipo de erro é raro, e permitir esse comportamento viabiliza muitos padrões comuns do JavaScript. Um exemplo breve:

```ts
enum EventType {
  Mouse,
  Keyboard,
}

interface Event {
  timestamp: number;
}
interface MouseEvent extends Event {
  x: number;
  y: number;
}
interface KeyEvent extends Event {
  keyCode: number;
}

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
  /* ... */
}

// Não sólido, mas útil e comum
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));

// Alternativas indesejáveis na presença de solidez
listenEvent(EventType.Mouse, (e: Event) =>
  console.log((e as MouseEvent).x + "," + (e as MouseEvent).y)
);
listenEvent(EventType.Mouse, ((e: MouseEvent) =>
  console.log(e.x + "," + e.y)) as (e: Event) => void);

// Ainda não permitido (erro claro). Segurança de tipos forçada para tipos completamente incompatíveis
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

Você pode ter o TypeScript lançando erros quando isso acontece pela marcação do compilador `strictFunctionTypes`.

## Parâmetros Opcionais e Parâmetros Rest

Ao comparar funções para compatibilidade, parâmetros opcionais e requeridos são intercambiáveis.
Parâmetros opcionais extras do tipo fonte não são um erro e parâmetros opcionais do tipo alvo, sem parâmetros correspondentes no tipo fonte, não são um erro.

Quando uma função tem um parâmetro do tipo rest, ela é tratada como se tivesse uma série infinita de parâmetros opcionais.

Isso não sólido pela perspectiva do sistema de tipos, mas pelo ponto de vista do tempo de execução a ideia de um parâmetro opcional é geralmente reforçada, uma vez que é o equivalente a passar `undefined` naquela posição para a maioria das funções.

O exemplo motivacional é o padrão comum de uma função que recebe um callback e a chama com alguma previsibilidade (para o programador) mas com numero desconhecido (para o sistema de tipos) de argumentos:

```ts
function chamaDepois(args: any[], callback: (...args: any[]) => void) {
  /* ... Chama callback com 'args' ... */
}

// Não sólido - chamaDepois "poderia" prover qualquer numero de argumentos
chamaDepois([1, 2], (x, y) => console.log(x + ", " + y));

// Confuso (x e y, na verdade, são requeridos ) e indetectáveis
chamaDepois([1, 2], (x?, y?) => console.log(x + ", " + y));
```

## Funções com sobrecarga

Quando uma função tem sobrecarga, cada sobrecarga no tipo fonte deve combinar com uma assinatura compatível no tipo alvo.
Isso assegura que a função alvo pode ser chamada nas mesmas situações da função fonte.

## Enums

Enums são compatíveis com números e números são compatíveis com enums. Valores de Enum de tipos de enum diferentes são considerados incompatíveis. Por Exemplo,

```ts
enum Status {
  Pronto,
  Esperando,
}
enum Cor {
  Vermelho,
  Azul,
  Verde,
}

let status = Status.Pronto;
status = Cor.Verde; // Erro
```

## Classes

Classes funcionam de forma similar a tipos literais de objetos e interfaces, com uma exceção: Ambos tem um tipo estático e de instancia.
Ao comparar dois objetos de um tipo de classe, apenas membros da instancia são comparados. 
Membros estáticos e construtores não afetam a compatibilidade.

```ts
class Animal {
  patas: number;
  constructor(nome: string, numPatas: number) {}
}

class Tamanho {
  patas: number;
  constructor(numPatas: number) {}
}

let a: Animal;
let s: Tamanho;

a = s; // OK
s = a; // OK
```

## Membros privados e protegidos em classes

Membros privados e protegidos em uma classe afetam sua compatibilidade.
Quando a compatibilidade de uma instancia de classe é verificada, se o tipo alvo contem um membro privado, então o tipo fonte também precisa conter um membro privado que se originou da mesma classe. 
De forma semelhante, o mesmo se aplica para uma instancia com um membro protegido.
Isso permite manter a compatibilidade de atribuição com a sua classe super, mas _não_ com classes de hierarquias de heranças diferentes que, de outra forma, possuem a mesma estrutura.

## Generics

Porquê TypeScript é um sistema de tipo estrutural, tipo dos parâmetros apenas afetam o tipo resultante quando consumidos como parte do tipo de um membro. Por Exemplo,

```ts
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;

x = y; // OK, porque y combina com a estrutura de x
```

No exemplo acima, `x` e `y` são compatíveis porque suas estruturas não usam o argumento de tipo de forma diferenciativa.
Modificando esse exemplo adicionando um membro a `Empty<T>` mostra como isso funciona: 

```ts
interface NaoVazio<T> {
  data: T;
}
let x: NaoVazio<number>;
let y: NaoVazio<string>;

x = y; // Erro, porque x e y não são compatíveis
```

Dessa forma, um tipo genérico que tem os seus tipos de argumentos especificados age como um tipo não genérico.

Para tipos genéricos que nao tem seus tipos de argumentos especificados, a compatibilidade é verificada especificando `any` no lugar de todos os tipos de argumentos não especificados.
A compatibilidade dos tipos resultantes é então verificada, assim como no caso dos tipos não genéricos.

Por exemplo,

```ts
let identidade = function <T>(x: T): T {
  // ...
};

let reverter = function <U>(y: U): U {
  // ...
};

identidade = reverter; // OK, porque (x: any) => any bate com (y: any) => any
```

## Tópicos avançados

## Subtipos vs Atribuições

Até aqui, temos usado "compatível", que não é um termo definido nas especificações da linguagem.
Em TypeScript, existem dois tipos de compatibilidade: subtipos e atribuições.
Eles diferem apenas no fato de que a atribuição estende a compatibilidade do subtipo com regras para permitir a atribuição de e para `enum` com valores numéricos correspondentes. 

Diferentes locais na linguagem usam um dos dois tipos de mecanismos de compatibilidade, dependendo da situação.
Para fins práticos, compatibilidade de tipos é ditada pela compatibilidade de atribuição, mesmo no casos das clausulas `implements` e `extends`.
