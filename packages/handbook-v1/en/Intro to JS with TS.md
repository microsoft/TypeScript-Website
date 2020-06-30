---
title: Type Checking JavaScript Files
layout: docs
permalink: /docs/handbook/intro-to-js-ts.html
oneline: How to add type checking to JavaScript files using TypeScript
---

The type system in TypeScript has different modes of working:

- A type-system base on inference on un-typed JavaScript code
- Incremental typing in vanilla JavaScript via JSDoc
- A looser type-checker for JavaScript code
- TypeScript code
- Strict TypeScript

Each step represents a move towards a safer type-system, but not never project needs to use strict TypeScript.

## Providing Type Hints via JSDoc

In a `.js` file, types can often be inferred just like in `.ts` files.
Likewise, when types can't be inferred, they can be specified using JSDoc syntax.

JSDoc annotations adorning a declaration will be used to set the type of that declaration. For example:

```js twoslash
/** @type {number} */
var x;

x = 0; // OK
x = false; // OK?
```

The last line should raise an error in TypeScript, but it doesn't by default in a JS project. You can use either a [`jsconfig.json`](/docs/handbook/tsconfig-json.html) or add `// @ts-check` to the first line in your `.js` files to have TypeScript raise it as an error.

```js twoslash
// @ts-check
// @errors: 2322
/** @type {number} */
var x;

x = 0; // OK
x = false; // Not OK
```

You can find the full list of supported JSDoc patterns [in JSDoc Supported Types](/docs/handbook/jsdoc-supported-types.html).

## `@ts-check`

In a large project using a `jsconfig.json` you can skip checking some files by adding a `// @ts-nocheck` comment to files.
You can also ignore errors on specific lines by adding `// @ts-ignore` on the preceding line.
