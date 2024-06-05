# @typescript/twoslash

## 3.2.7

### Patch Changes

- [#3000](https://github.com/microsoft/TypeScript-Website/pull/3000) [`71776ae`](https://github.com/microsoft/TypeScript-Website/commit/71776aecc1b56289ab56d240a9272ce83686ef1a) Thanks [@antfu](https://github.com/antfu)! - Handle `.d.cts` and `.d.mts` files

- Updated dependencies [[`0ea84b5`](https://github.com/microsoft/TypeScript-Website/commit/0ea84b59ae291aba677fe77ca059c4112e45fb9b), [`0ea84b5`](https://github.com/microsoft/TypeScript-Website/commit/0ea84b59ae291aba677fe77ca059c4112e45fb9b), [`6168ef4`](https://github.com/microsoft/TypeScript-Website/commit/6168ef49a4d08c0b5658732d23625bbcc6049109), [`9f8dea2`](https://github.com/microsoft/TypeScript-Website/commit/9f8dea2c19a3b6028148090f5e8cba8eea086ec3), [`26f3e56`](https://github.com/microsoft/TypeScript-Website/commit/26f3e566aa8fff235a8f6927ef2c33b28be4fe89), [`71776ae`](https://github.com/microsoft/TypeScript-Website/commit/71776aecc1b56289ab56d240a9272ce83686ef1a)]:
  - @typescript/vfs@1.5.3

## 3.2.6

### Patch Changes

- Updated dependencies [642ea11]
  - @typescript/vfs@1.5.2

## 3.2.5

### Patch Changes

- 46eba14: Initial bump for changesets
- Updated dependencies [46eba14]
  - @typescript/vfs@1.5.1

## 3.1.0

Adds support for `// ---cut-after---`, e.g.

````
```ts twoslash
const Page = () => (
// ---cut---
<Container>
  <ImportantComponent />
</Container>
// ---cut-after---
)
```
````

## 3.0.0

Changes the format of the `highlights` response from twoslash. It's very likely that no-one is using this, because none of the shiki infra is - but it's better to get this correct.

## 2.2.0

- Adds a new parameter to the twoslash config: `customTags`. This can be used to tell twoslash that you want to handle a specific `@tag` in the code sample. It comes out in the `tags` in `TwoSlashReturn`.

Prior to this change, any `// @something` which wasn't already in `ExampleOptions` would be passed to the TS compiler (maybe causing an exception if it's not a compiler option.) Now you can tell twoslash "I want to do something with this tag, let it through"

The use-case I'm thinking of is that shiki-twoslash may want to have it's own commands which sit on-top of twoslash, but I want to make sure that the internals of twoslash are all aligned correctly (think `--cut--` and the complex multi-file LSP logic) under the hood.

## 2.1.0

All "expected" errors from Twoslash are of the type `TwoslashError` which extends `Error`. This means you can catch the error and check its type, if it's a Twoslash error then it's something you can treat differently. In this case, that's being able to present a UI for those errors in shiki-twoslash as opposed to a critical process-ending exception.

## 2.0.0

- Removes HTML encoding from the Twoslash error rendered results. It's really not the responsibility of Twoslash to do that. I'm classing this as a major semver as folks could be relying on this behavior (all the shiki-twoslash stuff does for example.)

## 1.1.1

- Better handling of JSON files

## 1.1.0

- Adds a JS file into the npm tarball for using with a vanilla script tag, which sets `global.twoslash` with the main twoslash function. You need to include a copy of tsvfs beforehand.

Unpkg URLS:

- https://unpkg.com/browse/@typescript/vfs@dist/vfs.globals.js
- https://unpkg.com/browse/@typescript/twoslash@dist/twoslash.globals.js

## 1.0.2

- The `// @x`, `// ^?` and `// ^^^` comments ignore preceding whitespace

## 1.0.1

- Adds an option for declaring the project's root to overlay the vfs over: `vfsRoot`

## 1.0.0

- Supports falling back to _your project's_ node modules for resolving types and imports. This drastically simplifies setting up a code sample which relies on types not shipped with TypeScript.
- Support for adding vfs JSON files in a code sample

## 0.5.0

- Support TS 4.0
- Improvements to @showEmit and @showEmittedFile
- when `noStaticSemanticInfo` is enabled then you an still run queries
- better multi-file support
- `emit` handbook option actually emits all the JS/DTS files back to the vfs
- `noErrorValidation` is better supported

## 0.4.0

- Lines with `// prettier-ignore` are stripped, if you want to show it in a code sample, use `/** prettier-ignore */`
- You can request completions at a particular point in a file, note: the results come directly from TS and a
  useful but will definitely require some work to massage into being useful (they're un-ordered and un-prioritised.)
  To make your life easier it also includes a "completionsPrefix" which is the substring between the position indicated and the nearest dot or space, you can use that to filter the results.

You can see some results in the main README now.

```ts
const myString = ""
myString.s
//       ^?
```

## 0.3.0

Lots of work on the query engine, now it works across many files and multiple times in the same file. For example:

```ts
const a = "123"
//    ^?
const b = "345"
//    ^?
```

and

```ts
// @filename: index.ts
const a = "123"
//    ^?
// @filename: main-file-queries.ts
const b = "345"
//    ^?
```

Now returns correct query responses, I needed this for the bug workbench.
http://www.typescriptlang.org/dev/bug-workbench

Also has a way to set the defaults for the config

## 0.2.0

Initial public version of Twoslash. Good enough for using on the
TypeScript website, but still with a chunk of holes.
