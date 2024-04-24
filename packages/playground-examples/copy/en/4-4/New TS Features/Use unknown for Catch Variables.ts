//// { "compiler": { "ts": "4.4.2", "useUnknownInCatchVariables": true } }
// If `unknown` is new to you, read: example:unknown-and-never

// Since TypeScript 4.0, you have been able to change the type
// of the variable in a catch statement from the default of
// `any` to `unknown` by manually assigning the type:

try {
  // @ts-ignore
  iWillCrash();
} catch (err) {
  // This implicitly means you _have_ to declare
  // what the type is before you can write code
  // against `err`:
  console.log(err.message);

  // For example, we have to verify it is an
  // error before using it as one.
  if (err instanceof Error) {
    console.log(err.message);
  }
}

// Also: example:unknown-in-catch

// By using the option `useUnknownInCatchVariables`, you
// can have the compiler default to `unknown` instead of
// `any`. Effectively forcing all usage of that variable
// to be confirmed by the type system before usage.

// You can opt-out on one-off catch statements by assigning
// the variable to `any`.

try {
  // @ts-ignore
  iWillCrash();
} catch (err: any) {
  // In which case, you can treat it
  // however you would like.
  console.log(err.message);
}
