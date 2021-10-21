## Twoslash Annotations

The more arcane, but very ergonomic way to set a compiler setting is via [twoslash](https://www.typescriptlang.org/dev/twoslash/) commands which are comments which start with `// @`.

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
