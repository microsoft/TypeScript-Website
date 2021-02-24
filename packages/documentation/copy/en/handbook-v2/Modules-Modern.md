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

## Non-modules

Before we start, it's important to understand what TypeScript considers a module.
The JavaScript specification declares that any JavaScript files without an `export` or top-level `await` should be considered a script and not a module.

Inside a script file variables are declared to be in the shared global scope, and it's assumed that you'll either use the `--outFile` compiler option to join multiple input files into one output file, or use multiple `<script>` tags in your HTML to load these files (in the correct order!).

If you have a file that doesn't currently have any `import`s or `export`s, but you want to be treated as a module, add the line:

```ts twoslash
export {};
```

to make the file be a module exporting nothing. This syntax works regardless of your module target.

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
- **Module Output Target**: What should the should my emitted JavaScript module look like?

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

### Additional Import Syntax

An import can be renamed using a format like `import {old as new}`:

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
// ---cut---
// @filename: app.ts
import { pi as π } from "./maths.js";

console.log(π);
//          ^?
```

You can mix and match the above syntax into a single `import`:

```ts twoslash
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}

// @filename: app.ts
import RNGen, { pi as π } from "./maths.js";

RNGen;
// ^?

console.log(π);
//          ^?
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

You can import a file and _not_ include any variables into your current module via `import "./file"`

```ts twoslash
// @filename: maths.ts
export var pi = 3.14;
// ---cut---
// @filename: app.ts
import "./maths.js";

console.log("3.14");
```

In this case, the `import` does nothing. However, all of the code in `maths.ts` was evaluated, which could trigger side-effects which affect other objects.

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

## CommonJS Syntax

## TypeScript's Module Resolution Options

Module resolution is the process of taking a string from the `import` or `require` statement, and determining what file that string refers to.

TypeScript includes two resolution strategies: Classic and Node. Classic, the default when the compiler flag [`module`](/tsconfig/#module) is not `commonjs`, is included for backwards compatibility.
The Node strategy replicates how Node.js works in CommonJS mode, with additional checks for `.ts` and `.d.ts`.

There are many TSConfig flags which influence the module strategy within TypeScript: [`moduleResolution`](/tsconfig/#moduleResolution), [`baseUrl`](/tsconfig/#baseUrl), [`paths`](/tsconfig/#paths), [`rootDirs`](/tsconfig/#rootDirs).

For the full details on how these strategies work, you can consult the [Module Resolution](/docs/handbook/module-resolution.html).

## TypeScript's Module Output Options

There are two options which affect the emitted JavaScript output:

- [`target`](/tsconfig/#target) which determines which JS features are downleveled (converted to run in older JavaScript runtimes) and which are left intact.
- [`module](/tsconfig/#module) which determines what code is used for modules to interact with each other

Which `target` you use is determined by the features available in the JavaScript runtime you expect to run the TypeScript code in. That could be: the oldest web browser you support, the lowest version of Node.js you expect to run on or could come from unique constraints from your runtime - like Electron for example.

The all modules import one another using a module loader, the compiler flag [`module`](/tsconfig#module) determines which one is used.
At runtime the module loader is responsible for locating and executing all dependencies of a module before executing it.

For example, here is a TypeScript file using ES Modules syntax, showcasing a few different options for [`module`](/tsconfig#module):

```ts twoslash
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `CommonJS`

```ts twoslash
// @showEmit
// @module: commonjs
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `UMD`

```ts twoslash
// @showEmit
// @module: umd
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

#### `ES2020`

```ts twoslash
// @showEmit
// @module: es2020
// @filename: constants.ts
export const valueOfPi = 3.142;
// ---cut---
// @filename: index.ts
import { valueOfPi } from "./constants";

export const twoPi = valueOfPi * 2;
```

> Note that ES2020 is effectively the same as the original `index.ts`.

You can see all of the available options and what their code looks like in the [TSConfig Reference for `module`](/tsconfig/#module).
