---
title: TypeScript Tooling in 5 minutes
layout: docs
permalink: /ko/docs/handbook/typescript-tooling-in-5-minutes.html
oneline: A tutorial to understand how to create a small website with TypeScript
translatable: true
---

TypeScript로 간단한 웹 애플리케이션을 만들어봅시다.

## TypeScript 설치하기

프로젝트에서 TypeScript를 사용할 수 있는 두 가지 주요 방법이 있습니다:

- npm 사용하기(Node.js 패키지 매니저)
- Visual Studio TypeScript 플러그인 설치하기

Visual Studio 2017과 Visual Studio 2015 Update 3에는 TypeScript가 기본적으로 포함되어 있습니다.
만약 Visual Studio로 TypeScript를 설치하지 않았다면, [여기서 다운로드하세요](/download).

npm 사용자의 경우:

```shell
> npm install -g typescript
```

## 첫 번째 TypeScript 파일 생성하기

에디터에서, 아래 JavaScript 코드를 `greeter.ts`에 작성하세요.

```ts twoslash
// @noImplicitAny: false
function greeter(person) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## 코드 컴파일하기

우리는 `.ts` 확장자를 사용했지만, 이 코드는 JavaScript일 뿐입니다.
이 코드를 기존 JavaScript 앱에 바로 복사/붙여넣을 수 있습니다.

명령 줄에서, TypeScript 컴파일러를 실행해보세요:

```shell
tsc greeter.ts
```

방금 작성한 코드와 동일한 JavaScript 파일, `greeter.js`이 생성될 것입니다.
JavaScript 앱에서 TypeScript를 사용하여 실행 중입니다!

이제, TypeScript에서 제공하는 몇 가지 새로운 도구들을 사용해봅시다.
여기 표시된 대로 함수 인수인 'person'에 `: string` 타입 표기를 추가해봅시다.

```ts twoslash
function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## 타입 표기

TypeScript의 타입 표기는 함수나 변수의 의도된 계약을 기록하는 간단한 방법입니다.
이 경우, greeter 함수를 단일 문자열 매개변수로 호출하도록 합니다.
대신 배열을 전달하여 greeter 함수를 호출하도록 변경해봅시다.

```ts twoslash
// @errors: 2345
function greeter(person: string) {
  return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.textContent = greeter(user);
```

다시 컴파일해보면, 오류가 발생한 것을 볼 수 있습니다:

```shell
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

마찬가지로, greeter 호출에 대한 모든 인수를 제거해봅시다.
TypeScript는 예상치 못한 수의 매개변수를 사용하여 이 함수를 호출했음을 알려줍니다.
두 경우 모두, TypeScript는 코드 구조와 사용자가 제공한 타입 표기를 기반으로 정적 분석을 제공할 수 있습니다.

오류가 있었음에도, `greeter.js` 파일은 여전히 생성됩니다.
코드에 오류가 있어도 TypeScript를 사용할 수 있습니다. 그러나 이 경우, TypeScript는 코드가 예상대로 실행되지 않을 것이라고 경고합니다.

## 인터페이스

샘플을 좀 더 발전시켜봅시다. 여기 firstName과 lastName 필드가 있는 객체를 설명하는 인터페이스가 있습니다.
TypeScript에서는, 내부 구조가 호환되는 경우 두 개의 타입이 호환됩니다.
이를 통해, 명시적인 `implements` 절 없이도 인터페이스가 필요로 하는 모양을 갖추는 것만으로 인터페이스를 구현할 수 있습니다.

```ts twoslash
interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.textContent = greeter(user);
```

## 클래스

마지막으로, 클래스를 사용하여 예제를 확장해봅시다.
TypeScript는 클래스 기반 객체 지향 프로그래밍 지원과 같은 JavaScript의 새로운 기능을 지원합니다.

몇 가지 퍼블릭 필드와 생성자를 포함한 `Student` 클래스를 생성해봅시다.
클래스와 인터페이스가 함께 잘 작동하므로, 프로그래머가 적절한 수준의 추상화를 결정할 수 있습니다.

또한, 생성자에 대한 인수에 `public`을 사용하는 것은 자동으로 그 이름을 가진 속성을 만들 수 있게 해주는 약어입니다.

```ts twoslash
class Student {
  fullName: string;
  constructor(
    public firstName: string,
    public middleInitial: string,
    public lastName: string
  ) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.textContent = greeter(user);
```

`tsc greeter.ts` 명령어를 다시 실행해보면, 기존 코드와 새로 생성된 JavaScript 코드가 동일하다는 것을 알 수 있습니다.
TypeScript의 클래스는 JavaScript에서 자주 사용되는 동일한 프로토타입 기반 OO의 약어입니다.

## TypeScript 웹 앱 실행해보기

`greeter.html`에 다음과 같이 입력하세요:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>TypeScript Greeter</title>
  </head>
  <body>
    <script src="greeter.js"></script>
  </body>
</html>
```

브라우저에서 `greeter.html`을 열어 첫 번째 간단한 TypeScript 웹 애플리케이션을 실행하세요!

추가로: Visual Studio에서 `greeter.ts`를 열거나, TypeScript playground에 코드를 복사해보세요.
식별자 위로 마우스를 가져가면 해당 타입을 볼 수 있습니다.
어떤 경우에는 사용자를 위해 자동으로 타입이 추론됩니다.
마지막 줄을 다시 입력하고, DOM 요소 유형에 따라 완성 목록과 매개 변수 도움말을 참고해보세요.
greeter 함수에 대한 참조에 커서를 놓고, F12를 눌러 해당 정의로 이동해보세요.
심벌에 우클릭하여 리팩토링을 사용하여 이름을 바꿀 수 있습니다.

제공된 타입 정보는 애플리케이션 규모에서 JavaScript로 작업하는 도구와 함께 동작합니다.
TypeScript에서 가능한 것에 대한 더 많은 예제는 웹사이트의 Samples 부분을 참고하세요.

![Visual Studio picture](/images/docs/greet_person.png)
