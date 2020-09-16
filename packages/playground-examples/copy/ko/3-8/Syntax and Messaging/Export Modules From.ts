//// { compiler: { ts: "3.8.3" } }
// TypeScript의 다시 export 하는 기능을 통해
// ES2018에서 이용할 수 있는 추가 사례들을 지원하는 데에 더 가까워졌습니다.

// JavaScript export는 dependency 일부를
// 우아하게 다시 export 할 수 있도록 합니다:

export { ScriptTransformer } from "@jest/transform";

// 객체 전체를 export 하고 싶다면,
// 이전 버전의 TypeScript에서 
// 조금 더 장황해집니다:

import * as console from "@jest/console";
import * as reporters from "@jest/reporters";

export { console, reporters };

// TypeScript 3.8은,
// JavaScript 사양의 export 보다 더 많은 양식을 제공하여,
// 한 줄에 모듈을 다시 export 할 수 있도록 합니다.

export * as jestConsole from "@jest/console";
export * as jestReporters from "@jest/reporters";
