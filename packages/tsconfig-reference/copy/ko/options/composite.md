---
display: "Composite"
oneline: "Enable constraints that allow a TypeScript project to be used with project references."
---

`composite` 옵션은 프로젝트가 제작되지 않았을 때, 빠른 결정을 하기 위해서 빌드 도구(`—build` 모드에서 TypeScript를 포함한)를 가능하게 만들기위해 특정 조건을 적용합니다.

이 설정이 켜져 있는 경우:

- 만약 `rootDir` 설정이 명백하게 설정되지 않은 경우, 기본값은 'tsconfig.json' 파일을 포함하는 디렉터리입니다.

- 모든 실행 파일은 `include` 패턴으로 일치하거나 `파일` 배열에 나열되어야 합니다. 만약 이 제약 조건을 위반하면, 'tsc'는 지정되지 않은 파일을 알려줍니다.

- `declaration`의 기본값은 `true` 입니다.

TypeScript 프로젝트에 대한 문서는 [the handbook](https://www.typescriptlang.org/docs/handbook/project-references.html)에서 확인할 수 있습니다.
