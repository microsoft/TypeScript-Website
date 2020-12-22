---
display: "jsxFragmentFactory"
oneline: "Specify the JSX Fragment reference to use for fragements when targeting React JSX emit, e.g. 'React.Fragment' or 'Fragment'."
---

`Fragment`와 같이, `JsxFactory` 컴파일러 옵션이 지정된 react JSX 출력을 목표로 할 때 사용할 JSX 프래그먼트 팩토리 함수를 지정합니다.

예를 들어 이 TSConfig의 경우:

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

이 TSX 파일은:

```tsx
import { h, Fragment } from "preact";

const HelloWorld = () => (
  <>
    <div>Hello</div>
  </>
);
```

다음과 같을 것입니다:

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

이 옵션은 [바벨의 `/* @jsxFrag h */` 지시문](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#fragments)과 매우 유사한 파일 단위로 사용이 가능합니다.

예를 들어:

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
