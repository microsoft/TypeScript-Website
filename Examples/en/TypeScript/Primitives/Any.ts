// Any is the TypeScript escape clause. You can use any to
// either declare a section of your code to be dynamic and
// JavaScript like, or to work around limitations in the 
// type system.

// A good case for any is JSON parsing:

const myObject = JSON.parse("{}")

// Any declares to TypeScript to trust your code as being
// safe because you know more about it. Even if that is
// not strictly true. For example, this code would crash:

myObject.x.y.z

// Using an any gives you the ability to write code closer to
// original JavaScript with the trade off of type safety.

// Any is considered a top type in type theory, which means
// that all other objects (except never) can be classed as
// an any - this makes it a good case for functions which
// have a very open allowance for input.

declare function debug(value: any)

debug("a string")
debug(23)
debug({ color: "blue" })

// Unknown is a sibling type to any, if any is about saying
// "I know what's best", then unknown is a way to say "I'm 
// not sure what is best, so you need to tell TS the type"
// example:unknown-and-never
