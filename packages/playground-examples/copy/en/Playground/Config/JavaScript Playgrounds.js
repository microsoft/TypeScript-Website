//// { order: 3, isJavaScript: true }

// The playground can now handle JavaScript files.

// It's quite reasonable to wonder why we would add support
// for JavaScript in the playground, but it's likely that the
// majority of TypeScript's users are using JavaScript.

// TypeScript can use inferred types, type acquisition and
// JSDoc support in a JavaScript file to provide a great
// tooling environment:
//
//  example:objects-and-arrays
//  example:automatic-type-acquisition
//  example:jsdoc-support

// The playground supporting JavaScript means that you
// can learn and walk people through complicated JSDoc
// examples, or debug issues when there are expectation
// mis-matches.

// For example, how come this JSDoc comment isn't typed
// correctly?

/**
 * Adds two numbers together
 * @param {number} The first number
 * @param {number} The second number
 * @returns {number}
 */
function addTwoNumbers(a, b) {
  return a + b;
}

// It's much easier to figure that out in an environment
// where you can instantly see what's going on by hovering.
