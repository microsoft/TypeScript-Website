---
title: Variable Declaration
layout: docs
permalink: /pt/docs/handbook/variable-declarations.html
oneline: How TypeScript handles variable declaration
translatable: true
---

`let` e `const`são dois conceitos relativamente novos para declarações de variáveis em JavaScript.
[Como mencionamos anteriormente](/docs/handbook/basic-types.html#a-note-about-let), `let` é similar a `var` em alguns aspectos, mas evita que alguns usuários caiam em momentos "te peguei" em JavaScript. 

`const` é uma ampliação de `let` no qual previne re atribuições a uma variável.

Com TypeScript sendo uma extensão de JavaScript, a linguagem naturalmente suporta `let` e `const`.
Aqui iremos nos aprofundar nessas novas declarações e porque elas tem melhor preferência do que `var`.

Se você vem usando JavaScript descuidadamente, a próxima sessão pode ser uma boa maneira de refrescar sua memória. 
Se você está intimamente familiarizado com todas as peculiaridades de declarações `var` em JavaScript, talvéz você ache mais fácil pular a sessão.

## declarações `var` 

Tradicionalmente declarar uma variável em JavaScript sempre foi feito usando a palavra chave `var`.

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
Em qualquer ponto que `g` for chamada, o valor de `a` será amarrado com o valor de `a` em `f`.
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
Isso porque declarações `var` são acessíveis em qualquer lugar dentro da função, modulo, namespace ou escopo global em que estão contidas - o que iremos ver tudo sobre à frente - independente do bloco contido.
Algumas pessoas chamam isso _`var`-scoping_ ou _function-scoping_.
Parâmetros também tem escopo de função.

Essas regras de escopo podem causar muitos tipos de erros.
Um problema que ele deixa exacerbado é o fato de que não é um erro declarar a mesma variável várias vezes:

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

Talvez tenha sido fácil para alguns desenvolvedores JavaScript experientes identificar, mas o `for`-loop interno acidentalmente sobrescreve a variável `i` porque `i` faz referência para a mesma variável com escopo de função.
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

Preparado ? Dê uma olhada:

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
A maioria das pessoas espera que a saída seja

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

Lembra o que mencionamos anteriormente sobre captura de variáveis ?
Toda expressão função que passamos para `setTimeout` na verdade faz referencia para `i` do mesmo escopo.

Vamos parar um pouco para entender o que isso significa.
`setTimeout` irá executar a função após determinado numero de milissegundos, _mas apenas_ após o loop `for` ter parado de executar;
Quando o loop `for` parar sua execução, o valor de `i` é `10`.
Então cada vez que a função for chamada irá imprimir `10`!

Uma forma comum de contornar o caso é usar um IIFE - uma Immediately Invoked Function Expression (Função Expressão de Invocação imediata) - para capturar `i` a cada iteração:

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

Aa principal diferença não está na sintaxe, mas na semântica, na qual iremos nos aprofundar agora. 

## Escopo de bloco

Quando uma variável é declarada usando `let`, usa o que alguns chama de _escopo-lexical_ ou _escopo-de-bloco_.
Diferente de variáveis declaradas com `var` no qual o escopo permeia suas funções, variáveis com escopo de bloco não são visíveis de fora de seus 
blocos mais próximos ou loop-`for`.

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

Variáveis declaradas em uma cláusula `cathc` também possuem regras similares de escopo.

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
Isso é apenas uma forma sofisticada de dizer que você não pode acessa-las antes da afirmação `let`, por sorte o TypeScript fará com que você saiba disso.

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

Essa versão do loop irá na verdade fazer a soma corretamente porque o `i` do loop interior espelha `i` do loop exterior.
Espelhamento deveria _usualmente_ ser evitado com o intúito de escrever código mas claro.
While there are some scenarios where it may be fitting to take advantage of it, you should use your best judgement.

## Block-scoped variable capturing

When we first touched on the idea of variable capturing with `var` declaration, we briefly went into how variables act once captured.
To give a better intuition of this, each time a scope is run, it creates an "environment" of variables.
That environment and its captured variables can exist even after everything within its scope has finished executing.

```ts
function theCityThatAlwaysSleeps() {
  let getCity;

  if (true) {
    let city = "Seattle";
    getCity = function () {
      return city;
    };
  }

  return getCity();
}
```

Because we've captured `city` from within its environment, we're still able to access it despite the fact that the `if` block finished executing.

Recall that with our earlier `setTimeout` example, we ended up needing to use an IIFE to capture the state of a variable for every iteration of the `for` loop.
In effect, what we were doing was creating a new variable environment for our captured variables.
That was a bit of a pain, but luckily, you'll never have to do that again in TypeScript.

`let` declarations have drastically different behavior when declared as part of a loop.
Rather than just introducing a new environment to the loop itself, these declarations sort of create a new scope _per iteration_.
Since this is what we were doing anyway with our IIFE, we can change our old `setTimeout` example to just use a `let` declaration.

```ts
for (let i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100 * i);
}
```

and as expected, this will print out

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

## `const` declarations

`const` declarations are another way of declaring variables.

```ts
const numLivesForCat = 9;
```

They are like `let` declarations but, as their name implies, their value cannot be changed once they are bound.
In other words, they have the same scoping rules as `let`, but you can't re-assign to them.

This should not be confused with the idea that the values they refer to are _immutable_.

```ts
const numLivesForCat = 9;
const kitty = {
  name: "Aurora",
  numLives: numLivesForCat,
};

// Error
kitty = {
  name: "Danielle",
  numLives: numLivesForCat,
};

// all "okay"
kitty.name = "Rory";
kitty.name = "Kitty";
kitty.name = "Cat";
kitty.numLives--;
```

Unless you take specific measures to avoid it, the internal state of a `const` variable is still modifiable.
Fortunately, TypeScript allows you to specify that members of an object are `readonly`.
The [chapter on Interfaces](/docs/handbook/interfaces.html) has the details.

## `let` vs. `const`

Given that we have two types of declarations with similar scoping semantics, it's natural to find ourselves asking which one to use.
Like most broad questions, the answer is: it depends.

Applying the [principle of least privilege](https://wikipedia.org/wiki/Principle_of_least_privilege), all declarations other than those you plan to modify should use `const`.
The rationale is that if a variable didn't need to get written to, others working on the same codebase shouldn't automatically be able to write to the object, and will need to consider whether they really need to reassign to the variable.
Using `const` also makes code more predictable when reasoning about flow of data.

Use your best judgement, and if applicable, consult the matter with the rest of your team.

The majority of this handbook uses `let` declarations.

## Destructuring

Another ECMAScript 2015 feature that TypeScript has is destructuring.
For a complete reference, see [the article on the Mozilla Developer Network](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
In this section, we'll give a short overview.

## Array destructuring

The simplest form of destructuring is array destructuring assignment:

```ts
let input = [1, 2];
let [first, second] = input;
console.log(first); // outputs 1
console.log(second); // outputs 2
```

This creates two new variables named `first` and `second`.
This is equivalent to using indexing, but is much more convenient:

```ts
first = input[0];
second = input[1];
```

Destructuring works with already-declared variables as well:

```ts
// swap variables
[first, second] = [second, first];
```

And with parameters to a function:

```ts
function f([first, second]: [number, number]) {
  console.log(first);
  console.log(second);
}
f([1, 2]);
```

You can create a variable for the remaining items in a list using the syntax `...`:

```ts
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // outputs 1
console.log(rest); // outputs [ 2, 3, 4 ]
```

Of course, since this is JavaScript, you can just ignore trailing elements you don't care about:

```ts
let [first] = [1, 2, 3, 4];
console.log(first); // outputs 1
```

Or other elements:

```ts
let [, second, , fourth] = [1, 2, 3, 4];
console.log(second); // outputs 2
console.log(fourth); // outputs 4
```

## Tuple destructuring

Tuples may be destructured like arrays; the destructuring variables get the types of the corresponding tuple elements:

```ts
let tuple: [number, string, boolean] = [7, "hello", true];

let [a, b, c] = tuple; // a: number, b: string, c: boolean
```

It's an error to destructure a tuple beyond the range of its elements:

```ts
let [a, b, c, d] = tuple; // Error, no element at index 3
```

As with arrays, you can destructure the rest of the tuple with `...`, to get a shorter tuple:

```ts
let [a, ...bc] = tuple; // bc: [string, boolean]
let [a, b, c, ...d] = tuple; // d: [], the empty tuple
```

Or ignore trailing elements, or other elements:

```ts
let [a] = tuple; // a: number
let [, b] = tuple; // b: string
```

## Object destructuring

You can also destructure objects:

```ts
let o = {
  a: "foo",
  b: 12,
  c: "bar",
};
let { a, b } = o;
```

This creates new variables `a` and `b` from `o.a` and `o.b`.
Notice that you can skip `c` if you don't need it.

Like array destructuring, you can have assignment without declaration:

```ts
({ a, b } = { a: "baz", b: 101 });
```

Notice that we had to surround this statement with parentheses.
JavaScript normally parses a `{` as the start of block.

You can create a variable for the remaining items in an object using the syntax `...`:

```ts
let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length;
```

### Property renaming

You can also give different names to properties:

```ts
let { a: newName1, b: newName2 } = o;
```

Here the syntax starts to get confusing.
You can read `a: newName1` as "`a` as `newName1`".
The direction is left-to-right, as if you had written:

```ts
let newName1 = o.a;
let newName2 = o.b;
```

Confusingly, the colon here does _not_ indicate the type.
The type, if you specify it, still needs to be written after the entire destructuring:

```ts
let { a, b }: { a: string; b: number } = o;
```

### Default values

Default values let you specify a default value in case a property is undefined:

```ts
function keepWholeObject(wholeObject: { a: string; b?: number }) {
  let { a, b = 1001 } = wholeObject;
}
```

In this example the `b?` indicates that `b` is optional, so it may be `undefined`.
`keepWholeObject` now has a variable for `wholeObject` as well as the properties `a` and `b`, even if `b` is undefined.

## Function declarations

Destructuring also works in function declarations.
For simple cases this is straightforward:

```ts
type C = { a: string; b?: number };
function f({ a, b }: C): void {
  // ...
}
```

But specifying defaults is more common for parameters, and getting defaults right with destructuring can be tricky.
First of all, you need to remember to put the pattern before the default value.

```ts
function f({ a = "", b = 0 } = {}): void {
  // ...
}
f();
```

> The snippet above is an example of type inference, explained later in the handbook.

Then, you need to remember to give a default for optional properties on the destructured property instead of the main initializer.
Remember that `C` was defined with `b` optional:

```ts
function f({ a, b = 0 } = { a: "" }): void {
  // ...
}
f({ a: "yes" }); // ok, default b = 0
f(); // ok, default to { a: "" }, which then defaults b = 0
f({}); // error, 'a' is required if you supply an argument
```

Use destructuring with care.
As the previous example demonstrates, anything but the simplest destructuring expression is confusing.
This is especially true with deeply nested destructuring, which gets _really_ hard to understand even without piling on renaming, default values, and type annotations.
Try to keep destructuring expressions small and simple.
You can always write the assignments that destructuring would generate yourself.

## Spread

The spread operator is the opposite of destructuring.
It allows you to spread an array into another array, or an object into another object.
For example:

```ts
let first = [1, 2];
let second = [3, 4];
let bothPlus = [0, ...first, ...second, 5];
```

This gives bothPlus the value `[0, 1, 2, 3, 4, 5]`.
Spreading creates a shallow copy of `first` and `second`.
They are not changed by the spread.

You can also spread objects:

```ts
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { ...defaults, food: "rich" };
```

Now `search` is `{ food: "rich", price: "$$", ambiance: "noisy" }`.
Object spreading is more complex than array spreading.
Like array spreading, it proceeds from left-to-right, but the result is still an object.
This means that properties that come later in the spread object overwrite properties that come earlier.
So if we modify the previous example to spread at the end:

```ts
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { food: "rich", ...defaults };
```

Then the `food` property in `defaults` overwrites `food: "rich"`, which is not what we want in this case.

Object spread also has a couple of other surprising limits.
First, it only includes an objects'
[own, enumerable properties](https://developer.mozilla.org/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
Basically, that means you lose methods when you spread instances of an object:

```ts
class C {
  p = 12;
  m() {}
}
let c = new C();
let clone = { ...c };
clone.p; // ok
clone.m(); // error!
```

Second, the TypeScript compiler doesn't allow spreads of type parameters from generic functions.
That feature is expected in future versions of the language.
