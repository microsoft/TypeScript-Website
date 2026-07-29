# `@typescript/typescript6`

This package provides a `tsc6` command that runs TypeScript 6's `tsc`.

It also reexports the TypeScript 6 API, so you can import it in your code:

```ts
import ts6 from "@typescript/typescript6";
```

## Side-by-side with TypeScript 7

TypeScript 7 does not yet ship a stable programmatic API. For tools that still need the TypeScript 6 JS API (for example typescript-eslint), install this package alongside TypeScript 7 via npm aliases. See [Running Side-by-Side with TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

Recommended layout:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.2",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

## Package layout (`@typescript/old`)

This package depends on [`@typescript/old`](https://www.npmjs.com/package/@typescript/old) (`npm:typescript@^6`), which contains the real TypeScript 6 API implementation.

After install, `node_modules/typescript` (when aliased to this package) is a thin compatibility entrypoint. The large API bundle lives under:

```text
node_modules/@typescript/old/lib/typescript.js
```

If you use **path-based** ignores or excludes aimed at `node_modules/typescript/` (for example Jest `transformIgnorePatterns`, bundler excludes, or size checks), also cover `node_modules/@typescript/`. Otherwise tools may still process the ~8MB `@typescript/old` bundle.

Example (Jest):

```js
transformIgnorePatterns: [
  "/node_modules/typescript/",
  "/node_modules/@typescript/",
]
```
