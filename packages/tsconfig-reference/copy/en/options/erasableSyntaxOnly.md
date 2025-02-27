---
display: "Erasable Syntax Only"
oneline: "Do not allow runtime constructs that are not part of ECMAScript."
---

Node.js [supports running TypeScript files directly](https://nodejs.org/api/typescript.html#type-stripping) as of v23.6;
however, only TypeScript-specific syntax that does not have runtime semantics are supported under this mode.
In other words, it must be possible to easily *erase* any TypeScript-specific syntax from a file, leaving behind a valid JavaScript file.

That means the following constructs are not supported:

* `enum` declarations
* `namespace`s and `module`s with runtime code
* parameter properties in classes
* Non-ECMAScript `import =` and `export =` assignments

```ts
// ❌ error: An `import ... = require(...)` alias
import foo = require("foo");

// ❌ error: A namespace with runtime code.
namespace container {
    foo.method();

    export type Bar = string;
}

// ❌ error: An `import =` alias
import Bar = container.Bar;

class Point {
    // ❌ error: Parameter properties
    constructor(public x: number, public y: number) { }
}

// ❌ error: An `export =` assignment.
export = Point;

// ❌ error: An enum declaration.
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

Similar tools like [ts-blank-space](https://github.com/bloomberg/ts-blank-space) or [Amaro](https://github.com/nodejs/amaro) (the underlying library for type-stripping in Node.js) have the same limitations.
These tools will provide helpful error messages if they encounter code that doesn't meet these requirements, but you still won't find out your code doesn't work until you actually try to run it.

The `--erasableSyntaxOnly` flag will cause TypeScript to error on most TypeScript-specific constructs that have runtime behavior.

```ts
class C {
    constructor(public x: number) { }
    //          ~~~~~~~~~~~~~~~~
    // error! This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
    }
}
```

Typically, you will want to combine this flag with the `--verbatimModuleSyntax`, which ensures that a module contains the appropriate import syntax, and that import elision does not take place.
