---
display: "Check JS"
oneline: "Permite el reporte de errores en archivos con extensión de JavaScript"
---

Trabaja en conjunto con `allowJs`. Cuando `checkJs` está habilitado entonces los errores son reportados en archivos JavaScript. Esto es el
equivalente a incluir `// @ts-check` en la parte superior de todos los archivos JavaScript que están incluidos en tu proyecto.

Por ejemplo, lo siguiente es incorrecto de acuerdo a la definición `parseFloat` que viene con TypeScript.

```js
// parseFloat solo toma un string
module.exports.pi = parseFloat(3.124);
```

Cuando es importado a un modulo TypeScript:

```ts twoslash
// @allowJs
// @filename: constants.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```

No obtendrás ningún error. Sin embargo, si habilitas `checkJs` entonces obtendrás mensajes de error del archivo JavaScript.

```ts twoslash
// @errors: 2345
// @allowjs: true
// @checkjs: true
// @filename: constants.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```
