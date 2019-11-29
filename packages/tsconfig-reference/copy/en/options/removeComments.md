---
display: "Remove Comments"
---

Strips all comments from TypeScript files when converting into JavaScript. Defaults to being `true`.

For example, working this TypeScript file which has a JSDoc comment:

```ts
/** Used to show the user a hello message */
export declare const helloWorld = "hi";
```

Without setting `removeComments` or having it as `true`:

```ts twoslash
// @showEmit
// @removeComments: true
/** Used to show the user a hello message */
export declare const helloWorld = "hi";
```

When `removeComments` is set to `false`:

```ts twoslash
// @showEmit
// @removeComments: false
/** Used to show the user a hello message */
export declare const helloWorld = "hi";
```

This means your comments will show up in the JavaScript code.
