---
display: "Paths"
oneline: "Specify a set of entries that re-map imports to additional lookup locations."
---

A series of entries which re-map imports to lookup locations relative to the [`baseUrl`](#baseUrl). There is a larger coverage of `paths` in [the handbook](/docs/handbook/module-resolution.html#path-mapping).

`paths` lets you declare how TypeScript should resolve an import in your `require`/`import`s.

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // this mapping is relative to "baseUrl"
    }
  }
}
```

This would allow you to be able to write `import "jquery"`, and get all of the correct typing locally.

```json tsconfig
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
