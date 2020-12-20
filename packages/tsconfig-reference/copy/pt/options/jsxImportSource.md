---
display: "Fonte de importação jsx"
oneline: "O especificador de módulo para importar as funções factory jsx"
---

Declara o especificador de módulo a ser usado para importar as funções factory `jsx` e `jsxs` ao usar [`jsx`](#jsx) como `"react-jsx"` ou `"react-jsxdev"` que foi introduzido no TypeScript 4.1.

Com [React 17](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html), a biblioteca suporta uma nova forma de transformação JSX através de uma importação separada.

Por exemplo com este código:

```tsx
import React from "react";

function App() {
  return <h1>Olá Mundo</h1>;
}
```

Usando este TSConfig:

```json tsconfig
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react-jsx"
  }
}
```

O JavaScript gerado pelo TypeScript é:

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

Por exemplo se você quiser usar `"jsxImportSource": "preact"`, você precisa de um tsconfig como:

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

Que gera um código como:

```tsx twoslash
// @showEmit
// @jsxImportSource: preact
// @types: preact
// @jsx: react-jsx
// @target: esnext
// @module: commonjs
// @noErrors

export function App() {
  return <h1>Olá Mundo</h1>;
}
```

Ao invés disso, voce pode usar um pragma por arquivo para definir esta opção, por exemplo:

```tsx
/** @jsxImportSource preact */

export function App() {
  return <h1>Olá Mundo</h1>;
}
```

Adicionaria `preact/jsx-runtime` como uma importação para a factory `_jsx` 

_Nota:_ Para que isso funcione como você esperava, seu arquivo `tsx` deve incluir um `export` ou `import` para que seja considerado um módulo.
