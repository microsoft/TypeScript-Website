//// { compiler: { ts: "4.0.2" } }
// Tuplas Variádicas dão às tuplas a abilidate de utilizar o operador rest (...)
// para passar tipos através do verificador de tipos de uma forma que funciona
// como generics.

// Este é um tópico bastante avançado, então se você se sentir perdido não se preocupe.
// Baseia-se no example:generic-functions e example:tuples

// Para começar, aqui está uma tupla variádica que sempre prefixa outra tupla
// com um número

type AddMax<T extends unknown[]> = [max: number,  ...rest: T];
//          ^ Generic usada para restringir o T
//                                                ^ ... usado para indicar onde mesclar

// Isso pode ser usado para composição:
type MaxMin = AddMax<[min: number]>
type MaxMinDiameter = AddMax<[min: number, diameter: number]>

// O mesmo pode ser usado após a tupla:
type SuffixDIContext<T extends unknown[]> = [...first: T, context: any];
type DIContainer = SuffixDIContext<[param: string]>

// Este mecanismo pode ser combinado com múltiplos parâmetros de entrada. Por exemplo,
// esta função mescla dois arrays, mas usa '\0' como uma chave para indicar onde os arrays
// começam e terminam.
function joinWithNullTerminators<T extends unknown[], U extends unknown[]>(t: [...T], u: [...U]) {
    return ['\0', ...t, '\0', ...u, '\0'] as const;
}

// O TypeScript pode inferir o tipe de retorno de uma função dessa forma:
const result = joinWithNullTerminators(['variadic', 'types'], ["terminators", 3]);

// Essas ferramentas tornam possível tipar corretamente uma função como curry,
// um conceito muito usado na programação funcional

function curry<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...a: T) {
    return (...b: U) => f(...a, ...b);
}

// Há três argumentos generics
// - T: Os parâmetros que são um array de entradas para a função curry
// - U: Os parâmetros que _não_ são passados na função curry, e precisam ser aplicados à função de retorno
// - R: O tipo de retorno da função passada

const sum = (left: number, right: number,) => left + right

const a = curry(sum, 1, 2)
const b = curry(sum, 1)(2)
const c = curry(sum)(1, 2)

// Você pode encontrar uma explicação mais detalhada, com mais exemplos de código em:
// https://github.com/microsoft/TypeScript/pull/39094

 