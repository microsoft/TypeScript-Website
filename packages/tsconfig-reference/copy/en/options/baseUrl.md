---
display: "Base URL"
oneline: "Specify the base directory to resolve non-relative module names."
---

Sets a base directory from which to resolve non-relative module names. For example, in the directory structure:

```
project
├── ex.ts
├── hello
│   └── world.ts
└── tsconfig.json
```

With `"baseUrl": "./"`, TypeScript will look for files starting at the same folder as the `tsconfig.json`:

```ts
import { helloWorld } from "hello/world";

console.log(helloWorld);
```

This resolution has higher priority than lookups from `node_modules`.

This feature was designed for use in conjunction with AMD module loaders in the browser, and is not recommended in any other context. As of TypeScript 4.1, `baseUrl` is no longer required to be set when using [`paths`](#paths).