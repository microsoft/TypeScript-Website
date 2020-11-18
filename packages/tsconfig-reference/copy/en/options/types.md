---
display: "Types"
oneline: "Specify type package names to be included without being referenced in a source file."
---

By default all _visible_ "`@types`" packages are included in your compilation.
Packages in `node_modules/@types` of any enclosing folder are considered _visible_.
For example, that means packages within `./node_modules/@types/`, `../node_modules/@types/`, `../../node_modules/@types/`, and so on.

If `types` is specified, only packages listed will be included in the global scope. For instance:

```json tsconfig
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```

This `tsconfig.json` file will _only_ include `./node_modules/@types/node`, `./node_modules/@types/jest` and `./node_modules/@types/express`.
Other packages under `node_modules/@types/*` will not be included.

### What does this affect?

This option does not affect how `@types/*` are included in your application code, for example if you had the above `compilerOptions` example with code like:

```ts
import * as moment from "moment";

moment().format("MMMM Do YYYY, h:mm:ss a");
```

The `moment` import would be fully typed.

When you have this option set, by not including a module in the `types` array it:

- Will not add globals to your project (e.g `process` in node, or `expect` in Jest)
- Will not have exports appear as auto-import recommendations

This feature differs from [`typeRoots`](#typeRoots) in that it is about specifying only the exact types you want included, whereas [`typeRoots`](#typeRoots) supports saying you want particular folders.
