//// { compiler: { ts: "3.7-Beta" }, order: 3 }

// TypeScript's error messages can sometimes be a tad verbose...
// With 3.7, we've taken a few cases which could be particularly
// egregious.


// Nested Properties

let a = { b: { c: { d: { e: "string" } } } };
let b = { b: { c: { d: { e: 12 } } } };

a = b;
 
// Before, it was 2 lines of code per nested property, which
// quickly meant people learned to read error messages by
// reading the first and then last line of an error message.

// Now they're inline. :tada:

// Previously in 3.6:
//
// Type '{ b: { c: { d: { e: number; }; }; }; }' is not assignable to type '{ b: { c: { d: { e: string; }; }; }; }'.
//   Types of property 'b' are incompatible.
//     Type '{ c: { d: { e: number; }; }; }' is not assignable to type '{ c: { d: { e: string; }; }; }'.
//       Types of property 'c' are incompatible.
//         Type '{ d: { e: number; }; }' is not assignable to type '{ d: { e: string; }; }'.
//           Types of property 'd' are incompatible.
//             Type '{ e: number; }' is not assignable to type '{ e: string; }'.
//               Types of property 'e' are incompatible.
//                 Type 'number' is not assignable to type 'string'


// This can handle working through different types of objects, 
// to still give a useful and concise error message.

class ExampleClass {
  state = "ok"
}

class OtherClass {
  state = 12;
}

let x = { a: { b: { c: { d: { e: { f: ExampleClass } } } } } };
let y = { a: { b: { c: { d: { e: { f: OtherClass } } } } } };
x = y;

// Previously in 3.6:
//
// Type '{ a: { b: { c: { d: { e: { f: typeof OtherClass; }; }; }; }; }; }' is not assignable to type '{ a: { b: { c: { d: { e: { f: typeof ExampleClass; }; }; }; }; }; }'.
//   Types of property 'a' are incompatible.
//     Type '{ b: { c: { d: { e: { f: typeof OtherClass; }; }; }; }; }' is not assignable to type '{ b: { c: { d: { e: { f: typeof ExampleClass; }; }; }; }; }'.
//       Types of property 'b' are incompatible.
//         Type '{ c: { d: { e: { f: typeof OtherClass; }; }; }; }' is not assignable to type '{ c: { d: { e: { f: typeof ExampleClass; }; }; }; }'.
//           Types of property 'c' are incompatible.
//             Type '{ d: { e: { f: typeof OtherClass; }; }; }' is not assignable to type '{ d: { e: { f: typeof ExampleClass; }; }; }'.
//               Types of property 'd' are incompatible.
//                 Type '{ e: { f: typeof OtherClass; }; }' is not assignable to type '{ e: { f: typeof ExampleClass; }; }'.
//                   Types of property 'e' are incompatible.
//                     Type '{ f: typeof OtherClass; }' is not assignable to type '{ f: typeof ExampleClass; }'.
//                       Types of property 'f' are incompatible.
//                         Type 'typeof OtherClass' is not assignable to type 'typeof ExampleClass'.
//                           Type 'OtherClass' is not assignable to type 'ExampleClass'.
//                             Types of property 'state' are incompatible.
//                               Type 'number' is not assignable to type 'string'
