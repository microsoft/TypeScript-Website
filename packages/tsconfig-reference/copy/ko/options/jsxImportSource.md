---
display: "jsxImportSource"
oneline: "Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.`"
---

Typescript 4.1 버전에 소개 된 [jsx](#jsx)를 `"react-jsx"` 또는 `"react-jsxdev"`로 
사용 할 때, `jsx` 와 `jsxs` 내장 함수를 import하여 사용하는 
모듈 지정자(module specifier)를 선언합니다. 

[React 17](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)에서, 라이브러리는 독립 된 import를 통하여 새로운 형태의 JSX 변환을 지원해줍니다.

예를 들어: 

```tsx
import React from "react";

function App() {
  return <h1>Hello World</h1>;
}
```

TSConfig 사용할 때:

```json tsconfig
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react-jsx"
  }
}
```

TypeScript에서 컴파일 된 JavaScript는:

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

예를 들어, `"jsxImportSource": "preact"`를 사용하고 싶으시면, 다음과 같은 tsconfig를 이용하시면 됩니다:

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

다음과 같은 코드를 생성합니다:

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

또는, 파일 별 프래그마(per-file pragma)를 이용하여 다음과 같은 옵션을 설정할 수 있습니다:

```tsx
/** @jsxImportSource preact */

export function App() {
  return <h1>Hello World</h1>;
}
```

`_jsx`팩토리를 위한 import로서 `preact/jsx-runtime`를 추가합니다.

_노트:_ 의도한 대로 작동이 되려면, `tsx`파일은 `export` 또는 `import`를 추가해야만, 모듈로 간주됩니다.