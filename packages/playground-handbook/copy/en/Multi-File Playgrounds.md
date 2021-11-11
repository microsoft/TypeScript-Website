### Multi-File Playground

The playground supports splitting the editor's text into multiple files via the same syntax as [Twoslash](https://shikijs.github.io/twoslash/playground) which is: `// @filename: newFile.ts`:

```ts
// implicit first file (input.ts/tsx/js/jsx)
const a = 1
// @filename: file2.ts
// Comment in a second file
const a = 12
// @filename: file3.ts
// Comment in a third file
const a = 123
```

Comprises of three separate files in the same folder. In each file `a` is assigned to a different value. You can import between these files using `import`/`export` by default, or changing the compiler flags to the appropriate module type for however you want to import:

```ts
export type Task = "Do something"

// @filename: file2.ts
import { Task } from "./input.js"
```
