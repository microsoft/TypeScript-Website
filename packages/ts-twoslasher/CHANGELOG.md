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

## 0.2.0

Initial public version of Twoslash. Good enough for using on the
TypeScript website, but still with a chunk of holes.
