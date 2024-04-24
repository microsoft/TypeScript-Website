//// { "compiler": { "ts": "4.2.0-beta" } }
// Tuple types are a feature where the position of a type in an
// array is important. For example, in string[] (array) you know that all
// elements in the array are a string, in [string] (tuple) you know that
// only the first element is a string. According to the type system, a
// [string] is an array with only one element, of string.

const stringArray: string[] = ["sugar", "tea", "rum"];
const singleStringTuple: [string] = ["sugar", "tea", "rum"];

// Tuples allow TypeScript to describe arrays like: [string, number] - which
// means that only a string and a number can be used in the first and second
// positions respectively.

const stringNumberTuple: [string, number] = ["Weeks from shore", 2];

// Under the hood, TypeScript uses Tuples to describe parameters for functions
// which you can learn more from in:
//
// - example:tuples
// - example:named-tuples

// What was added in TypeScript 4.2 is the ability to describe functions which
// take an unknown number of parameters but that have a particular start,
// middle or end. This is done via the spread operator ... in a tuple to
// indicate that the number varies (aka: variadic)

// This type represents an unknown number of strings in the array but always
// finishes with an object.
type StringsThenConfig = [...string[], { huh: boolean }];

const firstChorus: StringsThenConfig = ["Blow", "Me Bully boys", "blow", { huh: true }];
const secondChorus: StringsThenConfig = ["We'll take our leave and go", { huh: false }];
const thirdChorus: StringsThenConfig = ["When she dived down below", { huh: true }];

// You can learn more about how the feature has evolved in the beta blog post:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-2-beta/
