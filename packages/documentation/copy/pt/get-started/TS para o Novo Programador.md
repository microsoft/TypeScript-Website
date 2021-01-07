---
title: TypeScript para o Novo Programador
short: TS para o novo programador
layout: docs
permalink: pt/docs/handbook/typescript-from-scratch.html
oneline: Aprenda TypeScript do zero
---

Parabéns por escolher TypeScript como uma das suas primeiras linguagens de programação - você já está tomando boas decisões!

Você provavelmente já ouviu falar que o TypeScript é um "sabor" ou "variação" do JavaScript.
A relação entre TypeScript (TS) e Javascript (JS) é mais que única entre as linguagens de programação moderna, aprender mais sobre este relacionamento irá lhe ajudar a entender como o TypeScript complementa o JavaScript.

## O que é o JavaScript? Uma breve história

JavaScript (também conhecido como ECMAScript) iniciou sua vida como uma simples linguagem script para browsers.
Na época ele foi inventado com a intenção de ser utilizado em pequenas porções de código embutido em páginas web - escrever mais do que algumas dezenas de código seria visto como algo não usual.
Devido a isto, os primeiros browsers executavam tais códigos de forma lenta.
No entanto, ao longo do tempo, JS se tornou mais popular e os desenvolvedores web começaram a utilizá-lo para criar experiências interativas.

Os desenvolvedores de navegadores web responderam a este aumento do uso de JS otimizando seus motores de execução (compilação dinâmica) e estendendo o que poderia ser feito com a linguagem(adicionado APIs), o que fez aumentar ainda mais a utilização do JS pelos desenvolvedores web.
Em sites modernos, o seu browser está frequentemente rodando aplicações que contém de centenas a milhares de linhas de código.
Este aumento gradual e constante da "web", fez com que o que iniciou de uma simples teia de páginas estáticas, evoluísse para uma plataforma de _aplicações_ de todos os tipos.

Mais do que isso, JS se tornou popular o bastante para ser utilizado fora do contexto dos browsers, como por exemplo podemos citar a implementação de servidores JS utilizando node.js.
A natureza "rode em qualquer lugar" faz do JS uma escolha atrativa para o desenvolvimento em múltiplas plataformas.
Atualmente existem muitos programados que usam _somente_ JavaScript para programar em toda a sua stack!

Para resumir, nós temos uma linguagem que foi projetada para usos rápidos, que cresceu para se tornar uma ferramenta completa para escrever aplicações com milhões de linhas de código.
Todas as linguagems tem seus próprios caprichos - estranhesas e surpresas, e o início humilde do JavaScript o faz ter _muitos_ destes. Alguns exemplos:

- O operador de igualdade do JavaScript (`==`) _força_ seus argumentos, levando a comportamentos estranhos:

  ```js
  if ("" == 0) {
    // É verdade, mas por que?
  }
  if (1 < x < 3) {
    // Verdade para *qualquer* valor de x!
  }
  ```
- JavaScript também permite o acesso a propriedades que não estão presentes:

  ```js
  const obj = { width: 10, height: 15 };
  // Porquê NaN? Difícil dizer!
  const area = obj.width * obj.heigth;
  ```
Muitas linguagems de programação poderiam disparar uma exceção quando estes tipos de erros ocorrerem, algumas poderiam fazê-lo durante a compilação - antes de qualquer código ser executado. 
Quando você escreve programas pequenos, estas excêntricidades são gerenciáveis; mas quando você está escrevendo aplicações com centenas de milhares de código, estas surpresas constantes tornam-se um sério problema.

## TypeScript: Um Checker Estático de Tipos

Nós dissemos anteriormente que algumas linguagens de programação não permitem que programas sejam executados caso tenham qualquer bug.
Detecção de erros sem ser a necessidade de rodar o programa é definido como _check estático_.
Determinar o que é um erro e o que não é baseado nos tipos dos valores sendo operados é conhecido como checagem estática de _tipos_.

O TypeScript checa os erros do programa programa antes da execução, e faz isso baseado nos _tipos de valores_, ele é um _checker estático de tipos_.
Por exemplo, o último código acima tem um erro devido ao _tipo_ do objeto `obj`.
Aqui está o erro que o TypeScript encontrou:

```ts twoslash
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```
### Um superset tipado do JavaScript

Mas, como o TypeScript se relaciona com o JavaScript?

#### Sintaxe

O TypeScript é uma linguagem que é um _superset_ do JavaScript: portanto a sintaxe do JS é aceita pelo TS.
A sintaxe se refere à maneira em que o código é escrito para criar um programa.
Por exemplo, o código abaixo tem um erro de _sintaxe_ porque está faltando um `)`:

```ts twoslash
// @errors: 1005
let a = (4
```
O TypeScript não considera nenhum código JavaScript como sendo um erro por conta de sua sintaxe.
Isto significa que você pode utilizar qualquer código JavaScript válido e colocá-lo em um arquivo TypeScript sem se preocupar sobre como exatamente ele está escrito.

#### Tipos

Por outro lado, o TypeScript é um superset _tipado_ o que significa que, ele adiciona regras em relação a como diferentes tipos de valores podem ser utilizados.
O erro anterior sobre `obj.heigth` não é um erro de _sintaxe_: é um erro a respeito de utilizar um _tipo_ de valor de uma maneira incorreta.

Abaixo um outro exemplo de código JavaScript que você pode rodar no seu browser, ele _irá_ mostrar um valor no console.

```js
console.log(4 / []);
```

