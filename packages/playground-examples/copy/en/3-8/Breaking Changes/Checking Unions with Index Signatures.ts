//// { compiler: { ts: "3.8.3" } }
// In previous versions of TypeScript, the checker would not
// verify that undeclared fields in a union conform to any indexed
// types in the union.

// You can learn about indexed types here: example:indexed-types

// For example, the IdentifierCache below indicates that any
// key on the object will be a number:

type IdentifierCache = { [key: string]: number };

// Meaning this will fail, because 'file_a' has a
// string value

const cacheWithString: IdentifierCache = { file_a: "12343" };

// However, when you put that into a union, then the
// validation check would not happen:

let userCache: IdentifierCache | { index: number };
userCache = { file_one: 5, file_two: "abc" };

// This is fixed, and there would be an error about
// 'file_two' from the compiler.

// This also takes into account when the key is a different
// type, for example: ([key: string] and [key: number])

type IdentifierResponseCache = { [key: number]: number };

let resultCache: IdentifierCache | IdentifierResponseCache;
resultCache = { file_one: "abc" };
