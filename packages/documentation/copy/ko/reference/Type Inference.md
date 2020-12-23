---
title: Type Inference
layout: docs
permalink: /ko/docs/handbook/type-inference.html
oneline: How code flow analysis works in TypeScript
translatable: true
---

TypeScript에는 명시적인 타입 표기가 없을 때 타입 정보를 제공하기 위해 타입 추론이 사용되는 여러 위치가 있습니다. 예를 들어, 이 코드에서 보면

```ts twoslash
let x = 3;
//  ^?
```

 `x` 변수의 타입은 `number` 로 추론됩니다.
이러한 종류의 추론은 변수와 멤버를 초기화하고 매개변수 기본값을 설정하며, 함수 반환 타입을 결정할 때 발생합니다.

대부분의 유형 추론은 간단합니다.
다음 부분에서는 유형을 추론하는 방법에 대한 몇 가지 뉘앙스를 살펴보겠습니다.

## 최적 공통 타입

여러 표현 식에서 타입을 추론할 때, 표현식들의 타입을 이용해 "최적 공통 타입"을 계산합니다. 예를 들어서:

```ts twoslash
let x = [0, 1, null];
//  ^?
```

위의 예에서 `x` 의 타입을 추론하려면 각 배열 요소의 타입들을 고려해야 합니다. 
여기서 배열 타입에 대해 이 두 가지의 선택 사항을 제공합니다:  `number` 와 `null`. 
가장 일반적인 타입 알고리즘은 각 후보 타입을 고려해서, 다른 모든 후보와 호환되는 타입을 결정합니다.

제공된 후보 타입에서 최적의 공통 타입을 선택해야 하므로 타입이 공통적인 구조를 공유하지만, 한 타입이 모든 후보 타입의 슈퍼 타입이 아닐 수가 있습니다. 예를 들면:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
let zoo = [new Rhino(), new Elephant(), new Snake()];
//    ^?
```

이상적으로는, `zoo` 가 `Animal[]` 로 추론되기를 원할 수 있지만, 배열에 `Animal` 타입의 객체가 없으므로 엄격하게 판단하여, 배열 요소 타입으로 추론하지 않습니다.
이를 수정하려면, 한 타입이 다른 모든 후보의 상위 타입이 아닌 경우 유형을 명시적으로 제공해야합니다:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
//    ^?
```

최적 공통 타입이 발견되지 않으면, 추론 결과는 유니언 배열 타입 `(Rhino | Elephant | Snake)[]` 입니다.

## 문맥상 타이핑

TypeScript의 타입 추론은 때에 따라 "다른 방향"에서도 작동합니다.
이를 "문맥상 타이핑"이라고 합니다. 문맥상 타이핑은 표현식의 타입이 위치에 의해 암시될 때 발생합니다. 예를 들면:

```ts
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button); //<- OK
  console.log(mouseEvent.kangaroo); //<- Error!
};
```

여기서, TypeScript 타입 검사기는 `Window.onmousedown` 함수의 타입을 사용하여 오른쪽에 할당된 함수 표현식의 타입을 추론했습니다.
여기선, `button`이 포함된 `mouseEvent` 매개변수의 [타입](https://developer.mozilla.org/docs/Web/API/MouseEvent) 을 추론할 수 있었습니다. 그러나 `kangaroo` 는 아닙니다.

TypeScript는 다른 문맥에서도 타입을 추론할 수 있을 만큼 똑똑합니다:

```ts
window.onscroll = function (uiEvent) {
  console.log(uiEvent.button); //<- Error!
};
```

위의 함수가 `Window.onscroll` 에 할당된다는 사실을 바탕으로, TypeScript는 `uiEvent` 가 이전 예제와 같은 [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent) 가 아니라 [UIEvent](https://developer.mozilla.org/docs/Web/API/UIEvent) 임을 알고 있습니다. `UIEvent` 객체에는 `button` 프로퍼티가 없으므로, TypeScript에서 오류가 발생합니다.

이 함수가 컨텍스트 타입 위치에 있지 않았을 때 함수의 인수는 암시적으로 `any` 타입을 가지며, 오류가 발생하지 않습니다. ( `--noImplicitAny` 옵션을 사용하지 않는다면):

```ts
const handler = function (uiEvent) {
  console.log(uiEvent.button); //<- OK
};
```

또한, 함수의 인수에 타입 정보를 명시적으로 제공하여 컨텍스트 타입을 재정의할 수도 있습니다.

```ts
window.onscroll = function (uiEvent: any) {
  console.log(uiEvent.button); //<- Now, no error is given
};
```

그러나 이 코드는 `uiEvent` 에 `button` 이라는 프로퍼티가 없으므로 `undefined` 을 기록합니다.

문맥상 타이핑은 많은 경우에 적용됩니다.
일반적으로는 함수 호출에 대한 인수, 오른쪽에 할당된 것, 타입 어셜션(assertions), 개체 및 배열 리터럴의 멤버, 반환문이 포함됩니다.
컨텍스트 타입은 또한 가장 일반적인 타입에서 후보 타입으로 작동합니다. 예를 들면:

```ts
function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake()];
}
```

이 예에서 가장 일반적인 타입에는, 이와 같은 네 가지의 후보 셋이 있습니다: `Animal`, `Rhino`, `Elephant`, and `Snake`.
이 중에서, `Animal` 은 최적 공통 타입 알고리즘으로 선택할 수 있습니다.