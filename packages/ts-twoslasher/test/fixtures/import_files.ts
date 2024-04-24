// @filename: file-with-export.ts
export const helloWorld = "Example string";

// @filename: index.ts
import {helloWorld} from "./file-with-export"
console.log(helloWorld)
