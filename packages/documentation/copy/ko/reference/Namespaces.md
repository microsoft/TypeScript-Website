---
title: Namespaces
layout: docs
permalink: ko/docs/handbook/namespaces.html
oneline: How TypeScript namespaces work
translatable: true
---

> **용어에 대한 참고 사항:**
> 유의할 점은 TypeScript 1.5에서 명칭이 변경되었다는 것입니다. "Internal modules"은 이제 "namespaces"입니다. "External modules"은 이제  [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/)'s terminology와 용어를 일치하기 위해 간단히 "moduls"입니다, (이름대로 `module X {`은 현재 선호되는 `namespace X {`와 동일합니다).

이 게시물은 TypeScript에서 namespaces(이전의 "internal modules")를 사용하여 코드를 작성하는 다양한 방법에 대해서 간략히 설명합니다. 우리가 용어에 대한 참고사항에 언급했듯이, "internal modules"는 이제 "namespaces"라고 불립니다. 또한 internal modules를 선언할 때 `module` 키워드를 사용한 어디에서나 `namespace` 키워드는 사용될 수 있고 대신 사용해야만 합니다. 이것은 유사하게 명명된 용어의 중복사용으로 인해 새로운 사용자를 혼란스럽게 하는 것을 방지한다.

## 첫 번째 단계

이 페이지 전체에서 우리가 예시로 사용할 프로그램을 시작해봅시다. 우리는 웹 페이지의 양식에 적힌 사용자의 입력을 확인하거나 외부에서 제공된 데이터 파일의 형식을 확인하기 위해 작성할 수 있는, 간단한 문자열 검증기 세트를 작성하였습니다.

## 단일 파일에서의 검증

```ts
interface StringValidator {
  isAcceptable(s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
  isAcceptable(s: string) {
    return lettersRegexp.test(s);
  }
}

class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}

// 시도할 몇몇 샘플들
let strings = ["Hello", "98052", "101"];

// 사용할 검증
let validators: { [s: string]: StringValidator } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// 각 문자열이 각각의 검증을 통과하는지 보여줌
for (let s of strings) {
  for (let name in validators) {
    let isMatch = validators[name].isAcceptable(s);
    console.log(`'${s}' ${isMatch ? "matches" : "does not match"} '${name}'.`);
  }
}
```

## Namespacing

검증을 더 추가함에 따라, 우리는 타입을 추적하고 다른 객체와의 이름 충돌에 대해 걱정하지 않도록 일종의 조직 체계를 갖기를 원할 것입니다. 전역 namespace에 많은 다른 이름들을 넣는 대신, 우리의 개체를 namespace로 래핑합시다.

이 예에서, 우리는 모든 검증 관련 엔터티를 `Validation`이라는 namespace로 이동시킬 것입니다. 우리는 여기에서 인터페이스와 클래스를 namespace 외부에서 표시되기를 원하기 때문에, 우리는 `export`를 앞에 적습니다. 반대로, 변수 `lettersRegexp` 와 `numberRegexp` 는 구현 세부사항이기 때문에, export되지 않은 채로 남아있으며 namespace 외부 코드에서 보이지 않습니다. 파일 하단의 테스트 코드에서는, namespace 외부에서 사용할 때 우리는 타입들의 이름을 한정해야합니다. (예 : `Validation.LettersOnlyValidator`)

## Namespaced Validators

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/;
  const numberRegexp = /^[0-9]+$/;

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}

// 시도할 몇몇 샘플들
let strings = ["Hello", "98052", "101"];

// 사용할 검증
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// 각 문자열이 각각의 검증을 통과하는지 보여줌
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```

## 파일들로 분할하기

우리의 어플리케이션이 성장함에 따라, 우리는 유지 보수가 용이하도록 코드를 여러 파일로 분할하고 싶을 것이다.

## Multi-file namespaces

여기, 우리는 우리의 `Validation` namespace를 많은 파일들로 나눌 것이다. 파일들이 따로 있어도, 각각 같은 namespace에 기여할 수 있고 한 곳에서 정의된 것처럼 사용될 수 있다. 파일들에는 종속성이 존재하기 때문에, 우리는 참조 태그를 추가하여 컴파일러에게 파일들간의 관계를 알려줄 것이다. 그렇지 않으면 테스트 코드는 변경되지 않는다.

##### Validation.ts

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

##### LettersOnlyValidator.ts

```ts
/// <reference path="Validation.ts" />
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

