---
display: "JSX"
oneline: "Specify what JSX code is generated."
---

Controls how JSX constructs are emitted in JavaScript files.
This only affects output of JS files that started in `.tsx` files.

- `react`: Emit `.js` files with JSX changed to the equivalent `React.createElement` calls
- `react-jsx`: Emit `.js` files with the JSX changed to `_jsx` calls
- `react-jsxdev`: Emit `.js` files with the JSX changed to `_jsx` calls
- `preserve`: Emit `.jsx` files with the JSX unchanged
- `react-native`: Emit `.js` files with the JSX unchanged

### For example

This sample code:

```tsx
export const HelloWorld = () => <h1>Hello world</h1>;
```

Default: `"react"`

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
export const HelloWorld = () => <h1>Hello world</h1>;
```

Preserve: `"preserve"`

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: preserve
export const HelloWorld = () => <h1>Hello world</h1>;
```

React Native: `"react-native"`

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: react-native
export const HelloWorld = () => <h1>Hello world</h1>;
```

React 17 transform: `"react-jsx"`<sup>[[1]](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)</sup>

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: react-jsx
export const HelloWorld = () => <h1>Hello world</h1>;
```

React 17 dev transform: `"react-jsxdev"`<sup>[[1]](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)</sup>

```tsx twoslash
declare module JSX {
  interface Element {}
  interface IntrinsicElements {
    [s: string]: any;
  }
}
// @showEmit
// @noErrors
// @jsx: react-jsxdev
export const HelloWorld = () => <h1>Hello world</h1>;
```
