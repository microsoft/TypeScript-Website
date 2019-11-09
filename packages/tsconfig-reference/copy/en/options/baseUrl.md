---
display: "Base Url"
---

Lets you set a base directory to resolve non-absolute module names. 

TODO: "non-absolute" - is this only relative imports or does it include named imports like a package?

You can define a root folder where you can do absolute file resolution. E.g.

```sh
baseUrl/
├── ex.ts
├── hello
│   └── world.ts
└── tsconfig.json
```

With `"baseUrl": "./"` inside this project TypeScript will look for files starting at the same folder as the `tsconfig.json`.

```ts
import { helloWorld } from "hello/world"

console.log(helloWorld)
```

If you get tired of imports always looking like `"../"` or `"./"`. Or needing
to change as you move files, this is a great way to fix that.
