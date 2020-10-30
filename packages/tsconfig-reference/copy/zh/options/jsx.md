---
display: "JSX"
oneline: "JSX 代码生成"
---

控制 JSX 在 JavaScript 文件中的输出方式。
这只影响 `.tsx` 文件的 JS 文件输出。

- `react`: 将 JSX 改为等价的对 `React.createElement` 的调用并生成 `.js` 文件。
- `react-jsx`: 改为 `__jsx` 调用并生成 `.js` 文件。
- `react-jsxdev`: 改为 `__jsx` 调用并生成 `.js` 文件。
- `preserve`: 不对 JSX 进行改变并生成 `.jsx` 文件。
- `react-native`: 不对 JSX 进行改变并生成 `.js` 文件。

### 例

示例代码：

```tsx
export const helloWorld = () => <h1>Hello world</h1>;
```

默认为： `"react"`

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

保留: `"preserve"`

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
export const helloWorld = () => <h1>Hello world</h1>;
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
export const helloWorld = () => <h1>Hello world</h1>;
```

React 17 转换: `"react-jsx"`<sup>[[1]](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)</sup>

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
export const helloWorld = () => <h1>Hello world</h1>;
```

React 17 开发模式转换: `"react-jsxdev"`<sup>[[1]](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)</sup>

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
export const helloWorld = () => <h1>Hello world</h1>;
```
