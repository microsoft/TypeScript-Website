---
display: "Types"
---

By default all _visible_ "`@types`" packages are included in your compilation.
Packages in `node_modules/@types` of any enclosing folder are considered _visible_.
For example, that means packages within `./node_modules/@types/`, `../node_modules/@types/`, `../../node_modules/@types/`, and so on.

If `types` is specified, only packages listed will be included. For instance:

```json
{
  "compilerOptions": {
    "types": ["node", "lodash", "express"]
  }
}
```

This `tsconfig.json` file will _only_ include `./node_modules/@types/node`, `./node_modules/@types/lodash` and `./node_modules/@types/express`.
Other packages under `node_modules/@types/*` will not be included.

This feature differs from [`typeRoots`](#typeRoots) in that it is about specifying only the exact types you want included, whereas [`typeRoots`](#typeRoots) supports saying you want particular folders.
