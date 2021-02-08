---
display: "Map Root"
oneline: "Specify the location where debugger should locate map files instead of generated locations."
---

Specify the location where debugger should locate map files instead of generated locations.
This string is treated verbatim inside the source-map, for example:

```json tsconfig
{
  "compilerOptions": {
    "sourceMap": true,
    "mapRoot": "https://my-website.com/debug/sourcemaps/"
  }
}
```

Would declare that `index.js` will have sourcemaps at `https://my-website.com/debug/sourcemaps/index.js.map`.
