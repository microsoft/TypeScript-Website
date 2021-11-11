## Twoslash Annotations

[Twoslash](https://www.npmjs.com/package/@typescript/twoslash) is an annotation format for TypeScript which uses specially crafted comments (two slashes `//`) as a markup format for writing code samples (available on npm at [`@typescript/twoslash`](https://www.npmjs.com/package/@typescript/twoslash)). It powers all the code samples in the TypeScript website, you can learn more about it [here](https://shikijs.github.io/twoslash/).

#### Twoslash Queries

The Playground supports showing the types at a certain location by using an empty comment with a `^?` to indicate the symbol you're interested in:

```ts
const abc = "Hello"
//    ^?
```

Would add a realtime inline annotation about what the type of `abc` is into the editor. This can make typing complex types easier, and make it much more obvious when sharing code what you think is important.

#### Twoslash Compiler Flags

A more arcane, but very ergonomic way to set a compiler setting is via compiler flag which are comments starting with `// @`.

The editor will auto-complete twoslash commands for any compiler setting for the current version of TypeScript in your Playground. If the setting is a boolean, you don't need to set a value:

```ts
// @isolatedModules
```

Would have `isolatedModules` turned on in your Playground. You can set the values via `true/false`:

```ts
// @strictPropertyInitialization: false
```

For more settings with more choices of values, you can use the same descriptive string that is available in a `tsconfig.json`:

```ts
// @target: esnext
// @module: nodenext
```

You can write a list with a comma separated string:

```ts
// @lib: es2015,dom
```

Writing a twoslash command will set the compiler flag as you type, and will be set instantly if you reload or share the URL with another person. This can act as a power-user tool for setting compiler flags _and_ making that change much more explicit than a query param (which may require looking up in the TS Config dropdown.)

<details>
<summary>Did you know?</summary>

The twoslash system replicates how the TypeScript Compiler is tested, which is ~60k integration tests which uses specially crafted comments to set up isolated compiler runs. It's quite a cool system, you can learn about them in more depth over at [`orta/typescript-notes`](https://github.com/orta/typescript-notes/tree/master/systems/testing).

</details>
