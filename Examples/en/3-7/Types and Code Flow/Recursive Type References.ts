//// { compiler: {  }, order: 2 }

// Choosing between using type vs interface is about the
// constraints in the features for each. With 3.7, one of
// the constrains on type but not in interface was removed.

// You can find out more about this in example:types-vs-interfaces

// It used to be that you could not refer to the type you
// are defining inside the type itself. This was a limit
// which didn't exist inside an interface, and could be worked
// around with a little work.

// For example, this is not feasible in 3.6:
type ValueOrArray<T> = T | Array<ValueOrArray<T>>;

// An implementation would have looked like this, by mixing
// the type with an interface.
type ValueOrArray2<T> = T | ArrayOfValueOrArray<T>;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray2<T>> {}

// This allows for a comprehensive definition of JSON,
// which works by referring to itself.

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const exampleStatusJSON: Json = {
  available: true,
  username: "Jean-loup",
  room: {
    name: "Highcrest",
    // Cannot add functions into the Json type
    // update: () => {}
  }
}

// There's more to learn from the 3.7 beta release notes and its PR:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
// https://github.com/microsoft/TypeScript/pull/33050
