---
title: JSX
layout: docs
permalink: /ko/docs/handbook/jsx.html
oneline: Using JSX with TypeScript
translatable: true
---

[JSX](https://facebook.github.io/jsx/)는 XML과 유사한 내장형 구문입니다.
이것은 구현에 따라 변환의 의미가 다르나 유효한 JavaScript로 변환되어야 합니다.
JSX는 [React](https://reactjs.org/) 프레임워크로써 인기를 얻었지만, 그 이후 다른 구현도 등장하였습니다.
TypeScript는 임베딩(embedding), 타입 검사 및 JSX를 JavaScript로 직접 컴파일하는 것을 지원합니다.

## 기본 사용 방법

JSX를 사용하기 전에 아래의 두 가지를 수행해야 합니다.

1. `.tsx` 확장자로 파일 이름 지정하기
2. `jsx` 옵션 활성화하기

TypeScript는 다음 세 가지의 JSX 모드를 제공합니다: `preserve`, `react`, `react-native`.
이 모드는 출력 단계에만 영향을 미치며 타입 검사에는 영향을 미치지 않습니다.
`preserve` 모드는 JSX를 출력 일부로 유지하여 이를 다른 변환 단계(예: [Babel](https://babeljs.io/))에서 추가로 사용합니다.
또한 출력 파일 확장자는 `.jsx`입니다.
`react` 모드는 `React.createElement`를 출력하고 사용하기 전 JSX 변환을 거칠 필요가 없으며 출력 파일 확장자는 `.js`입니다.
`react-native` 모드는 모든 JSX를 유지한다는 점에서 `preserve` 모드와 유사하나, 출력 파일 확장자가 `.js`라는 차이가 있습니다.

| 모드           | 입력      | 출력                                              | 출력 파일 확장자 |
| -------------- | --------- | ------------------------------------------------- | ---------------- |
| `preserve`     | `<div />` | `<div />`                                         | `.jsx`           |
| `react`        | `<div />` | `React.createElement("div")`                      | `.js`            |
| `react-native` | `<div />` | `<div />`                                         | `.js`            |
| `react-jsx`    | `<div />` | `_jsx("div", {}, void 0);`                        | `.js`            |
| `react-jsxdev` | `<div />` | `_jsxDEV("div", {}, void 0, false, {...}, this);` | `.js`            |

`--jsx` 커맨드 라인 플래그 또는 [tsconfig.json](/tsconfig#jsx) 파일 내 `jsx`의 해당 옵션을 통해 모드를 설정할 수 있습니다.

> \*참고: `--jsxFactory` 옵션을 사용하여 React JSX 방출 시 사용할 JSX 팩토리 함수로 지정할 수 있습니다. (기본값은 `React.createElement`)

## `as` 연산자

타입 단언 작성 방법은 다음과 같습니다:

```ts
var foo = <foo>bar;
```

이는 변수 `bar`가 `foo` 타입을 갖도록 단언합니다.
TypeScript 또한 단언을 위해 꺾쇠괄호를 사용하기 때문에, JSX의 구문과의 결합은 특정 구문 분석에 어려움이 발생할 수 있습니다. 결과적으로 TypeScript는 `.tsx`파일에서의 꺾쇠괄호 타입 단언을 허용하지 않습니다.

이 구문은 `.tsx` 파일에서 사용될 수 없으므로, 대체 타입 단언 연산자인 `as`를 사용해야 합니다.
`as` 연산자를 사용하여 위의 예제를 쉽게 재작성할 수 있습니다.

```ts
var foo = bar as foo;
```

`as` 연산자는 `.ts`와 `.tsx` 형식의 파일 모두에서 유효하며, 꺾쇠괄호 타입 단언 스타일과 동작이 같습니다.

## 타입 검사

JSX를 통한 타입 검사를 이해하기 위해서는 먼저 내장 요소와 값-기반 요소의 차이점에 대해 이해해야 합니다.
 `<expr />`라는 JSX 표현이 주어졌을 때, `expr`는 환경에 내장된 요소(예: DOM 환경의 `div` 또는 `span` ) 또는 사용자 지정 컴포넌트를 참조할 것입니다.
이것이 중요한 이유 두 가지는 다음과 같습니다:

1. React에서 내장 요소는 문자열 (`React.createElement("div")`)로 방출되지만 생성한 구성 요소는 (`React.createElement(MyComponent)`)가 아닙니다.
2. JSX 요소에 전달되는 속성의 타입은 다르게 조회되어야 합니다.
   내장 요소의 속성은 _내재적으로_ 알려져야 하지만, 컴포넌트는 각자의 속성 집합을 지정하고자 합니다.

TypeScript는 이를 구분하기 위해 [React와 같은 규칙](http://facebook.github.io/react/docs/jsx-in-depth.html#html-tags-vs.-react-components)을 사용합니다.
내장 요소는 항상 소문자로 시작하고, 값-기반 요소는 항상 대문자로 시작합니다.

## 내장 요소

내장 요소는 특별한 인터페이스인 `JSX.IntrinsicElements`에서 조회됩니다.
기본적으로 인터페이스가 지정되지 않으면 그대로 진행되어 내장 함수는 타입 검사가 이루어지지 않을 것입니다.
그러나 이 인터페이스가 _있는_ 경우 내장 함수의 이름이 `JSX.IntrinsicElements` 인터페이스에 있는 프로퍼티로 조회됩니다.
예를 들어:

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: any;
  }
}

<foo />; // 성공
<bar />; // 오류
```

위의 예시에서는 `<foo />`는 정상 작동하나, `<bar />`는 `JSX.IntrinsicElements`에 지정되지 않았기 때문에 오류가 발생합니다.

> 참고: 아래와 같이 `JSX.IntrinsicElements`에 catch-all 문자열 인덱서 또한 지정할 수 있습니다.

```ts
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
```

## 값-기반 요소

값-기반 요소는 해당 스코프 내의 식별자로 간단하게 조회됩니다.

```ts
import MyComponent from "./myComponent";

<MyComponent />; // 성공
<SomeOtherComponent />; // 오류
```

값-기반 요소를 정의하는 두 가지 방법은 다음과 같습니다.

1. 함수형 컴포넌트 (FC)
2. 클래스형 컴포넌트

두 타입의 값-기반 요소는 JSX 표현에서 구별할 수 없으므로, TS는 우선 과부하 해결을 이용하여 함수형 컴포넌트로 표현을 해석합니다. 만약 해당 작업이 성공하면, TS는 선언에 대한 표현식 해석을 완료합니다. 만약 값이 함수형 컴포넌트로 확인되지 않으면, TS는 클래스 컴포넌트로 해석합니다. 그래도 실패한다면 TS는 오류를 보고합니다.

### 함수형 컴포넌트

이름으로 알 수 있듯이, 컴포넌트는 첫 번째 인수가 `props` 객체인 JavaScript 함수로 정의됩니다.
TS는 반환 타입을 `JSX.Element`에 할당이 가능해야 합니다.

```ts
interface FooProp {
  name: string;
  X: number;
  Y: number;
}

declare function AnotherComponent(prop: { name: string });
function ComponentFoo(prop: FooProp) {
  return <AnotherComponent name={prop.name} />;
}

const Button = (prop: { value: string }, context: { color: string }) => (
  <button />
);
```

함수형 컴포넌트는 JavaScript 함수이기 때문에 과부하를 사용할 수 있습니다:

```ts
interface ClickableProps {
  children: JSX.Element[] | JSX.Element
}

interface HomeProps extends ClickableProps {
  home: JSX.Element;
}

interface SideProps extends ClickableProps {
  side: JSX.Element | string;
}

function MainButton(prop: HomeProps): JSX.Element;
function MainButton(prop: SideProps): JSX.Element {
  ...
}
```

> 참고: 함수형 컴포넌트는 무 상태 함수형 컴포넌트(SFC)로 알려져 있습니다. 최근 버전의 React에서는 함수형 컴포넌트를 무 상태로 더는 간주하지 않으므로, `SFC` 타입과 그것의 별칭인 `StatelessComponent` 은 이제는 사용되지 않습니다.

### 클래스형 컴포넌트

클래스형 컴포넌트 타입을 정의하는 것도 가능합니다.
하지만 이를 위해서는 _요소 클래스 타입(element class type)_ 과 _요소 인스턴스 타입(element instance type)_이라는 두 가지 용어를 이해하는 것이 좋습니다.

`<Expr />`가 주어지면, _요소 클래스 타입_은 `Expr`타입입니다.
따라서 위의 예시에서 `MyComponent`가 ES6 클래스인 경우, 해당 클래스의 타입은 클래스의 생성자이고 전역입니다.
만약 `MyComponent`가 팩토리 함수인 경우, 해당 클래스의 타입은 해당 함수입니다.

한 번 클래스의 타입이 결정되면, 인스턴스 타입은 클래스 타입의 생성 또는 호출 시그니처(두 가지 중 존재하는 것)의 반환 타입의 결합으로 결정됩니다.
다시 말하지만, ES6 클래스의 경우 인스턴스 타입은 해당 클래스 인스턴스의 타입이어야 하고, 팩토리 함수의 경우 함수에 의해 반환된 값의 타입이어야 합니다.

```ts
class MyComponent {
  render() {}
}

// 생성 시그니처 사용
var myComponent = new MyComponent();

// 요소 클래스 타입 => MyComponent
// 요소 인스턴스 타입 => { render: () => void }

function MyFactoryFunction() {
  return {
    render: () => {},
  };
}

// 호출 시그니처 사용
var myComponent = MyFactoryFunction();

// 요소 클래스 타입 => FactoryFunction
// 요소 인스턴스 타입 => { render: () => void }
```

요소 인스턴스 타입은 ` JSX.ElementClass`에 할당이 가능해야 하며, 그렇지 않으면 오류가 발생합니다.
기본적으로 `JSX.ElementClass`는 `{}`이지만, 적절한 인터페이스를 따르는 타입으로만 JSX 사용을 제한하도록 확장할 수 있습니다.

```ts
declare namespace JSX {
  interface ElementClass {
    render: any;
  }
}

class MyComponent {
  render() {}
}
function MyFactoryFunction() {
  return { render: () => {} };
}

<MyComponent />; // 성공
<MyFactoryFunction />; // 성공

class NotAValidComponent {}
function NotAValidFactoryFunction() {
  return {};
}

<NotAValidComponent />; // 오류
<NotAValidFactoryFunction />; // 오류
```

## 속성 타입 검사

속성 타입 검사를 위해서는 먼저 _요소 속성 타입_을 결정해야 합니다.
이는 내장 요소와 값-기반 요소에서 약간의 차이가 있습니다.

내장 요소의 경우, 요소 속성 타입은 `JSX.IntrinsicElements` 내 프로퍼티의 타입입니다.

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

// 'foo'의 요소 속성 타입은 '{bar?: boolean}'
<foo bar />;
```

값-기반 요소의 경우, 이는 약간 더 복잡합니다.
요소 속성 타입은 이전에 결정된 _요소 인스턴스 타입_ 의 프로퍼티 타입으로 결정됩니다.
사용할 프로퍼티는 `JSX.ElementAttributesProperty`에 의해 결정됩니다.
이는 단일 프로퍼티로 선언되어야 합니다.
이후에는 해당 프로퍼티의 이름을 사용합니다.
TypeScript 2.8부터는 `JSX.ElementAttributesProperty` 를 제공하지 않을 경우, 클래스 요소의 생성자 또는 함수형 컴포넌트의 호출의 첫 번째 매개변수의 타입을 대신 사용할 수 있습니다.

```ts
declare namespace JSX {
  interface ElementAttributesProperty {
    props; // 사용할 프로퍼티 이름 지정
  }
}

class MyComponent {
  // 요소 인스턴스 타입의 프로퍼티 지정
  props: {
    foo?: string;
  };
}

// 'MyComponent'의 요소 속성 타입은 '{foo?: string}'
<MyComponent foo="bar" />;
```

요소 속성 타입은 JSX에서 속성의 타입 검사에 사용됩니다.
선택적 및 필수적인 프로퍼티들이 지원됩니다.

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { requiredProp: string; optionalProp?: number };
  }
}

<foo requiredProp="bar" />; // 성공
<foo requiredProp="bar" optionalProp={0} />; // 성공
<foo />; // 오류, requiredProp이 누락됨
<foo requiredProp={0} />; // 오류, requiredProp은 문자열이여야 함
<foo requiredProp="bar" unknownProp />; // 오류, unknownProp는 존재하지 않음
<foo requiredProp="bar" some-unknown-prop />; // 성공, 'some-unknown-prop'는 유효한 식별자가 아니기 때문
```

> 참고: 속성의 이름이 유효한 식별자(_data-*_ 속성 등)인 경우, 요소 속성 타입을 찾을 수 없는 경우에도 이를 오류로 간주하지 않습니다.

추가로 `JSX.IntrinsicAttributes` 인터페이스는 일반적으로 컴포넌트의 props 또는 인수로 사용되지 않는 JSX 프레임워크의 사용을 위한 추가적인 프로퍼티를 지정할 수 있습니다. - 예를 들면 React의 `key`. 더 나아가서, `JSX.IntrinsicClassAttributes<T>` 제네릭 타입 또한 클래스형 컴포넌트를 위한 추가적인 속성의 유형과 동일하게 지정할 수 있습니다(함수형 컴포넌트는 불가능). 해당 타입의 경우, 제네릭 매개변수는 클래스 인스턴스 타입에 해당합니다. React에서는 `Ref<T>`의 타입의 `ref` 속성을 허용하기 위하여 사용됩니다. 일반적으로 JSX 프레임워크 사용자가 모든 태그에 특정 속성을 제공할 필요가 없는 경우, 이 인터페이스의 모든 프로퍼티는 선택적이어야 합니다.

스프레드 연산자 또한 동작합니다:

```ts
var props = { requiredProp: "bar" };
<foo {...props} />; // 성공

var badProps = {};
<foo {...badProps} />; // 오류
```

## 자식 타입 검사

TypeScript 2.3부터, TS는 _자식(children)_ 타입 검사를 도입했습니다. _자식_은 자식 _JSXExpressions_이 속성에 삽입하고자 하는 _요소 속성 타입_의 특수 프로퍼티입니다.
TS가 _props_ 명을 결정하기 위해 `JSX.ElementAttributesProperty`를 사용하는 것과 유사하게, TS는 _자식_ 내의 props명을 결정하기 위하여 `JSX.ElementChildrenAttribute`를 사용합니다.
`JSX.ElementChildrenAttribute` 는 단일 프로퍼티로 정의되어야만 합니다.

```ts
declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {}; // 사용할 자식의 이름을 지정
  }
}
```

```ts
<div>
  <h1>Hello</h1>
