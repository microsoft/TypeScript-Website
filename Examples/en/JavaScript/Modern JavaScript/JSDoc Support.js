//// { order: 3, isJavaScript: true }

// TypeScript has very rich JSDoc support, for a lot of cases
// you can even skip making your files .ts and just use JSDoc
// annotations to create a rich development environment.
//
// A JSDoc comment is a multi-line comment which starts with
// two stars instead of one.

/* This is a normal comment */
/** This is a JSDoc comment */

// JSDoc comments become attached to the closest JavaScript
// code below it.

const myVariable = "Hi";

// If you hover over myVariable, you can see that it has the
// text from inside the JSDoc comment attached.

// JSDoc comments are a way to provide type information to
// TypeScript and your editors. Let's start with an easy one
// setting a variable's type to a built-in type

// For all of these examples, you can hover over the name,
// and on the next line try write [example]. to see the
// auto-complete options.

/** @type {number} */
var myNumber;

// You can see all of the supported tags inside the handbook
// https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc
//
// However, we'll try go through some of the more common examples
// in here, you can also copy & paste any examples from the handbook
// into here.

// Importing the types for JavaScript configuration files:

/** @type { import("webpack").Config } */
const config = {};

// Creating a complex type to re-use in many places:

/**
 * @typedef {Object} User - a User account
 * @property {string} displayName - the name used to show the user
 * @property {number} id - a unique id
 */

// Then use it by referencing the typedef's name:

/** @type { User } */
const user = {};

// There's TypeScript compatible inline type shorthand, which
// you can use for both type and typedef

/** @type {{ owner: User, name: string }} */
const resource;

/** @typedef {{owner: User, name: string} Resource */

/** @type {Resource} */
const otherResource;

// Declaring a typed function

/**
 * Adds two numbers together
 * @param a {number} The first number
 * @param b {number} The second number
 * @returns {number}
 */
function addTwoNumbers(a, b) {
  return a + b;
}

// You can use most of TypeScript's type tools, like unions

/** @type {(string | boolean)} */
let stringOrBoolean = "";
stringOrBoolean = false;

// Extending globals in JSDoc is a more involved process
// which you can see in the VS Code docs
// https://code.visualstudio.com/docs/nodejs/working-with-javascript#_global-variables-and-type-checking

// Adding JSDoc comments to your functions is a win-win
// situation, you get better tooling and so do all your
// API consumers.
