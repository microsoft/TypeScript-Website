---
title: Symbols
layout: docs
permalink: /ko/docs/handbook/symbols.html
oneline: Using the JavaScript Symbol primitive in TypeScript
translatable: true
---

ECMAScript 2015부터, `symbol` 은  `number` 와  `string` 과 같은 기본 데이터 타입입니다.

`symbol` 값은  `Symbol` 생성자를 호출함으로써 생성됩니다.

```ts
let sym1 = Symbol();

let sym2 = Symbol("key"); // 선택적 문자열 키
```

심벌은 불변하고 유일합니다.

```ts
let sym2 = Symbol("key");
let sym3 = Symbol("key");

sym2 === sym3; // false, 심벌은 유일하다.
```

문자열처럼, 심벌은 객체 프로퍼티의 키로써 사용될 수 있습니다.

```ts
const sym = Symbol();

let obj = {
  [sym]: "value",
};

console.log(obj[sym]); // "value"
```

또한 심벌은 초기화된 프로퍼티 선언과 결합되어 객체 프로퍼티와 클래스 멤버를 선언할 수 있습니다.

```ts
const getClassNameSymbol = Symbol();

class C {
  [getClassNameSymbol]() {
    return "C";
  }
}

let c = new C();
let className = c[getClassNameSymbol](); // "C"
```

## 잘 알려진 심벌 (Well-known Symbols)

사용자 정의 심벌 외에, 잘 알려진 내장 심벌이 있습니다. 
내장 심벌은 언어 내부의 동작을 나타내는데 사용됩니다.

아래는 잘 알려진 심벌의 목록입니다:

## `Symbol.hasInstance`

생성자가 객체를 생성자의 인스턴스 중 하나로 인식하는지 확인하는 메서드. instanceof 연산자로 호출됩니다.

## `Symbol.isConcatSpreadable`

객체가 자신의 배열 요소를 Array.prototype.concat를 사용하여 직렬화할 수 있는지 나타내는 Boolean 값.

## `Symbol.iterator`

객체의 기본 반복자를 반환하는 메서드. for-of 문으로 호출됩니다.

## `Symbol.match`

정규 표현식과 문자열을 비교하는 정규 표현식 메서드.  `String.prototype.match` 메서드로 호출됩니다.

## `Symbol.replace`

문자열에서 일치하는 부분 문자열을 치환하는 정규 표현식 메서드.  `String.prototype.replace` 메서드로 호출됩니다.

## `Symbol.search`

정규 표현식과 매치되는 문자열의 인덱스를 반환하는 정규 표현식 메서드. `String.prototype.search` 메서드로 호출됩니다.

## `Symbol.species`

파생된 객체를 생성하는데 사용하는 생성자 함수의 중요한 속성.

## `Symbol.split`

정규 표현식과 매치되는 인덱스들에 위치한 문자열을 나누는 정규 표현식 메서드. 
 `String.prototype.split` 메서드로 호출됩니다.

## `Symbol.toPrimitive`

객체를 대응되는 기본 값으로 변환하는 메서드.  
`ToPrimitive` 추상 연산으로 호출됩니다.

## `Symbol.toStringTag`

객체의 기본 문자열 형식을 만드는데 사용되는 문자열 값.
내장 메서드인  `Object.prototype.toString` 로 호출됩니다.

## `Symbol.unscopables`

자신의 프로퍼티 이름이 연결된 개체의 'with' 환경 바인딩에서 제외되는 프로퍼티 이름인 객체.
