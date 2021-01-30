//// { order: 3, isJavaScript: true }

// TypeScript는 매우 많은 JSDoc 지원을 제공하며
// 많은 경우에서 .ts 파일을 건너뛸 수도 있고
// JSDoc 어노테이션을 사용하여 풍부한 개발환경을 만들 수도 있습니다.
//
// JSDoc 주석은 별표가 1개 대신에 2개로 시작하는
// 멀티라인 주석입니다.

/* 일반 주석입니다 */
/** JSDoc 주석입니다 */

// JSDoc 주석은 밑에 있는 가장 가까운
// JavaScript 코드에 첨부합니다.

const myVariable = "Hi";

// myVariable에 호버한다면,
// 내부에서 첨부된 JSDoc 주석 내용을 볼 수 있습니다.

// JSDoc 주석은 TypeScript와 에디터에게 타입 정보를 제공하는 방법입니다.
// 하나의 변수의 타입을 기본 제공된 타입으로
// 설정하는 방법을 사용하여 시작해봅시다.

// 모든 예제에서 이름에 호버할 수 있으며,
// 다음 라인에서 [example]. 을 작성하고
// 자동완성 옵션을 확인해 보세요.

/** @type {number} */
var myNumber;

// 핸드북에서 지원하는 모든 태그를 확인하실 수 있습니다:
//
// https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc

// 하지만, 여기에서 좀 더 일반적인 예제를 더 살펴볼 것입니다.
// 여러분은 핸드북에서 어떠한 예시도
// 이곳에 복사 & 붙여넣기를 하실 수 있습니다.

// JavaScript configuration 파일에 대한 타입을 가져오기:

/** @type { import("webpack").Config } */
const config = {};

// 여러 곳에서 재사용할 복합 타입을 생성하기:

/**
 * @typedef {Object} User - User 계정
 * @property {string} displayName - 표시할 이름
 * @property {number} id - 고유 id
 */

// 그러고 나서 typedef 이름을 참조하여 복합 타입을 사용합니다:

/** @type { User } */
const user = {};

// type과 typedef 모두 사용할 수 있는
// TypeScript 호환 인라인 타입 줄임말이 있습니다:

/** @type {{ owner: User, name: string }} */
const resource;

/** @typedef {{owner: User, name: string}} Resource */

/** @type {Resource} */
const otherResource;

// 타입을 명시한 함수 선언:

/**
 * 두 개의 숫자를 같이 추가합니다
 * @param {number} a 첫 번째 숫자
 * @param {number} b 두 번째 숫자
 * @returns {number}
 */
function addTwoNumbers(a, b) {
  return a + b;
}

// 유니온 타입처럼 대부분의 TypeScript 타입 도구를 사용할 수 있습니다:

/** @type {(string | boolean)} */
let stringOrBoolean = "";
stringOrBoolean = false;

// JSDoc에서 전역 파일을 확장하는 것은
// VS Code 문서에서 볼 수 있는 더 복잡한 프로세스입니다:
//
// https://code.visualstudio.com/docs/nodejs/working-with-javascript#_global-variables-and-type-checking

// 함수에 JSDoc 주석을 추가하는 것은
// 여러분이 더 좋은 도구를 얻게 되고 여러분의 모든 API 사용자들도 그럴 것이므로
// 서로가 win-win 하는 상황입니다.