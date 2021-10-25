---
display: "Lib"
oneline: "Specify a set of bundled library declaration files that describe the target runtime environment."
---

TypeScript includes a default set of type definitions for built-in JS APIs (like `Math`), as well as type definitions for things found in browser environments (like `document`).
TypeScript also includes APIs for newer JS features matching the [`target`](#target) you specify; for example the definition for `Map` is available if [`target`](#target) is `ES6` or newer.

You may want to change these for a few reasons:

- Your program doesn't run in a browser, so you don't want the `"dom"` type definitions
- Your runtime platform provides certain JavaScript API objects (maybe through polyfills), but doesn't yet support the full syntax of a given ECMAScript version
- You have polyfills or native implementations for some, but not all, of a higher level ECMAScript version

In TypeScript 4.5, lib files can be overriden by npm modules, find out more [in the blog](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#supporting-lib-from-node_modules).

### High Level libraries

| Name         | Contents                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ES5`        | Core definitions for all ES3 and ES5 functionality                                                                                                |
| `ES2015`     | Additional APIs available in ES2015 (also known as ES6) - `array.find`, `Promise`, `Proxy`, `Symbol`, `Map`, `Set`, `Reflect`, etc.               |
| `ES6`        | Alias for "ES2015"                                                                                                                                |
| `ES2016`     | Additional APIs available in ES2016 - `array.include`, etc.                                                                                       |
| `ES7`        | Alias for "ES2016"                                                                                                                                |
| `ES2017`     | Additional APIs available in ES2017 - `Object.entries`, `Object.values`, `Atomics`, `SharedArrayBuffer`, `date.formatToParts`, typed arrays, etc. |
| `ES2018`     | Additional APIs available in ES2018 - `async` iterables, `promise.finally`, `Intl.PluralRules`, `regexp.groups`, etc.                             |
| `ES2019`     | Additional APIs available in ES2019 - `array.flat`, `array.flatMap`, `Object.fromEntries`, `string.trimStart`, `string.trimEnd`, etc.             |
| `ES2020`     | Additional APIs available in ES2020 - `string.matchAll`, etc.                                                                                     |
| `ES2021`     | Additional APIs available in ES2021 - `promise.any`, `string.replaceAll` etc.                                                                     |
| `ESNext`     | Additional APIs available in ESNext - This changes as the JavaScript specification evolves                                                        |
| `DOM`        | [DOM](https://developer.mozilla.org/docs/Glossary/DOM) definitions - `window`, `document`, etc.                                                   |
| `WebWorker`  | APIs available in [WebWorker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) contexts                              |
| `ScriptHost` | APIs for the [Windows Script Hosting System](https://wikipedia.org/wiki/Windows_Script_Host)                                                      |
