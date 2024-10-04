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
// error: Cannot find module 'oops-this-module-does-not-exist' or its corresponding
//        type declarations.
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
