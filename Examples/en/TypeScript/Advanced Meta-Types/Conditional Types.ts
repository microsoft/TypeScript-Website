// Conditionals Types provide a way to do simple logic in the
// TypeScript type system. This is definitely an advanced
// feature, and it's quite feasible that you won't need to
// use this in your normal day to day code.

// A conditional type looks like:
//
//   A extends B ? C : D
//
// Where the conditional is whether a type extends an 
// expression, and if so what type should be returned. A
// type could also be deferred for 

// Let's go through some simple examples

type Cat = { meows: true }
type Dog = { barks: true }
type Cheetah = { meow: true, fast: true }
type Wolf = { barks: true, howls: true }

// We can create a conditional type which lets use extract
// types which only conform to something which barks.

type ExtractDogish<A> = A extends { barks: true } ? A : never

// Then we can create types which ExtractDogish wraps:

// A cat doesn't bark, so it will return never
type NeverCat = ExtractDogish<Cat>
// A wolf will bark, so it returns the wolf
type Wolfish = ExtractDogish<Wolf>

// This becomes useful when you want to work with a 
// union of many types and reduce the number of potential
// options in a union,

type Animals = Cat | Dog | Cheetah | Wolf

// When you apply ExtractDogish to a union type, it is the 
// same as running the conditional against each member of
// the type

type Dogish = ExtractDogish<Animals>

// = ExtractDogish<Cat> | ExtractDogish<Dog> |
//   ExtractDogish<Ceetah> | ExtractDogish<Wolf>

// = never | Dog | never | Wolf

// = Dog | Wolf (see example:unknown-and-never)

// This is call a distributive conditional type because the
// type distributes over each member of the union.


// Deferred Conditional Types

// Conditional types can be used to tighten your APIs which 
// can return different types depending on the inputs.

// For example this function which could return either a
// string or number depending on the boolean passed in. 

declare function getUserID<T extends boolean>(user: {}, oldSystem: T): T extends true ? string : number

// Then depending on how much the type-system knows about
// the boolean, you will get different return types:

let stringReturnValue = getUserID({}, /* oldSystem */ true)
let numberReturnValue = getUserID({}, /* oldSystem */ false)
let stringOrID = getUserID({}, /* oldSystem */ Math.random() < 0.5)

// In this case above TypeScript can know the return value 
// instantly. However, you can use conditional types in functions 
// where the type isn't known yet. This is called a deferred
// conditional type.

// Same as our Dogish above, but as a function instead
declare function isCatish<T>(x: T): T extends { meows: true } ? T : undefined;

// In this Generic function there are no constraints on the
// generic parameter U, and so it could be any type.

// This means using Catish would need to wait to know what
// the actual type of U is before it can be applied.

function findOtherAnimalsOfType<U>(animal: U) {
  let maybeCat = isCatish(animal)

  // You can use assignment to short-circuit the process
  // if you' have a good idea about the types during 
  // implementation
  let b: Cat | Cheetah | undefined = maybeCat;
  return maybeCat
}

const a = findOtherAnimalsOfType<Animals>({ meow: true, fast: true })
const b = findOtherAnimalsOfType<Cat>({ meows: true})

// TODO: This example needs work!


// typeof process("foo")
