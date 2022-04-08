---
title: TypeScript 4.3
layout: docs
permalink: /docs/handbook/release-notes/typescript-4-3.html
oneline: TypeScript 4.3 Release Notes
---

## Separate Write Types on Properties

In JavaScript, it's pretty common for APIs to convert values that are passed in before storing them.
This often happens with getters and setters too.
For example, let's imagine we've got a class with a setter that always converts a value into a `number` before saving it in a private field.

```js twoslash
class Thing {
  #size = 0;

  get size() {
    return this.#size;
  }
  set size(value) {
    let num = Number(value);

    // Don't allow NaN and stuff.
    if (!Number.isFinite(num)) {
      this.#size = 0;
      return;
    }

    this.#size = num;
  }
}
```

How would we type this JavaScript code in TypeScript?
Well, technically we don't have to do anything special here - TypeScript can look at this with no explicit types and can figure out that `size` is a number.

The problem is that `size` allows you to assign more than just `number`s to it.
We could get around this by saying that `size` has the type `unknown` or `any` like in this snippet:

```ts
class Thing {
  // ...
  get size(): unknown {
    return this.#size;
  }
}
```

But that's no good - `unknown` forces people reading `size` to do a type assertion, and `any` won't catch any mistakes.
If we really want to model APIs that convert values, previous versions of TypeScript forced us to pick between being precise (which makes reading values easier, and writing harder) and being permissive (which makes writing values easier, and reading harder).

That's why TypeScript 4.3 allows you to specify types for reading and writing to properties.

```ts twoslash
class Thing {
  #size = 0;

  get size(): number {
    return this.#size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN and stuff.
    if (!Number.isFinite(num)) {
      this.#size = 0;
      return;
    }

    this.#size = num;
  }
}
```

In the above example, our `set` accessor takes a broader set of types (`string`s, `boolean`s, and `number`s), but our `get` accessor always guarantees it will be a `number`.
Now we can finally assign other types to these properties with no errors!

```ts twoslash
class Thing {
  #size = 0;

  get size(): number {
    return this.#size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN and stuff.
    if (!Number.isFinite(num)) {
      this.#size = 0;
      return;
    }

    this.#size = num;
  }
}
// ---cut---
let thing = new Thing();

// Assigning other types to `thing.size` works!
thing.size = "hello";
thing.size = true;
thing.size = 42;

// Reading `thing.size` always produces a number!
let mySize: number = thing.size;
```

When considering how two properties with the same name relate to each other, TypeScript will only use the "reading" type (e.g. the type on the `get` accessor above).
"Writing" types are only considered when directly writing to a property.

Keep in mind, this isn't a pattern that's limited to classes.
You can write getters and setters with different types in object literals.

```ts
function makeThing(): Thing {
  let size = 0;
  return {
    get size(): number {
      return size;
    },
    set size(value: string | number | boolean) {
      let num = Number(value);

      // Don't allow NaN and stuff.
      if (!Number.isFinite(num)) {
        size = 0;
        return;
      }

      size = num;
    },
  };
}
```

In fact, we've added syntax to interfaces/object types to support different reading/writing types on properties.

```ts
// Now valid!
interface Thing {
    get size(): number
    set size(value: number | string | boolean);
}
```

One limitation of using different types for reading and writing properties is that the type for reading a property has to be assignable to the type that you're writing.
In other words, the getter type has to be assignable to the setter.
This ensures some level of consistency, so that a property is always assignable to itself.

