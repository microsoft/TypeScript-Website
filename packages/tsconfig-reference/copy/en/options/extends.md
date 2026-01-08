---
display: "Extends"
oneline: "Specify one or more path or node module references to base configuration files from which settings are inherited."
---

The value of `extends` is a string or array of strings which contains a path to another configuration file to inherit from.
The path may use Node.js style resolution.

When using an array, the configurations are applied from left to right, with later entries overriding earlier ones. This allows you to compose multiple base configurations together.

The configuration from the base file are loaded first, then overridden by those in the inheriting config file. All relative paths found in the configuration file will be resolved relative to the configuration file they originated in.

It's worth noting that [`files`](#files), [`include`](#include), and [`exclude`](#exclude) from the inheriting config file _overwrite_ those from the
base config file, and that circularity between configuration files is not allowed.

Currently, the only top-level property that is excluded from inheritance is [`references`](#references).

##### Example

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

`tsconfig.nostrictnull.json`:

```json tsconfig
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "strictNullChecks": false
  }
}
```

`tsconfig.multiple.json`:

```json tsconfig
{
  "extends": ["./configs/base", "./configs/strict"],
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

Properties with relative paths found in the configuration file, which aren't excluded from inheritance, will be resolved relative to the configuration file they originated in.

Properties with relative paths found in the configuration file, which aren't excluded from inheritance, will be resolved relative to the configuration file they originated in.