</div>;

<div>
  <h1>Hello</h1>
  World
</div>;

const CustomComp = (props) => <div>{props.children}</div>
<CustomComp>
  <div>Hello World</div>
  {"This is just a JS expression..." + 1000}
</CustomComp>
```

다른 속성과 같이_자식_의 타입도 지정할 수 있습니다. 예를 들어서 [React 타이핑](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)을 사용하는 경우, 이는 기본 타입을 오버라이드 할 것입니다.

```ts
interface PropsType {
  children: JSX.Element
  name: string
}

class Component extends React.Component<PropsType, {}> {
  render() {
    return (
      <h2>
        {this.props.children}
      </h2>
    )
  }
}

// OK
<Component name="foo">
  <h1>Hello World</h1>
</Component>

// 오류: 자식은 JSX.Element의 배열이 아닌 JSX.Element 타입입니다
<Component name="bar">
  <h1>Hello World</h1>
  <h2>Hello World</h2>
</Component>

// 오류: 자식은 JSX.Element의 배열 또는 문자열이 아닌 JSX.Element 타입입니다
<Component name="baz">
  <h1>Hello</h1>
  World
</Component>
```

## JSX 결과 타입

기본적으로 JSX 표현 식의 결괏값은 `any` 타입입니다.
`JSX.Element` 인터페이스를 통해 해당 타입으로 변경할 수 있습니다.
그러나 JSX 내 요소, 속성 혹은 자식의 정보는 해당 인터페이스를 통해 검색할 수 없습니다.
해당 인터페이스는 블랙박스(black box)입니다.

## 표현 식 포함하기

JSX는 태그 사이에서의 표현 식을 중괄호(`{ }`)에 넣어 사용합니다.

```ts
var a = (
  <div>
    {["foo", "bar"].map((i) => (
      <span>{i / 2}</span>
    ))}
  </div>
);
```

위의 코드는 문자열을 통해 숫자를 나눌 수 없으므로 결과로 오류가 발생할 것입니다.
` preserve` 옵션을 사용한 출력은 다음과 같습니다:

```ts
var a = (
  <div>
    {["foo", "bar"].map(function (i) {
      return <span>{i / 2}</span>;
    })}
  </div>
);
```

## React 통합

React와 JSX를 함께 사용하기 위해서는 [React 타이핑](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)을 사용해야 합니다.
이 타이핑은 React와 사용하기 위한 적절한 `JSX` 네임스페이스를 정의합니다.

```ts
/// <reference path="react.d.ts" />

interface Props {
  foo: string;
}

class MyComponent extends React.Component<Props, {}> {
  render() {
    return <span>{this.props.foo}</span>;
  }
}

<MyComponent foo="bar" />; // 성공
<MyComponent foo={0} />; // 오류
```

### JSX 구성

JSX 사용자 정의에 사용되는 다양한 컴파일러 플래그가 있으며, 이는 컴파일러 플래그와 인라인 파일별 프라그마로 동작합니다. 자세한 내용은 tsconfig 참조 페이지를 통해 배울 수 있습니다:

- [`jsxFactory`](/tsconfig/#jsxFactory)
- [`jsxFragmentFactory`](/tsconfig/#jsxFragmentFactory)
- [`jsxImportSource`](/tsconfig/#jsxImportSource)
