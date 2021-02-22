---
title: Modules Two
layout: docs
permalink: /docs/handbook/2/modules-2.html
oneline: "How JavaScript handles file boundries."
beta: true
---

JavaScript has a long history of different ways to handle modularizing code.
TypeScript having been around since 2012, has implemented support for a lot of these formats, but over time the community and the JavaScript specification has converged on a format called ES Modules (or ES6 modules). You might know it as the `import`/`export` syntax.

ES Modules was added to the JavaScript spec in 2015, and by 2020 had broad support in most web browsers and JavaScript runtimes.

For focus, the handbook will cover both ES Modules and it's popular pre-cursor CommonJS `module.exports =` syntax, and you can find information about the other module patterns in the reference section under [Modules](/docs/handbook/modules.html).

## How JavaScript Modules are Defined

In TypeScript, just as in ECMAScript 2015, any file containing a top-level `import` or `export` is considered a module.

Conversely, a file without any top-level import or export declarations is treated as a script whose contents are available in the global scope (and therefore to modules as well).

Modules are executed within their own scope, not in the global scope.
This means that variables, functions, classes, etc. declared in a module are not visible outside the module unless they are explicitly exported using one of the export forms.
Conversely, to consume a variable, function, class, interface, etc. exported from a different module, it has to be imported using one of the import forms.

## Modules in TypeScript

<blockquote class='bg-reading'>
   <p>Additional Reading:<br />
   <a href='https://exploringjs.com/impatient-js/ch_modules.html#overview-syntax-of-ecmascript-modules'>Impatient JS (Modules)</a><br/>
   <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules'>MDN: JavaScript Modules</a><br/>
   </p>
</blockquote>

There are three main things to consider when writing module-based code in TypeScript:

- **Syntax**: What syntax do I want to use to import and export things?
- **Module Resolution**: What is the relationship between module names (or paths) and files on disk?
- **Module Target**: What module format should my emitted JavaScript use?

#### ES Module Syntax

A file can declare a main export via `export default`:

```ts twoslash
// @filename: hello.ts
export default function helloWorld() {
  console.log("Hello, world!");
}
```

This is then imported via:

```ts twoslash
// @filename: hello.ts
export default function helloWorld() {
  console.log("Hello, world!");
}
// ---cut---
// @filename: index.ts
import hello from "./hello.js";
hello();
```

In addition to the default export, you can have more than one export of variables and functions via the `export` by omitting `default`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;
export class RandomNumberGenerator {}
export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
```

These can be used in another file via the `import` syntax:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;
export class RandomNumberGenerator {}
export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
// ---cut---
// @filename: app.ts
import { pi, phi, absolute } from "./maths.js";

console.log(pi);
const positivePhi = absolute(phi);
//    ^?
```

You can take all of the exported objects and put them into a single namespace using `* as name`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
// ---cut---
// @filename: app.ts
import * as math from "./maths.js";

console.log(math.pi);
const positivePhi = math.absolute(math.phi);
//    ^?
```

#### TypeScript Specific ES Module Syntax

Types can be exported and import using the same syntax as JavaScript values:

```ts twoslash
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}

// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

TypeScript has extended the `import` syntax with `import type` which is an import which can _only_ import types.

```ts twoslash
// @errors: 1361
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";

// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;

// @filename: app.ts
import type { createCatName } from "./animal.js";
const name = createCatName();
```

This syntax allows a non-TypeScript transpiler like Babel, swc or esbuild to know what imports can be safely removed.

#### ES Module Syntax with CommonJS

When working in Node.js, most libraries are CommonJS.
