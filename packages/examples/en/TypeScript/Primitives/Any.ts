// Any is the TypeScript escape clause. You can use any to
// either declare a section of your code to be dynamic and
// JavaScript like, or to work around limitations in the
// type system.

// A good case for any is JSON parsing:

const myObject = JSON.parse("{}");

// Any declares to TypeScript to trust your code as being
// safe because you know more about it. Even if that is
// not strictly true. For example, this code would crash:

myObject.x.y.z;

// Using an any gives you the ability to write code closer to
// original JavaScript with the trade off of type safety.

// any is much like a 'type wildcard' which you can replace 
// with any type (except never) to make one type assignable
// to the other.

declare function debug(value: any);

debug("a string");
debug(23);
debug({ color: "blue" });

// Each call to debug is allowed because you could replace the
// any with the type of the argument to match.

// TypeScript will take into account the position of the
// anys in different forms, for example with these tuples
// for the function argument

declare function swap(x: [number, string]): [string, number]

declare const pair: [any, any];
swap(pair)

// The call to swap is allowed because the argument can be
// matched by replacing the first any in pair with number
// and the second `any` with string.

// If tuples are new to you, see: example:tuples

// Unknown is a sibling type to any, if any is about saying
// "I know what's best", then unknown is a way to say "I'm
// not sure what is best, so you need to tell TS the type"
// example:unknown-and-never
