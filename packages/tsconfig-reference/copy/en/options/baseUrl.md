---
display: "Base URL"
oneline: "Specify the base directory to resolve bare specifier module names."
---

This option is deprecated in TypeScript 6.0 and later.
It was designed for use in conjunction with AMD module loaders in the browser, and is not recommended in any other context.
As of TypeScript 4.1, `baseUrl` is no longer required to be set when using [`paths`](#paths).

If you previously used `baseUrl` as a common prefix for paths, move the prefix into the `paths` entries instead:

```json tsconfig
{
  "compilerOptions": {
    "paths": {
      "hello/*": ["./hello/*"]
    }
  }
}
```
