//// { order: 0, compiler: { jsx: "react" } }

// React is a popular library for creating user interfaces.
// It provides a JavaScript abstraction for creating view 
// components using a JavaScript language extension called
// JSX. 

// TypeScript supports JSX, and provides a rich set of 
// type tools to richly model how components connect.

// To get started with understanding how React comes 
// together. First we'll look at how generic interfaces 
// works in TypeScript. We're going to create an faux-React 
// functional component.

interface FuaxactFunctionComponent<Props extends {}> {
    (props: Props, context?: any): FuaxactFunctionComponent<any> | null
}

// This creates a function which is generic with a Props 
// variable which has to be an object. The component function 
// returns either another component function or null.

// The other component API is a class-based one, here's a
// simplified version of that API

interface FuaxactClassComponent<Props extends {}, State = {}> {
    props: Props
    state: State

    setState: (prevState: State, props: Props) => Props
    callback?: () => void
    render() : FuaxactClassComponent<any> | null

}

// Because this class can have both Props and State - it has
// two generic arguments which are used throughout the class.

// The React library comes with it's own type definitions
// like these but are much more comprehensive. Let's bring
// those into our playground and explore a few components.

import React from 'react';

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
          <p style={{ fontWeight: props.priority ? "bold": "normal"}}>OK</p>
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


