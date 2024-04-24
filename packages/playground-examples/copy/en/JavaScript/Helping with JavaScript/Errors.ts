//// { "order": 3, "isJavaScript": true }

// By default TypeScript doesn't provide error messaging
// inside JavaScript. Instead the tooling is focused on
// providing rich support for editors.

// Turning on errors however, is pretty easy. In a
// typical JS file, all that's required to turn on TypeScript
// error messages is adding the following comment:

// @ts-check

let myString = "123";
myString = {};

// This may start to add a lot of red squiggles inside your
// JS file. While still working inside JavaScript, you have
// a few tools to fix these errors.

// For some of the trickier errors, which you don't feel
// code changes should happen, you can use JSDoc annotations
// to tell TypeScript what the types should be:

/** @type {string | {}} */
let myStringOrObject = "123";
myStringOrObject = {};

// Which you can read more on here: example:jsdoc-support

// You could declare the failure unimportant, by telling
// TypeScript to ignore the next error:

let myIgnoredError = "123";
// @ts-ignore
myStringOrObject = {};

// You can use type inference via the flow of code to make
// changes to your JavaScript: example:code-flow
