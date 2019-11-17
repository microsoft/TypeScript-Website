# TypeScript TwoSlasher

A twisted flavour of TypeScript code for writing code samples and letting TypeScript do more of the work inspired
by the [fourslash test system](https://github.com/orta/typescript-notes/blob/master/systems/testing/fourslash.md) in 
the TypeScript Compiler. Used as a pre-parser before showing code samples inside the TypeScript website and to create 
a standard way for us to create single file references.

### Features 

- Pulling out accurate errors from a TypeScript code sample
- Declaratively symbols you want to show
- Handling transpilation and replacing the sample content
- Splitting a code sample to only show a subset

### TODO

- Creating a playground link for the code
- Support creating multiple files to correctly show import samples

Note: This is not shipped to npm yet.

<!-- AUTO-GENERATED-CONTENT:START (FIXTURES) -->
The markup API lives inline inside the code, where you can do special commands. These are the config variables available

```ts
/** Available inline flags which are not compiler flags */
interface ExampleOptions {
    /** Let's the sample suppress all error diagnostics */
    noErrors: false;
    /** An array of TS error codes, which you write as space separated - this is so the tool can know about unexpected errors */
    errors: number[];
    /** Shows the JS equivalent of the TypeScript code instead */
    showEmit: false;
    /** When mixed with showEmit, lets you choose the file to present instead of the JS */
    showEmittedFile: string;
}
```

As well as all compiler API options are available, which you can see in the examples below.

### Examples

#### `compiler_errors.ts`

```.ts
// @target: ES2015
// @errors: 7006

function fn(s) {
  console.log(s.subtr(3))
}

fn(42);
```

Turns to:

```ts

function fn(s) {
  console.log(s.subtr(3))
}

fn(42);
```

With:

```json
{
  "code": "See above",
  "extension": "ts",
  "highlights": [],
  "queries": [],
  "errors": [
    {
      "category": 1,
      "code": 7006,
      "length": 1,
      "start": 13,
      "renderedMessage": "Parameter 's' implicitly has an 'any' type.",
      "id": "err-7006-13-1"
    }
  ],
  "playgroundURL": "https://www.typescriptlang.org/play/#code/FAMwrgdgxgLglgewgAhBAFAZwJTIN7DLJRKYIA2ApgHTkIDmW1mYARjAE7oDM22wAX2CgMAFgBM2ANzAgA"
}
```

#### `compiler_flags.ts`

```.ts
// @noImplicitAny: false
// @target: ES2015

// This will not throw because of the noImplicitAny
function fn(s) {
  console.log(s.subtr(3))
}

fn(42);
```

Turns to:

```ts

// This will not throw because of the noImplicitAny
function fn(s) {
  console.log(s.subtr(3))
}

fn(42);
```

With:

```json
{
  "code": "See above",
  "extension": "ts",
  "highlights": [],
  "queries": [],
  "errors": [],
  "playgroundURL": "https://www.typescriptlang.org/play/#code/FAehAIBUAsEsGdwHdYBtXgHYHsAu5doAnbJcAIwFMBjAQwFd5LxsAzA6ZnASQFsAHVLGqxcAQUwBPYK3qZquWNkzhWmABTwAlOADewcOGrL42VJQB0qbAHNNF+PXK4i6gMxatwAL7AZGgBYAJi0AbmAgA"
}
```

#### `cuts_out_unneccessary_code.ts`

```.ts
interface IdLabel { id: number, /* some fields */ }
interface NameLabel { name: string, /* other fields */ }
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
// This comment should not be included

//cut
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
    throw "unimplemented"
}

let a = createLabel("typescript");
    ^?

let b = createLabel(2.8);
    ^?

let c = createLabel(Math.random() ? "hello" : 42);
    ^?
```

Turns to:

```ts

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
    throw "unimplemented"
}

let a = createLabel("typescript");

let b = createLabel(2.8);

let c = createLabel(Math.random() ? "hello" : 42);
```

With:

```json
{
  "code": "See above",
  "extension": "ts",
  "highlights": [],
  "queries": [
    {
      "kind": "query",
      "offset": 4,
      "position": 347
    },
    {
      "kind": "query",
      "offset": 4,
      "position": 383
    },
    {
      "kind": "query",
      "offset": 4,
      "position": 410
    }
  ],
  "errors": [],
  "playgroundURL": "https://www.typescriptlang.org/play/#code/JYOwLgpgTgZghgYwgAgJIBMAycBGEA2yA3ssOgFzIgCuAtnlADTID0AVMgM4D2tKMwAuk7I2LZAF8AUKEixEKAHJw+2PIRIgVESpzBRQAc2btk3MAAtoyAUJFjJUsAE8ADku0B5KBgA8AFWQIAA9IEGEqOgZkAB8ufSMAPmQAXmRAkLCImnprAH40LFwCZEplVWL8AG4pFnF-C2ARBF4+cC4Lbmp8dCpzZDxSEAR8anQIdClalgRqMCkYamGwYG4QZAQoCDhINQIAoNCIcJEc6Li9AxBDRIAKMm9ynXSASjKvH3QA5KIpZH-kJYoNwAO7IABES2AtFc+AgbUg6HBUmkUjhYGQcFSGy2Owge3wt3BLncnE2wFcYHBLxqaIgGJw2M2212lVuACYAHQADhpU3RGyZuNZ6luAFkdhZOVA4OFeLcXsgCuCrPh8NxwaVkAAWdl8oA"
}
```

#### `declarations.ts`

```.ts
// @declaration: true
// @showEmit
// @showEmittedFile: index.d.ts

/**
 * Gets the length of a string
 * @param value a string
 */
export function getStringLength(value: string) {
  return value.length
}
```

Turns to:

```ts
/**
 * Gets the length of a string
 * @param value a string
 */
export declare function getStringLength(value: string): number;
```

With:

```json
{
  "code": "See above",
  "extension": "ts",
  "highlights": [],
  "queries": [],
  "errors": [],
  "playgroundURL": "https://www.typescriptlang.org/play/#code/PQKhFgCgAIWhxApgFwM7WQC0dANogOwHMtoB7AM2gENpVkAnAS2KlmgAEAHah6gW2gA3argCuOWvWasYIYFEQAPLmQbJoAE0QBjXLxwUxBHciZkC0IigDKjFkQAyhEpgAUI8YgBcde8QBKXwIxfgAjRAYAbiggA"
}
```

#### `highlighting.ts`

```.ts
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
                  ^^^^^^^^^^
```

Turns to:

```ts
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

With:

```json
{
  "code": "See above",
  "extension": "ts",
  "highlights": [
    {
      "kind": "highlight",
      "position": 134,
      "length": 10,
      "description": ""
    }
  ],
  "queries": [],
  "errors": [],
  "playgroundURL": "https://www.typescriptlang.org/play/#code/GYVwdgxgLglg9mABAcwE4FN1QBQAd2oDOCAXIoVKjGMgDSIAmAhlOmQCIvoCUiA3gChEiCAmIAbdADpxcZNgAGACXTjZiACR98RBAF96UOMwCeiGIU19mrKUc6sAypWrzuegIQLuAbgF6BATRMHAAiAFkmBgYLBFD6MHQAd0QHdGxuXwEgA"
}
```

#### `query.ts`

```.ts
let foo = "hello there!";
    ^?
```

Turns to:

```ts
let foo = "hello there!";
```

With:

```json
{
  "code": "See above",
  "extension": "ts",
  "highlights": [],
  "queries": [
    {
      "kind": "query",
      "offset": 4,
      "position": 4
    }
  ],
  "errors": [],
  "playgroundURL": "https://www.typescriptlang.org/play/#code/DYUwLgBAZg9jEF4ICIAWJjHmdAnEAhMgNwBQQA"
}
```

#### `showEmit.ts`

```.ts
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers

// --importHelpers on: Spread helper will be imported from 'tslib'

export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Turns to:

```ts
"use strict";
// --importHelpers on: Spread helper will be imported from 'tslib'
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function fn(arr) {
    var arr2 = tslib_1.__spread([1], arr);
}
exports.fn = fn;
```

With:

```json
{
  "code": "See above",
  "extension": "ts",
  "highlights": [],
  "queries": [],
  "errors": [],
  "playgroundURL": "https://www.typescriptlang.org/play/#code/EQVwzgpgBGAuBOBLAxrYBuAsAKAPS6gFpDEBbABwHt5YAJCAG3InjCkoDsAuKAZXPgQAhgBMoAC0bN4UAO6IGDKACNoZKjQhiAZvEqkoAclhgGiZYZwB5ZQCsIqAHQiI2xBwgAFPdNgBPAAoIAA8NEwAaKGAAfWiIMABZShEQBghgSIBvKAA3IQYQCB4EQqgAXwBKLGw8mRMzZWiARigAXihBAEcQREEA4HrzYCqcbRAOVEROKG0OAKF4eAqoTJwoddyFqAX4ACY2qEHGpsdYsAFhEQCAbSaAXUidkewynBCwsEdZg9nqoA"
}
```

### API

The API is one main exported function:

```ts
/**
 * Runs the checker against a TypeScript/JavaScript code sample returning potentially
 * difference code, and a set of annotations around how it works.
 *
 * @param code The twoslash markup'd code
 * @param extension For example: ts, tsx, typescript, javascript, js
 */
export function twoslasher(code: string, extension: string): TwoSlashReturn;
```

Which returns

```ts
interface TwoSlashReturn {
    /** The output code, could be TypeScript, but could also be a JS/JSON/d.ts */
    code: string;
    /** The new extension type for the code, potentially changed if they've requested emitted results */
    extension: string;
    /** Sample requests to highlight a particular part of the code */
    highlights: {
        kind: 'highlight';
        position: number;
        length: number;
        description: string;
    }[];
    /** Requests to use the LSP to get info for a particular symbol in the source */
    queries: {
        kind: 'query';
        position: number;
        offset: number;
    }[];
    /** Diagnostic error messages which came up when creating the program */
    errors: {
        renderedMessage: string;
        id: string;
        category: 0 | 1 | 2 | 3;
        code: number;
        start: number | undefined;
        length: number | undefined;
    }[];
    /** The URL for this sample in the playground */
    playgroundURL: string;
}
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Local Development

Below is a list of commands you will probably find useful. You can get debug logs by running with the env var of `DEBUG="*"`.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. The library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder. The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit. 
