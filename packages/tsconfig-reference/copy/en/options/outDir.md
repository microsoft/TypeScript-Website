---
display: "Out Dir"
oneline: "Specify an output folder for all emitted files."
---

If specified, `.js` (as well as `.d.ts`, `.js.map`, etc.) files will be emitted into this directory.
The directory structure of the original source files is preserved; see [`rootDir`](#rootDir) if the computed root is not what you intended.

If not specified, `.js` files will be emitted in the same directory as the `.ts` files they were generated from:

```sh
$ tsc

example
├── index.js
└── index.ts
```

With a `tsconfig.json` like this:

```json tsconfig
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

Running `tsc` with these settings moves the files into the specified `dist` folder:

```sh
$ tsc

example
├── dist
│   └── index.js
├── index.ts
└── tsconfig.json
```
