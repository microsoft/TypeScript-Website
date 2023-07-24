---
display: "Composite"
oneline: "Enable constraints that allow a TypeScript project to be used with project references."
---

The `composite` option enforces certain constraints which make it possible for build tools (including TypeScript
itself, under `--build` mode) to quickly determine if a project has been built yet.

When this setting is on:

- The [`rootDir`](#rootDir) setting, if not explicitly set, defaults to the directory containing the `tsconfig.json` file.

- All implementation files must be matched by an [`include`](#include) pattern or listed in the [`files`](#files) array. If this constraint is violated, `tsc` will inform you which files weren't specified.

- [`declaration`](#declaration) defaults to `true`

You can find documentation on TypeScript projects in [the handbook](https://www.typescriptlang.org/docs/handbook/project-references.html).
