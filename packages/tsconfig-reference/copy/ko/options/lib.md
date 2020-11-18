---
display: "Lib"
oneline: "A list of bundled library declaration files which describe the target runtime environment."
---

TypeScript는 JS API(`Math` 와 같은)에 대한 기본적인 타입 정의와 브라우저 환경(`document` 와 같은)에 있는 타입 정의를 포함합니다. 
이 뿐만 아니라 TypeScript는 지정한 `target` 과 일치하는 최신 JS 기능을 위한 API도 포함되어 있습니다; 예를 들어 `target`이 `ES6` 이상이면 `Map` 에 대한 정의를 사용할 수 있습니다.

이는 몇 가지 이유에 의해 변경될 수 있습니다:

- 프로그램이 브라우저에서 동작하지 않아 `"dom"` 타입의 정의가 필요 없을 경우
- 런타임 플랫폼이 특정 JavaScript API 객체를 제공하지만(폴리필을 통해서) 아직 주어진 ECMAScript 버전의 문법을 일부 지원하지 않을 경우
- 더 높은 버전의 ECMAScript을 위한 폴리필이나 네이티브 구현이 있을 경우

### 상위 레벨 라이브러리

| Name         | Contents                                                     |
| ------------ | ------------------------------------------------------------ |
| `ES5`        | 모든 ES3 및 ES5 기능에 대한 핵심적인 정의                    |
| `ES2015`     | ES2015(또는 ES6로 알려진)에서 추가로 사용 가능한 API - `array.find`, `Promise`, `Proxy`, `Symbol`, `Map`, `Set`, `Reflect`, 기타 등등 |
| `ES6`        | "ES2015" 의 별칭                                             |
| `ES2016`     | ES2016에서 추가로 사용 가능한 API - `array.include`, 기타 등등 |
| `ES7`        | "ES2016" 의 별칭                                             |
| `ES2017`     | ES2017 에서 추가로 사용 가능한 API - `Object.entries`, `Object.values`, `Atomics`, `SharedArrayBuffer`, `date.formatToParts`, typed arrays, 기타 등등 |
| `ES2018`     | ES2018 에서 추가로 사용 가능한 API -  `async` iterables, `promise.finally`, `Intl.PluralRules`, `rexexp.groups`, 기타 등등 |
| `ES2019`     | ES2019 에서 추가로 사용 가능한 API - `array.flat`, `array.flatMap`, `Object.fromEntries`, `string.trimStart`, `string.trimEnd`, 기타 등등 |
| `ES2020`     | ES2020 에서 추가로 사용 가능한 API - `string.matchAll`, etc. |
| `ESNext`     | ESNext 에서 추가로 사용 가능한 API - 이는 JavaScript의 사양이 향상될 때 마다 변함. |
| `DOM`        | [DOM](https://developer.mozilla.org/docs/Glossary/DOM) 정의 - `window`, `document`, etc. |
| `WebWorker`  | [웹 워커(WebWorker)](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) 환경에서 추가로 사용 가능한 API |
| `ScriptHost` | [윈도우 스크립트 호스트 시스템(Windows Script Hosting System)](https://wikipedia.org/wiki/Windows_Script_Host) 을 위한 API |

### 개별적인 라이브러리 컴포넌트

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

위 목록들은 최신이 아닐수도 있습니다. 전체적인 목록은 [TypeScript의 소스 코드](https://github.com/microsoft/TypeScript/tree/master/lib) 에서 조회할 수 있습니다.
