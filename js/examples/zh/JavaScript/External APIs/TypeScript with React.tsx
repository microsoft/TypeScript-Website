//// { order: 2, compiler: { jsx: 2, esModuleInterop: true } }

// React 是一个流行的创建用户界面的库。它提供了 JavaScript 的抽象，
// 即被称为 JSX 的 JavaScript 语言扩展来创建界面。

// TypeScript 支持 JSX，并且提供了丰富的类型工具用于对组件
// 之间的关系进行丰富的建模。

// 为了了解 TypeScript 如何与 React 组件一起工作，您可能需要
// 简单了解一下泛型：
//
// - example:generic-functions
// - example:generic-classes

// 首先我们了解如何使用泛型接口来映射 React 组件。这是一个
// 仿 React 的函数组件：

type FauxactFunctionComponent<Props extends {}> =
  (props: Props, context?: any) => FauxactFunctionComponent<any> | null | JSX.Element


// 
// 大意：
//
// FauxactFunctionComponent 是一个泛型函数，其依赖于另一个类型 Props。
// Props 必须是一个对象（确保您不能传递原始类型）并且 Props 类型将被复用为
// 函数中的第一个参数。

// 要使用它，您需要一个 props 类型。

interface DateProps { iso8601Date: string, message: string }

// 我们可以创建一个使用 DateProps 接口的 DateComponent，并渲染出日期。

const DateComponent: FauxactFunctionComponent<DateProps> =
  (props) => <time dateTime={props.iso8601Date}>{props.message}</time>

// 这回创建一个具有 Props 类型变量的泛型函数，其中 Props 必须是一个对象。
// 组件函数返回另一个组件函数或 null。


// 另一个组件的 API 是基于类的。下面是这种 API 的简单示例：

interface FauxactClassComponent<Props extends {}, State = {}> {
  props: Props
  state: State

  setState: (prevState: State, props: Props) => Props
  callback?: () => void
  render(): FauxactClassComponent<any> | null
}

// 由于这个类可以拥有 Props 和 State ——它有两个可以在类中使用的泛型参数。

// React 库附带了他们更加全面的类型定义，让我们将其带入我们的游乐场
// 并探索一些组件。

import * as React from 'react';

// 您的 props 是您公开的 API，所以值得使用 JSDoc 来解释它的工作原理：

export interface Props {
  /** 用户名 */
  name: string;
  /** 名字是否应该被渲染为粗体 */
  priority?: boolean
}

const PrintName: React.FC<Props> = (props) => {
  return (
    <div>
      <p style={{ fontWeight: props.priority ? "bold" : "normal" }}>{props.name}</p>
    </div>
  )
}

// 您可以像下面这样使用新组件：

const ShowUser: React.FC<Props> = (props) => {
  return <PrintName name="Ned" />
}

// TypeScript 支持在大括号（{}）和属性中提供智能感知

let username = "Cersei"
const ShowStoredUser: React.FC<Props> = (props) => {
  return <PrintName name={username} priority />
}

// TypeScript 可以用于现代 React 代码一起使用，您可以看
// 到 count 本身和 setCount 的参数，已经正确地根据传递
// 给 useState 的初始值被推断为 number。

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

// React 和 TypeScript 是一个非常非常大的主题，但基本原理非
// 常简单：TypeScript 支持 JSX，其余的由 DefinitelyTyped
// 中的 React 类型定义处理。

// 在如下网站您可以了解更多关于共同使用 React 和 TypeScript 的信息：
//
// https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
// https://egghead.io/courses/use-typescript-to-develop-react-applications
// https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
