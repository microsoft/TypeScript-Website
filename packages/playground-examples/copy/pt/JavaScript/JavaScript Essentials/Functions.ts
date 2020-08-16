//// { order: 2, compiler: { noImplicitAny: false } }

//Existem várias maneiras de declarar uma função em JavaScript.
//Vejamos uma função que adiciona dois números:

//Crie uma função de escopo global chamado addOldSchool
function addOldSchool(x, y) {
  return x + y;
}

//Você pode mover o nome da função para uma variável também
const anonymousOldSchoolFunction = function (x, y) {
  return x + y;
};

//Você pode também usar a forma abreviada de uma Arrow Function
const addFunction = (x, y) => {
  return x + y;
};

//Nós iremos focar na última forma, porém tudo se aplica para
//os três formatos

//TypeScript fornece uma sintaxe adicional para a 
//definição da função e dá dicas de quais tipagens são
//esperadas por essa função
//
//A seguir temos uma versão simples da função de adicionar,
//a qual recebe dois parametros de qualquer tipagem (any): 
//poderiam ser passadas strings, números ou objetos.

const add1 = (x: any, y: any) => {
  return x + y;
};
add1("Hello", 23);

//Isso é legítimo em JavaScript (strings podem ser 
//adicionados como esse exemplo), porém não é o ideal para 
//nossa função, que sabemos que é para números, portanto
//iremos converter os parametros x e y para receberem somente números.

const add2 = (x: number, y: number) => {
  return x + y;
};
add2(16, 23);
add2("Hello", 23);

//Ótimo. Nós receberemos um erro quando algo que não seja um número
//for passado. Se você passar o mouse sbre a palavra add2 acima, verá
//que o TypeScript os descreve como:
//
//   const add2: (x: number, y: number) => number
//
//Onde foi deduzido que, quando os dois parametros são números,
//o único tipo de retorno possível é um número.
//Isso é ótimo, você não precisa escrever sintaxe extra.
//Vejamos o que é preciso para fazer isso:

const add3 = (x: number, y: number): string => {
  return x + y;
};

//Essa função falha porque informamos ao TypeScript 
//que ela deveria retornar uma string, mas a função 
//não cumpriu com o esperado.

const add4 = (x: number, y: number): number => {
  return x + y;
};

//Isso é uma versão mais explícita de add2 - Existem casos
//em que você talvez queira usar uma sintaxe explícita do tipo 
//de retorno para dar espaço para trabalhar antes de começar.
//Um pouco como o desenvolvimento orientado a testes (TDD) recomenda
//começar com um teste com falha, mas nesse caso, é com o formato
//de uma função com falha.

//Este exemplo é apenas uma introdução, você pode aprender muito mais
//como as funções funcionam no TypeScript no manual e na
//seção de exemplos de JavaScript Funcional:
//
// https://www.typescriptlang.org/docs/handbook/functions.html
// example:function-chaining

//E para continuar nosso tour pelos fundamentos do JavaScript,
//veremos como o fluxo de código afeta a tipagem do TypeScript:
//example:code-flow
