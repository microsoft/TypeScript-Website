---
title: Project References
layout: docs
permalink: /docs/handbook/project-references.html
oneline: How to split up a large TypeScript project
translatable: true
---

Project references are a new feature in TypeScript 3.0 that allow you to structure your TypeScript programs into smaller pieces.

By doing this, you can greatly improve build times, enforce logical separation between components, and organize your code in new and better ways.

We're also introducing a new mode for `tsc`, the `--build` flag, that works hand in hand with project references to enable faster TypeScript builds.

## An Example Project

Let's look at a fairly normal program and see how project references can help us better organize it.
Imagine you have a project with two modules, `converter` and `units`, and a corresponding test file for each:

```
/
├── src/
│   ├── converter.ts
│   └── units.ts
├── test/
│   ├── converter-tests.ts
│   └── units-tests.ts
└── tsconfig.json
```

The test files import the implementation files and do some testing:

```ts
// converter-tests.ts
import * as converter from "../src/converter";

assert.areEqual(converter.celsiusToFahrenheit(0), 32);
```

Previously, this structure was rather awkward to work with if you used a single tsconfig file:

- It was possible for the implementation files to import the test files
- It wasn't possible to build `test` and `src` at the same time without having `src` appear in the output folder name, which you probably don't want
- Changing just the _internals_ in the implementation files required _typechecking_ the tests again, even though this wouldn't ever cause new errors
- Changing just the tests required typechecking the implementation again, even if nothing changed

You could use multiple tsconfig files to solve _some_ of those problems, but new ones would appear:

- There's no built-in up-to-date checking, so you end up always running `tsc` twice
- Invoking `tsc` twice incurs more startup time overhead
- `tsc -w` can't run on multiple config files at once

Project references can solve all of these problems and more.

## What is a Project Reference?

