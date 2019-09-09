//// { order: 1, target: "ES5" }

// JavaScript added import/export to the language back in 2016
// and TypeScript has complete support for this style of
// linking between files and to external modules. TypeScript
// expands on this syntax by also allowing types to be passed
//  with code.

// Let's look at importing code from a module

import { danger, message, warn, DangerDSLType } from "danger";

// This takes a set of named imports from a node module
// called danger. While there are more than four imports,
// these are the only ones that we have chosen to import.

// Specifically naming which imports you are importing
// gives tools the ability to remove unused code in your
// apps, and helps you understand what is being used in
// a particular file.

// In this case: danger, message and warn are JavaScript
// imports - where as DangerDSLType is an interface type.

// TypeScript lets engineers document their code using
// JSDoc, and docs are imported also. For example if
// you hover on the different parts below, you see 
// explanations of what they are.

danger.git.modified_files;

// If you want to know how to provide these documentation
// annotations read example:jsdoc-support

// Another way to import code is by using the default export
// of a module. An example of this is the debug module, which
// exposes a function that creates a logging function.

import debug from "debug";
const log = debug("playground");
log("Started running code");

// Because of the nature of default exports having no true
// name, they can be tricky when applied with static analysis
// tools like the refactoring support in TypeScript but they
// have their uses.

// Because there is a long history in import/exporting code
// in JavaScript, there is a confusing part of default exports:
// Some exports have documentation that implies you can write
// an import like this:

import req from "request";

// However that fails, and then you find a stack overflow
// which recommends the import as:

import * as request from "request";

// And this works. Why? We'll get back to that at the end of
// our section on exporting.

// In order to import, you must be able to export. The modern
// way to write exports is using the export keyword.

/** The current stickers left on the roll */
export const numberOfStickers = 11;

// This could be imported into another file by:
//
// import { numberOfStickers } from "./path/to/file"

// You can have as many of those in a file as you like. Then
// a default export add is close to the same thing.

/** Generates a sticker for you */
const stickerGenerator = () => {};
export default stickerGenerator;

// This could be imported into another file by:
//
// import getStickers from "./path/to/file"
//
// the naming is up to the module consumer.

// These aren't the only types of imports, just the most common
// in modern code. Covering all of the ways code can cross
// module boundaries is a very long topic in the handbook.
//
// https://www.typescriptlang.org/docs/handbook/modules.html

// However, to try cover that last question. If you look at
// the JavaScript code for this example - you'll see this:

// var stickerGenerator = function () { };
// exports.default = stickerGenerator;

// This sets the default property on the exports object
// to be stickerGenerator. There is code out there which
// sets exports to be a function, instead of an object.
//
// TypeScript opted to stick with the ECMAScript specification
// about how to handle those cases, which is to raise an
// error. However, there is a compiler setting which will
// automatically handle those cases for you which is
// esModuleInterop.
//
// If you turn that on for this example, you will see that
// error go away.
