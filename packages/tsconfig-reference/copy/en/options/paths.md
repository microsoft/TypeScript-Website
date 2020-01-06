---
display: "Paths"
oneline: "A set of locations to look for imports in"
---

A series of entries which re-map imports to lookup locations relative to the `baseUrl`, there is a larger coverage of `paths` in [the handbook](/docs/handbook/module-resolution.html#path-mapping).

`paths` lets you declare how TypeScript should resolve an import in your `require`/`import`s.

```json
{
  "compilerOptions": {
    "baseUrl": ".", // this must be specified if "paths" is specified.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // this mapping is relative to "baseUrl"
    }
  }
}
```

This would allow you to be able to write `import "jquery"`, and get all of the correct typing locally.

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
        "app/*": ["app/*"],
        "config/*": ["app/_config/*"],
        "environment/*": ["environments/*"],
        "shared/*": ["app/_shared/*"],
        "helpers/*": ["helpers/*"],
        "tests/*": ["tests/*"]
    },
}
```

In this case, you can tell the TypeScript file resolver to support a number of custom prefixes to find code.
This pattern can be used to avoid long relative paths within your codebase.
