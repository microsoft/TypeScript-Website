---
title: tsc CLI Options
layout: docs
permalink: /docs/handbook/compiler-options.html
oneline: A very high-level overview of the CLI compiler options for tsc
disable_toc: true
---

<!-- This file is auto-generated, see packages/tsconfig-reference/scripts/cli/generateMarkdown.ts -->

## Using the CLI

Running `tsc` locally will compile the closest project defined by a `tsconfig.json`, you can compile a set of TypeScript
files by passing in a glob of files you want.

```sh
# Run a compile based on a backwards look through the fs for a tsconfig.json
tsc

# Transpile just the index.ts with the compiler defaults
tsc index.ts

# Transpile any .ts files in the folder src, with the default settings
tsc src/*.ts

# Transpile any files referenced in with the compiler settings from tsconfig.production.json
tsc --project tsconfig.production.json
```

## Compiler Options

**If you're looking for more information about the compiler options in a tsconfig, check out the [TSConfig Reference](/tsconfig)**
