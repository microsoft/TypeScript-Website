//// { compiler: {  }, order: 1 }

// Dada a flexibilidade do JavaScript, pode ser uma boa ideia
// adicionar verificações em tempo de execução ao seu código
// para validar suas suposições.

// Normalmente são chamadas de asserções (ou invariantes) e
// são pequenas funções que geram erros no início, quando
// suas variáveis não correspondem ao que você espera.

// O Node vem com uma função pronta para fazer isso,
// é chamada de assert e está disponível sem importação.

// No entanto, vamos definir a nossa própria. Isso declara
// uma função que afirma que a expressão chamada value é
// verdadeira:
declare function assert(value: unknown): asserts value;

// Agora vamos usá-la para validar o tipo de enum
declare const maybeStringOrNumber: string | number;
assert(typeof maybeStringOrNumber === "string");

// Com o TypeScript 3.7, a análise do fluxo de código pode
// usar esses tipos de funções para descobrir o que é o
// código. Então, quando você passa o mouse sobre a
// variável abaixo - você pode ver que ela foi reduzida
// de uma string ou número para apenas uma string.

maybeStringOrNumber;

// Você pode usar funções assert para garantir seus
// tipos em todo o código inferido, por exemplo, o
// TypeScript sabe que essa função retornará um número
// sem a necessidade de adicionar tipos ao parâmetro por
// meio da declaração de assert acima.

function multiply(x: any, y: any) {
  assert(typeof x === "number");
  assert(typeof y === "number");

  return x * y;
}

// As funções de asserção são irmãs das Type Guards
// example:type-guards com exceção de afetar o fluxo de
// controle quando ele continua através da função.

// Por exemplo, podemos usar funções de asserção para
// restringir um enum ao longo do tempo:

declare const oneOfFirstFiveNumbers: 1 | 2 | 3 | 4 | 5;

declare function isOdd(param: unknown): asserts param is 1 | 3 | 5;
declare function isBelowFour(param: unknown): asserts param is 1 | 2 | 3 | 4;

// Isso deve reduzir o enum para: 1 | 3 | 5

isOdd(oneOfFirstFiveNumbers);
oneOfFirstFiveNumbers;

// Isso cortará os possíveis estados do enum para: 1 | 3

isBelowFour(oneOfFirstFiveNumbers);
oneOfFirstFiveNumbers;

// Esta é uma introdução sobre alguns dos recursos das
// funções de asserção no TypeScript 3.7 - você pode
// descobrir mais lendo as notas de lançamento:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
