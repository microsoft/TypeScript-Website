---
display: "Paths"
oneline: "Specify a set of entries that re-map imports to additional lookup locations."
---

A series of entries which re-map imports to lookup locations relative to the [`baseUrl`](#baseUrl) if set, or to the tsconfig file itself otherwise. There is a larger coverage of `paths` in [the handbook](/docs/handbook/module-resolution.html#path-mapping).

`paths` lets you declare how TypeScript should resolve an import in your `require`/`import`s.

```json tsconfig
{
  "compilerOptions": {
    "paths": {
      "jquery": ["./vendor/jquery/dist/jquery"]
    }
  }
}
```

This would allow you to be able to write `import "jquery"`, and get all of the correct typing locally.

```json tsconfig
{
  "compilerOptions": {
    "paths": {
        "app/*": ["./src/app/*"],
        "config/*": ["./src/app/_config/*"],
        "environment/*": ["./src/environments/*"],
        "shared/*": ["./src/app/_shared/*"],
        "helpers/*": ["./src/helpers/*"],
        "tests/*": ["./src/tests/*"]
    },
}
```

In this case, you can tell the TypeScript file resolver to support a number of custom prefixes to find code.

Note that this feature does not change how import paths are emitted by `tsc`, so `paths` should only be used to inform TypeScript that another tool has this mapping and will use it at runtime or when bundling.
