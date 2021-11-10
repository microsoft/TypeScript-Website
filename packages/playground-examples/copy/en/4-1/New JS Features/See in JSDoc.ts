//// { "compiler": { "ts": "4.1.0-beta" } }

// With 4.1 the JSDoc parser in TypeScript
// used in both JavaScript and TypeScript files
// supports the @see parameter.

// You can use the @see to help people quickly
// jump to other related code via clicking
// (cmd/ctrl + clicking) or getting hover info

/**
 * @see hello
 */
const goodbye = "Good";

/**
 * You say hi, I say low
 *
 * @see goodbye
 */
const hello = "Hello, hello";
