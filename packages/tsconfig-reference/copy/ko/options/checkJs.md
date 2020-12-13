---
display: "Check JS"
oneline: "Enable error reporting in type-checked JavaScript files."
---

`allowJs`와 함께 작동합니다. `checkJs` 이 사용가능하다면 에러는 JavaScript 파일에 보고됩니다. 이것은 당신의 프로젝트에 포함된 모든 JavaScript 파일의 제일 위에 `// @ts-check`을 포함하는 것과 동일합니다.

예를 들어, TypeScript와 함께 제공되는 `parseFloat` 에 따르면 이것은 잘못된 JavaScript입니다 :

```js
// parseFloat only takes a string
module.exports.pi = parseFloat(3.124);
```

이것을 TypeScript 모듈로 import 한다면 :

```ts twoslash
// @allowJs
// @filename: constants.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```

당신은 어떠한 에러도 발생시키지 않을 것입니다. 하지만, 만약 당신이 `checkJs` 를 킨다면 당신은 JavaScript 파일로부터 얻을 것입니다.

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
