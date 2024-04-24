---
display: "JSX Import Source"
oneline: "Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`."
---

Declares the module specifier to be used for importing the `jsx` and `jsxs` factory functions when using [`jsx`](#jsx) as `"react-jsx"` or `"react-jsxdev"` which were introduced in TypeScript 4.1.

With [React 17](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) the library supports a new form of JSX transformation via a separate import.

For example with this code:

```tsx
import React from "react";

function App() {
  return <h1>Hello World</h1>;
}
```

Using this TSConfig:

```json tsconfig
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react-jsx"
  }
}
```

The emitted JavaScript from TypeScript is:

```tsx twoslash
// @showEmit
// @noErrors
// @jsx: react-jsx
// @module: commonjs
// @target: esnext
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
import React from "react";

function App() {
  return <h1>Hello World</h1>;
}
```

For example if you wanted to use `"jsxImportSource": "preact"`, you need a tsconfig like:

```json tsconfig
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "types": ["preact"]
  }
}
```

Which generates code like:

```tsx twoslash
// @showEmit
// @jsxImportSource: preact
// @types: preact
// @jsx: react-jsx
// @target: esnext
// @module: commonjs
// @noErrors

export function App() {
  return <h1>Hello World</h1>;
}
```

Alternatively, you can use a per-file pragma to set this option, for example:

```tsx
/** @jsxImportSource preact */

export function App() {
  return <h1>Hello World</h1>;
}
```

Would add `preact/jsx-runtime` as an import for the `_jsx` factory.

_Note:_ In order for this to work like you would expect, your `tsx` file must include an `export` or `import` so that it is considered a module.
