---
display: "jsxFragmentFactory"
oneline: "Specify the JSX Fragment reference to use for fragements when targeting React JSX emit, e.g. 'React.Fragment' or 'Fragment'."
---

コンパイラオプションに`jsxFactory`が指定されており、React JSXのコンパイルを目的とする場合に使用されるJSXフラグメントファクトリ関数(例: `Fragment`)を指定します。

例えば、次のTSConfigでは:

```json tsconfig
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}
```

このTSXファイルは:

```tsx
import { h, Fragment } from "preact";

const HelloWorld = () => (
  <>
    <div>Hello</div>
  </>
);
```

次のようになります:

```tsx twoslash
// @showEmit
// @showEmittedFile: index.js
// @jsxFactory: h
// @jsxFragmentFactory: Fragment
// @noErrors
// @target: esnext
// @module: commonjs

import { h, Fragment } from "preact";

const HelloWorld = () => (
  <>
    <div>Hello</div>
  </>
);
```

このオプションは[Babelの`/* @jsxFrag h */`ディレクティブ](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#fragments)とよく似ており、ファイル単位で使用できます。

例:

```tsx twoslash
/** @jsx h */
/** @jsxFrag Fragment */

import { h, Fragment } from "preact";

const HelloWorld = () => (
  <>
    <div>Hello</div>
  </>
);
```
