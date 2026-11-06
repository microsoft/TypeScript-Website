---
display: "noUncheckedSideEffectImports"
oneline: "Check side effect imports."
---

In JavaScript it's possible to `import` a module without actually importing any values from it.

```ts
import "some-module";
```

These imports are often called *side effect imports* because the only useful behavior they can provide is by executing some side effect (like registering a global variable, or adding a polyfill to a prototype).

By default, TypeScript will not check these imports for validity. If the import resolves to a valid source file, TypeScript will load and check the file.
If no source file is found, TypeScript will silently ignore the import.

This is surprising behavior, but it partially stems from modeling patterns in the JavaScript ecosystem.
For example, this syntax has also been used with special loaders in bundlers to load CSS or other assets.
Your bundler might be configured in such a way where you can include specific `.css` files by writing something like the following:

```tsx
import "./button-component.css";

export function Button() {
    // ...
}
```

Still, this masks potential typos on side effect imports.

When `--noUncheckedSideEffectImports` is enabled, TypeScript will error if it can't find a source file for a side effect import.

```ts
import "oops-this-module-does-not-exist";
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// error: Cannot find module or type declarations for side-effect import of
//        'oops-this-module-does-not-exist'.
```

When enabling this option, some working code may now receive an error, like in the CSS example above.
To work around this, users who want to just write side effect `import`s for assets might be better served by writing what's called an *ambient module declaration* with a wildcard specifier.
It would go in a global file and look something like the following:

```ts
// ./src/globals.d.ts

// Recognize all CSS files as module imports.
declare module "*.css" {}
```

In fact, you might already have a file like this in your project!
For example, running something like `vite init` might create a similar `vite-env.d.ts`.

#### Side effect imports of CSS from packages

A wildcard declaration like `declare module "*.css" {}` only matches specifiers that end in `.css`.
If a package exposes its stylesheet through a subpath without that extension, and TypeScript can't find a declaration file for that subpath, importing it still causes an error:

```ts
import "library-name/css";
//     ~~~~~~~~~~~~~~~~~~
// error: Cannot find module or type declarations for side-effect import of
//        'library-name/css'.
```

If you maintain such a package, the recommended fix is to ship a declaration file next to the stylesheet.
For a stylesheet at `./dist/style.css`, that file is `./dist/style.d.css.ts`:

```ts
// ./dist/style.d.css.ts
export {};
```

Users of the package then need to enable [`allowArbitraryExtensions`](#allowArbitraryExtensions).
Otherwise, TypeScript reports error TS6263, because the import resolves to a declaration file for a file with a non-standard extension.

Alternatively, you can add a `"types"` condition to the subpath in your `package.json`, pointing to a declaration file which only contains `export {};`.
This works without any setting in your users' projects:

```json
{
  "exports": {
    "./css": {
      "types": "./dist/style.d.ts",
      "default": "./dist/style.css"
    }
  }
}
```

```ts
// ./dist/style.d.ts
export {};
```

You can also expose the stylesheet through a subpath that ends in `.css`, like `library-name/style.css`, so that a `"*.css"` declaration in your users' projects matches it.

If you use a package which does none of these, you can declare the specifier yourself in a global file:

```ts
// ./src/globals.d.ts
declare module "library-name/css";
```

If a bundler already validates imports of non-code files like CSS in your project, you can instead set `noUncheckedSideEffectImports` to `false` and let the bundler handle them.
TypeScript then no longer reports any unresolved side effect import.