Este é um programa sintaticamente-válido, irá mostrar `Infinity` no console.
O TypeScript, por outro lado, considera sem sentido uma divisão de um número por um array e irá mostrar um erro:

```ts twoslash
// @errors: 2363
console.log(4 / []);
```

É possível que você realmente _tinha_ a intenção de dividir o número por um array, talvez por curiosidade, mas na maioria das vezes, este é um erro de programação.
O check de tipos do TypeScript é projetado para permitir que programas corretos rodarem enquanto pega a maioria dos erros comuns.
(Mais tarde, nós iremos aprender sobre os ajustes que você pode utilizar para configurar quão rigidamente o TypeScript irá checar o seu código.)

Se você mover um código dentro de um arquivo JavaScript para um arquivo TypeScript, você verificará _erros de tipo_ dependendo de como o código é escrito.
Eles podem ser problemas legítimos com o seu código, ou o TypeScript pode estar sendo muito conservador.
Ao longo deste guia nós iremos demonstrar como adicionar várias sintaxes TypeScript para elimitar tais erros.

#### Comportamento Em Tempo de Execução

O TypeScript é também uma linguagem de programação que preserva o _comportamento em tempo de execução_ do JavaScript.
Por exemplo, a divisão por zero produz `Infinity` ao invés de disparar uma exceção em tempo de execução.
Como princípio, o TypeScript **nunca** modifica o comportamento que do código JavaScript tem em tempo de execução.

Isto significa que se você mover um código do JavaScript para o TypeScript, é **garantido** que ele execute da mesma maneira, mesmo se o TypeScript pensar que o código tem erros de tipo.

Manter o mesmo comportamento em tempo de execução do JavaScript é uma premisa fundamental do TypeScript porque significa que você pode fazer uma transição fácil entre as duas linguagens sem se preocupar com diferenças sutis que podem fazer o seu código parar de funcionar.

<!--
Missing subsection on the fact that TS extends JS to add syntax for type
specification.  (Since the immediately preceding text was raving about
how JS code can be used in TS.)
-->

#### Apagamento de Tipos

A grosso modo, uma vez que o compilador do TypeScript completa a checagem do seu código, ele _apaga_ os tipos para produzir como resultado o código "compilado".
Isto significa que uma vez que o seu código é compilado, o JS resultante não tem nenhuma informação de tipo.

Isto também significa que o TypeScript nunca modifica o _comportamento_ do seu programa baseado nos tipos inferidos.
A conclusão é que enquanto você pode ver erros de tipo durante a compilação, o sistema de tipos em si não tem influência em como o seu programa funciona quando ele roda.

Finalmente, o TypeScript não fornece nenhuma biblioteca adicional ao JS.
Os seus programas irão utilizar a mesma biblioteca padrão (ou externas) do JavaScript, logo não há nenhum framework específico do TypeScript para aprender adicionalmente.

<!--
Should extend this paragraph to say that there's an exception of
allowing you to use newer JS features and transpile the code to an older
JS, and this might add small stubs of functionality when needed.  (Maybe
with an example --- something like `?.` would be good in showing readers
that this document is maintained.)
-->

## Aprendendo JavaScript e TypeScript

Nós frequentemente vemos a seguinte questão "Eu devo aprender a programar em JavaScript ou TypeScript?".

A resposta é que você não pode aprender TypeScript sem aprender JavaScript!
O TypeScript compartilhar a sintaxe e o comportamento em tempo de execução do JavaScript, logo qualquer coisa que você aprenda sobre o JavaScript irá ajudá-lo a aprender TypeScript ao mesmo tempo.

Existem muitos, muitos recursos disponíveis para programadores aprenderem JavaScript; você _não_ deve ignorar estes recursos se você estiver escrevendo TypeScript.
Por exemplo, no StackOverflow existem 20 vezes mais perguntas com a tag `javascript` do que `typescript`, mas _todas_ as perguntas do `javascript` também se aplicam ao TypeScript.

Se você se encontrar procurando por alguma coisa do tipo "como ordenar uma lista em TypeScript", lembre-se: **O TypeScript é um JavaScript em tempo de execução com uma checagem de tipos em tempo de compilação**.
A maneira como você ordena uma lista em TypeScript é a mesma na qual você faz em JavaScript.
Também é legal se você encontrar algum conteúdo que usa o TypeScript diretamente, mas não se limite a pensar que você precisa de respostas específicas para o TypeScript sobre como executar tarefas em tempo de execução.

---

A partir daqui, nós recomendamos que você aprenda alguns fundamentos do JavaScript (o [JavaScript guide at the Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide) é um bom ponto de partida.)

Uma vez que você esteja se sentindo confortável, você pode voltar para ler [TypeScript para Programadores JavaScript](/docs/handbook/typescript-in-5-minutes.html), e iniciar [o handbook](/docs/handbook/intro.html) o explorar os [Exemplos de playground](/play#show-examples).

<!-- Note: I'll be happy to write the following... -->
<!--
## Types

    * What's a type? (For newbies)
      * A type is a *kind* of value
      * Types implicitly define what operations make sense on them
      * Lots of different kinds, not just primitives
      * We can make descriptions for all kinds of values
      * The `any` type -- a quick desctiption, what it is, and why it's bad
    * Inference 101
      * Examples
      * TypeScript can figure out types most of the time
      * Two places we'll ask you what the type is: Function boundaries, and later-initialized values
    * Co-learning JavaScript
      * You can+should read existing JS resources
      * Just paste it in and see what happens
      * Consider turning off 'strict' -->
