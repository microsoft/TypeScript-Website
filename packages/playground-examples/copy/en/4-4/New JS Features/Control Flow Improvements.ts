//// { "compiler": { "ts": "4.4.2" } }
// Control Flow Analysis is the name for the system which
// narrows the potential types an identifier can be based
// on the code someone has wrote, you can get an overview
// in example:type-widening-and-narrowing

// Roughly, Control Flow Analysis lets you write code like
// the following:

declare const userInput: string | number;
if (typeof userInput === "string") {
  userInput; // string
} else {
  userInput; // number
}

// In this case, prior to TypeScript 4.4, code flow analysis
// would only be applied to the code inside the if statement.
// This meant that a very simple refactor like the following:

const isString = typeof userInput === "string";

// Would have _not_ had control flow analysis applied:

if (isString) {
  userInput; // string | number in 4.3
} else {
  userInput; // string | number in 4.3
}

// In TypeScript 4.4 - the version you're currently on, the control flow
// analysis can handle this sort of code. This works when TypeScript
// can make reasonable assumptions that the variable hasn't changed since
// it was created. For example, a `let` would not be able to be used
// in analysis:

let isString2 = typeof userInput === "string";
if (isString2) {
  userInput; // string | number in 4.4
} else {
  userInput; // string | number in 4.4
}

// For full details see:
// https://github.com/microsoft/TypeScript/pull/44730
