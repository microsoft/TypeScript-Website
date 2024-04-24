// TypeScript has some fun special cases for literals in
// source code.

// In part, a lot of the support is covered in type widening
// and narrowing ( example:type-widening-and-narrowing ) and it's
// worth covering that first.

// A literal is a more concrete subtype of a collective type.
// What this means is that "Hello World" is a string, but a
// string is not "Hello World" inside the type system.

const helloWorld = "Hello World";
let hiWorld = "Hi World"; // this is a string because it is let

// This function takes all strings
declare function allowsAnyString(arg: string);
allowsAnyString(helloWorld);
allowsAnyString(hiWorld);

// This function only accepts the string literal "Hello World"
declare function allowsOnlyHello(arg: "Hello World");
allowsOnlyHello(helloWorld);
allowsOnlyHello(hiWorld);

// This lets you declare APIs which use unions to say it
// only accepts a particular literal:

declare function allowsFirstFiveNumbers(arg: 1 | 2 | 3 | 4 | 5);
allowsFirstFiveNumbers(1);
allowsFirstFiveNumbers(10);

let potentiallyAnyNumber = 3;
allowsFirstFiveNumbers(potentiallyAnyNumber);

// At first glance, this rule isn't applied to complex objects.

const myUser = {
  name: "Sabrina",
};

// See how it transforms `name: "Sabrina"` to `name: string`
// even though it is defined as a constant. This is because
// the name can still change any time:

myUser.name = "Cynthia";

// Because myUser's name property can change, TypeScript
// cannot use the literal version in the type system. There
// is a feature which will allow you to do this however.

const myUnchangingUser = {
  name: "Fatma",
} as const;

// When "as const" is applied to the object, then it becomes
// a object literal which doesn't change instead of a
// mutable object which can.

myUnchangingUser.name = "Raîssa";

// "as const" is a great tool for fixtured data, and places
// where you treat code as literals inline. "as const" also
// works with arrays:

const exampleUsers = [{ name: "Brian" }, { name: "Fahrooq" }] as const;
