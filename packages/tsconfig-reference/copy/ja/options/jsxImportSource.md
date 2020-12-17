---
display: "jsxImportSource"
oneline: "The module specifier for importing the jsx factory functions"
---

TypeScript 4.1で導入された`"react-jsx"`や`"react-jsxdev"`を[`jsx`](#jsx)に指定する際に`jsx`と`jsxs`のファクトリ関数をインポートするモジュール指定子を宣言します。

[React 17](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)では、それぞれのインポートによる新しいJSXの変換がサポートされています。

例えば、このコードで:

```tsx
import React from "react";

function App() {
  return <h1>Hello World</h1>;
}
```

次のようなTSConfigの場合:

```json tsconfig
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react-jsx"
  }
}
```

TypeScriptからコンパイルされるJavaScriptは次のようになります:

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

`"jsxImportSource": "preact"`を使用する場合、tsconfigは次のようになり:

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

以下のようなコードが生成されます:

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

あるいは、ファイル単位のディレクティブを使ってこのオプションを設定することもできます。例えば:

```tsx
/** @jsxImportSource preact */

export function App() {
  return <h1>Hello World</h1>;
}
```

これにより、`_jsx`ファクトリをインポートする`preact/jsx-runtime`が追加されます。

_注意:_ このオプションを期待通りに動作させるには、`tsx`ファイルに`export`または`import`を含める必要があります。これにより、ファイルはモジュールとみなされます。
