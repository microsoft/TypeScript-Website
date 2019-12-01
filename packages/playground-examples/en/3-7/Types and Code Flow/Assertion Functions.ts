//// { compiler: {  }, order: 1 }

// Given JavaScript's flexibility, it can be a good idea to add
// runtime checks to your code to validate your assumptions.

// These are typically called assertions (or invariants) and
// they are small functions which raise errors early when
// your variables don't match up to what you expect.

// Node comes with a function for doing this out of the box,
// it's called assert and it's available without an import.

// We're going to define our own though. This declares a
// function which asserts that the expression called
// value is true:
declare function assert(value: unknown): asserts value;

// Now we're use it to validate the type of an enum
declare const maybeStringOrNumber: string | number
assert(typeof maybeStringOrNumber === "string")

// With TypeScript 3.7, the code flow analysis can use these
// types of functions to figure out what the code is. So,
// when you hover over the variable below - you can see that
// it has been narrowed from a string or number to
// just a string.

maybeStringOrNumber

// You can use assertion functions to make guarantees of
// your types throughout your inferred code, for example
// TypeScript knows that this function will return a
// number without the need to add types to the parameter
// via the above assert declaration.

function multiply(x: any, y: any) {
  assert(typeof x === "number");
  assert(typeof y === "number");

  return x * y;
}

// Assertion functions are siblings to Type Guards
// example:type-guards except they affect the control flow
// when it continues through the function.

// For example, we can use assertion functions to narrow
// an enum down over time:

declare const oneOfFirstFiveNumbers: 1 | 2 | 3 | 4 | 5

declare function isOdd(param: unknown): asserts param is 1 | 3 | 5
declare function isBelowFour(param: unknown): asserts param is 1 | 2 | 3 | 4

// This should cut down the enum to: 1 | 3 | 5

isOdd(oneOfFirstFiveNumbers)
oneOfFirstFiveNumbers

// This will then cut the enum's possible states to: 1 | 3

isBelowFour(oneOfFirstFiveNumbers)
oneOfFirstFiveNumbers

// This is a primer on some of the features of assertion functions
// in TypeScript 3.7 - you can find out more by reading the
// release notes:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
