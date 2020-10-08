---
title: Using Babel with TypeScript
layout: docs
permalink: /ko/docs/handbook/babel-with-typescript.html
oneline: How to create a hybrid Babel + TypeScript project
translatable: true
---

## Babel vs TypeScript의 `tsc`

모던 JavaScript 프로젝트를 만들 때, TypeScript에서 JavaScript 파일로 변환하는 올바른 방법에 대해 고민할 수 있습니다.

많은 경우 그 대답은 프로젝트에 따라 _"~에 달려있다"_ 또는 _"누군가 여러분 대신 결정했을지도 모른다`_ 가 될 것입니다. 만약 [tsdx](https://www.npmjs.com/package/tsdx), [Angular](https://angular.io/), [NestJS](https://nestjs.com/)와 같은 기존 프레임워크 또는 [Getting Started](/docs/home)에 언급된 프레임워크를 사용하여 프로젝트를 만들고 있다면 결정은 여러분 손에 달려있습니다.

하지만, 사용할만한 직관적인 방법은 다음과 같습니다:

- 빌드 출력 결과와 소스 입력 파일이 거의 비슷한가요? `tsc`를 사용하세요.
- 여러 잠재적인 결과물을 내는 빌드 파이프라인이 필요하신가요? `babel`로 트랜스파일링을 하고, `tsc`로 타입을 검사하세요.

## 트랜스파일링은 Babel, 타입은 `tsc`

JavaScript 코드 베이스에서 TypeScript로 포팅되었을 수 있는 기존 빌드 인프라 구조를 가진 프로젝트의 일반적인 패턴입니다.

이 기술은, Babel의 [preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)을 사용하여 JS 파일을 생성한 후, TypeScript를 사용하여 타입 검사 및 `.d.ts` 파일을 생성하는 복합 접근 방식입니다.

Babel은 TypeScript를 지원하기 때문에, 기존 빌드 파이프라인으로 작업할 수 있고 Babel이 코드 타입을 검사하지 않기 때문에 JS 출력 시간이 더 빨라질 수 있습니다.

#### 타입 검사와 d.ts 파일 생성

Babel 사용의 단점은 TS를 JS로 전환하는 동안 타입 검사를 할 수 없다는 점입니다. 즉, 에디터에서 잡지 못한 타입 오류가 프로덕션 코드에 포함될 수도 있다는 뜻입니다.

또한, Babel은 TypeScript에 대한 `.d.ts` 파일을 만들 수 없기 때문에 여러분의 프로젝트가 라이브러리인 경우 작업하기가 더 어려워질 수 있습니다.

이러한 문제를 해결하려면 TSC를 사용하여 프로젝트의 타입을 검사할 수 있는 명령어를 설정하는 것이 좋습니다. 이는 Babel 구성의 일부를 해당 [`tsconfig.json`](/tconfig)에 복제하고, 다음 플래그가 활성화되었는지 확인하는 것을 의미합니다:

```json tsconfig
"compilerOptions": {
  // tsc를 사용해 .js 파일이 아닌 .d.ts 파일이 생성되었는지 확인합니다.
  "declaration": true,
  "emitDeclarationOnly": true,
  // Babel이 TypeScript 프로젝트의 파일을 안전하게 트랜스파일할 수 있는지 확인합니다.
  "isolatedModules": true
}
```

해당 플래그에 대한 자세한 내용은 다음을 참고해주세요:

- [`isolatedModules`](/tsconfig#isolatedModules)
- [`declaration`](/tsconfig#declaration), [`emitDeclarationOnly`](/tsconfig#emitDeclarationOnly)
