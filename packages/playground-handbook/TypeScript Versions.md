### TypeScript Versions

The TypeScript Playground supports TypeScript versions all the way back to `3.3.3` (which was versioned as [`3.3.3333`](https://github.com/Microsoft/TypeScript/issues/30032)) up to the latest nightly build.

The ability to switch the version of TypeScript makes it easy to figure out regressions and to be able to let people test out new language features without having to upgrade their projects to (potentially) an unstable version of TypeScript. You can access the list of production TypeScript versions via a dropdown in the editor's toolbar inside the Playground.

The dropdown shows the highest patch version for a TypeScript release, but that is not every version available. You can refer to these two JSON files for the full list of [release versions](https://typescript.azureedge.net/indexes/releases.json) and [pre-release versions](https://typescript.azureedge.net/indexes/pre-releases.json).

Setting a TypeScript version will append `?ts=[version]` to your URL and reload. For example, setting the TypeScript version to 4.3.5 will add `?ts=4.3.5`.
