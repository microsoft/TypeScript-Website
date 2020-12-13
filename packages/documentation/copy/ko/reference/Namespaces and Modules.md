---
title: Namespaces and Modules
layout: docs
permalink: /ko/docs/handbook/namespaces-and-modules.html
oneline: How to organize code in TypeScript via modules or namespaces
translatable: true
---

이 게시물은 TypeScript의 모듈과 namespace를 사용하여 코드를 구성하는 다양한 방법에 관해 설명합니다. 
또한 namespace와 모듈을 사용하는 방법의 고급 주제들을 살펴보고, 그것들을 TypeScript에서 사용할 때 주의해야 할 일반적인 함정을 설명할 것입니다.

ES Module에 대한 자세한 내용은 [Modules](/docs/handbook/modules.html) 설명서를 참고하시길 바랍니다.
TypeScript namespace에 대한 자세한 내용은  [Namespaces](/docs/handbook/namespaces.html) 설명서를 참고하시길 바랍니다.

참고 : TypeScript namespace의 "매우" 예전 버전에서는 'Internal Modules'이라고 불렷으며, JavaScript 모듈 시스템 전 버전이다.

## Module 사용하기

모듈은 코드와 선언을 모두 포함할 수 있습니다.

모듈은 또한 모듈 로더 (예 : CommonJs/Require.js) 또는 ES Module을 지원하는 런타임에 대한 의존성을 갖습니다. 
모듈은 더 나은 코드의 재사용, 더 강력한 분리 및 번들링을 위한 더 나은 도구 지원을 제공합니다.

Node.js 어플리케이션의 경우, 모듈이 기본이고 **현대 코드에서는 namespace보다 모듈을 권장한다는 점**도 주목할 필요가 있을 것입니다.

ECMAScript 2015부터, 모듈은 언어의 기본 부분이며, 모든 호환 엔진 구현에서 지원되어야 합니다. 
따라서 새 프로젝트의 경우 모듈은 권장되는 코드 구성 매커니즘입니다.

## Namespaces 사용하기

Namespace는 코드를 구성하는 TypeScript만의 방법입니다.
Namespcae는 단순히 전역 namespace에서 이름이 지정된 JavaScript 객체입니다. 
이것은 Namespce를 사용하기 매우 간단한 구조로 만듭니다. 
모듈과 달리, 여러 파일에 걸쳐있을 수 있으며, `--outFile`를 사용하여 연결할 수 있습니다. 
Namespace는 HTML 페이지에  `<script>`로 포함된 모든 의존성을 가진 웹 어플리케이션에서 코드를 구조화하는 좋은 방법이 될 수 있습니다.

모든 글로벌 namespace 오염과 마찬가지로, 특히 큰 규모의 어플리케이션에서 구성 요소 의존성을 식별하기가 어려울 수 있습니다.

## Namespace와 모듈의 함정

이 섹션에서는 namespcae와 module을 사용할 때 발생하는 다양한 일반적인 함정과, 이를 피하는 방법에 관해 설명할 것입니다.

## `/// <reference>`-ing a module

일반적인 실수는 module 파일을 참조하기 위해 `import` 문 대신  `/// <reference ... />` 구문을 사용하는 것입니다. 
차이점을 이해하려면, 먼저 컴파일러가  `import` 의 경로(예 : in `import x from "...";`과 `import x = require("...");`안의 `...`, 등)를 기반으로 module에 대한 타입 정보를 찾는 방법을 이해해야 합니다.

컴파일러는 `.ts`, `.tsx`, 그리고 적절한 경로와 함께 `.d.ts`를 찾으려고 합니다. 
특정 파일을 찾을 수 없는 경우, 컴파일러는 _ambient module 선언_을 찾습니다. 
이것들은 `.d.ts` 파일에서 선언되어야 한다는 것을 상기하시기 바랍니다.

- `myModules.d.ts`

  ```ts
  // 모듈이 아닌 .d.ts 파일 또는 .ts 파일 :
  declare module "SomeModule" {
    export function fn(): string;
  }
  ```

- `myOtherModule.ts`

  ```ts
  /// <reference path="myModules.d.ts" />
  import * as m from "SomeModule";
  ```

여기에서 참조 태그를 사용하면 ambient module에 대한 선언이 포함된 선언 파일을 찾을 수 있습니다. 
여러 TypeScript 샘플에서 사용하는 `node.d.ts`파일이 사용되는 방식입니다.

## 불필요한 Namespacing

프로그램을 namespace에서 module로 변환하는 경우, 다음과 같은 파일로 쉽게 끝낼 수 있습니다 :

- `shapes.ts`

  ```ts
  export namespace Shapes {
    export class Triangle {
      /* ... */
    }
    export class Square {
      /* ... */
    }
  }
  ```

여기의 최상위 module인 `Shapes` 는 이유 없이 `Triangle` 와 `Square`를 래핑합니다. 
이것은 여러분의 module 소비자에게 혼란스럽고 짜증나는 일입니다 :

- `shapeConsumer.ts`

  ```ts
  import * as shapes from "./shapes";
  let t = new shapes.Shapes.Triangle(); // shapes.Shapes?
  ```

TypeScript에서 module의 주요 특징은 서로 다른 두 module이 동일한 스코프에 이름을 제공하지 않는다는 것입니다. 
module의 소비자가 어떤 이름을 할당할지 결정하므로, 내보낸 export한 기호를 namespace에 미리 포장할 필요가 없습니다.

Module 내용을 namespcae 해서는 안 되는 이유를 반복해서 설명하기 위해, namespace의 일반적인 아이디어는 구성의 논리적 그룹화를 제공하는 것이며, 이름 충돌을 방지하는 것입니다. 
Module 파일 자체는 이미 논리적으로 그룹화되어 있고, 최상위 레벨의 이름은 그것을 import 하는 코드로 정의되어 있으므로, export 된 객체에 추가적인 module 레이어를 사용할 필요가 없습니다.

수정된 예는 다음과 같습니다 :

- `shapes.ts`

  ```ts
  export class Triangle {
    /* ... */
  }
  export class Square {
    /* ... */
  }
  ```

- `shapeConsumer.ts`

  ```ts
  import * as shapes from "./shapes";
  let t = new shapes.Triangle();
  ```

## Module의 Trade-off

JS 파일과 module 사이에 일대일 서신이 있는 것처럼, TypeScript는 소스 파일과 송신된 JS파일 사이에 일대일 서신이 있습니다. 
이것의 한 가지 효과는 여러분이 목표하는 module 시스템에 따라 module 소스 파일을 연결할 수 없다는 것입니다. 
예를 들어  `commonjs`나 `umd`를 대상으로 할 때, `outFile`을 사용할 수 없지만, TypeScript 1.8 이상에서는, `amd` 나 `system`을 대상으로 할 때  `outFile`을 사용하는 것이  [가능합니다.](./release-notes/typescript-1-8.html#concatenate-amd-and-system-modules-with---outfile) 
