---
display: "Resolve JSON Module"
---

Allows importing modules with a '.json' extension, which is a common practice in node projects. This includes
generating a type for the import based on the static JSON shape.

```ts twoslash
// @resolveJsonModule
// @esModuleInterop
// @errors: 2307
// @filename: settings.json
{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
// @filename: index.ts
import settings from "./settings.json";

settings.debug === true;
settings.dry === 2;
```
