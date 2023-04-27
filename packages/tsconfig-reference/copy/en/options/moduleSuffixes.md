---
display: "moduleSuffixes"
oneline: "List of file name suffixes to search when resolving a module."
---

Provides a way to override the default list of file name suffixes to search when resolving a module.
 
```json tsconfig
{
    "compilerOptions": {
        "moduleSuffixes": [".ios", ".native", ""]
    }
}
```

Given the above configuration, an import like the following:

```ts
import * as foo from "./foo";
```

TypeScript will look for the relative files `./foo.ios.ts`, `./foo.native.ts`, and finally `./foo.ts`.

Note the empty string `""` in [`moduleSuffixes`](#moduleSuffixes) which is necessary for TypeScript to also look-up `./foo.ts`. 

This feature can be useful for React Native projects where each target platform can use a separate tsconfig.json with differing `moduleSuffixes`.