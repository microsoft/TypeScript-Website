---
display: "Root Dirs"
oneline: "Allow multiple folders to be treated as one when resolving modules."
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

`rootDirs` can be used to provide a separate "type layer" to files that are not TypeScript or JavaScript by providing a home for generated `.d.ts` files in another folder. This technique is useful for bundled applications where you use `import` of files that aren't necessarily code:

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

This technique lets you generate types ahead of time for the non-code source files. Imports then work naturally based off the source file's location.
For example `./src/index.ts` can import the file `./src/css/main.css` and TypeScript will be aware of the bundler's behavior for that filetype via the corresponding generated declaration file.

```ts twoslash
// @filename: main.css.d.ts
export const appClass = "mainClassF3EC2";
// ---cut---
// @filename: index.ts
import { appClass } from "./main.css";
```
