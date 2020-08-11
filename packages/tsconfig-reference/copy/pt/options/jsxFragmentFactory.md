---
display: "jsxFragmentFactory"
oneline: "Faz alguma coisa"
---

Especifique a função de fábrica de fragmentos JSX para ser acionada ao direcionar o react JSX emitir com a opção do compilador `jsxFactory` especificada, por exemplo `Fragment`.

Esta opção pode ser usada como base por arquivo um muito semelhante a [Babel's `/** @jsxFrag h */` directive](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#fragments).

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
