_This is still a bit of a work in progress_ and only available inside the Bug workbench, however, it's likely this will make its way to the main Playground soon.

### Multi-File Playground

The playground supports splitting the editor's text into multiple files via the same syntax as [Twoslash](https://shikijs.github.io/twoslash/playground) which is: `// @filename: newFile.ts`:

```ts
// implicit first file (input.ts/tsx/js/jsx)

// @filename: file2.ts
// Comment in a second file

// @filename: file3.ts
// Comment in a third file
```

Comprises of three separate files in the same folder. You can import between these files using `import`/`export` by default, or changing the compiler flags to the appropriate:

```ts
export type Task = "Do something"

// @filename: file2.ts
import { Task } from "./input.js"
```
