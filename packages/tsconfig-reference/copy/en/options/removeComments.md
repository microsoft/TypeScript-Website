---
display: "Remove Comments"
oneline: "Remove comments in TypeScript from appearing in JavaScript"
---

Strips all comments from TypeScript files when converting into JavaScript. Defaults to `true`.

For example, this is a TypeScript file which has a JSDoc comment:

```ts
/** The translation of 'Hello world' into Portuguese */
export const helloWorldPTBR = "Olá Mundo";
```

When `removeComments` is set to `true`:

```ts twoslash
// @showEmit
// @removeComments: true
/** The translation of 'Hello world' into Portuguese */
export const helloWorldPTBR = "Olá Mundo";
```

Without setting `removeComments` or having it as `false`:

```ts twoslash
// @showEmit
// @removeComments: false
/** The translation of 'Hello world' into Portuguese */
export const helloWorldPTBR = "Olá Mundo";
```

This means that your comments will show up in the JavaScript code.
