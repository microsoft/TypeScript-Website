---
display: "Extends"
oneline: "Specify one or more path or node module references to base configuration files from which settings are inherited."
---

The value of `extends` is a string which contains a path to another configuration file to inherit from.
The path may use Node.js style resolution.

Since TypeScript 5.0, `extends` may also be an array of strings, in order to extend from multiple configuration files. In that case, configurations are applied in order from first to last, with later entries overriding earlier ones on conflict. The inheriting configuration file itself is applied last.

The configuration from the base file are loaded first, then overridden by those in the inheriting config file. All relative paths found in the configuration file will be resolved relative to the configuration file they originated in.

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

##### Example extending multiple files

In TypeScript 5.0 and later, `extends` can be set to an array of paths. Each entry is resolved using the same rules as the single-string form (relative path, Node.js-style package resolution, or a path into a package such as `@tsconfig/strictest/tsconfig.json`).

`tsconfig1.json`:

```json tsconfig
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

`tsconfig2.json`:

```json tsconfig
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```

`tsconfig.json`:

```json tsconfig
{
  "extends": ["./tsconfig1.json", "./tsconfig2.json"],
  "files": ["./index.ts"]
}
```

The resulting configuration enables both `strictNullChecks` and `noImplicitAny`. If both base files set the same option, the value from `tsconfig2.json` wins because it appears later in the array.
