---
display: "JSX"
oneline: "Control how JSX is emitted"
---

Controls how JSX constructs are emitted in JavaScript files.
This only affects output of JS files that started in `.tsx` files.

- `react`: Emit `.js` files with JSX changed to the equivalent `React.createElement` calls
- `preserve`: Emit `.jsx` files with the JSX unchanged
- `react-native`: Emit `.js` files with the JSX unchanged

<!-- This is blocked on https://github.com/microsoft/TypeScript-Website/issues/860

### For example

This sample code:

```ts
export const helloWorld = () => <h1>Hello world</h1>;
```

Default: ("react")

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
export const helloWorld = () => <h1>Hello world</h1>;
```

Preserve:

```ts twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: preserve
export const helloWorld = () => <h1>Hello world</h1>;
```

React Native:

````ts twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: react-native
export const helloWorld = () => <h1>Hello world</h1>;
````
-->
