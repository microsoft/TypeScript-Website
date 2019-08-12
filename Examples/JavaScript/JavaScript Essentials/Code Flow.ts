//// { order: 3, compiler: { strictNullChecks: true } }

// How code flows inside your JavaScript file can affect what the types for your
// JavaScript looks like. If statements are great place to start here, because 
// they provide a way to confirm a particular shape of an object.

const users = [{ name: "Ahmed" }, { name: "Gemma" }, { name: "Jon" }]

// We're going to look to see if we can find a user
const jon = users.find(u => u.name === "jon")

// If you hover over the three different jon's below, you'll see how the
// type definitions change depending on where the word is located:

if (jon) {
  jon
} else {
  jon
}

// This uses a TypeScript feature called union types. A union type is a
// way to declare that an object could be one of many things. JavaScript's
// dynamic nature means a lot of function receive and return objects of
// different types and you need to be able to figure out which one you have.

// In the above case find could fail, and in that case you don't have an
// object. This is written like: { name:string } | undefined 
// The pipe acts as the separator between different types.

// You can use this in a few ways, lets start by looking at an array
// where the variables are not all the same.

const identifiers = ["Hello", "World", 24, 19]

// Could be a vinyl or cassette
const randomIdentifier = identifiers[0]

// We can use the JavaScript "typeof x === y" syntax to check for the
// type of the object. You can hover on randomIdentifier below to
// see how it changes between different locations

if (typeof randomIdentifier === "number") {
  randomIdentifier
} else {
  randomIdentifier
}

// This code flow analysis means that you can write vanilla JavaScript and
// TypeScript will try to understand how the code you write would affect 
// the types available at different locations. 

// To learn more about code flow analysis
//  - [handbook]

// To continue reading through examples you could jump to a few different
// places now.
//
// - Modern JavaScript: example:immutability
// - Functional Programming with JavaScript example:function-chaining
// 