`tsconfig.json` files have a new top-level property, [`references`](/tsconfig#references). It's an array of objects that specifies projects to reference:

```js tsconfig
{
    "compilerOptions": {
        // The usual
    },
    "references": [
        { "path": "../src" }
    ]
}
```

The `path` property of each reference can point to a directory containing a `tsconfig.json` file, or to the config file itself (which may have any name).

When you reference a project, new things happen:

- Importing modules from a referenced project will instead load its _output_ declaration file (`.d.ts`)
- If the referenced project produces an [`outFile`](/tsconfig#outFile), the output file `.d.ts` file's declarations will be visible in this project
- Build mode (see below) will automatically build the referenced project if needed

By separating into multiple projects, you can greatly improve the speed of typechecking and compiling, reduce memory usage when using an editor, and improve enforcement of the logical groupings of your program.

## `composite`

Referenced projects must have the new [`composite`](/tsconfig#composite) setting enabled.
This setting is needed to ensure TypeScript can quickly determine where to find the outputs of the referenced project.
Enabling the [`composite`](/tsconfig#composite) flag changes a few things:

- The [`rootDir`](/tsconfig#rootDir) setting, if not explicitly set, defaults to the directory containing the `tsconfig` file
- All implementation files must be matched by an [`include`](/tsconfig#include) pattern or listed in the [`files`](/tsconfig#files) array. If this constraint is violated, `tsc` will inform you which files weren't specified
- [`declaration`](/tsconfig#declaration) must be turned on

## `declarationMap`s

We've also added support for [declaration source maps](https://github.com/Microsoft/TypeScript/issues/14479).
If you enable [`declarationMap`](/tsconfig#declarationMap), you'll be able to use editor features like "Go to Definition" and Rename to transparently navigate and edit code across project boundaries in supported editors.

## `prepend` with `outFile`

You can also enable prepending the output of a dependency using the `prepend` option in a reference:

```js
   "references": [
       { "path": "../utils", "prepend": true }
   ]
```

Prepending a project will include the project's output above the output of the current project.
All output files (`.js`, `.d.ts`, `.js.map`, `.d.ts.map`) will be emitted correctly.

`tsc` will only ever use existing files on disk to do this process, so it's possible to create a project where a correct output file can't be generated because some project's output would be present more than once in the resulting file.
For example:

```txt
   A
  ^ ^
 /   \
B     C
 ^   ^
  \ /
   D
```

It's important in this situation to not prepend at each reference, because you'll end up with two copies of `A` in the output of `D` - this can lead to unexpected results.

## Caveats for Project References

Project references have a few trade-offs you should be aware of.

Because dependent projects make use of `.d.ts` files that are built from their dependencies, you'll either have to check in certain build outputs _or_ build a project after cloning it before you can navigate the project in an editor without seeing spurious errors.

When using VS Code (since TS 3.7) we have a behind-the-scenes in-memory `.d.ts` generation process that should be able to mitigate this, but it has some perf implications. For very large composite projects you might want to disable this using [disableSourceOfProjectReferenceRedirect option](/tsconfig#disableSourceOfProjectReferenceRedirect).

Additionally, to preserve compatibility with existing build workflows, `tsc` will _not_ automatically build dependencies unless invoked with the `--build` switch.
Let's learn more about `--build`.

## Build Mode for TypeScript

A long-awaited feature is smart incremental builds for TypeScript projects.
In 3.0 you can use the `--build` flag with `tsc`.
This is effectively a new entry point for `tsc` that behaves more like a build orchestrator than a simple compiler.

Running `tsc --build` (`tsc -b` for short) will do the following:

- Find all referenced projects
- Detect if they are up-to-date
- Build out-of-date projects in the correct order

You can provide `tsc -b` with multiple config file paths (e.g. `tsc -b src test`).
Just like `tsc -p`, specifying the config file name itself is unnecessary if it's named `tsconfig.json`.

### `tsc -b` Commandline

You can specify any number of config files:

```shell
 > tsc -b                            # Use the tsconfig.json in the current directory
 > tsc -b src                        # Use src/tsconfig.json
 > tsc -b foo/prd.tsconfig.json bar  # Use foo/prd.tsconfig.json and bar/tsconfig.json
```

Don't worry about ordering the files you pass on the commandline - `tsc` will re-order them if needed so that dependencies are always built first.

There are also some flags specific to `tsc -b`:

- [`--verbose`](/tsconfig#verbose): Prints out verbose logging to explain what's going on (may be combined with any other flag)
- `--dry`: Shows what would be done but doesn't actually build anything
- `--clean`: Deletes the outputs of the specified projects (may be combined with `--dry`)
- [`--force`](/tsconfig#force): Act as if all projects are out of date
- `--watch`: Watch mode (may not be combined with any flag except [`--verbose`](/tsconfig#verbose))

## Caveats

Normally, `tsc` will produce outputs (`.js` and `.d.ts`) in the presence of syntax or type errors, unless [`noEmitOnError`](/tsconfig#noEmitOnError) is on.
Doing this in an incremental build system would be very bad - if one of your out-of-date dependencies had a new error, you'd only see it _once_ because a subsequent build would skip building the now up-to-date project.
For this reason, `tsc -b` effectively acts as if [`noEmitOnError`](/tsconfig#noEmitOnError) is enabled for all projects.

If you check in any build outputs (`.js`, `.d.ts`, `.d.ts.map`, etc.), you may need to run a [`--force`](/tsconfig#force) build after certain source control operations depending on whether your source control tool preserves timestamps between the local copy and the remote copy.

## MSBuild

If you have an msbuild project, you can enable build mode by adding

```xml
    <TypeScriptBuildMode>true</TypeScriptBuildMode>
```

to your proj file. This will enable automatic incremental build as well as cleaning.

Note that as with `tsconfig.json` / `-p`, existing TypeScript project properties will not be respected - all settings should be managed using your tsconfig file.

Some teams have set up msbuild-based workflows wherein tsconfig files have the same _implicit_ graph ordering as the managed projects they are paired with.
If your solution is like this, you can continue to use `msbuild` with `tsc -p` along with project references; these are fully interoperable.

## Guidance

### Overall Structure

With more `tsconfig.json` files, you'll usually want to use [Configuration file inheritance](/docs/handbook/tsconfig-json.html) to centralize your common compiler options.
This way you can change a setting in one file rather than having to edit multiple files.

Another good practice is to have a "solution" `tsconfig.json` file that simply has [`references`](/tsconfig#references) to all of your leaf-node projects and sets [`files`](/tsconfig#files) to an empty array (otherwise the solution file will cause double compilation of files). Note that starting with 3.0, it is no longer an error to have an empty [`files`](/tsconfig#files) array if you have at least one `reference` in a `tsconfig.json` file.

This presents a simple entry point; e.g. in the TypeScript repo we simply run `tsc -b src` to build all endpoints because we list all the subprojects in `src/tsconfig.json`

You can see these patterns in the TypeScript repo - see `src/tsconfig_base.json`, `src/tsconfig.json`, and `src/tsc/tsconfig.json` as key examples.

### Structuring for relative modules

In general, not much is needed to transition a repo using relative modules.
Simply place a `tsconfig.json` file in each subdirectory of a given parent folder, and add `reference`s to these config files to match the intended layering of the program.
You will need to either set the [`outDir`](/tsconfig#outDir) to an explicit subfolder of the output folder, or set the [`rootDir`](/tsconfig#rootDir) to the common root of all project folders.

### Structuring for outFiles

Layout for compilations using [`outFile`](/tsconfig#outFile) is more flexible because relative paths don't matter as much.
One thing to keep in mind is that you'll generally want to not use `prepend` until the "last" project - this will improve build times and reduce the amount of I/O needed in any given build.
The TypeScript repo itself is a good reference here - we have some "library" projects and some "endpoint" projects; "endpoint" projects are kept as small as possible and pull in only the libraries they need.

<!--
### Structuring for monorepos

TODO: Experiment more and figure this out. Rush and Lerna seem to have different models that imply different things on our end
-->
