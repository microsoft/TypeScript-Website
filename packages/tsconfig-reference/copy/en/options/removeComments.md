---
display: 'Remove Comments'
---

Strips all comments from TypeScript files when converting into JavaScript. Defaults to `true`.

For example, this is a TypeScript file which has a JSDoc comment:

```ts
/** The translation of 'Hello world' into Portuguese */
export declare const helloWorldPTBR = 'Olá Mundo'
```

Without setting `removeComments` or having it as `true`:

```ts twoslash
// @showEmit
// @removeComments: tru
/** The translation of 'Hello world' into Portuguese */
export declare const helloWorldPTBR = 'Olá Mundo'
```

When `removeComments` is set to `false`:

```ts twoslash
// @showEmit
// @removeComments: false
/** The translation of 'Hello world' into Portuguese */
export declare const helloWorldPTBR = 'Olá Mundo'
```

This means that your comments will show up in the JavaScript code.
