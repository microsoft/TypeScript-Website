//// { "compiler": { "ts": "4.0.2" } }

// Because JavaScript allows throwing any value, TypeScript
// does not support declaring the type of an error

try {
  // ..
} catch (e) { }

// Historically, this has meant that the `e` in the catch
// would default to any. This allowed for the freedom to
// arbitrarily access any property. With 4.0, we've loosened
// the restrictions on type assignment in the catch clause
// to allow both `any` and `unknown`.

// Same behavior with any:
try {
  // ..
} catch (e) {
  e.stack;
}

// Explicit behavior with unknown:

try {
  // ..
} catch (e: unknown) {
  // You cannot use `e` at all until the type
  // system learns what it is, for more info see:
  // example:unknown-and-never
  e.stack;

  if (e instanceof SyntaxError) {
    e.stack;
  }
}
