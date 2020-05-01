//// { order: 3, compiler: { strictNullChecks: false } }

// JavaScript has two ways to declare values which don't
// exist, and TypeScript adds extra syntax which allows even
// more ways to declare something as optional or nullable.

// First up, the difference between the two JavaScript
// primitives: undefined and null

// Undefined is when something cannot be found or set

const emptyObj = {};
const anUndefinedProperty: undefined = emptyObj["anything"];

// Null is meant to be used when there is a conscious lack
// of a value.

const searchResults = {
  video: { name: "LEGO Movie" },
  text: null,
  audio: { name: "LEGO Movie Soundtrack" },
};

// Why not use undefined? Mainly, because now you can verify
// that text was correctly included. If text returned as
// undefined then the result is the same as though it was
// not there.

// This might feel a bit superficial, but when converted into
// a JSON string, if text was an undefined, it would not be
// included in the string equivalent.

// Strict Null Types

// Before TypeScript 2.0 undefined and null were effectively
// ignored in the type system. This let TypeScript provide a
// coding environment closer to un-typed JavaScript.

// Version 2.0 added a compiler flag called "strictNullChecks"
// and this flag required people to treat undefined and null
// as types which needs to be handled via code-flow analysis
// ( see more at example:code-flow )

// For an example of the difference in turning on strict null
// checks to TypeScript, hover over "Potential String" below:

type PotentialString = string | undefined | null;

// The PotentialString discards the undefined and null. If
// you go up to the settings and turn on strict mode and come
// back, you'll see that hovering on PotentialString now shows
// the full union.

declare function getID(): PotentialString;

const userID = getID();
console.log("User Logged in: ", userID.toUpperCase());

// Only in strict mode the above will fail ^

// There are ways to tell TypeScript you know more, such as
// a type assertion or via a non-null assertion operator (!)

const definitelyString1 = getID() as string;
const definitelyString2 = getID()!;

// Or you safely can check for the existence via an if:

if (userID) {
  console.log(userID);
}

// Optional Properties

// Void

// Void is the return type of a function which does not
// return a value.

const voidFunction = () => {};
const resultOfVoidFunction = voidFunction();

// This is usually an accident, and TypeScript keeps the void
// type around to let you get compiler errors - even though at
// runtime it would be an undefined.
