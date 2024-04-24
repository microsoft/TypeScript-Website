//// { "compiler": { "ts": "4.7.3" } }
// In almost every release there are control flow improvements,
// in 4.7 there are improvements in computed properties work when
// narrowing. To learn more about narrowing see: example:type-widening-and-narrowing

const dog = "stringer";

const dogsToOwnersOrID = {
  hayes: "The McShanes",
  poppy: "Pat",
  stringer: "Jane",
  otto: 1,
} as Record<string, string | number>;

// A computed property is a property access which is not hardcoded,
// for example:

const owner = dogsToOwnersOrID[dog];
//    ^?

// Prior to TypeScript 4.7, using a computed property would not
// reliably narrow the type of a value.

if (typeof dogsToOwnersOrID[dog] === "string") {
  const str = dogsToOwnersOrID[dog].toUpperCase();
  //     ^?

  // In 4.6, this would still be 'string | number'.
}
