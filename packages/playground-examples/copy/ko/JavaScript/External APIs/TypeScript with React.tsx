//// { order: 2, compiler: { jsx: 2, esModuleInterop: true } }

// React는 사용자 인터페이스를 만드는 데 널리 사용되는 라이브러리입니다.
// JSX라는 JavaScript 언어 확장을 사용하여
// 뷰 컴포넌트를 작성하기 위해
// JavaScript 추상화를 제공합니다.

// TypeScript는 JSX를 지원하며, 컴포넌트 연동을 다양하게
// 모델링 할 수 있는 다양한 타입의 도구 집합을 제공합니다.

// TypeScript에서 React 컴포넌트가 어떻게 동작하는지 이해하기 위해서는
// 제네릭에 대해 미리 알 필요가 있습니다:
//
// - 예:generic-functions
// - 예:generic-classes

// 먼저 제네릭 인터페이스가 React 컴포넌트 매핑에서 어떻게 쓰이는지 알아보겠습니다.
// 다음은 함수형 컴포넌트 faux-React입니다:

type FauxactFunctionComponent<Props extends {}> =
  (props: Props, context?: any) => FauxactFunctionComponent<any> | null | JSX.Element


// 대략:
//
// FauxactFunctionComponent는
// Props라는 다른 타입에 의존하는 제네릭 함수입니다.
// Props는 (원시형 타입이 통과하지 못하게 하려면) 반드시 객체여야만 하며,
// Props 타입은 함수에서 첫 번째 인수로 재사용 됩니다.

// 이를 사용하기 위해서는 다음과 같은 props 타입이 필요합니다:

interface DateProps { iso8601Date: string, message: string }

// 그런 다음 DateProps 인터페이스를 사용하는
// DataComponent를 만들어 날짜를 렌더링 할 수 있습니다.

const DateComponent: FauxactFunctionComponent<DateProps> =
  (props) => <time dateTime={props.iso8601Date}>{props.message}</time>

// 이렇게 하면 객체 변수 Props로 제네릭 함수가 생성됩니다.
// 컴포넌트 함수는 또 다른 컴포넌트 함수나
// null 값을 반환합니다.


// 다른 컴포넌트 API는 클래스 기반입니다.
// 다음은 API에 대한 요약된 설명입니다:

interface FauxactClassComponent<Props extends {}, State = {}> {
  props: Props
  state: State

  setState: (prevState: State, props: Props) => Props
  callback?: () => void
  render(): FauxactClassComponent<any> | null
}

// 이 클래스는 Props와 State를 모두 가지고 있기 때문에
// 클래스 전체에 사용되는 두 개의 제네릭 인수를 가집니다.

// React 라이브러리는 위와 같은 자체 타입 정의와 함께 제공되지만
// 훨씬 더 포괄적입니다. 라이브러리에서 플레이그라운드로
// 몇 개의 컴포넌트를 가져와 다루어보겠습니다.

import * as React from 'react';

// props는 public API이므로, JSDoc을 사용하여 작동 방식을
// 설명하고 넘어가겠습니다.

export interface Props {
  /** 사용자 이름 */
  name: string;
  /** 이름은 볼드체로 렌더링 돼야 합니다 */
  priority?: boolean;
}

const PrintName: React.FC<Props> = (props) => {
  return (
    <div>
      <p style={{ fontWeight: props.priority ? "bold" : "normal" }}>{props.name}</p>
    </div>
  )
}

// 아래에서 새로운 컴포넌트 사용을 실행해볼 수 있습니다:

const ShowUser: React.FC<Props> = (props) => {
  return <PrintName name="Ned" />
}

// TypeScript는 속성의 {} 내부에서
// intellisense 기능을 지원합니다.

let username = "Cersei"
const ShowStoredUser: React.FC<Props> = (props) => {
  return <PrintName name={username} priority />
}

// TypeScript는 최신 React 코드에서도 작동합니다.
// 여기서는 count 및 setCount가 useState에 전달된
// 초기 값을 기반으로 숫자를 사용한다는 것을
// 유추할 수 있습니다.

import { useState, useEffect } from 'react';

const CounterExample = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

// React와 TypeScript는 정말 큰 주제이지만
// 그 기본 토대는 매우 작습니다: TypeScript는
// JSX를 지원하며 나머지는 Definitely Typed에 의한
// React 타입으로 처리됩니다.

// 아래의 사이트에서 Typescript로 React를
// 사용하는 방법에 대해 더 자세히 알아볼 수 있습니다.
//
// https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
// https://egghead.io/courses/use-typescript-to-develop-react-applications
// https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
