// TypeScript's inference can get you very far, but there
// are lots of extra ways to provide a richer way to document
// the shape of your functions.

// A good first place is to look at optional params, which
// is a way of letting others know you can skip params.

let i = 0
const incrementIndex = (value?: number) => {
  i += (value === undefined ? 1 : value)
}

// This function can be called like:

incrementIndex()
incrementIndex(0)
incrementIndex(3)

// You can type parameters as functions, which provides
// type inference when you write the functions.

const callbackWithIndex = (callback: (i: number) => void) => {
  callback(i)
}

// Embedding function interfaces can get a bit hard to read
// with all the arrows. Using a type alias will let you name
// the function param.

type NumberCallback = (i: number) => void
const callbackWithIndex2 = (callback: NumberCallback) => {
  callback(i)
}

// These can be called like:

callbackWithIndex((index) => { console.log(index) })

// By hovering on index above, you can see how TypeScript
// has inferred the index to be a number correctly.

// TypeScript inference can work when passing a function
// as an instance reference too. To show this, we'll use
// a function which changed a number into string:

const numberToString = (n: number) => { return n.toString() }

// This can be used in a function like map on an array
// to convert all numbers into a string, if you hover
// on stringedNumbers below you can see the expected types.
const stringedNumbers = [1,4,6,10].map((i) => numberToString(i))

// We can use shorthand to have the function passed directly
// and get the same results with more focused code:
const stringedNumbersTerse = [1,4,6,10].map(numberToString)

// You may have functions which could accept a lot of types
// but you are only interested in a few properties. This is
// a useful case for indexed signatures in types. The
// following type declares that this function is OK to use
// any object so long as it includes the property name:

interface AnyObjectButMustHaveName {
  name: string
  [key: string]: any
}

const printFormattedName = (input: AnyObjectButMustHaveName) => { }

printFormattedName({name: "joey"})
printFormattedName({name: "joey", age: 23})

// If you'd like to learn more about index-signatures
// we recommend:
//
// https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks
// https://basarat.gitbooks.io/typescript/docs/types/index-signatures.html

// You can also allow this kind of behavior everywhere
// via the tsconfig flag suppressExcessPropertyErrors -
// however, you can't know if others using your API have
// this set to off.

// Functions in JavaScript can accept different sets of params.
// There are two common patterns for describing these: union
// types for parameters/return, and function overloads.

// Using union types in your parameters makes sense if there
// is only one or two changes and documentation does not need
// to change between functions.

const boolOrNumberFunction = (input: boolean | number) => {}

boolOrNumberFunction(true)
boolOrNumberFunction(23)

// Function overloads on the other hand offer a much richer
// syntax for the parameters and return types.

interface BoolOrNumberOrStringFunction {
  /** Takes a bool, returns a bool */
  (input: boolean): boolean
  /** Takes a number, returns a number */
  (input: number): number
  /** Takes a string, returns a bool */
  (input: string): boolean
}

// If this is your first time seeing declare, it allows you
// to tell TypeScript something exists even if it doesn't
// exist in the runtime in this file. Useful for mapping
// code with side-effects but extremely useful for demos
// where making the implementation would be a lot of code.

declare const boolOrNumberOrStringFunction: BoolOrNumberOrStringFunction

const boolValue = boolOrNumberOrStringFunction(true)
const numberValue = boolOrNumberOrStringFunction(12)
const boolValue2 = boolOrNumberOrStringFunction("string")

// If you hover over the above values and functions you
// can see the right documentation and return values.

// Using function overloads can get you very far, however
// there's another tool for dealing with different types of
// inputs and return values and that is generics.

// These provide a way for you to have types as placeholder
// variables in type definitions.

// example:generic-functions
// example:function-chaining
