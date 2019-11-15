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
### API

The API is one main exported function:

```ts
/**
 * Runs the checker against a TypeScript/JavaScript code sample returning potentially
 * difference code, and a set of annotations around how it works.
 *
 * @param code The fourslash code
 * @param extension For example: ts, tsx, typescript, javascript, js
 */
export function twoslasher(code: string, extension: string): TwoSlashReturn;
```

The majority of the API lives inline inside the code, where you can do special commands. These are the config variables available

```ts
/** Available inline flags which are not compiler flags */
interface ExampleOptions {
    /** Let's the sample suppress all error diagnostics */
    noErrors: false;
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

function fn(s) {
  console.log(s.subtr(3))
}

fn(42);
```

Turns to:

```json
{
  "code": "\nfunction fn(s) {\n  console.log(s.subtr(3))\n}\n\nfn(42);\n",
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
  "playgroundURL": ""
}
```

#### `compiler_flags.ts`

```.ts
// @noImplicitAny: false
// @target: ES2015

function fn(s) {
  // No error?
  console.log(s.subtr(3))
}

fn(42);
```

Turns to:

```json
{
  "code": "\nfunction fn(s) {\n  // No error?\n  console.log(s.subtr(3))\n}\n\nfn(42);\n",
  "extension": "ts",
  "highlights": [],
  "queries": [],
  "errors": [],
  "playgroundURL": ""
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

```json
{
  "code": "\nfunction createLabel<T extends number | string>(idOrName: T): NameOrId<T> {\n    throw \"unimplemented\"\n}\n\nlet a = createLabel(\"typescript\");\n\nlet b = createLabel(2.8);\n\nlet c = createLabel(Math.random() ? \"hello\" : 42);\n",
  "extension": "ts",
  "highlights": [],
  "queries": [
    { "kind": "query", "offset": 4, "position": 347 },
    { "kind": "query", "offset": 4, "position": 383 },
    { "kind": "query", "offset": 4, "position": 410 }
  ],
  "errors": [],
  "playgroundURL": ""
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

```json
{
  "code": "/**\r\n * Gets the length of a string\r\n * @param value a string\r\n */\r\nexport declare function getStringLength(value: string): number;\r\n",
  "extension": "ts",
  "highlights": [],
  "queries": [],
  "errors": [],
  "playgroundURL": ""
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

```json
{
  "code": "function greet(person: string, date: Date) {\n  console.log(`Hello ${person}, today is ${date.toDateString()}!`);\n}\n\ngreet(\"Maddison\", new Date());\n",
  "extension": "ts",
  "highlights": [
    { "kind": "highlight", "position": 134, "length": 10, "description": "" }
  ],
  "queries": [],
  "errors": [],
  "playgroundURL": ""
}
```

#### `query.ts`

```.ts
let foo = "hello there!";
    ^?
```

Turns to:

```json
{
  "code": "let foo = \"hello there!\";\n",
  "extension": "ts",
  "highlights": [],
  "queries": [{ "kind": "query", "offset": 4, "position": 4 }],
  "errors": [],
  "playgroundURL": ""
}
```

#### `showEmit.ts`

```.ts
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
// --importHelpers on: Spread helper is inserted imported from 'tslib'
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Turns to:

```json
{
  "code": "\"use strict\";\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar tslib_1 = require(\"tslib\");\r\n// --importHelpers on: Spread helper is inserted imported from 'tslib'\r\nfunction fn(arr) {\r\n    var arr2 = tslib_1.__spread([1], arr);\r\n}\r\nexports.fn = fn;\r\n",
  "extension": "ts",
  "highlights": [],
  "queries": [],
  "errors": [],
  "playgroundURL": ""
}
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. The library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder. The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).


### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit.
