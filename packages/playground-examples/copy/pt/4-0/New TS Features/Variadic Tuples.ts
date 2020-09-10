//// { compiler: { ts: "4.0.2" } }
// Tuplas variadas oferecem a tuplas a habilidade de tratar o operador rest (...)
// para passar tipo através do verificador de tipos de uma forma que funciona como genéricos.

// Isto é um tópico bastante avançado, então se você se sentir perdido, não se preocupe muito.
// Ele foi construído com o exemplo: generic-functions e tuples.

// Para começar, aqui está uma tupla variada que sempre prefixará outra.
// Tupla com número

type AddMax<T extends unknown[]> = [max: number, ...rest: T];
//          ^ Generic usado para restringir os tipos para T
//                                                ^ ... usado para indicar onde mesclar

// Isto pode então ser usado para composição.
type MaxMin = AddMax<[min: number]>;
type MaxMinDiameter = AddMax<[min: number, diameter: number]>;

// O mesmo pode ser usado após a tupla:
type SuffixDIContext<T extends unknown[]> = [...first: T, context: any];
type DIContainer = SuffixDIContext<[param: string]>;

// Este mecanismo pode ser combinado com vários parâmetros de entrada. Por exemplo, este
// função mescla dois arrays, mas usa '\ 0' como um sigilo para indicar onde os arrays
// começam e terminam.
function joinWithNullTerminators<T extends unknown[], U extends unknown[]>(t: [...T], u: [...U]) {
  return ["\0", ...t, "\0", ...u, "\0"] as const;
}

// TypeScript pode inferir o tipo do retorno da função dessa forma:
const result = joinWithNullTerminators(["variadic", "types"], ["terminators", 3]);

// Essas ferramentas fazem o possível para tipar uma função corretamente como curry
// que é um conceito bem usado em programção funcional

function curry<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...a: T) {
  return (...b: U) => f(...a, ...b);
}

// Há três argumentos genéricos:
// - T: O parâmetro que é o array de entradas para função curry
// - U: O parâmetro que não são passados para função curry e precisam ser aplicados no retorno da função.
// - R: O tipo de retorno da função passada

const sum = (left: number, right: number) => left + right;

const a = curry(sum, 1, 2);
const b = curry(sum, 1)(2);
const c = curry(sum)(1, 2);

// Você pode encontrar uma explicação mais aprofundada com mais código de exemplos em:
// https://github.com/microsoft/TypeScript/pull/39094
