---
display: "jsxFragmentFactory"
oneline: "Menentukan pengidentifikasi fragmen JSX akan diubah seperti apa"
---

Menentukan fungsi penghasil fragmen JSX yang akan digunakan ketika menargetkan kompiler react JSX `jsxFactory` sudah ditentukan, misalnya seperti `Fragment`.

Opsi ini dapat digunakan pada basis per file juga seperti halnya [Babel's `/** @jsxFrag h */` directive](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#fragments).

Contoh dengan menggunakan TSConfig berikut ini:

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

TSX file berikut:

```tsx
import { h, Fragment } from "preact";

const HelloWorld = () => (
  <>
    <div>Hello</div>
  </>
);
```

Akan terlihat seperti:

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
