---
title: Modules
layout: docs
permalink: /docs/handbook/2/modules.html
oneline: "Learn how TypeScript handles different module styles."
beta: true
---

Modules as a concept in JavaScript have a long and complicated history that makes any single definition or description difficult.
Many competing implementations have been shipped and adopted, and multiple mutually-incompatible interop systems have been built on top of those.
Ultimately, this chapter requires much more background reading than others.

We'll focus on key aspects of TypeScript-specific behavior after briefly describing the module landscape.

## A Brief History of Modules

Let's review how we got into this mess by doing a short chronological walkthrough of modules as they've existed throughout JavaScript's history.

### No Modules

In the beginning, there were just `<script>` tags in HTML files.
All JavaScript code was loaded and executed before the page was rendered, and all files worked in the same global scope.
Different parts of a program could talk to each other through global variables.

This is represented today by the setting `module: "none"` - there are no modules.

This was good for simple programs, but the limitations of this approach are quickly encountered.
Loading all JavaScript at once is bad for page load times, and different files had to be careful to not interfere with each other's global variables.
Worse, there was no way for a single JavaScript file to declare its dependencies.
Programmers had to ensure that any HTML file their file was included in had the proper prerequisites.

### AMD

```js
// An example AMD module
define("my_module", ["dependency_1", "dependency_2"], function (dep1, dep2) {
  return {
    name: "My Awesome Module",
    greet: () => {
      alert("Hello, world!");
    },
  };
});
```

