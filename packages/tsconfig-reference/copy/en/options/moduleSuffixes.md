---
display: "moduleSuffixes"
oneline: "A way to add extra suffixes to module resolution"
---

List of file name suffixes to search when resolving a module. You can use this to control the order of resolution for files with the same name.

```json tsconfig
{
    "compilerOptions": {
        "moduleSuffixes": [".ios", ".android", ".web", ""]
    }
}
```
 
This setup would mean that TypeScript would first look up `./main.ios.ts`, `./main.native.ts` and `./main.web.ts` over `./foo.ts` when resolving `foo.js` in a module import. 

Like other module resolution options, this does not affect the transpiled output, and so you would need to be running your JavaScript in an environment which also has these types of module suffix support. 
