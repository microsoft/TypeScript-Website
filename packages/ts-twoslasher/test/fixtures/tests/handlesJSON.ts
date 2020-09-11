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
