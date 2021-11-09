//// { "compiler": { "ts": "4.0.2" } }
// Variadic Tuples gives tuples the ability to handle the rest operator (...)
// to pass types through type checker in a way that works like generics.

// This is quite an advanced topic, so if you get lost do not worry too much.
// It builds on example:generic-functions and example:tuples

// To start off, here is a variadic tuple which will always prefix another
// tuple with a number:

type AddMax<T extends unknown[]> = [max: number, ...rest: T];
//          ^ Generic used to constrain the T
//                                                ^ ... used to indicate where to merge

// This can then be used for composition:
type MaxMin = AddMax<[min: number]>
type MaxMinDiameter = AddMax<[min: number, diameter: number]>

// The same can be used after the tuple:
type SuffixDIContext<T extends unknown[]> = [...first: T, context: any];
type DIContainer = SuffixDIContext<[param: string]>

// This mechanism can be combined with multiple input params. For example, this
// function merges two arrays but uses '\0' as a sigil to indicate where the arrays 
// start and stop.
function joinWithNullTerminators<T extends unknown[], U extends unknown[]>(t: [...T], u: [...U]) {
    return ['\0', ...t, '\0', ...u, '\0'] as const;
}

// TypeScript can infer the return type of a function like this:
const result = joinWithNullTerminators(['variadic', 'types'], ["terminators", 3]);

// These tools make it possible to correctly type a function like curry which
// is a well used concept in functional programming:

function curry<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...a: T) {
    return (...b: U) => f(...a, ...b);
}

// There are three generic arguments:
// - T: The params which are array of inputs to the curry function
// - U: The parameters which _aren't_ passed into to curry function, and need applying to the return func
// - R: the return type of the passed in function

const sum = (left: number, right: number,) => left + right

const a = curry(sum, 1, 2)
const b = curry(sum, 1)(2)
const c = curry(sum)(1, 2)

// You can find a more indepth explanation, with more code samples in
// https://github.com/microsoft/TypeScript/pull/39094

