---
title: Choosing Compiler Options
layout: docs
permalink: /docs/handbook/modules/guides/choosing-compiler-options.html
oneline: How to choose compiler options that reflect your module environment
translatable: true
---

## I’m writing an app

A single tsconfig.json can only represent a single environment, both in terms of what globals are available and in terms of how modules behave. If your app contains server code, DOM code, web worker code, test code, and code to be shared by all of those, each of those should have its own tsconfig.json, connected with [project references](https://www.typescriptlang.org/docs/handbook/project-references.html#handbook-content). Then, use this guide once for each tsconfig.json. For library-like projects within an app, especially ones that need to run in multiple runtime environments, use the “[I’m writing a library](#im-writing-a-library)” section.

### I’m using a bundler

In addition to adopting the following settings, it’s also recommended _not_ to set `{ "type": "module" }` or use `.mts` files in bundler projects for now. [Some bundlers](https://andrewbranch.github.io/interop-test/#synthesizing-default-exports-for-cjs-modules) adopt different ESM/CJS interop behavior under these circumstances, which TypeScript cannot currently analyze with `"moduleResolution": "bundler"`. See [issue #54102](https://github.com/microsoft/TypeScript/issues/54102) for more information.

```json5
{
  "compilerOptions": {
    // This is not a complete template; it only
    // shows relevant module-related settings.
    // Be sure to set other important options
    // like `target`, `lib`, and `strict`.

    // Required
    "module": "esnext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,

    // Consult your bundler’s documentation
    "customConditions": ["module"],

    // Recommended
    "noEmit": true, // or `emitDeclarationOnly`
    "allowImportingTsExtensions": true,
    "allowArbitraryExtensions": true,
    "verbatimModuleSyntax": true, // or `isolatedModules`
  }
}
```

### I’m compiling and running the outputs in Node.js

Remember to set `"type": "module"` or use `.mts` files if you intend to emit ES modules.

```json5
{
  "compilerOptions": {
    // This is not a complete template; it only
    // shows relevant module-related settings.
    // Be sure to set other important options
    // like `target`, `lib`, and `strict`.

    // Required
    "module": "nodenext",

    // Implied by `"module": "nodenext"`:
    // "moduleResolution": "nodenext",
    // "esModuleInterop": true,
    // "target": "esnext",

    // Recommended
    "verbatimModuleSyntax": true,
  }
}
```

### I’m using ts-node

ts-node attempts to be compatible with the same code and the same tsconfig.json settings that can be used to [compile and run the JS outputs in Node.js](#im-compiling-and-running-the-outputs-in-node). Refer to [ts-node documentation](https://typestrong.org/ts-node/) for more details.

### I’m using tsx

Whereas ts-node makes minimal modifications to Node.js’s module system by default, [tsx](https://github.com/esbuild-kit/tsx) behaves more like a bundler, allowing extensionless/index module specifiers and arbitrary mixing of ESM and CJS. Use the same settings for tsx as you [would for a bundler](#im-using-a-bundler).

### I’m writing ES modules for the browser, with no bundler or module compiler

TypeScript does not currently have options dedicated to this scenario, but you can approximate them by using a combination of the `nodenext` ESM module resolution algorithm and `paths` as a substitute for URL and import map support.

```json5
// tsconfig.json
{
  "compilerOptions": {
    // This is not a complete template; it only
    // shows relevant module-related settings.
    // Be sure to set other important options
    // like `target`, `lib`, and `strict`.

    // Combined with `"type": "module"` in a local package.json,
    // this enforces including file extensions on relative path imports.
    "module": "nodenext",
    "paths": {
      // Point TS to local types for remote URLs:
      "https://esm.sh/lodash@4.17.21": ["./node_modules/@types/lodash/index.d.ts"],
      // Optional: point bare specifier imports to an empty file
      // to prohibit importing from node_modules specifiers not listed here:
      "*": ["./empty-file.ts"]
    }
  }
}
```

This setup allows explicitly listed HTTPS imports to use locally-installed type declaration files, while erroring on imports that would normally resolve in node_modules:

```ts
import {} from "lodash";
//             ^^^^^^^^
// File '/project/empty-file.ts' is not a module. ts(2306)
```

Alternatively, you can use [import maps](https://github.com/WICG/import-maps) to explicitly map a list of bare specifiers to URLs in the browser, while relying on `nodenext`’s default node_modules lookups, or on `paths`, to direct TypeScript to type declaration files for those bare specifier imports:

```html
<script type="importmap">
{
  "imports": {
    "lodash": "https://esm.sh/lodash@4.17.21"
  }
}
</script>
```

```ts
import {} from "lodash";
// Browser: https://esm.sh/lodash@4.17.21
// TypeScript: ./node_modules/@types/lodash/index.d.ts
```

## I’m writing a library

<!-- TODO: I might move all this to a guide/appendix on library publishing and link -->

Choosing compilation settings as a library author is a fundamentally different process from choosing settings as an app author. When writing an app, settings are chosen that reflect the runtime environment or bundler—typically a single entity with known behavior. When writing a library, you would ideally check your code under _all possible_ library consumer compilation settings. Since this is impractical, you can instead use the strictest possible settings, since satisfying those tends to satisfy all others.

```json5
{
  "compilerOptions": {
    "module": "node16",
    "target": "es2020", // set to the *lowest* target you support
    "strict": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "sourceMap": true,
    "declarationMap": true
  }
}
```

Let’s examine why we picked each of these settings:

- **`module: "node16"`**. When a codebase is compatible with Node.js’s module system, it almost always works in bundlers as well. If you’re using a third-party emitter to emit ESM outputs, ensure that you set `"type": "module"` in your package.json so TypeScript checks your code as ESM, which uses a stricter module resolution algorithm in Node.js than CommonJS does.
- **``target: "es2020"``**. Setting this value to the _lowest_ ECMAScript version that you intend to support ensures the emitted code will not use language features introduced in a later version. Since `target` also implies a corresponding value for `lib`, this also ensures you don’t access globals that may not be available in older environments.
- **`strict: true`**. Without this, you may write type-level code that ends up in your output `.d.ts` files and errors when a consumer compiles with `strict` enabled. For example, this `extends` clause:
  ```ts
  export interface Super {
    foo: string;
  }
  export interface Sub extends Super {
    foo: string | undefined;
  }
  ```
  is only an error under `strictNullChecks`. On the other hand, it’s very difficult to write code that errors only when `strict` is _disabled_, so it’s highly recommended for libraries to compile with `strict`.
- **`verbatimModuleSyntax: true`**. This setting protects against a few module-related pitfalls that can cause problems for library consumers. First, it prevents writing any import statements that could be interpreted ambiguously based on the user’s value of `esModuleInterop` or `allowSyntheticDefaultImports`. Previously, it was often suggested that libraries compile without `esModuleInterop`, since its use in libraries could force users to adopt it too. However, it’s also possible to write imports that only work _without_ `esModuleInterop`, so neither value for the setting guarantees portability for libraries. `verbatimModuleSyntax` does provide such a guarantee.[^1] Second, it prevents the use of `export default` in modules that will be emitted as CommonJS, which can require bundler users and Node.js ESM users to consume the module differently. See the appendix on [ESM/CJS Interop](/docs/handbook/modules/appendices/esm-cjs-interop.html#library-code-needs-special-considerations) for more details.
- **`declaration: true`** emits type declaration files alongside the output JavaScript. This is needed for consumers of the library to have any type information.
- **`sourceMap: true`** and **`declarationMap: true`** emit source maps for the output JavaScript and type declaration files, respectively. These are only useful if the library also ships its source (`.ts`) files. By shipping source maps and source files, consumers of the library will be able to debug the library code somewhat more easily. By shipping declaration maps and source files, consumers will be able to see the original TypeScript sources when they run Go To Definition on imports from the libraries. Both of these represent a tradeoff between developer experience and library size, so it’s up to you whether to include them.

### Considerations for bundling libraries

If you’re using a bundler to emit your library, then all your (non-externalized) imports will be processed by the bundler with known behavior, not by your users’ unknowable environments. In this case, you can use `"module": "esnext"` and `"moduleResolution": "bundler"`, but only with two caveats:

1. TypeScript cannot model module resolution when some files are bundled and some are externalized. When bundling libraries with dependencies, it’s common to bundle the first-party library source code into a single file, but leave imports of external dependencies as real imports in the bundled output. This essentially means module resolution is split between the bundler and the end user’s environment. To model this in TypeScript, you would want to process bundled imports with `"moduleResolution": "bundler"` and externalized imports with `"moduleResolution": "nodenext"` (or with multiple options to check that everything will work in a range of end-user environments). But TypeScript cannot be configured to use two different module resolution settings in the same compilation. As a consequence, using `"moduleResolution": "bundler"` may allow imports of externalized dependencies that would work in a bundler but are unsafe in Node.js. On the other hand, using `"moduleResolution": "nodenext"` may impose overly strict requirements on bundled imports.
2. You must ensure that your declaration files get bundled as well. Recall the [first rule of declaration files](/docs/handbook/modules/theory.html#the-role-of-declaration-files): every declaration file represents exactly one JavaScript file. If you use `"moduleResolution": "bundler"` and use a bundler to emit an ESM bundle while using `tsc` to emit many individual declaration files, your declaration files may cause errors when consumed under `"module": "nodenext"`. For example, an input file like:

   ```ts
   import { Component } from "./extensionless-relative-import";
   ```

   will have its import erased by the JS bundler, but produce a declaration file with an identical import statement. That import statement, however, will contain an invalid module specifier in Node.js, since it’s missing a file extension. For Node.js users, TypeScript will error on the declaration file and infect types referencing `Component` with `any`, assuming the dependency will crash at runtime.

   If your TypeScript bundler does not produce bundled declaration files, use `"moduleResolution": "nodenext"` to ensure that the imports preserved in your declaration files will be compatible with end-users’ TypeScript settings. Even better, consider not bundling your library.

### Notes on dual-emit solutions

A single TypeScript compilation (whether emitting or just type checking) assumes that each input file will only produce one output file. Even if `tsc` isn’t emitting anything, the type checking it performs on imported names rely on knowledge about how the output file will behave at runtime, based on the module- and emit-related options set in the tsconfig.json. While third-party emitters are generally safe to use in combination with `tsc` type checking as long as `tsc` can be configured to understand what the other emitter will emit, any solution that emits two different sets of outputs with different module formats while only type checking once leaves (at least) one of the outputs unchecked. Because external dependencies may expose different APIs to CommonJS and ESM consumers, there’s no configuration you can use to guarantee in a single compilation that both outputs will be type-safe. In practice, most dependencies follow best practices and dual-emit outputs work. Running tests and [static analysis](https://npmjs.com/package/@arethetypeswrong/cli) against all output bundles before publishing significantly reduces the chance of a serious problem going unnoticed.

[^1]: `verbatimModuleSyntax` can only work when the JS emitter emits the same module kind as `tsc` would given the tsconfig.json, source file extension, and package.json `"type"`. The option works by enforcing that the `import`/`require` written is identical to the `import`/`require` emitted. Any configuration that produces both an ESM and a CJS output from the same source file is fundamentally incompatible with `verbatimModuleSyntax`, since its whole purpose is to prevent you from writing `import` anywhere that a `require` would be emitted. `verbatimModuleSyntax` can also be defeated by configuring a third-party emitter to emit a different module kind than `tsc` would—for example, by setting `"module": "esnext"` in tsconfig.json while configuring Babel to emit CommonJS.