---
display: "Resolve JSON Module"
---

Allows importing modules with a '.json' extension, which is a common practice in node projects. This includes
generating a type for the `import` based on the static JSON shape.

TypeScript does not support resolving JSON files by default:

```ts twoslash
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

Enabling the option allows importing JSON, and validating the types in that JSON file.

```ts twoslash
// @resolveJsonModule: true
// @esModuleInterop: true
// @errors: 2307
// @filename: index.ts
import settings from "./settings.json";

settings.debug === true;
settings.dry === 2;
// @filename: settings.json
{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
```

