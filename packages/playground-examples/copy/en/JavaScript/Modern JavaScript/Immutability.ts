// JavaScript is a language with a few ways to declare that
// some of your objects don't change. The most prominent is
// const - which says that the value won't change.

const helloWorld = "Hello World";

// You cannot change helloWorld now, TypeScript will give
// you an error about this, because you would get one at
// runtime instead.

helloWorld = "Hi world";

// Why care about immutability? A lot of this is about
// reducing complexity in your code. If you can reduce the
// number of things which can change, then there are less
// things to keep track of.

// Using const is a great first step, however this fails
// down a bit when using objects.

const myConstantObject = {
  msg: "Hello World",
};

// myConstantObject is not quite a constant though, because
// we can still make changes to parts of the object, for
// example we can change msg:

myConstantObject.msg = "Hi World";

// const means the value at that point stays the same, but
// that the object itself may change internally. This can
// be changed using Object.freeze.

const myDefinitelyConstantObject = Object.freeze({
  msg: "Hello World",
});

// When an object is frozen, then you cannot change the
// internals. TypeScript will offer errors in these cases:

myDefinitelyConstantObject.msg = "Hi World";

// This works the same for arrays too:

const myFrozenArray = Object.freeze(["Hi"]);
myFrozenArray.push("World");

// Using freeze means you can trust that the object is
// staying the same under the hood.

// TypeScript has a few extra syntax hooks to improve working
// with immutable data which you can find in the TypeScript
// section of the examples:
//
// example:literals
// example:type-type-widening-and-narrowing
