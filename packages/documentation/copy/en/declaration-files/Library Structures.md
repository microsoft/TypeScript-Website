---
title: Library Structures
layout: docs
permalink: /docs/handbook/declaration-files/library-structures.html
oneline: How to structure your d.ts files
---

Broadly speaking, the way you _structure_ your declaration file depends on how the library is consumed.
There are many ways of offering a library for consumption in JavaScript, and you'll need to write your declaration file to match it.
This guide covers how to identify common library patterns, and how to write declaration files which correspond to that pattern.

Each type of major library structuring pattern has a corresponding file in the [Templates](/docs/handbook/declaration-files/templates.html) section.
You can start with these templates to help you get going faster.

## Identifying Kinds of Libraries

First, we'll review the kinds of libraries TypeScript declaration files can represent.
We'll briefly show how each kind of library is _used_, how it is _written_, and list some example libraries from the real world.

Identifying the structure of a library is the first step in writing its declaration file.
We'll give hints on how to identify structure both based on its _usage_ and its _code_.
Depending on the library's documentation and organization, one might be easier than the other.
We recommend using whichever is more comfortable to you.

### What should you look for?

Question to ask yourself while looking at a library you are trying to type.

1. How do you obtain the library?

   For example, can you _only_ get it through npm or only from a CDN?

2. How would you import it?

   Does it add a global object? Does it use `require` or `import`/`export` statements?

### Smaller samples for different types of libraries

### Modular Libraries

Almost every modern Node.js library falls into the module family.
These type of libraries only work in a JS environment with a module loader.
For example, `express` only works in Node.js and must be loaded using the CommonJS `require` function.

ECMAScript 2015 (also known as ES2015, ECMAScript 6, and ES6), CommonJS, and RequireJS have similar notions of _importing_ a _module_.
In JavaScript CommonJS (Node.js), for example, you would write

```js
var fs = require("fs");
```

In TypeScript or ES6, the `import` keyword serves the same purpose:

```ts
import * as fs from "fs";
```

You'll typically see modular libraries include one of these lines in their documentation:

```js
var someLib = require("someLib");
```

or

```js
define(..., ['someLib'], function(someLib) {

});
```

