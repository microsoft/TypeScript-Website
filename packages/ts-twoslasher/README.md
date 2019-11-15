# TypeScript TwoSlasher

A twisted flavour of TypeScript code for writing code samples and letting TypeScript do more of the work inspired
by the fourslash test system in the TypeScript Compiler. Used as a pre-parser before showing code samples inside
the TypeScript website.


### Features 

- Pulling out accurate errors from a TypeScript code sample
- Declaratively symbols you want to show
- Handling transpilation

### Examples 

<!-- AUTO-GENERATED-CONTENT:START (FIXTURES) -->
### Examples

#### `example.ts`

```.ts
// @noImplicitAny: false
function fn(s) {
  // No error?
  console.log(s.subtr(3))
}
fn(42);
```

Turns to:

```json
{
  "code": "function fn(s) {\n  // No error?\n  console.log(s.subtr(3))\n}\nfn(42);\n",
  "extension": ".ts",
  "highlights": [],
  "queries": [],
  "errors": []
}
```

#### `failIngImplicitAny.ts`

```.ts
// @noImplicitAny: false
function fn(s) {
  // No error?
  console.log(s.subtr(3))
}
fn(42);
```

Turns to:

```json
{
  "code": "function fn(s) {\n  // No error?\n  console.log(s.subtr(3))\n}\nfn(42);\n",
  "extension": ".ts",
  "highlights": [],
  "queries": [],
  "errors": []
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
  "extension": ".ts",
  "highlights": [
    { "kind": "highlight", "position": 132, "length": 10, "description": "" }
  ],
  "queries": [],
  "errors": []
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
  "extension": ".ts",
  "highlights": [],
  "queries": [{ "kind": "query", "offset": 4, "position": 4 }],
  "errors": []
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
  "extension": ".ts",
  "highlights": [],
  "queries": [],
  "errors": []
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
