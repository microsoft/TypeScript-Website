---
display: "Fábrica de fragmentos JSX"
oneline: "Faz alguma coisa"
---

Especifique a função que será a fábrica de fragmentos JSX para ser acionada ao usar o react JSX com a opção do compilador `jsxFactory` especificada, por exemplo `Fragment`.

Esta opção pode ser usada por arquivo, muito semelhante a [diretiva `/** @jsxFrag h */` do Babel](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#fragments).).

Por exemplo, com esse TSConfig:

```json
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

Temos esse arquivo TSX:

```tsx
import { h, Fragment } from "preact";

const OlaMundo = () => (
  <>
    <div>Olá</div>
  </>
);
```

Que seria equivalente, a esse arquivo TSX:

```tsx twoslash
// @showEmit
// @showEmittedFile: index.js
// @jsxFactory: h
// @jsxFragmentFactory: Fragment
// @noErrors
// @target: esnext
// @module: commonjs

import { h, Fragment } from "preact";

const OlaMundo = () => (
  <>
    <div>Olá</div>
  </>
);
```
