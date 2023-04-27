//// { "compiler": { "ts": "4.7.3" } }
// Prior to TypeScript 4.7, you would have to do call a function
// in order to narrow a generic type to something specific. For
// example, let's take a Map object:

const map = new Map<string, number>();
//    ^?

// This map uses strings for keys, and numbers for values. Until
// we created the map, the values for key (string) and value (number)
// were yet to be defined and could still be anything.

// Instantiation expressions means that we can create a version of the
// Map function which will always accept only strings for keys and 
// numbers for values:

const MapStrNum = Map<string, number>;

const map2 = new MapStrNum()
//    ^?

// This feature allows us to elegantly create a more specific typed
// functions without having to wrap the function in another function.