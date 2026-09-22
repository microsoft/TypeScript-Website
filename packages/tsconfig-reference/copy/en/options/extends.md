---
display: "Extends"
oneline: "Specify one or more path or node module references to base configuration files from which settings are inherited."
---

The value of `extends` is a string which contains a path to another configuration file to inherit from, or an array of strings where each entry is a path to another configuration file to inherit from.
Each path may use Node.js style resolution.

The configuration from the base file is loaded first, then overridden by those in the inheriting config file. If `extends` is an array, each base configuration is loaded in order, with later entries overriding earlier entries. All relative paths found in the configuration file will be resolved relative to the configuration file they originated in.

It's worth noting that [`files`](#files), [`include`](#include), and [`exclude`](#exclude) from the inheriting config file _overwrite_ those from the
base config file, and that circularity between configuration files is not allowed.

Currently, the only top-level property that is excluded from inheritance is [`references`](#references).

#### Example

`configs/base.json`:

```json tsconfig
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

`tsconfig.json`:

```json tsconfig
{
  "extends": "./configs/base",
  "files": ["main.ts", "supplemental.ts"]
}
```

`tsconfig.backend.json`:

```json tsconfig
{
  "extends": ["./configs/base", "./configs/node"],
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

`tsconfig.nostrictnull.json`:

```json tsconfig
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "strictNullChecks": false
  }
}
```

Properties with relative paths found in the configuration file, which aren't excluded from inheritance, will be resolved relative to the configuration file they originated in.