##### ZipCodeValidator.ts

```ts
/// <reference path="Validation.ts" />
namespace Validation {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

##### Test.ts

```ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// 시도할 몇몇 샘플들
let strings = ["Hello", "98052", "101"];

// 사용할 검증
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// 각 문자열이 각각의 검증을 통과하는지 보여줌
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```

관련된 파일이 여러 개 있다면, 컴파일된 모든 코드가 로드되었는지 확인해야합니다. 이를 수행하는 방법에는 두 가지가 있습니다.

먼저,  연결된 출력을  `--outFile`  flag를 사용하여 적으면 모든 입력 파일들을 하나의 Javascript 출력 파일로 컴파일할 수 있다 :

```Shell
tsc --outFile sample.js Test.ts
```

컴파일러는 파일들에 있는 참조 태그를 기반으로 자동 정렬합니다. 각 파일을 개별적으로 지정할 수도 있습니다 :

```Shell
tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

또는 파일 별 컴파일(default)를 사용하여 각 입력 파일을 위해 하나의 JavaScript 파일을 내보낼 수 있습니다. 여러 JS 파일이 생성되는 경우엔,  웹 페이지에서 `<script>`태그를 이용하여 각 내보낸 파일들을 적절한 순서로 로드해야합니다. 예를 들면 다음과 같습니다 : 

##### MyTestPage.html (excerpt)

```html
<script src="Validation.js" type="text/javascript" />
<script src="LettersOnlyValidator.js" type="text/javascript" />
<script src="ZipCodeValidator.js" type="text/javascript" />
<script src="Test.js" type="text/javascript" />
```

## Aliases(별칭)

namespace로 간단히 작업할 수 있는 또 다른 방법은 `import q = x.y.z`을 이용하여 자주 사용되는 객체의 더 짧은 이름을 생성하는 것입니다. 모듈을 로드하기 위해 사용되는 `import x = require("name")`구문과 혼동하지 않도록, 이 구문은 단순히 지정된 기호에 대한 별칭을 생성합니다. 여러분은 모듈 import로 만든 객체들을 포함하여 모든 종류의 식별자에 대해 이러한 종류의 import(일반적으로 별칭이라고 함)를 사용할 수 있습니다.

```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // 'new Shapes.Polygons.Square()'와 같음
```

`require` 키워드를 사용하지 않고, 대신 import한 기호의 정규화된 이름으로 부터 직접 할당한다는 점에 유의하시길 바랍니다. 이는 `var`를 사용하는 것과 유사하지만, import한 기호의 타입과 namespace의 의미에서도 작동합니다. 중요한 것은 값의 경우, `import`는 원래 기호와 구분되는 참조이므로, 별칭이 지정된 `var`에 대한 변경 사항은 원래 변수에 적용되지 않습니다.

## 다른 JavaScript 라이브러리와의 작업

TypeScript로 작성되지 않은 라이브러리의 모양을 설명하기 위해서, 우리는 라이브러리가 노출한 API를 선언해야 합니다. 대부분의 JavaScript 라이브러리들이 몇 개의 최상위 객체만 노출하기 때문에, namespace들은 이들을 나타내는 좋은 방법이 됩니다.

우리는 구현을 정의하지 않는 선언을 "ambient"라고 부릅니다. 일반적으로 이것들은 `.d.ts` 파일들에 정의되어 있습니다. C/C++에 익숙하다면, 이것을 `.h`파일로 생각할 수 있습니다. 몇 가지 예를 살펴 보겠습니다.

## Ambient Namespaces

인기있는 라이브러리 D3는 `d3`라는 전역 객체에서 이것의 기능을 정의하고 있습니다. 라이브러리가 `<script>` 태그(모듈 로더 대신)를 통해 로드되기 때문에, 선언은 namespace를 사용하여 형태를 정의합니다. TypeScript 컴파일러가 형태를 보기위해서는, ambient namespace 선언을 사용합니다. 예를 들어, 우리는 다음과 같이 작성을 시작할 수 있습니다 : 

##### D3.d.ts (단순 발췌)

```ts
declare namespace D3 {
  export interface Selectors {
    select: {
      (selector: string): Selection;
      (element: EventTarget): Selection;
    };
  }

  export interface Event {
    x: number;
    y: number;
  }

  export interface Base extends Selectors {
    event: Event;
  }
}

declare var d3: D3.Base;
```
