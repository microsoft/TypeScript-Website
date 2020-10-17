//// { order: 3, isJavaScript: true }

// Node.js는 Chrome V8 JavaScript 엔진을 기반으로
// 구축된 매우 유명한 JavaScript 런타임입니다.
// 이것을 사용해 서버, 프론트엔드 클라이언트 및 그 사이 모든 것을 구축할 수 있습니다.

// https://nodejs.org/

// Node.js는 JavaScript 런타임을 확장한 주요 라이브러리와 함께 제공됩니다.
// 라이브러리는 경로 처리부터:

import { join } from "path";
const myPath = join("~", "downloads", "todo_list.json");

// 파일 조작에 이르기까지 다양합니다:

import { readFileSync } from "fs";
const todoListText = readFileSync(myPath, "utf8");

// JSDoc-style 타입을 사용하면 JavaScript 프로젝트에 점진적으로
// 타입을 추가할 수 있습니다. JSON 구조를 기반으로
// TODO 리스트 항목을 만들어보겠습니다:

/**
 * @typedef {Object} TODO TODO 항목
 * @property {string} title TODO 항목 표기명
 * @property {string} body TODO 항목에 대한 설명
 * @property {boolean} done TODO 항목 완료 여부
 */

// 이제 이 값을 JSON.parse 반환 값에 할당합니다.
// 더 자세한 내용은, 예:jsdoc-support를 참조하십시오.

/** @type {TODO[]} TODO 리스트 */
const todoList = JSON.parse(todoListText);

// 그리고 프로세스 처리 과정은 다음과 같습니다:
import { spawnSync } from "child_process";
todoList
  .filter(todo => !todo.done)
  .forEach(todo => {
    // ghi 클라이언트를 사용해 아직 완료되지 않은
    // 모든 todo 리스트 항목에 대한 이슈를 생성합니다.

    // 아래와 같이 'todo.title'를 강조 표시하면
    // JS에서 자동완성 및 문서가 올바르게 표시됩니다.
    spawnSync(`ghi open --message "${todo.title}\n${todo.body}"`);
  });

// TypeScript에는 DefinitelyTyped을 통해 내장된
// 모든 모듈에 대한 최신 타입 정의가 있습니다.
// 이는 강력한 타입 적용 범위 안에서 node 프로그램을 작성할 수 있음을 의미합니다.
