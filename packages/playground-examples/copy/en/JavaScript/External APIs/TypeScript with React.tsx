//// { order: 2, compiler: { jsx: 2, esModuleInterop: true } }

// React is a popular library for creating user interfaces.
// It provides a JavaScript abstraction for creating view
// components using a JavaScript language extension called
// JSX.

// TypeScript supports JSX, and provides a rich set of
// type tools to richly model how components connect.

// To understand how TypeScript works with React components
// you may want a primer on generics:
//
// - example:generic-functions
// - example:generic-classes

// First we'll look at how generic interfaces are used to map
// React components. This is a faux-React functional component:

type FauxactFunctionComponent<Props extends {}> =
  (props: Props, context?: any) => FauxactFunctionComponent<any> | null | JSX.Element


// Roughly:
//
// FauxactFunctionComponent is a generic function which relies on
// another type, Props. Props has to be an object (to make sure
// you don't pass a primitive) and the Props type will be
// re-used as the first argument in the function.

// To use it, you need a props type:

interface DateProps { iso8601Date: string, message: string }

// We can then create a DateComponent which uses the
// DateProps interface, and renders the date.

const DateComponent: FauxactFunctionComponent<DateProps> =
  (props) => <time dateTime={props.iso8601Date}>{props.message}</time>

// This creates a function which is generic with a Props
// variable which has to be an object. The component function
// returns either another component function or null.


// The other component API is a class-based one.Here's a
// simplified version of that API:

interface FauxactClassComponent<Props extends {}, State = {}> {
  props: Props
  state: State

  setState: (prevState: State, props: Props) => Props
  callback?: () => void
  render(): FauxactClassComponent<any> | null
}

// Because this class can have both Props and State - it has
// two generic arguments which are used throughout the class.

// The React library comes with it's own type definitions
// like these but are much more comprehensive. Let's bring
// those into our playground and explore a few components.

import * as React from 'react';

// Your props are your public API, so it's worth taking the
// time to use JSDoc to explain how it works:

export interface Props {
  /** The user's name */
  name: string;
  /** Should the name be rendered in bold */
  priority?: boolean
}

const PrintName: React.FC<Props> = (props) => {
  return (
    <div>
      <p style={{ fontWeight: props.priority ? "bold" : "normal" }}>{props.name}</p>
    </div>
  )
}

// You can play with the new component's usage below:

const ShowUser: React.FC<Props> = (props) => {
  return <PrintName name="Ned" />
}

// TypeScript supports providing intellisense inside
// the {} in an attribute

let username = "Cersei"
const ShowStoredUser: React.FC<Props> = (props) => {
  return <PrintName name={username} priority />
}

// TypeScript works with modern React code too, here you can
// see that count and setCount have correctly been inferred
// to use numbers based on the initial value passed into
// useState.

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

// React and TypeScript is a really, really big topic
// but the fundamentals are pretty small: TypeScript
// supports JSX, and the rest is handled by the React
// typings from Definitely Typed.

// You can learn more about using React with TypeScript
// from these sites:
//
// https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
// https://egghead.io/courses/use-typescript-to-develop-react-applications
// https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
