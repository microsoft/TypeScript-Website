---
display: "Checar JS"
oneline: "Executa o verificador de tipos em arquivos .js do seu projeto"
---

Funciona em conjunto com o `allowJs`. Quando o `checkJs` está ativado, os erros são relatados também nos arquivos JavaScript. Isto é
o equivalente a incluir `// @ts-check` na parte superior de todos os arquivos JavaScript incluídos no seu projeto.

Por exemplo, este é um JavaScript incorreto, de acordo com a definição do tipo `parseFloat` que acompanha o TypeScript:

```js
// parseFloat só recebe uma string
module.exports.pi = parseFloat(3.124);
```

Quando importado em um módulo TypeScript:

```ts twoslash
// @allowJs
// @filename: constantes.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constantes";
console.log(pi);
```

Você não vai obter nenhum erro. No entanto, se você ativar o `checkJs` então voce também terá mensagens de erro no seu arquivo JavaScript.

```ts twoslash
// @errors: 2345
// @allowjs: true
// @checkjs: true
// @filename: constantes.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constantes";
console.log(pi);
```
