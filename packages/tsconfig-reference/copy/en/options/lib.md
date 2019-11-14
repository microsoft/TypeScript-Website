---
display: "Lib"
---

**Default**: At a minimum `["dom"]`, plus more depending on `target`

TypeScript includes a default set of type definitions for built-in JS APIs (like `Math`), as well as type definitions for things found in browser environments (like `document`).
TypeScript also includes APIs for newer JS features matching the `target` you specify; for example the definition for `Map` is available if `target` is `ES6` or newer.

You may want to change these for a few reasons:
 * Your program doesn't run in a browser, so you don't want the `"dom"` type definitions
 * Your runtime platform provides certain JavaScript API objects (maybe through polyfills), but doesn't yet support the full syntax of a given ECMAScript version
 * You have polyfills or native implementations for some, but not all, of a higher level ECMAScript version

| Name                    | Contents / Notes           |
|-------------------------|----------------------------|
| ES5                     | Core definitions for all ES3 and ES5 functionality |
| ES2015                  | Additional APIs available in ES2015 (also known as ES6) |
| ES6                     | Alias for "ES2015" |
| ES2016                  | Additional APIs available in ES2016 |
| ES7                     | Alias for "ES2016" |
| ES2017                  | Additional APIs available in ES2017 |
| ES2018                  | Additional APIs available in ES2017 |
| ESNext                  | Additional APIs available in ESNext |
| DOM                     | DOM definitions (`window`, `document`, etc.) |
| DOM.Iterable            | |
| WebWorker               | APIs available in WebWorker contexts |
| ScriptHost              | |
| ES2015.Core             | |
| ES2015.Collection       | |
| ES2015.Generator        | |
| ES2015.Iterable         | |
| ES2015.Promise          | |
| ES2015.Proxy            | |
| ES2015.Reflect          | |
| ES2015.Symbol           | |
| ES2015.Symbol.WellKnown | |
| ES2016.Array.Include    | |
| ES2017.object           | |
| ES2017.Intl             | |
| ES2017.SharedMemory     | |
| ES2017.String           | |
| ES2017.TypedArrays      | |
| ES2018.Intl             | |
| ES2018.Promise          | |
| ES2018.RegExp           | |
| ESNext.AsyncIterable    | |
| ESNext.Array            | |
| ESNext.Intl             | |
| ESNext.Symbol           | |
