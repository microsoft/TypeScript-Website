---
title: Declarações de variáveis
layout: docs
permalink: /pt/docs/handbook/variable-declarations.html
oneline: Como TypeScript lida com declarações de variáveis
translatable: true
---

`let` e `const`são dois conceitos relativamente novos para declarações de variáveis em JavaScript.
[Como mencionamos anteriormente](/docs/handbook/basic-types.html#a-note-about-let), `let` é similar a `var` em alguns aspectos, mas evita que alguns usuários caiam em momentos "te peguei" em JavaScript.

`const` é uma ampliação de `let` no qual previne reatribuições a uma variável.

Com TypeScript sendo uma extensão de JavaScript, a linguagem naturalmente suporta `let` e `const`.
Aqui iremos nos aprofundar nessas novas declarações e porque elas tem melhor preferência do que `var`.

Se você vem usando JavaScript descuidadamente, a próxima sessão pode ser uma boa maneira de refrescar sua memória.
Se você está intimamente familiarizado com todas as peculiaridades de declarações `var` em JavaScript, talvéz você ache mais fácil pular essa sessão.

## declarações `var`

Tradicionalmente, declarar uma variável em JavaScript sempre foi feito usando a palavra chave `var`.

```ts
var a = 10;
```

Como você ja deve ter descoberto, apenas declaramos a variável chamada `a` com o valor `10`.

Podemos também declarar uma variável dentro de uma função:

```ts
function f() {
  var mensagem = "Olá, mundo!";

  return mensagem;
}
```

e também podemos acessar essas mesmas variáveis através de outras funções:

```ts
function f() {
  var a = 10;
  return function g() {
    var b = a + 1;
    return b;
  };
}

var g = f();
g(); // retorna '11'
```

No exemplo acima, `g` capturou a variável `a` declarada em `f`.
Em qualquer ponto que `g` for chamada, o valor de `a` será atrelado com o valor de `a` em `f`.
Mesmo se `g` for chamada quando `f` tiver terminado de rodar, ela será capaz de acessar e modificar `a`.

```ts
function f() {
  var a = 1;

  a = 2;
  var b = g();
  a = 3;

  return b;

  function g() {
    return a;
  }
}

f(); // retorna '2'
```

## Regras de escopo

Declarações `var` possuem regras de escopo estranhas para aqueles acostumados com outras linguagens.
Veja o exemplo a seguir:

```ts
function f(deveriaInicializar: boolean) {
  if (deveriaInicializar) {
    var x = 10;
  }

  return x;
}

f(true); // retorna '10'
f(false); // retorna 'undefined'
```

Talvez alguns leitores precisem dar uma segunda olhada nesse exemplo.
A variável `x` foi declarada _dentro do bloco `if`_, e mesmo assim fomos capazes de acessa-la de fora daquele bloco.
Isso porque declarações `var` são acessíveis em qualquer lugar dentro da função, módulo, namespace ou escopo global em que estão contidas - o que iremos ver mais à frente - independente do bloco contido.
Algumas pessoas chamam isso _escopo-`var`_ ou _escopo de função_.
Parâmetros também tem escopo de função.

Essas regras de escopo podem causar muitos tipos de erros.
Um problema que elas deixam exacerbado é o fato de que não é um erro declarar a mesma variável várias vezes:

```ts
function sumaMatriz(matriz: number[][]) {
  var soma = 0;
  for (var i = 0; i < matriz.length; i++) {
    var linhaAtual = matriz[i];
    for (var i = 0; i < linhaAtual.length; i++) {
      soma += linhaAtual[i];
    }
  }

  return soma;
}
```

Talvez tenha sido fácil para alguns desenvolvedores JavaScript experientes identificar, mas o loop `for` interno acidentalmente sobrescreve a variável `i` porque `i` faz referência para a mesma variável com escopo de função.
Como desenvolvedores experientes já sabem, tipos similares de bugs escorregam pelo code review e podem ser uma fonte interminável de frustração.

## Captura de peculiaridades em variáveis

Gaste alguns segundos para adivinhar qual é a saída do seguinte trecho de código:

```ts
for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100 * i);
}
```

Para aqueles sem familiaridade, `setTimeout` irá tentar executar a função após um certo numero de milissegundos (esperando, entretanto, qualquer outra coisa parar de rodar).

Preparado? Dê uma olhada:

```
10
10
10
10
10
10
10
10
10
10
```

Muitos desenvolvedores JavaScript estão intimamente familiarizados com esse comportamento, mas se você está surpreso, certamente não esta sozinho.
A maioria das pessoas espera que a saída seja:

```
0
1
2
3
4
5
6
7
8
9
```

Lembra o que mencionamos anteriormente sobre captura de variáveis?
Toda expressão função que passamos para `setTimeout` na verdade faz referencia para `i` do mesmo escopo.

Vamos parar um pouco para entender o que isso significa.
`setTimeout` irá executar a função após determinado numero de milissegundos, _mas apenas_ após o loop `for` ter parado de executar;
Quando o loop `for` parar sua execução, o valor de `i` é `10`.
Então cada vez que a função for chamada irá imprimir `10`!

Uma forma comum de contornar o caso é usar um IIFE - uma Immediately Invoked Function Expression (Expressão de Invocação Imediata) - para capturar `i` a cada iteração:

```ts
for (var i = 0; i < 10; i++) {
  // captura o estado atual de 'i'
  // ao invocar a função com seu valor atual
  (function (i) {
    setTimeout(function () {
      console.log(i);
    }, 100 * i);
  })(i);
}
```

Esse padrão de aparência estranha é, na verdade, bem comum.
O `i` na lista de parâmetros, na verdade, oculta o `i` declarado no loop `for`, mas como demos o mesmo nome para ambos, não temos de modificar muito o corpo do loop.

## Declarações `let`

Até agora você descobriu que `var` tem alguns problemas, o que é precisamente o porque afirmações `let` foram introduzidas.
Independentemente da palavra chave usada, afirmações `let` são escritas da mesma forma que afirmações `var`.

```ts
let ola = "Olá!";
```

A principal diferença não está na sintaxe, mas na semântica, na qual iremos nos aprofundar agora.

## Escopo de bloco

Quando uma variável é declarada usando `let`, usa-se o que alguns chamam de _escopo léxico_ ou _escopo de bloco_.
Diferente de variáveis declaradas com `var` no qual o escopo permeia suas funções, variáveis com escopo de bloco não são visíveis de fora de seus blocos mais próximos ou loop-`for`.

```ts
function f(input: boolean) {
  let a = 100;

  if (input) {
    // Ainda é ok referenciar 'a'
    let b = a + 1;
    return b;
  }

  // Erro: 'b' não existe aqui
  return b;
}
```

Aqui, temos duas variáveis locais `a` e `b`.
O escopo de `a` é limitado ao corpo de `f` em quanto o escopo de `b` é limitado ao bloco `if` na qual está contida.

Variáveis declaradas em uma cláusula `catch` também possuem regras similares de escopo.

```ts
try {
  throw "ah não!";
} catch (e) {
  console.log("Eh bem.");
}

// Erro: 'e' não existe aqui
console.log(e);
```

Outra propriedade de variáveis com escopo de bloco é que elas não podem ser lidas ou escritas antes de serem declaradas.
Enquanto essas variáveis estão "presentes" através de seu escopo, todas apontam para cima até que sua declaração seja parte de sua _zona morta temporal_.
Isso é apenas uma forma sofisticada de dizer que você não pode acessa-las antes da afirmação `let` e por sorte o TypeScript fará com que você saiba disso.

```ts
a++; // ilegal usar `a` antes de ser declarada;
let a;
```

Algo a se notar é que você ainda pode _capturar_ uma variável de escopo antes dela ser declarada.
O único problema é que é ilegal chamar essa função antes da declaração.
Se tivermos como foco ES2015, um ambiente de execução moderno irá lançar um erro; entretanto, atualmente TypeScript é permissívo e não irá reportar isso com um erro.

```ts
function foo() {
  // ok capturar 'a'
  return a;
}

// chamada ilegal 'foo' antes de 'a' ser declarada
// ambiente de execução deveria lançar um erro aqui
foo();

let a;
```

Para mais informações sobre zonas mortas temporais, veja conteúdo relevante no [Mozilla Developer Network](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone_and_errors_with_let).

## Re-declarações e Shadowing

Com declarações `var`, mencionamos que não importa quantas vezes você declara suas variáveis; você tem apenas uma.

```ts
function f(x) {
  var x;
  var x;

  if (true) {
    var x;
  }
}
```

No exemplo acima, todas as declarações de `x` na verdade fazem referencia para _o mesmo_ `x`, e isso é perfeitamente válido.
Isso acaba sendo fonte de erros com frequência.
Felizmente, declarações `let` não são tão permissíveis.

```ts
let x = 10;
let x = 20; // erro: não pode redeclarar 'x' no mesmo escopo
```

Ambas as variáveis não precisam necessáriamente ter escopo de bloco para o TypeScript nos falar que existe um problema.

```ts
function f(x) {
  let x = 100; // erro: interfere com a declaração de parâmetros
}

function g() {
  let x = 100;
  var x = 100; // erro: não pode haver ambas declarações de 'x'
}
```

Isso não quer dizer que uma variável de bloco nunca pode ser declarada com uma variável com escopo de função.
A variável de escopo de bloco precisa apenas ser declarada dentro de um bloco diferente distinguível.

```ts
function f(condicao, x) {
  if (condicao) {
    let x = 100;
    return x;
  }

  return x;
}

f(false, 0); // retorna '0'
f(true, 0); // retorna '100'
```

O ato de introduzir um novo nome em um escopo mais encadeado é chamado _shadowing_.
Isso é meio que uma faca de dois gúmes pois pode introduzir certos bugs por sí só no evento de shadowing acidental, em quanto também pode prevenir certos bugs.
Por exemplo, imagine que tenhamos escrito nossa função anterior `somaMatriz` usando variáveis `let`.

```ts
function somaMatriz(matriz: number[][]) {
  let soma = 0;
  for (let i = 0; i < matriz.length; i++) {
    var linhaAtual = matriz[i];
    for (let i = 0; i < linhaAtual.length; i++) {
      soma += linhaAtual[i];
    }
  }

  return soma;
}
```

Essa versão do loop irá, na verdade, fazer a soma corretamente porque o `i` do loop interior espelha o `i` do loop exterior.
O _shadowing_ deveria _normalmente_ ser evitado com o intuito de escrever código mas claro.
Embora existam alguns cenários onde ele pode se encaixar de forma vantajosa, você deve julgar a melhor forma de usa-lo.

## Captura de variáveis de escopo de bloco

Quando abordamos pela primeira vez a idéia de captura de variáveis com declarações `var`, abordamos de forma breve como variáveis agem quando capturadas.
Para dar uma melhor visão sobre isso, cada vez que um escopo é rodado, ele cria um "ambiente" de variáveis.
Esse ambiente e suas variáveis capturadas podem existir mesmo após tudo em seu escopo tiver terminado de ser executado.

```ts
function aCidadeQueSempreDorme() {
  let getCidade;

  if (true) {
    let cidade = "Seattle";
    getCidade = function () {
      return cidade;
    };
  }

  return getCidade();
}
```

Porque nós capturamos `cidade` de dentro de seu ambiente, ainda somos capazes de acessa-la a pesar do fato de que o bloco `if` terminou sua execução.

Lembre que com nosso exemplo anterior `setTimeout`, adicionamos a necessidade de usar um IIFE para capturar o estado de uma variável para cada iteração do loop `for`.
Na prática, o que estávamos fazendo era criar uma nova variável de ambiente para nossas variáveis capturadas.
Isso foi um pouco doloroso, mas felizmente, você nunca terá de fazer isso em TypeScript de novo.

Declarações `let` tem um comportamento drasticamente diferentes quando declaradas como parte de um loop.
Além de apenas introduzir um novo ambiente ao próprio loop, essas declarações meio que criam um novo escopo _por iteração_.
Como isso é o que estamos fazendo de qualquer forma com nosso IIFE, nós podemos mudar nosso exemplo antigo `setTimeout` para usar apenas uma declaração `let`.

```ts
for (let i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100 * i);
}
```

como esperado, isso irá imprimir

```
0
1
2
3
4
5
6
7
8
9
```

## Declarações `const`

Declarações `const` são outra forma de declarar variáveis.

```ts
const numVidasParaPorGato = 9;
```

Elas são como declarações `let` mas, como seu nome indica, seu valor não pode ser alterado uma vez que o mesmo é delimitado.
Em outras palavras, elas tem a mesma regra de escopo de `let`, mas você não pode reatribui-las.

Isso não deveria ser confundido com a idéia de que os valores nos quais elas fazem referência são _imutáveis_.

```ts
const numVidasParaPorGato = 9;
const gatinho = {
  nome: "Aurora",
  numVidas: numVidasParaPorGato,
};

// Erro
gatinho = {
  name: "Danielle",
  numVidas: numVidasParaPorGato,
};

// tudo "okay"
gatinho.nome = "Rory";
gatinho.nome = "Kitty";
gatinho.nome = "Cat";
gatinho.numVidas--;
```

A não ser que você tome medidas específicas para evitar, o estado interior de uma variável `const` ainda é modificável.
Felizmente, TypeScript te permite especificar que membros de um objeto são `readonly`.
O [capítulo sobre Interfaces](/docs/handbook/interfaces.html) tem mais detalhes.

## `let` vs. `const`

Dado que temos dois tipos de declarações com semântica de escopo similares, é natural nos perguntarmos qual usar.
Como a maioria das perguntas amplas, a resposta é: depende.

Aplicando o [princípio do menos privilegiado](https://wikipedia.org/wiki/Principle_of_least_privilege), todas declarações além daquelas que você planeja modificar deveriam usar `const`.

A justificativa é que, se uma variável não precisa ser escrita, outros trabalhando na mesma base de dados não deveriam ser possibilitados de escrever automaticamente no objeto, e precisarão considerar quando eles realmente precisam reatribuir para a variável.
Usando `const` também faz o código mais previsível quando se está raciocinando sobre o fluxo de dados.

Use seu melhor julgamento, e se aplicável, consulte o assunto com o resto de seu time.

A maioria desse manual usa declarações `let`.

## Desestruturação

Outra funcionalidade do ECMAScript 2015 que o TypeScript tem é desestruturação.

Para uma referência completa, veja [o artigo na Mozilla Developer Network](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
Nessa sessão, daremos uma visão geral breve.

## Desestruturação de Array

A forma mais simples de desestruturação são atribuições de desestruturação de arrays:

```ts
let entrada = [1, 2];
let [primeiro, segundo] = entrada;
console.log(primeiro); // retorna saída 1
console.log(segundo); // retorna saída 2
```

Isso cria duas novas variáveis chamadas `primeiro` e `segundo`.
Isso é equivalente a usar indexação, mas é muito mais conveniente:

```ts
primeiro = entrada[0];
segundo = entrada[1];
```

Desestruturação também funciona com variáveis ja declaradas:

```ts
// variáveis de troca
[primeiro, segundo] = [segundo, primeiro];
```

E com parâmetros para uma função:

```ts
function f([primeiro, segundo]: [number, number]) {
  console.log(primeiro);
  console.log(segundo);
}
f([1, 2]);
```

Você pode criar uma variável para os itens restantes da lista usando a sintaxe `...`:

```ts
let [primeiro, ...restante] = [1, 2, 3, 4];
console.log(primeiro); // retorna saída 1
console.log(restante); // retorna saída [ 2, 3, 4 ]
```

Claro, como isso é JavaScript, você pode apenas ignorar elementos finais que não se importa:

```ts
let [primeiro] = [1, 2, 3, 4];
console.log(primeiro); // retorna saída 1
```

Ou outros elementos:

```ts
let [, segundo, , quarto] = [1, 2, 3, 4];
console.log(segundo); // retorna saída 2
console.log(quarto); // retorna saída 4
```

## Desestruturação de Tupla

Tuplas podem ser desestruturadas como arrays; as variáveis de desestruturação pegam os tipos dos elementos tupla correspondentes:

```ts
let tupla: [number, string, boolean] = [7, "olá", true];

let [a, b, c] = tupla; // a: number, b: string, c: boolean
```

É um erro desestruturar a tupla além do limite de seus elementos:

```ts
let [a, b, c, d] = tupla; // Erro, sem elementos no index 3
```

Como nos arrays, você pode desestruturar o resto da tupla com `...`, para obter uma tupla mais curta:

```ts
let [a, ...bc] = tupla; // bc: [string, boolean]
let [a, b, c, ...d] = tupla; // d: [], a tupla vazia
```

Ou ignorar elementos finais, ou outros elementos:

```ts
let [a] = tupla; // a: number
let [, b] = tupla; // b: string
```

## Desestruturação de Objetos

Você também pode desestruturar objetos:

```ts
let o = {
  a: "foo",
  b: 12,
  c: "bar",
};
let { a, b } = o;
```

Isso cria novas variáveis `a` e `b` a partir de `o.a` e `o.b`.
Perceba que você pode pular `c` se você não o quiser.

Como desestruturação de arrays, você pode ter atribuições sem declarações:

```ts
({ a, b } = { a: "baz", b: 101 });
```

Perceba que tivemos que cercar esse elemento com parêntesis.
JavaScript normalmente analisa um `{` como o começo do bloco.

Você pode criar uma variável para o restante dos itens em um objeto usando a sintaxe `...`:

```ts
let { a, ...atravessando } = o;
let total = atravessando.b + atravessando.c.length;
```

### Renomeação de propriedades

Você também pode dar nomes diferentes para propriedades:

```ts
let { a: novoNome1, b: novoNome2 } = o;
```

Aqui a sintaxe começa a ficar confusa.
Você pode ler `a: novoNome1` como "`a` sendo `novoNome1`".
A direção é esquerda para direita, como se você tivesse escrito:

```ts
let novoNome1 = o.a;
let novoNome2 = o.b;
```

De forma confusa, os dois pontos _não_ indicam o tipo.
O tipo, se você o especificar, ainda precisa ser escrito após toda desestruturação:

```ts
let { a, b }: { a: string; b: number } = o;
```

### Valores padrão

Valores padrão te permitem especificar um valor caso a propriedade seja `undefined`:

```ts
function mantenhaObjetoInteiro(objetoInteiro: { a: string; b?: number }) {
  let { a, b = 1001 } = objetoInteiro;
}
```

Nesse exemplo o `b?` indica que `b` é opcional, então ele pode ser `undefined`.
`mantenhaObjetoInteiro` agora tem uma variável para `objetoInteiro` assim como as propriedades `a` e `b`, mesmo se `b` for `undefined`.

## Declaração de Funções

Desestruturação também funciona em declarações de funções.
Para casos simples é bem descomplicado:

```ts
type C = { a: string; b?: number };
function f({ a, b }: C): void {
  // ...
}
```

Mas especificar valores padrões é mais comum para parâmetros, e ter valores padrão de forma correta com desestruturação pode ser complicado.
Primeiro, você precisa lembrar de por a padronização antes do valor padrão.

```ts
function f({ a = "", b = 0 } = {}): void {
  // ...
}
f();
```

> O código acima é um exemplo de inferência de tipo, explicado anteriormente nesse manual.

Então, você precisa lembrar de prover um valor padrão para parâmetros opcionais na propriedade desestruturada ao invés do inicializador principal.
Lembre que `C` foi definida com `b` opcional:

```ts
function f({ a, b = 0 } = { a: "" }): void {
  // ...
}
f({ a: "sim" }); // ok, padrão b = 0
f(); // ok, padrão para { a: "" }, no qual então define padrão b = 0
f({}); // erro, 'a' é requerido se você fornecer um argumento
```

Use desestruturação com cuidado.
Como os exemplos anteriores demonstram, qualquer coisa a mais do que desestruturação simples é confuso.
Isso é especialmente verdade com desestruturação em encadeamentos profundos, que fica _realmente_ difícil de entender mesmo sem empilhamento, renomeação, valores padrão e anotações de tipo.
Tente manter expressões de desestruturação pequenas e simples.
Você pode sempre escrever as atribuições que a desestruturação geraria.

## Propagação

O operador de propagação é o oporto do de desestruturação.
Ele te permite propagar um array para outro array, ou um objeto para outro objeto.
Por exemplo:

```ts
let primeiro = [1, 2];
let segundo = [3, 4];
let ambosMais = [0, ...primeiro, ...segundo, 5];
```

Isso dá a `ambosMais` o valor `[0, 1, 2, 3, 4, 5]`.
Propagação cria uma cópia rasa de `primeiro` e `segundo`.
Eles não são modificados pela propagação.

Você também pode propagar objetos:

```ts
let padroes = { comida: "apimentada", preco: "$$", ambiente: "barulhento" };
let busca = { ...padroes, comida: "rica" };
```

Agora `busca` é `{ comida: "rica", preco: "$$", ambiente: "barulhento" }`.
Propagação de objetos é mais complexo do que propagação de array.
Como propagação de array, procede-se da esquerda para direita, mas o resultado ainda é um objeto.
Isso significa que propriedades que vem depois no objeto propagado sobrescrevem propriedades que vieram anteriormente.
Então se modificarmos o exemplo anterior para propagar no final:

```ts
let padroes = { comida: "apimentada", preco: "$$", ambiente: "barulhento" };
let busca = { comida: "rica", ...padroes };
```

Então a propriedade `comida` em `padroes` sobrescreve `comida: "rica"`, o que não é o que queremos nesse caso.

Propagação de objetos também possui outros limites surpreendentes.
Primeiro, ele apenas inclui [as próprias propriedades enumeradas](https://developer.mozilla.org/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) de um objeto.
Basicamente, isso significa que você perde métodos quando propaga instancias de um objeto:

```ts
class C {
  p = 12;
  m() {}
}
let c = new C();
let clone = { ...c };
clone.p; // ok
clone.m(); // erro!
```

Segundo, o compilador TypeScript não permite propagação do tipo dos parâmetros para funções genéricas.
Essa funcionalidade é esperada em versões futuras da linguagem.
