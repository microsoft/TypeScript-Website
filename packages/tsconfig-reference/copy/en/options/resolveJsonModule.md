---
display: "Resolve JSON Module"
oneline: "Enable importing .json files."
---

Allows importing modules with a `.json` extension, which is a common practice in node projects. This includes
generating a type for the `import` based on the static JSON shape.

TypeScript does not support resolving JSON files by default:

```ts twoslash
// @errors: 2732
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
// @errors: 2367
// @resolveJsonModule
// @module: commonjs
// @moduleResolution: node
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