For more information on this feature, take a look at [the implementing pull request](https://github.com/microsoft/TypeScript/pull/42425).

## `override` and the `--noImplicitOverride` Flag

When extending classes in JavaScript, the language makes it super easy (pun intended) to override methods - but unfortunately, there are some mistakes that you can run into.

One big one is missing renames.
For example, take the following classes:

```ts
class SomeComponent {
  show() {
    // ...
  }
  hide() {
    // ...
  }
}

class SpecializedComponent extends SomeComponent {
  show() {
    // ...
  }
  hide() {
    // ...
  }
}
```

`SpecializedComponent` subclasses `SomeComponent`, and overrides the `show` and `hide` methods.
What happens if someone decides to rip out `show` and `hide` and replace them with a single method?

```diff
 class SomeComponent {
-    show() {
-        // ...
-    }
-    hide() {
-        // ...
-    }
+    setVisible(value: boolean) {
+        // ...
+    }
 }
 class SpecializedComponent extends SomeComponent {
     show() {
         // ...
     }
     hide() {
         // ...
     }
 }
```

_Oh no!_
Our `SpecializedComponent` didn't get updated.
Now it's just adding these two useless `show` and `hide` methods that probably won't get called.

Part of the issue here is that a user can't make it clear whether they meant to add a new method, or to override an existing one.
That's why TypeScript 4.3 adds the `override` keyword.

```ts
class SpecializedComponent extends SomeComponent {
    override show() {
        // ...
    }
    override hide() {
        // ...
    }
}
```

When a method is marked with `override`, TypeScript will always make sure that a method with the same name exists in a the base class.

```ts twoslash
// @noImplicitOverride
// @errors: 4113
class SomeComponent {
    setVisible(value: boolean) {
        // ...
    }
}
class SpecializedComponent extends SomeComponent {
    override show() {

    }
}
```

This is a big improvement, but it doesn't help if you _forget_ to write `override` on a method - and that's a big mistake users can run into also.

For example, you might accidentally "trample over" a method that exists in a base class without realizing it.

```ts
class Base {
  someHelperMethod() {
    // ...
  }
}

class Derived extends Base {
  // Oops! We weren't trying to override here,
  // we just needed to write a local helper method.
  someHelperMethod() {
    // ...
  }
}
```

That's why TypeScript 4.3 _also_ provides a new [`noImplicitOverride`](/tsconfig#noImplicitOverride) flag.
When this option is turned on, it becomes an error to override any method from a superclass unless you explicitly use an `override` keyword.
In that last example, TypeScript would error under [`noImplicitOverride`](/tsconfig#noImplicitOverride), and give us a clue that we probably need to rename our method inside of `Derived`.

We'd like to extend our thanks to our community for the implementation here.
The work for these items was implemented in [a pull request](https://github.com/microsoft/TypeScript/pull/39669) by [Wenlu Wang](https://github.com/Kingwl), though an earlier pull request implementing only the `override` keyword by [Paul Cody Johnston](https://github.com/pcj) served as a basis for direction and discussion.
We extend our gratitude for putting in the time for these features.

## Template String Type Improvements

In recent versions, TypeScript introduced a new type construct: template string types.
These are types that either construct new string-like types by concatenating...

```ts
type Color = "red" | "blue";
type Quantity = "one" | "two";

type SeussFish = `${Quantity | Color} fish`;
// same as
//   type SeussFish = "one fish" | "two fish"
//                  | "red fish" | "blue fish";
```

...or match patterns of other string-like types.

```ts
declare let s1: `${number}-${number}-${number}`;
declare let s2: `1-2-3`;

// Works!
s1 = s2;
```

The first change we made is just in when TypeScript will infer a template string type.
When a template string is _contextually typed_ by a string-literal-like type (i.e. when TypeScript sees we're passing a template string to something that takes a literal type) it will try to give that expression a template type.

```ts
function bar(s: string): `hello ${string}` {
    // Previously an error, now works!
    return `hello ${s}`;
}
```

This also kicks in when inferring types, and the type parameter `extends string`

```ts
declare let s: string;
declare function f<T extends string>(x: T): T;

// Previously: string
// Now       : `hello ${string}`
let x2 = f(`hello ${s}`);
```

The second major change here is that TypeScript can now better-relate, and _infer between_, different template string types.

To see this, take the following example code:

```ts
declare let s1: `${number}-${number}-${number}`;
declare let s2: `1-2-3`;
declare let s3: `${number}-2-3`;

s1 = s2;
s1 = s3;
```

When checking against a string literal type like on `s2`, TypeScript could match against the string contents and figure out that `s2` was compatible with `s1` in the first assignment;
however, as soon as it saw another template string, it just gave up.
As a result, assignments like `s3` to `s1` just didn't work.

TypeScript now actually does the work to prove whether or not each part of a template string can successfully match.
You can now mix and match template strings with different substitutions and TypeScript will do a good job to figure out whether they're really compatible.

```ts
declare let s1: `${number}-${number}-${number}`;
declare let s2: `1-2-3`;
declare let s3: `${number}-2-3`;
declare let s4: `1-${number}-3`;
declare let s5: `1-2-${number}`;
declare let s6: `${number}-2-${number}`;

// Now *all of these* work!
s1 = s2;
s1 = s3;
s1 = s4;
s1 = s5;
s1 = s6;
```

In doing this work, we were also sure to add better inference capabilities.
You can see an example of these in action:

```ts
declare function foo<V extends string>(arg: `*${V}*`): V;

function test<T extends string>(s: string, n: number, b: boolean, t: T) {
    let x1 = foo("*hello*");            // "hello"
    let x2 = foo("**hello**");          // "*hello*"
    let x3 = foo(`*${s}*` as const);    // string
    let x4 = foo(`*${n}*` as const);    // `${number}`
    let x5 = foo(`*${b}*` as const);    // "true" | "false"
    let x6 = foo(`*${t}*` as const);    // `${T}`
    let x7 = foo(`**${s}**` as const);  // `*${string}*`
}
```

For more information, see [the original pull request on leveraging contextual types](https://github.com/microsoft/TypeScript/pull/43376), along with [the pull request that improved inference and checking between template types](https://github.com/microsoft/TypeScript/pull/43361).

## ECMAScript `#private` Class Elements

TypeScript 4.3 expands which elements in a class can be given `#private` `#names` to make them truly private at run-time.
In addition to properties, methods and accessors can also be given private names.

```ts
class Foo {
  #someMethod() {
    //...
  }

  get #someValue() {
    return 100;
  }

  publicMethod() {
    // These work.
    // We can access private-named members inside this class.
    this.#someMethod();
    return this.#someValue;
  }
}

new Foo().#someMethod();
//        ~~~~~~~~~~~
// error!
// Property '#someMethod' is not accessible
// outside class 'Foo' because it has a private identifier.

new Foo().#someValue;
//        ~~~~~~~~~~
// error!
// Property '#someValue' is not accessible
// outside class 'Foo' because it has a private identifier.
```

Even more broadly, static members can now also have private names.

```ts
class Foo {
  static #someMethod() {
    // ...
  }
}

Foo.#someMethod();
//  ~~~~~~~~~~~
// error!
// Property '#someMethod' is not accessible
// outside class 'Foo' because it has a private identifier.
```

This feature was authored [in a pull request](https://github.com/microsoft/TypeScript/pull/42458) from our friends at Bloomberg - written by [Titian Cernicova-Dragomir](https://github.com/dragomirtitian)and [Kubilay Kahveci](https://github.com/mkubilayk), with support and expertise from [Joey Watts](https://github.com/joeywatts), [Rob Palmer](https://github.com/robpalme), and [Tim McClure](https://github.com/tim-mc).
We'd like to extend our thanks to all of them!

## `ConstructorParameters` Works on Abstract Classes

In TypeScript 4.3, the `ConstructorParameters` type helper now works on `abstract` classes.

```ts
abstract class C {
  constructor(a: string, b: number) {
    // ...
  }
}

// Has the type '[a: string, b: number]'.
type CParams = ConstructorParameters<typeof C>;
```

This is thanks to work done in TypeScript 4.2, where construct signatures can be marked as abstract:

```ts
type MyConstructorOf<T> = {
    abstract new(...args: any[]): T;
}

// or using the shorthand syntax:

type MyConstructorOf<T> = abstract new (...args: any[]) => T;
```

You can [see the change in more detail on GitHub](https://github.com/microsoft/TypeScript/pull/43380).

## Contextual Narrowing for Generics

TypeScript 4.3 now includes some slightly smarter type-narrowing logic on generic values.
This allows TypeScript to accept more patterns, and sometimes even catch mistakes.

For some motivation, let's say we're trying to write a function called `makeUnique`.
It'll take a `Set` or an `Array` of elements, and if it's given an `Array`, it'll sort that `Array` remove duplicates according to some comparison function.
After all that, it will return the original collection.

```ts
function makeUnique<T>(
  collection: Set<T> | T[],
  comparer: (x: T, y: T) => number
): Set<T> | T[] {
  // Early bail-out if we have a Set.
  // We assume the elements are already unique.
  if (collection instanceof Set) {
    return collection;
  }

  // Sort the array, then remove consecutive duplicates.
  collection.sort(comparer);
  for (let i = 0; i < collection.length; i++) {
    let j = i;
    while (
      j < collection.length &&
      comparer(collection[i], collection[j + 1]) === 0
    ) {
      j++;
    }
    collection.splice(i + 1, j - i);
  }
  return collection;
}
```

Let's leave questions about this function's implementation aside, and assume it arose from the requirements of a broader application.
Something that you might notice is that the signature doesn't capture the original type of `collection`.
We can do that by adding a type parameter called `C` in place of where we've written `Set<T> | T[]`.

```diff
- function makeUnique<T>(collection: Set<T> | T[], comparer: (x: T, y: T) => number): Set<T> | T[]
+ function makeUnique<T, C extends Set<T> | T[]>(collection: C, comparer: (x: T, y: T) => number): C
```

In TypeScript 4.2 and earlier, you'd end up with a bunch of errors as soon as you tried this.

```ts
function makeUnique<T, C extends Set<T> | T[]>(
  collection: C,
  comparer: (x: T, y: T) => number
): C {
  // Early bail-out if we have a Set.
  // We assume the elements are already unique.
  if (collection instanceof Set) {
    return collection;
  }

  // Sort the array, then remove consecutive duplicates.
  collection.sort(comparer);
  //         ~~~~
  // error: Property 'sort' does not exist on type 'C'.
  for (let i = 0; i < collection.length; i++) {
    //                             ~~~~~~
    // error: Property 'length' does not exist on type 'C'.
    let j = i;
    while (
      j < collection.length &&
      comparer(collection[i], collection[j + 1]) === 0
    ) {
      //                    ~~~~~~
      // error: Property 'length' does not exist on type 'C'.
      //                                       ~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~
      // error: Element implicitly has an 'any' type because expression of type 'number'
      //        can't be used to index type 'Set<T> | T[]'.
      j++;
    }
    collection.splice(i + 1, j - i);
    //         ~~~~~~
    // error: Property 'splice' does not exist on type 'C'.
  }
  return collection;
}
```

Ew, errors!
Why is TypeScript being so mean to us?

The issue is that when we perform our `collection instanceof Set` check, we're expecting that to act as a type guard that narrows the type from `Set<T> | T[]` to `Set<T>` and `T[]` depending on the branch we're in;
however, we're not dealing with a `Set<T> | T[]`, we're trying to narrow the generic value `collection`, whose type is `C`.

It's a very subtle distinction, but it makes a difference.
TypeScript can't just grab the constraint of `C` (which is `Set<T> | T[]`) and narrow that.
If TypeScript _did_ try to narrow from `Set<T> | T[]`, it would forget that `collection` is also a `C` in each branch because there's no easy way to preserve that information.
If hypothetically TypeScript tried that approach, it would break the above example in a different way.
At the return positions, where the function expects values with the type `C`, we would instead get a `Set<T>` and a `T[]` in each branch, which TypeScript would reject.

```ts
function makeUnique<T>(
  collection: Set<T> | T[],
  comparer: (x: T, y: T) => number
): Set<T> | T[] {
  // Early bail-out if we have a Set.
  // We assume the elements are already unique.
  if (collection instanceof Set) {
    return collection;
    //     ~~~~~~~~~~
    // error: Type 'Set<T>' is not assignable to type 'C'.
    //          'Set<T>' is assignable to the constraint of type 'C', but
    //          'C' could be instantiated with a different subtype of constraint 'Set<T> | T[]'.
  }

  // ...

  return collection;
  //     ~~~~~~~~~~
  // error: Type 'T[]' is not assignable to type 'C'.
  //          'T[]' is assignable to the constraint of type 'C', but
  //          'C' could be instantiated with a different subtype of constraint 'Set<T> | T[]'.
}
```

So how does TypeScript 4.3 change things?
Well, basically in a few key places when writing code, all the type system really cares about is the constraint of a type.
For example, when we write `collection.length`, TypeScript doesn't care about the fact that `collection` has the type `C`, it only cares about the properties available, which are determined by the constraint `T[] | Set<T>`.

In cases like this, TypeScript will grab the narrowed type of the constraint because that will give you the data you care about;
however, in any other case, we'll just try to narrow the original generic type (and often end up with the original generic type).

In other words, based on how you use a generic value, TypeScript will narrow it a little differently.
The end result is that the entire above example compiles with no type-checking errors.

For more details, you can [look at the original pull request on GitHub](https://github.com/microsoft/TypeScript/pull/43183).

## Always-Truthy Promise Checks

Under [`strictNullChecks`](/tsconfig#strictNullChecks), checking whether a `Promise` is "truthy" in a conditional will trigger an error.

```ts
async function foo(): Promise<boolean> {
  return false;
}

async function bar(): Promise<string> {
  if (foo()) {
    //  ~~~~~
    // Error!
    // This condition will always return true since
    // this 'Promise<boolean>' appears to always be defined.
    // Did you forget to use 'await'?
    return "true";
  }
  return "false";
}
```

[This change](https://github.com/microsoft/TypeScript/pull/39175) was contributed by [Jack Works](https://github.com/Jack-Works), and we extend our thanks to them!

## `static` Index Signatures

Index signatures allow us set more properties on a value than a type explicitly declares.

```ts
class Foo {
  hello = "hello";
  world = 1234;

  // This is an index signature:
  [propName: string]: string | number | undefined;
}

let instance = new Foo();

// Valid assigment
instance["whatever"] = 42;

// Has type 'string | number | undefined'.
let x = instance["something"];
```

Up until now, an index signature could only be declared on the instance side of a class.
Thanks to [a pull request](https://github.com/microsoft/TypeScript/pull/37797) from [Wenlu Wang](https://github.com/microsoft/TypeScript/pull/37797), index signatures can now be declared as `static`.

```ts
class Foo {
  static hello = "hello";
  static world = 1234;

  static [propName: string]: string | number | undefined;
}

// Valid.
Foo["whatever"] = 42;

// Has type 'string | number | undefined'
let x = Foo["something"];
```

The same sorts of rules apply for index signatures on the static side of a class as they do for the instance side - namely, that every other static property has to be compatible with the index signature.

```ts
class Foo {
  static prop = true;
  //     ~~~~
  // Error! Property 'prop' of type 'boolean'
  // is not assignable to string index type
  // 'string | number | undefined'.

  static [propName: string]: string | number | undefined;
}
```

## `.tsbuildinfo` Size Improvements

In TypeScript 4.3, `.tsbuildinfo` files that are generated as part of [`incremental`](/tsconfig#incremental) builds should be significantly smaller.
This is thanks to several optimizations in the internal format, creating tables with numeric identifiers to be used throughout the file instead of repeating full paths and similar information.
This work was spear-headed by [Tobias Koppers](https://github.com/sokra) in [their pull request](https://github.com/microsoft/TypeScript/pull/43079), serving as inspiration for [the ensuing pull request](https://github.com/microsoft/TypeScript/pull/43155) and [further optimizations](https://github.com/microsoft/TypeScript/pull/43695).

We have seen significant reductions of `.tsbuildinfo` file sizes including

- 1MB to 411 KB
- 14.9MB to 1MB
- 1345MB to 467MB

Needless to say, these sorts of savings in size translate to slightly faster build times as well.

## Lazier Calculations in `--incremental` and `--watch` Compilations

One of the issues with [`incremental`](/tsconfig#incremental) and `--watch` modes are that while they make later compilations go faster, the initial compilation can be a bit slower - in some cases, significantly slower.
This is because these modes have to perform a bunch of book-keeping, computing information about the current project, and sometimes saving that data in a `.tsbuildinfo` file for later builds.

That's why on top of `.tsbuildinfo` size improvements, TypeScript 4.3 also ships some changes to [`incremental`](/tsconfig#incremental) and `--watch` modes that make the first build of a project with these flags just as fast as an ordinary build!
To do this, much of the information that would ordinarily be computed up-front is instead done on an on-demand basis for later builds.
While this can add some overhead to a subsequent build, TypeScript's [`incremental`](/tsconfig#incremental) and `--watch` functionality will still typically operate on a much smaller set of files, and any needed information will be saved afterwards.
In a sense, [`incremental`](/tsconfig#incremental) and `--watch` builds will "warm up" and get faster at compiling files once you've updated them a few times.

In a repository with 3000 files, **this reduced initial build times to almost a third**!

[This work was started](https://github.com/microsoft/TypeScript/pull/42960) by [Tobias Koppers](https://github.com/sokra), whose work ensued in [the resulting final change](https://github.com/microsoft/TypeScript/pull/43314) for this functionality.
We'd like to extend a great thanks to Tobias for helping us find these opportunities for improvements!

## Import Statement Completions

One of the biggest pain-points users run into with import and export statements in JavaScript is the order - specifically that imports are written as

```ts
import { func } from "./module.js";
```

instead of

```ts
from "./module.js" import { func };
```

This causes some pain when writing out a full import statement from scratch because auto-complete wasn't able to work correctly.
For example, if you start writing something like `import {`, TypeScript has no idea what module you're planning on importing from, so it couldn't provide any scoped-down completions.

To alleviate this, we've leveraged the power of auto-imports!
Auto-imports already deal with the issue of not being able to narrow down completions from a specific module - their whole point is to provide every possible export and automatically insert an import statement at the top of your file.

So when you now start writing an `import` statement that doesn't have a path, we'll provide you with a list of possible imports.
When you commit a completion, we'll complete the full import statement, including the path that you were going to write.

![Import statement completions](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/05/auto-import-statement-4-3.gif)

This work requires editors that specifically support the feature.
You'll be able to try this out by using the latest [Insiders versions of Visual Studio Code](https://code.visualstudio.com/insiders/).

For more information, take a look at [the implementing pull request](https://github.com/microsoft/TypeScript/pull/43149)!

## Editor Support for `@link` Tags

TypeScript can now understand `@link` tags, and will try to resolve declarations that they link to.
What this means is that you'll be able to hover over names within `@link` tags and get quick information, or use commands like go-to-definition or find-all-references.

For example, you'll be able to go-to-definition on `bar` in `@link bar` in the example below and a TypeScript-supported editor will jump to `bar`'s function declaration.

```ts
/**
 * To be called 70 to 80 days after {@link plantCarrot}.
 */
function harvestCarrot(carrot: Carrot) {}

/**
 * Call early in spring for best results. Added in v2.1.0.
 * @param seed Make sure it's a carrot seed!
 */
function plantCarrot(seed: Seed) {
  // TODO: some gardening
}
```

![Jumping to definition and requesting quick info on a `@link` tag for ](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/05/link-tag-4-3.gif)

For more information, see [the pull request on GitHub](https://github.com/microsoft/TypeScript/pull/41877)!

## Go-to-Definition on Non-JavaScript File Paths

Many loaders allow users to include assets in their applications using JavaScript imports.
They'll typically be written as something like `import "./styles.css"` or the like.

Up until now, TypeScript's editor functionality wouldn't even attempt to read this file, so go-to-definition would typically fail.
At best, go-to-definition would jump to a declaration like `declare module "*.css"` if it could find something along those lines.

TypeScript's language service now tries to jump to the correct file when you perform a go-to-definition on relative file paths, even if they're not JavaScript or TypeScript files!
Try it out with imports to CSS, SVGs, PNGs, font files, Vue files, and more.

For more information, you can check out [the implementing pull request](https://github.com/microsoft/TypeScript/pull/42539).

## Breaking Changes

### `lib.d.ts` Changes

As with every TypeScript version, declarations for `lib.d.ts` (especially the declarations generated for web contexts), have changed.
In this release, we leveraged [Mozilla's browser-compat-data](https://github.com/mdn/browser-compat-data) to remove APIs that no browser implements.
While it is unlike that you are using them, APIs such as `Account`, `AssertionOptions`, `RTCStatsEventInit`, `MSGestureEvent`, `DeviceLightEvent`, `MSPointerEvent`, `ServiceWorkerMessageEvent`, and `WebAuthentication` have all been removed from `lib.d.ts`.
This is discussed [in some detail here](https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/991).

https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/991

### `useDefineForClassFields` now defaults to true on `esnext` and eventually on `es2022`

In 2021 the class fields feature was added into the JavaScript specification with behavior which differed from how TypeScript had implemented it. In preparation for this, in TypeScript 3.7, a flag was added ([`useDefineForClassFields`](/tsconfig#useDefineForClassFields)) to migrate to emitted JavaScript to match the JavaScript standard behavior.

Now that the feature is in JavaScript we are changing the default to `true` for ES2022 and above, including ESNext.

### Errors on Always-Truthy Promise Checks

Under [`strictNullChecks`](/tsconfig#strictNullChecks), using a `Promise` that always appears to be defined within a condition check is now considered an error.

```ts
declare var p: Promise<number>;

if (p) {
  //  ~
  // Error!
  // This condition will always return true since
  // this 'Promise<number>' appears to always be defined.
  //
  // Did you forget to use 'await'?
}
```

For more details, [see the original change](https://github.com/microsoft/TypeScript/pull/39175).

### Union Enums Cannot Be Compared to Arbitrary Numbers

Certain `enum`s are considered _union `enum`s_ when their members are either automatically filled in, or trivially written.
In those cases, an enum can recall each value that it potentially represents.

In TypeScript 4.3, if a value with a union `enum` type is compared with a numeric literal that it could never be equal to, then the type-checker will issue an error.

```ts
enum E {
  A = 0,
  B = 1,
}

function doSomething(x: E) {
  // Error! This condition will always return 'false' since the types 'E' and '-1' have no overlap.
  if (x === -1) {
    // ...
  }
}
```

As a workaround, you can re-write an annotation to include the appropriate literal type.

```ts
enum E {
  A = 0,
  B = 1,
}

// Include -1 in the type, if we're really certain that -1 can come through.
function doSomething(x: E | -1) {
  if (x === -1) {
    // ...
  }
}
```

You can also use a type-assertion on the value.

```ts
enum E {
  A = 0,
  B = 1,
}

function doSomething(x: E) {
  // Use a type asertion on 'x' because we know we're not actually just dealing with values from 'E'.
  if ((x as number) === -1) {
    // ...
  }
}
```

Alternatively, you can re-declare your enum to have a non-trivial initializer so that any number is both assignable and comparable to that enum. This may be useful if the intent is for the enum to specify a few well-known values.

```ts
enum E {
  // the leading + on 0 opts TypeScript out of inferring a union enum.
  A = +0,
  B = 1,
}
```

For more details, [see the original change](https://github.com/microsoft/TypeScript/pull/42472)
