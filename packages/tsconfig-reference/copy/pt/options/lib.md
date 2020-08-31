---
display: "Biblioteca"
oneline: "Inclua definições de tipo que você sabe que estão disponíveis em seu tempo de execução de JavaScript"
---

O TypeScript inclui um conjunto padrão de definições de tipo para APIs JS embutidas (como `Math`), bem como definições de tipo para coisas encontradas em ambientes de navegador (como `document`).
TypeScript também inclui APIs para recursos JS mais recentes que correspondem ao `target` que você especifica; por exemplo, a definição para `Map` está disponível se `target` for `ES6` ou mais recente.

Você pode querer alterá-los por alguns motivos:

- Seu programa não roda em um navegador, então você não quer as definições do tipo `"dom"`
- Sua plataforma de tempo de execução fornece certos objetos de API JavaScript (talvez por meio de polyfills), mas ainda não suporta a sintaxe completa de uma determinada versão ECMAScript
- Você tem polyfills ou implementações nativas para alguns, mas não todos, de uma versão ECMAScript de nível superior

### Bibliotecas de alto nível

| Name         | Contents                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ES5`        | Definições básicas para todas as funcionalidades ES3 e ES5                                                                                                |
| `ES2015`     | APIs adicionais disponíveis no ES2015 (também conhecido como ES6) - `array.find`, `Promise`, `Proxy`, `Symbol`, `Map`, `Set`, `Reflect`, etc.               |
| `ES6`        | Alias for "ES2015"                                                                                                                                |
| `ES2016`     | APIs adicionais disponíveis no ES2016 - `array.include`, etc.                                                                                       |
| `ES7`        | Alias for "ES2016"                                                                                                                                |
| `ES2017`     | APIs adicionais disponíveis no ES2017 - `Object.entries`, `Object.values`, `Atomics`, `SharedArrayBuffer`, `date.formatToParts`, typed arrays, etc. |
| `ES2018`     | APIs adicionais disponíveis no ES2018 - `async` iterables, `promise.finally`, `Intl.PluralRules`, `rexexp.groups`, etc.                             |
| `ES2019`     | APIs adicionais disponíveis no ES2019 - `array.flat`,` array.flatMap`, `Object.fromEntries`, `string.trimStart`, `string.trimEnd`, etc.             |
| `ES2020`     | APIs adicionais disponíveis no ES2020 - `string.matchAll`, etc.                                                                                     |
| `ESNext`     | APIs adicionais disponíveis no ESNext - Isso muda conforme a especificação do JavaScript evolui                                                       |
| `DOM`        | [DOM](https://developer.mozilla.org/docs/Glossary/DOM) definitions - `window`, `document`, etc.                                                   |
| `WebWorker`  | APIs disponíveis em [Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) contexts                              |
| `ScriptHost` | APIs para o [Windows Script Hosting System](https://wikipedia.org/wiki/Windows_Script_Host)                                                      |

### Individual library components

| Name                      |
| ------------------------- |
| `DOM.Iterable`            |
| `ES2015.Core`             |
| `ES2015.Collection`       |
| `ES2015.Generator`        |
| `ES2015.Iterable`         |
| `ES2015.Promise`          |
| `ES2015.Proxy`            |
| `ES2015.Reflect`          |
| `ES2015.Symbol`           |
| `ES2015.Symbol.WellKnown` |
| `ES2016.Array.Include`    |
| `ES2017.object`           |
| `ES2017.Intl`             |
| `ES2017.SharedMemory`     |
| `ES2017.String`           |
| `ES2017.TypedArrays`      |
| `ES2018.Intl`             |
| `ES2018.Promise`          |
| `ES2018.RegExp`           |
| `ES2019.Array`            |
| `ES2019.Full`             |
| `ES2019.Object`           |
| `ES2019.String`           |
| `ES2019.Symbol`           |
| `ES2020.Full`             |
| `ES2020.String`           |
| `ES2020.Symbol.wellknown` |
| `ESNext.AsyncIterable`    |
| `ESNext.Array`            |
| `ESNext.Intl`             |
| `ESNext.Symbol`           |

Esta lista pode estar desatualizada, você pode ver a lista completa no [TypeScript source code](https://github.com/microsoft/TypeScript/tree/master/lib).
