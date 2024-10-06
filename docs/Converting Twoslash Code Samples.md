### A Guide to Converting to Twoslash

To run the site with Twoslash enabled you need to use `pnpm start`.

Code samples on the TypeScript Website should run through [Twoslash](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher#typescript-twoslash) which lets the compiler do more of the work.

Without twoslash a code sample looks like:

````
```ts
// Declare a tuple type
let x: [string, number];

// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```
````

With twoslash:

````
```ts twoslash
// Declare a tuple type
let x: [string, number];

// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```
````

This would now break the TypeScript website build because the code sample has a compiler error, this is great. Let's fix that by telling TypeScript this error is on purpose:

````
```ts twoslash
// @errors: 2322
// Declare a tuple type
let x: [string, number];

// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```
````

Now it will pass. The thing from here is that the comments are kind redundant because the compiler will tell you that info, so let's trim those:

````
```ts twoslash
// @errors: 2322
// Declare a tuple type
let x: [string, number];

// Initialize it
x = ["hello", 10];

// Initialize it incorrectly
x = [10, "hello"];
```
````

---

A twoslash code sample can do _a lot_ - the best documentation for twoslash lives inside the [bug workbench](https://www.typescriptlang.org/dev/bug-workbench) where you can test your code sample live and read how it all works.
