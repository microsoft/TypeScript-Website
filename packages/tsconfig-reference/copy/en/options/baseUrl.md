---
display: "Base Url"
oneline: "Specify the base directory to resolve non-relative module names."
---

Lets you set a base directory to resolve non-absolute module names.

You can define a root folder where you can do absolute file resolution. E.g.

```
baseUrl
├── ex.ts
├── hello
│   └── world.ts
└── tsconfig.json
```

With `"baseUrl": "./"` inside this project TypeScript will look for files starting at the same folder as the `tsconfig.json`.

```ts
import { helloWorld } from "hello/world";

console.log(helloWorld);
```

If you get tired of imports always looking like `"../"` or `"./"`, or needing
to change them as you move files, this is a great way to fix that.
