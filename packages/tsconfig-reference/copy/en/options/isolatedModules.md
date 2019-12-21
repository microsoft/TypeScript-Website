---
display: "Isolated Modules"
---

While you can use TypeScript to produce JavaScript code from TypeScript code, it's also common to use other transpilers such as [Babel](https://babeljs.io) to do this.
However, most other transpilers only operate on a single file at a time, so can't apply code transforms that depend on whole-program analysis.
This restriction also applies to TypeScript's `ts.transpileModule` API which is used by some build tools.

These limitations can cause runtime problems for some TypeScript constructs.
Setting the `isolatedModules` flag tells TypeScript to warn you if you write certain code that can't be correctly interpreted by a single-file transpilation process.
It does not change the behavior of your code, or otherwise change the behavior of TypeScript's checking and emitting process.

#### Exports of Non-Value Identifiers

In TypeScript, you can import a _type_ and then subsequently export it:

```ts twoslash
// @noErrors
import { someType, someFunction } from "someModule";

someFunction();

export { someType, someFunction };
```

Because there's no value for `someType`, the emitted `export` will not try to export it (this would be a runtime error):

```js
export { someFunction };
```

Single-file transpilers don't know whether `someType` produces a value or not, so it's an error to export a name that only refers to a type if `isolatedModules` is set.

#### Non-Module Files

If `isolatedModules` is set, all implementation files must be _modules_.
An error occurs if any file isn't a module:

```ts twoslash
// @errors: 1208
// @isolatedModules
function fn() {}
```

This restriction doesn't apply to `.d.ts` files

#### References to `const enum` members

In TypeScript, when you reference a `const enum` member, the reference is replaced by its actual value in the emitted JavaScript:

```ts
declare const enum Numbers {
  Zero = 0,
  One = 1
}
console.log(Numbers.Zero + Numbers.One);
```

To:

```ts twoslash
// @showEmit
// @removeComments
declare const enum Numbers {
  Zero = 0,
  One = 1
}
console.log(Numbers.Zero + Numbers.One);
```

Without knowledge of the values of these members, other transpilers can't replace the references to `Number`, which would be a runtime error if left alone (since there is no `Numbers` object at runtime).
Because of this, when `isolatedModules` is set, it is an error to reference an ambient `const enum` member.