[AMD, the asynchronous module definition](https://requirejs.org/docs/whyamd.html) solved many of these problems.
It allowed for each part of a program to declare its dependencies, and modules could be loaded asynchronously.
Each module ran in its own explicitly-written function body, avoiding conflicts in the global scope.
You could also write multiple modules in the same JavaScript file, if desired.

This is the standard implemented by [RequireJS](https://requirejs.org), and is also recognized by some module bundlers.

AMD is very configurable in how a module name is resolved to a given file.
In fact, one file might provide multiple module definitions, and file lookup might not occur at all for some module names.

### CommonJS

```js
// An example CommonJS module
const fs = require("fs");

module.exports = function () {
  return fs.readFile("someFile.txt");
};
```

[Node.js](https://nodejs.org) took a different approach and implemented a module system known as [CommonJS](https://nodejs.org/docs/latest/api/modules.html).
Here, modules are loaded synchronously through a call to the `require` function, meaning that module dependencies are _imperative_ rather than _declarative_.
There's also a more explicit one-to-one relationship between modules and files.

While the CommonJS specification itself doesn't specify the relationship between module names and file paths, it's commonly understood that NodeJS's resolution algorithm (which involves looking in `node_modules` for non-relative paths) is implied.

### UMD

```js
// UMD wrapper for either global or AMD environment
// Adapted from https://github.com/umdjs/umd/blob/master/templates/amdWebGlobal.js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["b"], function (b) {
      return (root.amdWebGlobal = factory(b));
    });
  } else {
    root.amdWebGlobal = factory(root.b);
  }
})(typeof self !== "undefined" ? self : this, function (b) {
  // Use b in some fashion.
  return {};
});
```

At this point, many libraries were being used in non-module environments, AMD environments, and CommonJS environments.
Instead of shipping three versions of the same code, many libraries decided to write a small wrapper around their code that detected which environment they were in.
When run in a non-module environment, they'd provide a global variable, otherwise they'd expose a module compatible with AMD or CommonJS.
This is known as the _UMD_ pattern.

It's somewhat awkward to load dependencies from a UMD library, so this pattern is most commonly seen for libraries which themselves have no dependencies.

Some UMD libraries will _always_ create a global variable, while others will only do this if no module loader is present.

### ES6

```js
// An example ES6 module
import * as NS from "someModule";
import { prop1, prop2 } from "../anotherModule";

export const A = prop1 + prop2;
export function fn() {
  return NS.method();
}
```

The TC39 committee surveyed the module landscape and wrote a standard that combined some aspects of both CommonJS and AMD, as well as introducing some new concepts.
An ES6 module statically declares its imports and exports, and its dependencies are loaded synchronously.
Later, dynamic `import` was added, which allows for asynchronous non-static dependencies to be loaded.

ES6 modules do not define a relationship between the paths used in `import` statements and files on disk.
Generally, bundlers will use an existing tool's definition of how to turn an import path into a file name, allow user configuration, or both.

## Modules in TypeScript

There are three main things to consider when writing module-based code in TypeScript:

- **Syntax**: What syntax do I want to use to import and export things?
- **Module Resolution**: What is the relationship between module names (or paths) and files on disk?
- **Module Target**: What module format should my emitted JavaScript use?

Let's review each of these in more detail.

## Syntax

### ES6

> > **Background Reading**: [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [export](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) declarations (MDN)

TypeScript supports the full variety of `import` and `export` syntaxes.
You can use these forms when using any module target.
If you're targeting ES6 modules, these will be transpiled as-is (except for unused imports; see [[Unused and Type-Only Imports]]).

If you're targeting CommonJS or AMD but writing ES6 syntax, TypeScript follows the same interop scheme as Babel.
Here are examples of each ES6 import and export form and the equivalent CommonJS or AMD outputs.

> **Warning!** These interop rules are currently in committee and working group discussions between Node, TC39 (the JavaScript language controlling body), and other
> community members. At time of writing, _none_ of these interop rules are on track to be standardized, and you may be broken in the future if you use ES6 syntax
> to import CommonJS modules.
> The safest thing to do is to use CommonJS-style imports when writing CommonJS code.

#### Namespace Imports

Namespace imports are treated as importing the entire module object:

```js
// Namespace import
import * as ns from "m";

// Becomes (CommonJS)
const ns = require("m");

// Becomes (AMD)
define(["m"], function (ns) {});
```

##### Namespace Imports of Functions and Classes

A common error is to try to use ES6 namespace import syntax to import a function:

```js
import * as express from "express";
// Error
express();
```

This code does not run in a true ES6 environment.
If the thing you're trying to import is a function, you should either use a default import or a CommonJS-style import (see below>)
See the StackOverflow question ["What does “… resolves to a non-module entity and cannot be imported using this construct” mean?](https://stackoverflow.com/questions/39415661/what-does-resolves-to-a-non-module-entity-and-cannot-be-imported-using-this) for more details.

#### Destructuring Imports

Destructuring imports bind to properties of the module:

```js
// Destructured import
import { prop } from "m";
prop.greet();

// Becomes (CommonJS; AMD is similar)
var _m = require("m");
_m.prop.greet();
```

A common question is why `_m` is emitted, and why `prop` doesn't get emitted as a local variable.
The answer is that ES6 module bindings are _live_: Whenever they are read, they get the current value of the property from the imported module.
For example, if you wrote a simple `counter` module:

```js
export let counter = 0;
export function increment() {
  counter++;
}
```

and used it:

```js
import { counter, increment } from "./counter";
increment();
increment();
// Should print '2'
console.log(counter);
```

If TypeScript emitted `var counter = _m.counter`, this code would incorrectly print `0` instead of `2`

#### Default Imports

Default imports import the `.default` member of a module:

```js
import df from "m";
df.greet();

// Becomes (CommonJS; AMD is similar)
var _m = df;
_m.default.greet();
```

#### Synthetic Defaults and `esModuleInterop`

It's unusual for a CommonJS module to actually export a member named `default`.
Usually the intent here is, for example, to bind the entire module presented by `"m"` to `df`.

If your module loader _automatically_ provides a `.default` property on CommonJS modules that points to the module itself, you can turn on the `--allowSyntheticDefaultImports` compiler option.
When this is enabled, TypeScript will treat a default import as if it is importing the module itself instead.
**This does not change the emitted code!**

If your module loader _doesn't_ automatically provide a `.default` property on CommonJS modules, but you want to import these modules using default import syntax, you can enable the `--esModuleInterop` flag.
This will emit an extra helper that detects non-ES6 modules at runtime and will allow the CommonJS module to be loaded through a default import.

#### Export Forms

Export declarations follow the same pattern as imports -- when targeting AMD or CommonJS, they create corresponding named properties.
Note that if you're writing a CommonJS module using ES6 syntax, you usually don't want to create a `default` export, as CommonJS consumers won't be expecting to find a property with this name.

### CommonJS-style `import` and `export =`

If you're writing a CommonJS module (i.e. one that runs in Node.js) or an AMD module, we recommend using TypeScript's `require` syntax instead of ES6 syntax.

#### `import ... = require(...)`

The CommonJS-style `import` declaration has exactly one form:

```ts twoslash
// @noErrors
import fs = require("fs");

// Becomes (CommonJS)
var fs = require("fs");

// Becomes (AMD)
define(["fs"], function (fs) {});
```

#### Unsupported Syntax

## Unused and Type-Only Imports

TypeScript uses the same syntax for importing types and namespaces as it does for values.
TODO finish

## Module Syntax in TypeScript

TypeScript allows you to write module-based code in a syntax that can be transpiled to the module format of your choice.

## Non-modules

If a `.ts` file doesn't have any `import` or `export` declarations, the file will automatically be considered a non-module file.
These files' variables are declared in the global scope, and it's assumed that you'll either use the `--outFile` compiler option to join multiple input files into one output file, or use multiple `<script>` tags in your HTML to load these files (in the correct order!).

If you have a file that doesn't currently have any imports or exports, but you want to be treated as a module, add the line

```ts twoslash
export {};
```

to make the file be a module exporting nothing.
This syntax works regardless of your module target.

### ES6

### AMD

## Import Paths and Module Resolution

## Declaring Modules

A "module" in modern JavaScript parlance

The word "modules" encompasses a wide variety of

Starting with ECMAScript 2015, JavaScript has a concept of modules.
TypeScript shares this concept.

Modules are executed within their own scope, not in the global scope.
This means that variables, functions, classes, etc. declared in a module are not visible outside the module unless they are explicitly exported using one of the export forms.
Conversely, to consume a variable, function, class, interface, etc. exported from a different module, it has to be imported using one of the import forms.

Modules are declarative: the relationships between modules are specified in terms of imports and exports at the file level.

Modules import one another using a module loader.
At runtime the module loader is responsible for locating and executing all dependencies of a module before executing it.
Well-known modules loaders used in JavaScript are the CommonJS module loader for Node.js and require.js for Web applications.

In TypeScript, just as in ECMAScript 2015, any file containing a top-level import or export is considered a module.
Conversely, a file without any top-level import or export declarations is treated as a script whose contents are available in the global scope (and therefore to modules as well).

### ES Modules

> > [Background Reading: ES Modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)

## Import Forms

## Importing CommonJS modules with ES Syntax

- Overview of Choices
  - ES6 (read MDN)
  - CommonJS
  - AMD
  - SystemJS
  - UMD
  - See the appendix because oh my god
- Import forms
- Paths and Module resolution
- Synthetic defaults
- Import ellision
