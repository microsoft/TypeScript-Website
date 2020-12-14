---
title: Declaration Merging
layout: docs
permalink: /ko/docs/handbook/declaration-merging.html
oneline: How merging namespaces and interfaces works
translatable: true
---

## 소개 (Introduction)

TypeScript의 독특한 개념 중 일부는 타입 레벨에서 JavaScript 객체의 형태를 설명합니다. 
TypeScript만의 특별한 예로 '선언 병합'의 개념이 있습니다. 
이 개념을 이해하면 기존의 JavaScript 작업을 할 때 이점이 많아질 것입니다. 
또한 고급 추상화 개념으로의 문을 열어줄 것입니다.

본론으로 돌아가서, "선언 병합"은 컴파일러가 같은 이름으로 선언된 개별적인 선언 두 개를 하나의 정의로 합치는 것을 의미합니다. 
이 병합된 정의는 원래 두 선언의 특성을 모두 갖습니다. 병합할 선언이 몇 개든 병합할 수 있습니다; 
두 개의 선언만 합치도록 제한하지 않습니다.

## 기본 사용법 (Basic Concepts)

TypeScript에서, 선언은 네임스페이스, 타입 또는 값 3개의 그룹 중 적어도 하나의 엔티티를 생성합니다. 
네임스페이스-생성 선언은 점 표기법을 사용하여 접근할 이름을 가진 네임 스페이스를 생성합니다. 
타입-생성 선언은 주어진 이름에 바인딩 되고 선언된 형태로 표시된 타입을 생성합니다. 
마지막으로, 값-생성 선언은 JavaScript에서 확인할 수 있는 출력값을 생성합니다.

| 선언 타입     | 네임 스페이스 | 타입 |  값  |
| ------------- | :-----------: | :--: | :--: |
| 네임 스페이스 |       X       |      |  X   |
| 클래스        |               |  X   |  X   |
| 열거형        |               |  X   |  X   |
| 인터페이스    |               |  X   |      |
| 타입 별칭     |               |  X   |      |
| 함수          |               |      |  X   |
| 변수          |               |      |  X   |

각 선언으로 생성된 결과를 이해하는 것은 선언 병합을 할 때 병합된 결과물을 이해하는 데 도움이 됩니다.

## 인터페이스 병합 (Merging Interfaces)

가장 단순하고 일반적인 선언 병합의 타입은 인터페이스 병합입니다. 
가장 기본적인 수준에서, 병합은 두 선언의 멤버를 같은 이름의 단일 인터페이스로 기계적으로 결합합니다.

```ts
interface Box {
  height: number;
  width: number;
}

interface Box {
  scale: number;
}

let box: Box = { height: 5, width: 6, scale: 10 };
```

인터페이스의 비-함수 멤버는 고유해야 합니다. 
만약 고유하지 않으면, 모두 같은 타입이어야 합니다.
인터페이스가 동일한 이름의 함수 멤버를 선언하지만 다른 타입으로 선언하는 경우 컴파일러는 error를 발생시킵니다.

함수 멤버의 경우, 이름이 같은 각 함수 멤버는 같은 함수의 오버로드 하는 것으로 처리합니다. 
또한 중요한 것은 인터페이스 A와 이후 인터페이스 A를 병합하는 경우에, 두 번째 인터페이스가 첫 번째 인터페이스보다 더 높은 우선순위를 갖게 됩니다.

예를 들어:

```ts
interface Cloner {
  clone(animal: Animal): Animal;
}

interface Cloner {
  clone(animal: Sheep): Sheep;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}
```

위의 세 인터페이스를 아래와 같은 단일 선언으로 병합할 수 있습니다:

```ts
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

각 그룹의 요소는 동일한 순서를 유지하지만, 그룹 자체는 나중에 오버로드 될수록 첫 번째에 위치하는 것에 유의하세요.

이 규칙엔 특수 시그니처(specialized signatures)라는 예외가 존재합니다. 
만약 _단일_ 문자열 리터럴 타입(예. 문자열 리터럴이 유니온이 아닌 경우)인 매개변수가 있을 경우, 시그니처는 병합된 오버로드 목록의 맨 위로 올라오게 됩니다.

예를 들어, 아래의 인터페이스들이 병합됩니다:

```ts
interface Document {
  createElement(tagName: any): Element;
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
  createElement(tagName: string): HTMLElement;
  createElement(tagName: "canvas"): HTMLCanvasElement;
}
```

 `Document`의 병합된 선언 결과는 다음과 같습니다:

```ts
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}
```

## 네임스페이스 병합 (Merging Namespaces)

인터페이스와 마찬가지로 같은 이름의 네임스페이스는 네임스페이스 멤버와 병합합니다. 
네임스페이스가 네임스페이스와 값 둘 다 만들기 때문에, 두 가지가 병합되는 방법을 이해해야 합니다.

네임스페이스를 병합하기 위해서, 각 네임스페이스에 선언된 export 된 인터페이스로부터 타입 정의가 병합되며, 내부에 병합된 인터페이스 정의가 있는 단일 네임스페이스가 형성됩니다. 

네임스페이스 값을 병합하려면, 각 선언 위치에 이미 지정된 이름의 네임스페이스가 있을 경우에, 기존 네임스페이스에 두 번째 네임스페이스의 export 된 멤버를 첫 번째에 추가하여 네임스페이스 값이 확장됩니다.

이러한 예제인  `Animals` 의 선언 병합:

```ts
namespace Animals {
  export class Zebra {}
}

namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Dog {}
}
```

다음과 같습니다:

```ts
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }

  export class Zebra {}
  export class Dog {}
}
```

이러한 네임스페이스 병합의 모델은 좋은 출발점이지만, 우리는 export 되지 않은 멤버에게 어떤 일이 발생하는지 이해해야 합니다. 
export 되지 않은 멤버는 원래 네임스페이스(병합되지 않은 네임스페이스)에서만 볼 수 있습니다. 이는 병합 후에 다른 선언으로 병합된 멤버는 export 되지 않은 멤버를 볼 수 없다는 것을 의미합니다.

아래의 예제에서 더 명확하게 확인할 수 있습니다:

```ts
namespace Animal {
  let haveMuscles = true;

  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}

namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles; // 오류, haveMuscles가 여기에 접근할 수 없기 때문에
  }
}
```

`haveMuscles` 가 export 되지 않아서, 동일하게 병합되지 않은 네임스페이스를 공유하는  `animalsHaveMuscles` 함수만 이 심벌을 볼 수 있습니다. 
`doAnimalsHaveMuscles` 함수가, 병합된 `Animal` 네임스페이스의 멤버일지라도, export 되지 않은 멤버는 볼 수 없습니다.

## 클래스, 함수, 열거형과 네임 스페이스 병합 (Merging Namespaces with Classes, Functions, and Enums)

네임 스페이스는 다른 타입의 선언과 병합할 수 있을 정도로 유연합니다. 
이를 위해서, 네임 스페이스 선언은 병합할 선언을 따라야 합니다. 결과 선언은 두 선언 타입의 프로퍼티를 모두 갖습니다. 
TypeScript는 이를 통해 JavaScript와 다른 프로그래밍 언어에서의 패턴을 모델링 합니다.

## 네임 스페이스와 클래스 병합 (Merging Namespaces with Classes)

이 부분은 내부 클래스를 설명하는 방법을 말합니다.

```ts
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}
```

병합된 멤버의 가시성 규칙은  [Merging Namespaces](./declaration-merging.html#merging-namespaces) 세션에서 설명한 것과 같으므로, `AlbumLabel`클래스를 export해야 병합된 클래스를 볼 수 있습니다. 
최종 결과는 다른 클래스 내에서 관리되는 클래스입니다. 
또한 네임 스페이스를 사용하여 기존 클래스에 더 많은 정적 멤버를 추가할 수도 있습니다.

내부 클래스 패턴 이외에도, JavaScript에서 함수를 생성하고 프로퍼티를 추가함으로써 함수를 확장하는 것에도 익숙할 것입니다. 
TypeScript는 선언 병합을 통해 타입을 안전하게 보존하며 정의할 수 있습니다.

```ts
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}

console.log(buildLabel("Sam Smith"));
```

마찬가지로 네임스페이스는 정적 멤버의 열거형을 확장할 수 있습니다:

```ts
enum Color {
  red = 1,
  green = 2,
  blue = 4,
}

namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == "yellow") {
      return Color.red + Color.green;
    } else if (colorName == "white") {
      return Color.red + Color.green + Color.blue;
    } else if (colorName == "magenta") {
      return Color.red + Color.blue;
    } else if (colorName == "cyan") {
      return Color.green + Color.blue;
    }
  }
}
```

## 허용되지 않은 병합 (Disallowed Merges)

TypeScript에서 모든 병합이 허용되는 것은 아닙니다. 
클래스는 다른 클래스나 변수와 병합할 수 없습니다. 
클래스 병합을 대체하는 것에 대한 정보는 [Mixins in TypeScript](/docs/handbook/mixins.html) 섹션에서 볼 수 있습니다. 

## 모듈 보강 (Module Augmentation)

JavaScript는 모듈 병합을 지원하지 않지만 기존 객체를 import 하고 업데이트함으로써 패치할 수 있습니다. 
쉬운 Observable 예를 살펴보겠습니다:

```ts
// observable.ts
export class Observable<T> {
  // ... 연습을 위해 남겨둠 ...
}

// map.ts
import { Observable } from "./observable";
Observable.prototype.map = function (f) {
  // ... 연습을 위해 남겨둠
};
```

이는 TypeScript에서 잘 동작하지만, 컴파일러는 `Observable.prototype.map`에 대해 알지 못합니다. 
모듈 보강을 통해 컴파일러에게 정보를 알려줄 수 있습니다:

```ts
// observable.ts
export class Observable<T> {
  // ... 연습을 위해 남겨둠 ...
}

// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function (f) {
  // ... 연습을 위해 남겨둠
};

// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number>;
o.map((x) => x.toFixed());
```

모듈 이름은  `import`/`export`의 모듈 지정자와 같은 방법으로 해석됩니다. 
자세한 내용은  [모듈](/docs/handbook/modules.html)을 참고하세요. 
그다음 보강된 선언은 마치 원본과 같은 파일에서 선언된 것처럼 병합됩니다.

그러나, 두 가지 제한 사항을 명심하세요:

1. 보강에 새로운 최상위 선언을 할 수 없습니다 -- 기존 선언에 대한 패치만 가능합니다.
2. Default exports는 보강할 수 없으며, 이름을 갖는 export만 보강할 수 있습니다(해당 이름으로 확장시켜야 하며,  `default`는 예약어입니다 - 자세한 내용은 [#14080](https://github.com/Microsoft/TypeScript/issues/14080)을 참고하세요)

## 전역 보강 (Global augmentation)

모듈 내부에서 전역 스코프에 선언을 추가할 수 있습니다:

```ts
// observable.ts
export class Observable<T> {
  // ... 연습을 위해 남겨둠 ...
}

declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}

Array.prototype.toObservable = function () {
  // ...
};
```

전역 보강은 모듈 보강과 동일한 동작과 한계를 가지고 있습니다.