As with global modules, you might see these examples in the documentation of [a UMD](#umd) module, so be sure to check the code or documentation.

#### Identifying a Module Library from Code

Modular libraries will typically have at least some of the following:

- Unconditional calls to `require` or `define`
- Declarations like `import * as a from 'b';` or `export c;`
- Assignments to `exports` or `module.exports`

They will rarely have:

- Assignments to properties of `window` or `global`

#### Templates For Modules

There are four templates available for modules,
[`module.d.ts`](/docs/handbook/declaration-files/templates/module-d-ts.html), [`module-class.d.ts`](/docs/handbook/declaration-files/templates/module-class-d-ts.html), [`module-function.d.ts`](/docs/handbook/declaration-files/templates/module-function-d-ts.html) and [`module-plugin.d.ts`](/docs/handbook/declaration-files/templates/module-plugin-d-ts.html).

You should first read [`module.d.ts`](/docs/handbook/declaration-files/templates/module-d-ts.html) for an overview on the way they all work.

Then use the template [`module-function.d.ts`](/docs/handbook/declaration-files/templates/module-function-d-ts.html) if your module can be _called_ like a function:

```js
const x = require("foo");
// Note: calling 'x' as a function
const y = x(42);
```

Use the template [`module-class.d.ts`](/docs/handbook/declaration-files/templates/module-class-d-ts.html) if your module can be _constructed_ using `new`:

```js
const x = require("bar");
// Note: using 'new' operator on the imported variable
const y = new x("hello");
```

If you have a module which when imported, makes changes to other modules use template [`module-plugin.d.ts`](/docs/handbook/declaration-files/templates/module-plugin-d-ts.html):

```js
const jest = require("jest");
require("jest-matchers-files");
```

### Global Libraries

A _global_ library is one that can be accessed from the global scope (i.e. without using any form of `import`).
Many libraries simply expose one or more global variables for use.
For example, if you were using [jQuery](https://jquery.com/), the `$` variable can be used by simply referring to it:

```ts
$(() => {
  console.log("hello!");
});
```

You'll usually see guidance in the documentation of a global library of how to use the library in an HTML script tag:

```html
<script src="http://a.great.cdn.for/someLib.js"></script>
```

Today, most popular globally-accessible libraries are actually written as UMD libraries (see below).
UMD library documentation is hard to distinguish from global library documentation.
Before writing a global declaration file, make sure the library isn't actually UMD.

#### Identifying a Global Library from Code

Global library code is usually extremely simple.
A global "Hello, world" library might look like this:

```js
function createGreeting(s) {
  return "Hello, " + s;
}
```

or like this:

```js
// Web
window.createGreeting = function (s) {
  return "Hello, " + s;
};

// Node
global.createGreeting = function (s) {
  return "Hello, " + s;
};

// Potentially any runtime
globalThis.createGreeting = function (s) {
  return "Hello, " + s;
};
```

When looking at the code of a global library, you'll usually see:

- Top-level `var` statements or `function` declarations
- One or more assignments to `window.someName`
- Assumptions that DOM primitives like `document` or `window` exist

You _won't_ see:

- Checks for, or usage of, module loaders like `require` or `define`
- CommonJS/Node.js-style imports of the form `var fs = require("fs");`
- Calls to `define(...)`
- Documentation describing how to `require` or import the library

#### Examples of Global Libraries

Because it's usually easy to turn a global library into a UMD library, very few popular libraries are still written in the global style.
However, libraries that are small and require the DOM (or have _no_ dependencies) may still be global.

#### Global Library Template

The template file [`global.d.ts`](/docs/handbook/declaration-files/templates/global-d-ts.html) defines an example library `myLib`.
Be sure to read the ["Preventing Name Conflicts" footnote](#preventing-name-conflicts).

### _UMD_

A _UMD_ module is one that can _either_ be used as module (through an import), or as a global (when run in an environment without a module loader).
Many popular libraries, such as [Moment.js](https://momentjs.com/), are written this way.
For example, in Node.js or using RequireJS, you would write:

```ts
import moment = require("moment");
console.log(moment.format());
```

whereas in a vanilla browser environment you would write:

```js
console.log(moment.format());
```

#### Identifying a UMD library

[UMD modules](https://github.com/umdjs/umd) check for the existence of a module loader environment.
This is an easy-to-spot pattern that looks something like this:

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["libName"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("libName"));
    } else {
        root.returnExports = factory(root.libName);
    }
}(this, function (b) {
```

If you see tests for `typeof define`, `typeof window`, or `typeof module` in the code of a library, especially at the top of the file, it's almost always a UMD library.

Documentation for UMD libraries will also often demonstrate a "Using in Node.js" example showing `require`,
and a "Using in the browser" example showing using a `<script>` tag to load the script.

#### Examples of UMD libraries

Most popular libraries are now available as UMD packages.
Examples include [jQuery](https://jquery.com/), [Moment.js](https://momentjs.com/), [lodash](https://lodash.com/), and many more.

#### Template

Use the [`module-plugin.d.ts`](/docs/handbook/declaration-files/templates/module-plugin-d-ts.html) template.

## Consuming Dependencies

There are several kinds of dependencies your library might have.
This section shows how to import them into the declaration file.

### Dependencies on Global Libraries

If your library depends on a global library, use a `/// <reference types="..." />` directive:

```ts
/// <reference types="someLib" />

function getThing(): someLib.thing;
```

### Dependencies on Modules

If your library depends on a module, use an `import` statement:

```ts
import * as moment from "moment";

function getThing(): moment;
```

### Dependencies on UMD libraries

#### From a Global Library

If your global library depends on a UMD module, use a `/// <reference types` directive:

```ts
/// <reference types="moment" />

function getThing(): moment;
```

#### From a Module or UMD Library

If your module or UMD library depends on a UMD library, use an `import` statement:

```ts
import * as someLib from "someLib";
```

Do _not_ use a `/// <reference` directive to declare a dependency to a UMD library!

## Footnotes

### Preventing Name Conflicts

Note that it's possible to define many types in the global scope when writing a global declaration file.
We strongly discourage this as it leads to possible unresolvable name conflicts when many declaration files are in a project.

A simple rule to follow is to only declare types _namespaced_ by whatever global variable the library defines.
For example, if the library defines the global value 'cats', you should write

```ts
declare namespace cats {
  interface KittySettings {}
}
```

But _not_

```ts
// at top-level
interface CatsKittySettings {}
```

This guidance also ensures that the library can be transitioned to UMD without breaking declaration file users.

### The Impact of ES6 on Module Call Signatures

Many popular libraries, such as Express, expose themselves as a callable function when imported.
For example, the typical Express usage looks like this:

```ts
import exp = require("express");
var app = exp();
```

In ES6-compliant module loaders, the top-level object (here imported as `exp`) can only have properties;
the top-level module object can _never_ be callable.

The most common solution here is to define a `default` export for a callable/constructable object;
module loaders commonly detect this situation automatically and replace the top-level object with the `default` export.
TypeScript can handle this for you, if you have [`"esModuleInterop": true`](/tsconfig/#esModuleInterop) in your tsconfig.json.
