---
title: "Global .d.ts"
layout: docs
permalink: /docs/handbook/declaration-files/templates/global-d-ts.html
---

## Global Libraries

<!-- 
TODO:

1. mention that global nearly always means 'browser'
2. if you have a global library that you suspect is UMD, look for instructions on
   a. how to import it
   b. -OR- how to make it work with webpack
3. Make the page follow the structure of documentation,usage,source example.

-->

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

## Identifying a Global Library from Code

Global library code is usually extremely simple.
A global "Hello, world" library might look like this:

```js
function createGreeting(s) {
  return "Hello, " + s;
}
```

or like this:

```js
window.createGreeting = function (s) {
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

## Examples of Global Libraries

Because it's usually easy to turn a global library into a UMD library, very few popular libraries are still written in the global style.
However, libraries that are small and require the DOM (or have _no_ dependencies) may still be global.

## Global Library Template

You can see an example DTS below:

```ts
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ If this library is callable (e.g. can be invoked as myLib(3)),
 *~ include those call signatures here.
 *~ Otherwise, delete this section.
 */
declare function myLib(a: string): string;
declare function myLib(a: number): number;

/*~ If you want the name of this library to be a valid type name,
 *~ you can do so here.
 *~
 *~ For example, this allows us to write 'var x: myLib';
 *~ Be sure this actually makes sense! If it doesn't, just
 *~ delete this declaration and add types inside the namespace below.
 */
interface myLib {
  name: string;
  length: number;
  extras?: string[];
}

/*~ If your library has properties exposed on a global variable,
 *~ place them here.
 *~ You should also place types (interfaces and type alias) here.
 */
declare namespace myLib {
  //~ We can write 'myLib.timeout = 50;'
  let timeout: number;

  //~ We can access 'myLib.version', but not change it
  const version: string;

  //~ There's some class we can create via 'let c = new myLib.Cat(42)'
  //~ Or reference e.g. 'function f(c: myLib.Cat) { ... }
  class Cat {
    constructor(n: number);

    //~ We can read 'c.age' from a 'Cat' instance
    readonly age: number;

    //~ We can invoke 'c.purr()' from a 'Cat' instance
    purr(): void;
  }

  //~ We can declare a variable as
  //~   'var s: myLib.CatSettings = { weight: 5, name: "Maru" };'
  interface CatSettings {
    weight: number;
    name: string;
    tailLength?: number;
  }

  //~ We can write 'const v: myLib.VetID = 42;'
  //~  or 'const v: myLib.VetID = "bob";'
  type VetID = string | number;

  //~ We can invoke 'myLib.checkCat(c)' or 'myLib.checkCat(c, v);'
  function checkCat(c: Cat, s?: VetID);
}
```
