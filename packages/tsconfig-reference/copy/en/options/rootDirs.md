---
display: "Root Dirs"
oneline: "Treat multiple folders as one when resolving modules."
---

Using `rootDirs`, you can inform the compiler that there are many "virtual" directories acting as a single root.
This allows the compiler to resolve relative module imports within these "virtual" directories, as if they were merged in to one directory.

For example:

```
 src
 └── views
     └── view1.ts (can import "./template1", "./view2`)
     └── view2.ts (can import "./template1", "./view1`)

 generated
 └── templates
         └── views
             └── template1.ts (can import "./view1", "./view2")
```

```json tsconfig
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/templates/views"]
  }
}
```

This does not affect how TypeScript emits JavaScript, it only emulates the assumption that they will be able to
work via those relative paths at runtime.

`rootDirs` can be used to provide a separate "type layer" to a set of files via `.d.ts` file in another folder, this is a technique useful for bundled applications where you use `import` with files that aren't necessarily code:

```sh
 src
 └── index.ts
 └── css
     └── main.css
     └── navigation.css

 generated
 └── css
     └── main.css.d.ts
     └── navigation.css.d.ts
```

```json tsconfig
{
  "compilerOptions": {
    "rootDirs": ["src", "generated"]
  }
}
```

Letting you generate types ahead of time for the source files, exclude the resulting types folder and imports work naturally based off the source location.
For example the `./src/index.ts` could import the file `./src/css/main.css` and TypeScript can made be aware of the bundler's behavior for that filetype.

```ts twoslash
// @filename: main.css.d.ts
export const appClass = "mainClassF3EC2";
// ---cut---
// @filename: index.ts
import { appClass } from "./main.css";
```
