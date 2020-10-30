//// { order: 1, target: "ES5" }

// JavaScript는 2016년에 import/export를 다시 추가하였고
// TypeScript는 파일들과 외부 모듈로의 연결에 관한
// 이 스타일을 완전히 지원합니다.
// TypeScript는 코드와 전달될 타입들을 허용함으로써
// 이 문법을 확장시킵니다.

// 모듈에서 코드를 import하는 것을 보겠습니다.

import { danger, message, warn, DangerDSLType } from "danger";

// danger라는 node 모듈에서 일련의 이름 붙은 import를 가져옵니다.
// 4개 이상의 import를 할 수 있지만,
// 이것들이 우리가 import하기로 선택한 것들입니다.

// 여러분이 무엇을 import하는지 이름을 구체적으로 적으면
// 앱에서 사용되지 않는 코드를 제거할 수 있으며
// 특정 파일에서 무엇이 사용되는지
// 쉽게 이해할 수 있습니다.

// 이 경우: danger, message, warn은 JavaScript import입니다.
// 반면 DangerDSLType은 인터페이스 타입입니다.

// TypeScript는 JSDoc을 이용하여 개발자의 코드를 문서화하며,
// 문서들은 또 import됩니다.
// 예를 들어 만약 아래의 서로 다른 부분들에 커서를 올리면,
// 각각에 대한 설명을 볼 수 있습니다.

danger.git.modified_files;

// 이러한 문서 표기를 제공하는 방법을 알고 싶다면
// example:jsdoc-support를 참고하세요.

// 코드를 import하는 다른 방식은
// 모듈의 default export를 사용하는 것입니다.
// 이 예제는 디버그 모듈로, 로그 기능을 하는 함수를 내보냅니다.

import debug from "debug";
const log = debug("playground");
log("Started running code");

// default export는 실제 이름이 없기 때문에,
// TypeScript의 리팩토링 지원과 같은
// 정적 분석 도구가 적용되었을 때 까다로울 수 있지만
// 각각의 사용법이 있습니다.

// JavaScript의 importing/exporting 코드에는 오랜 역사가 있기 때문에,
// default exports에는 헷갈리는 부분이 있습니다.
// 몇몇 export에 관한 문서에 따르면
// import를 아래와 같은 식으로 쓰는 것을 볼 수 있습니다.

import req from "request";

// 하지만 이것은 오류를 발생시키는데, stack overflow를 찾아보면
// import를 다음과 같이 제안합니다.

import * as req from "request";

// 그리고 이것은 작동합니다. 왜일까요?
// exporting에 대한 섹션의 끝부분에서 다시 확인해보겠습니다.

// import하기 위해서는, export할 수 있어야 합니다.
// export를 쓰는 최신 방식은 export 키워드를 쓰는 것입니다.

/** 현재 롤에 남아 있는 스티커 수 */
export const numberOfStickers = 11;

// 다른 파일에서 아래와 같이 import할 수 있습니다.
//
// import { numberOfStickers } from "./path/to/file"

// 하나의 파일에 원하는 만큼 많은 import를 할 수 있습니다.
// default export도 비슷합니다.

/** 스티커를 만들어 줍니다. */
const stickerGenerator = () => {};
export default stickerGenerator;

// 다른 파일에서 아래와 같이 import할 수 있습니다.
//
// import getStickers from "./path/to/file"
//
// 이름은 모듈을 사용하는 곳에서 붙입니다.

// 이는 import의 유일한 형태가 아니라 최신 코드의 가장 일반적인 방법입니다.
// 모듈 간의 경계를 넘나들 수 있는 코드의 모든 방식을 다루는 것은
// 핸드북에서 다루기에는 너무 긴 토픽입니다.
//
// https://www.typescriptlang.org/docs/handbook/modules.html

// 하지만, 마지막 질문을 해결해봅시다.
// 다음 예제의 JavaScript 코드를 보면 - 이것을 볼 수 있습니다:

// var stickerGenerator = function () { };
// exports.default = stickerGenerator;

// export의 기본 프로퍼티 객체를
// stickerGenerator로 설정합니다.
// export를 객체 대신 함수로 설정하는 코드가 있습니다.
//
// TypeScript는 그러한 경우들을 다루기 위해
// ECMAScript 표준을 선택헀고,
// 이를 통해 에러를 발생시킵니다.
// 하지만 자동으로 그러한 경우들을 해결해주는
// esModuleInterop이라는 컴파일러 세팅이 있습니다.
//
// 이 예제에 해당 세팅을 설정하면,
// 에러가 사라질 것입니다.
