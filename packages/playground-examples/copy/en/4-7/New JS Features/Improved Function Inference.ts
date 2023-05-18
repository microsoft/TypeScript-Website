//// { "compiler": { "ts": "4.7.3" } }
// With TypeScript 4.7, there are improvements in how types
// are inferred from typed function calls.

// Take this function 'cache', it takes one type parameter, 'Type'
// and one function argument, which contains two functions.

declare function cache<Type>(arg: { add: (n: string) => Type; process: (x: Type) => void }): void;

// When TypeScript is trying to infer the type of 'Type', it
// has two potential places to look:
//
// - the return of 'add'
// - the first parameter of 'remove'

// TypeScript's code inference now takes more these cases into
// account with more code styles, and also handle cases where the
// types depend on each other.

cache({
  add: n => n,
  process: x => x.toLowerCase(),
});

// Here Type = string because `add` returns a string
// which is the parameter type. However, prior versions of
// TypeScript would infer Type = any/unknown because both
// add and process would be evaluated at the same time.

cache({
  add: function (str) {
    return { value: str + "!" };
  },
  process: x => x.value.toLowerCase(),
});

// Here Type = { value: string }

cache({
  add() {
    return 23;
  },
  process: x => x + 1,
});

// Here Type = number

// This helps JavaScript and TypeScript users experience
// less accidental anys when working across different
// code styles.
