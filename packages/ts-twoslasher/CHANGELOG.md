## 0.5.0

- Support TS 4.0
- Improvements to @showEmit and @showEmittedFile

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
http://www.staging-typescript.org/dev/bug-workbench

Also has a way to set the defaults for the config

## 0.2.0

Initial public version of Twoslash. Good enough for using on the
TypeScript website, but still with a chunk of holes.
