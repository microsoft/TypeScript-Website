---
display: "Source Root"
oneline: "Specify the root path for debuggers to find the reference source code."
---

Specify the location where a debugger should locate TypeScript files instead of relative source locations.
This string is treated verbatim inside the source-map where you can use a path or a URL:

```json tsconfig
{
  "compilerOptions": {
    "sourceMap": true,
    "sourceRoot": "https://my-website.com/debug/source/"
  }
}
```

Would declare that `index.js` will have a source file at `https://my-website.com/debug/source/index.ts`.
