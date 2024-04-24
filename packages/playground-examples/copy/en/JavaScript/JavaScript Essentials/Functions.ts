//// { "order": 2, "compiler": { "noImplicitAny": false } }

// There are quite a few ways to declare a function in
// JavaScript. Let's look at a function which adds two
// numbers together:

// Creates a function in global scope called addOldSchool
function addOldSchool(x, y) {
  return x + y;
}

// You can move the name of the function to a variable
// name also
const anonymousOldSchoolFunction = function (x, y) {
  return x + y;
};

// You can also use fat-arrow shorthand for a function
const addFunction = (x, y) => {
  return x + y;
};

// We're going to focus on the last one, but everything
// applies to all three formats.

// TypeScript provides additional syntax which adds to a
// function definition and offers hints on what types
// are expected by this function.
//
// Up next is the most open version of the add function, it
// says that add takes two inputs of any type: this could
// be strings, numbers or objects which you've made.

const add1 = (x: any, y: any) => {
  return x + y;
};
add1("Hello", 23);

// This is legitimate JavaScript (strings can be added
// like this for example) but isn't optimal for our function
// which we know is for numbers, so we'll convert the x and
// y to only be numbers.

const add2 = (x: number, y: number) => {
  return x + y;
};
add2(16, 23);
add2("Hello", 23);

// Great. We get an error when anything other than a number
// is passed in. If you hover over the word add2 above,
// you'll see that TypeScript describes it as:
//
//   const add2: (x: number, y: number) => number
//
// Where it has inferred that when the two inputs are
// numbers the only possible return type is a number.
// This is great, you don't have to write extra syntax.
// Let's look at what it takes to do that:

const add3 = (x: number, y: number): string => {
  return x + y;
};

// This function fails because we told TypeScript that it
// should expect a string to be returned but the function
// didn't live up to that promise.

const add4 = (x: number, y: number): number => {
  return x + y;
};

// This is a very explicit version of add2 - there are
// cases when you want to use the explicit return type
// syntax to give yourself a space to work within before
// you get started. A bit like how test-driven development
// recommends starting with a failing test, but in this case
// it's with a failing shape of a function instead.

// This example is only a primer, you can learn a lot more
// about how functions work in TypeScript in the handbook and
// inside the Functional JavaScript section of the examples:
//
// https://www.typescriptlang.org/docs/handbook/functions.html
// example:function-chaining

// And to continue our tour of JavaScript essentials,
// we'll look at how code flow affects the TypeScript types:
// example:code-flow
