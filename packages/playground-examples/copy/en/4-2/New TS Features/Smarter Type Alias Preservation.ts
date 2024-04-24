//// { "compiler": { "ts": "4.2.0-beta" } }
// Type aliases differ from interfaces in that they aren't guaranteed to
// keep their name as they are used throughout the compiler. In part, this
// is a trade-off on what gives them their flexibility, but the downside
// is that sometimes TypeScript shows an object instead of the name.

// In 4.2, the compiler keeps track of the original name for a type alias
// in more places. Reducing the size of error messages and hover hints.

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

type Named = { name: string };

// Previously: Shape
declare let shape: Shape;

// No change there, but if you took the existing shape union and extend it,
// then TypeScript used to 'lose' the original name:

// Previously: { kind: "circle"; radius: number; | { kind: "square"; size: number; | { kind: "rectangle"; width: number; height: number; | undefined
declare let optionalShape: Shape | undefined;

// Previously: { kind: "circle"; radius: number; | { kind: "square"; size: number; | { kind: "rectangle"; width: number; height: number; | undefined
declare let namedShape: Shape & Named;

// Previously: ({ kind: "circle"; radius: number; Named) | ({ kind: "square"; size: number; Named) | ({ kind: "rectangle"; width: number; height: number; Named) | undefined
declare let optionalNamedShape: (Shape & Named) | undefined; // (Shape & Named) | undefined
