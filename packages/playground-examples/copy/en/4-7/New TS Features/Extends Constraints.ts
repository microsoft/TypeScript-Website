//// { "compiler": { "ts": "4.7.3" } }
// In 4.7 TypeScript added support for inlining an extends clause
// in a conditional type. This can help reduce the complexity of
// conditional types.

// If you're new to conditional types see: example:conditional-types

// As an example, here is a 4.6 conditional type which looks
// at the return value of a function and only returns a type
// if the return type is a string.

// prettier-ignore
type ReturnTypeOnlyStrings47<T> =
  T extends (...args: any[]) => 
    infer R ? (R extends string ? R : never) : never;

// It's essentially two if statements, one for the return type
// and one then to check if the return type is a string. In
// 4.7 this can be done inside one statement.

// prettier-ignore
type ReturnType2<T> =
  T extends (...args: any[]) =>
    (infer R extends string) ? R : never;

// It's a little like being able to use an && inside the conditional
// type check, which makes code a bit simpler and more readable.