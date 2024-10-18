---
title: What is a tsconfig.json
layout: docs
permalink: /docs/handbook/tsconfig-json.html
oneline: Learn about how a TSConfig works
translatable: true
---

## Overview

The presence of a `tsconfig.json` file in a directory indicates that the directory is the root of a TypeScript project.
The `tsconfig.json` file specifies the root files and the compiler options required to compile the project.

JavaScript projects can use a `jsconfig.json` file instead, which acts almost the same but has some [JavaScript-related flags enabled by default](#jsconfig-defaults).

A project is compiled in one of the following ways:

## Using `tsconfig.json` or `jsconfig.json`

- By invoking tsc with no input files, in which case the compiler searches for the `tsconfig.json` file starting in the current directory and continuing up the parent directory chain.
- By invoking tsc with no input files and a `--project` (or just `-p`) command line option that specifies the path of a directory containing a `tsconfig.json` file, or a path to a valid `.json` file containing the configurations.

When input files are specified on the command line, `tsconfig.json` files are ignored.

## Examples

Example `tsconfig.json` files:

- Using the [`files`](/tsconfig#files) property

  ```json tsconfig
  {
    "compilerOptions": {
      "module": "commonjs",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "sourceMap": true
    },
    "files": [
      "core.ts",
      "sys.ts",
      "types.ts",
      "scanner.ts",
      "parser.ts",
      "utilities.ts",
      "binder.ts",
      "checker.ts",
      "emitter.ts",
      "program.ts",
      "commandLineParser.ts",
      "tsc.ts",
      "diagnosticInformationMap.generated.ts"
    ]
  }
  ```

- Using the [`include`](/tsconfig#include) and [`exclude`](/tsconfig#exclude) properties

  ```json  tsconfig
  {
    "compilerOptions": {
      "module": "system",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "outFile": "../../built/local/tsc.js",
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["**/*.spec.ts"]
  }
  ```

## TSConfig Bases

Depending on the JavaScript runtime environment which you intend to run your code in, there may be a base configuration which you can use at [github.com/tsconfig/bases](https://github.com/tsconfig/bases/).
These are `tsconfig.json` files which your project extends from which simplifies your `tsconfig.json` by handling the runtime support.

For example, if you were writing a project which uses Node.js version 12 and above, then you could use the npm module [`@tsconfig/node12`](https://www.npmjs.com/package/@tsconfig/node12):

```json tsconfig
{
  "extends": "@tsconfig/node12/tsconfig.json",

  "compilerOptions": {
    "preserveConstEnums": true
  },

  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]
}
```

This lets your `tsconfig.json` focus on the unique choices for your project, and not all of the runtime mechanics. There are a few tsconfig bases already, and we're hoping the community can add more for different environments.

## Details

The `"compilerOptions"` property can be omitted, in which case the compiler's defaults are used. See our full list of supported [Compiler Options](/tsconfig).

## JSConfig Defaults

A `jsconfig.json` enforces different defaults, being equivalent to the following `tsconfig.json`:

``` json tsconfig
{
  "compilerOptions": {
    "allowJs": true,
    "maxNodeModuleJsDepth": 2,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "typeAcquisition": {
    "enable": true
  }
}
```

## TSConfig Reference

To learn more about the hundreds of configuration options in the [TSConfig Reference](/tsconfig).

## Schema

The `tsconfig.json` Schema can be found at [the JSON Schema Store](http://json.schemastore.org/tsconfig).
