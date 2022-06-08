---
title: ECMAScript Modules in Node.js
layout: docs
permalink: /docs/handbook/esm-node.html
oneline: Using ECMAScript Modules in Node.js
---

For the last few years, Node.js has been working to support running ECMAScript modules (ESM).
This has been a very difficult feature to support, since the foundation of the Node.js ecosystem is built on a different module system called CommonJS (CJS).

Seamless tooling between the two runtime environments brings large challenges, with many new features to juggle;
however, support for ESM in Node.js is now implemented in Node.js 12 and later, and the dust has begun to settle.

That's why TypeScript brings two new `module` and `moduleResolution` settings: `node16` and `nodenext`.

```json tsconfig
{
    "compilerOptions": {
        "module": "nodenext",
    }
}
```

These new modes bring a few high-level features which we'll explore here.

### `type` in `package.json` and New Extensions

Node.js supports [a new setting in `package.json`](https://nodejs.org/api/packages.html#packages_package_json_and_file_extensions) called `type`.
`"type"` can be set to either `"module"` or `"commonjs"`.

```json tsconfig
{
    "name": "my-package",
    "type": "module",

    "//": "...",
    "dependencies": {
    }
}
```

This setting controls whether `.js` files are interpreted as ES modules or CommonJS modules, and defaults to CommonJS when not set.
When a file is considered an ES module, a few different rules come into play compared to CommonJS:

* `import`/`export` statements, and top-level `await` can be used
* relative import paths need full extensions (e.g we have to write `import "./foo.js"` instead of `import "./foo"`)
* imports might resolve differently from dependencies in `node_modules`
* certain global-like values like `require()`, `process` and `__dirname` cannot be used directly
* CommonJS modules get imported under certain special rules

We'll come back to some of these.

To overlay the way TypeScript works in this system, `.ts` and `.tsx` files now work the same way.
When TypeScript finds a `.ts`, `.tsx`, `.js`, or `.jsx` file, it will walk up looking for a `package.json` to see whether that file is an ES module, and use that to determine:

* how to find other modules which that file imports
* and how to transform that file if producing outputs

When a `.ts` file is compiled as an ES module, ECMAScript `import`/`export` syntax is left alone in the `.js` output;
when it's compiled as a CommonJS module, it will produce the same output you get today under [`module`](/tsconfig#module): `commonjs`.

This also means paths resolve differently between `.ts` files that are ES modules and ones that are CJS modules.
For example, let's say you have the following code today:

```ts
// ./foo.ts
export function helper() {
    // ...
}

// ./bar.ts
import { helper } from "./foo"; // only works in CJS

helper();
```

This code works in CommonJS modules, but will fail in ES modules because relative import paths need to use extensions.
As a result, it will have to be rewritten to use the extension of the *output* of `foo.ts` - so `bar.ts` will instead have to import from `./foo.js`.

```ts
// ./bar.ts
import { helper } from "./foo.js"; // works in ESM & CJS

helper();
```

This might feel a bit cumbersome at first, but TypeScript tooling like auto-imports and path completion will typically just do this for you.

One other thing to mention is the fact that this applies to `.d.ts` files too.
When TypeScript finds a `.d.ts` file in package, whether it is treated as an ESM or CommonJS file is interpreted based on the containing package.

### New File Extensions

Using the `type` field in `package.json` is nice way to structure your project because it allows us to continue using the `.ts` and `.js` file extensions which can be convenient;
however, you will occasionally need to write a file that differs from what `type` specifies.
You might also just prefer to always be explicit.

Node.js supports two extensions to help with this: `.mjs` and `.cjs`.
`.mjs` files are always ES modules, and `.cjs` files are always CommonJS modules, and there's no way to override these.

In turn, TypeScript supports two new source file extensions: `.mts` and `.cts`.
When TypeScript emits these to JavaScript files, it will emit them to `.mjs` and `.cjs` respectively.

Furthermore, TypeScript also supports two new declaration file extensions: `.d.mts` and `.d.cts`.
When TypeScript generates declaration files for `.mts` and `.cts`, their corresponding extensions will be `.d.mts` and `.d.cts`.

Using these extensions is entirely optional, but will often be useful even if you choose not to use them as part of your primary workflow.

### CommonJS Interop

Node.js allows ES modules to import CommonJS modules as if they were ES modules with a default export.

```ts twoslash
// @module: nodenext
// @filename: helper.cts
export function helper() {
    console.log("hello world!");
}

// @filename: index.mts
import foo from "./helper.cjs";

// prints "hello world!"
foo.helper();
```

In some cases, Node.js also synthesizes named exports from CommonJS modules, which can be more convenient.
In these cases, ES modules can use a "namespace-style" import (i.e. `import * as foo from "..."`), or named imports (i.e. `import { helper } from "..."`).

```ts twoslash
// @module: nodenext
// @filename: helper.cts
export function helper() {
    console.log("hello world!");
}

// @filename: index.mts
import { helper } from "./v.cjs";

// prints "hello world!"
helper();
```

There isn't always a way for TypeScript to know whether these named imports will be synthesized, but TypeScript will err on being permissive and use some heuristics when importing from a file that is definitely a CommonJS module.

One _TypeScript-specific_ note about interop is the following syntax:

```ts
import foo = require("foo");
```

In a CommonJS module, this just boils down to a `require()` call, and in an ES module, this imports [`createRequire`](https://nodejs.org/api/module.html#module_module_createrequire_filename) to achieve the same thing.
This will make code less portable on runtimes like the browser (which don't support `require()`), but will often be useful for interoperability.
In turn, you can write the above example using this syntax as follows:

```ts twoslash
// @module: nodenext
// @filename: helper.cts
export function helper() {
    console.log("hello world!");
}

// @filename: index.mts
import foo = require("./foo.cjs");

foo.helper()
```

Finally, it's worth noting that the only way to import ESM files from a CJS module is using dynamic `import()` calls.
This can present challenges, but is the behavior in Node.js today.

You can [read more about ESM/CommonJS interop in Node.js here](https://nodejs.org/api/esm.html#esm_interoperability_with_commonjs).

### `package.json` Exports, Imports, and Self-Referencing

Node.js supports [a new field for defining entry points in `package.json` called `"exports"`](https://nodejs.org/api/packages.html#packages_exports).
This field is a more powerful alternative to defining `"main"` in `package.json`, and can control what parts of your package are exposed to consumers.

Here's an `package.json` that supports separate entry-points for CommonJS and ESM:

```json5
// package.json
{
    "name": "my-package",
    "type": "module",
    "exports": {
        ".": {
            // Entry-point for `import "my-package"` in ESM
            "import": "./esm/index.js",

            // Entry-point for `require("my-package") in CJS
            "require": "./commonjs/index.cjs",
        },
    },

    // CJS fall-back for older versions of Node.js
    "main": "./commonjs/index.cjs",
}
```

There's a lot to this feature, [which you can read more about on the Node.js documentation](https://nodejs.org/api/packages.html).
Here we'll try to focus on how TypeScript supports it.

With TypeScript's original Node support, it would look for a `"main"` field, and then look for declaration files that corresponded to that entry.
For example, if `"main"` pointed to `./lib/index.js`, TypeScript would look for a file called `./lib/index.d.ts`.
A package author could override this by specifying a separate field called `"types"` (e.g. `"types": "./types/index.d.ts"`).

The new support works similarly with [import conditions](https://nodejs.org/api/packages.html).
By default, TypeScript overlays the same rules with import conditions - if you write an `import` from an ES module, it will look up the `import` field, and from a CommonJS module, it will look at the `require` field.
If it finds them, it will look for a colocated declaration file.
If you need to point to a different location for your type declarations, you can add a `"types"` import condition.

```json5
// package.json
{
    "name": "my-package",
    "type": "module",
    "exports": {
        ".": {
            // Entry-point for TypeScript resolution - must occur first!
            "types": "./types/index.d.ts",

            // Entry-point for `import "my-package"` in ESM
            "import": "./esm/index.js",

            // Entry-point for `require("my-package") in CJS
            "require": "./commonjs/index.cjs",
        },
    },

    // CJS fall-back for older versions of Node.js
    "main": "./commonjs/index.cjs",

    // Fall-back for older versions of TypeScript
    "types": "./types/index.d.ts"
}
```

TypeScript also supports [the `"imports"` field of `package.json`](https://nodejs.org/api/packages.html#packages_imports) in a similar manner (looking for declaration files alongside corresponding files), and supports [packages self-referencing themselves](https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name).
These features are generally not as involved, but are supported.
