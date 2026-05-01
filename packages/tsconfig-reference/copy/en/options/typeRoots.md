---
display: "Type Roots"
oneline: "Specify multiple folders that act like `./node_modules/@types`."
---

The `typeRoots` option specifies folders that act like `./node_modules/@types`.
It changes where TypeScript looks when resolving type package names from [`types`](#types) and `/// <reference types="..." />` directives.

In TypeScript 6.0 and later, [`types`](#types) defaults to `[]`, so specifying `typeRoots` does not by itself include every package under those folders.
List the packages you need in `types`, or specify `"types": ["*"]` to include all packages under the configured `typeRoots`.

For example:

```json tsconfig
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"],
    "types": ["node"]
  }
}
```

This config file will look for the `node` type package under `./typings` and `./vendor/types`, and will not look for it under `./node_modules/@types`.
All paths are relative to the `tsconfig.json`.

To include _all_ packages under `./typings` and `./vendor/types`, use:

```json tsconfig
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"],
    "types": ["*"]
  }
}
```
