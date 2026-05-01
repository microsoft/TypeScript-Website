---
display: "Root Dir"
oneline: "Specify the root folder within your source files."
---

**Default**: The directory containing the `tsconfig.json` file. If compiling files from the command line without a `tsconfig.json`, the default is the longest common path of all non-declaration input files.

When TypeScript compiles files, it keeps the same directory structure in the output directory as exists in the input directory.

For example, let's say you have some input files:

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
├── types.d.ts
```

If your [`outDir`](#outDir) was `dist`, TypeScript would write this tree:

```
MyProj
├── dist
│   ├── core
│   │   ├── a.js
│   │   ├── b.js
│   │   ├── sub
│   │   │   ├── c.js
```

If you want `core` to be treated as the root of your source tree, set `rootDir: "core"` in `tsconfig.json`.
TypeScript would then write this tree:

```
MyProj
├── dist
│   ├── a.js
│   ├── b.js
│   ├── sub
│   │   ├── c.js
```

Importantly, `rootDir` **does not affect which files become part of the compilation**.
It has no interaction with the [`include`](#include), [`exclude`](#exclude), or [`files`](#files) `tsconfig.json` settings.

Note that TypeScript will never write an output file to a directory outside of [`outDir`](#outDir), and will never skip emitting a file.
For this reason, `rootDir` also enforces that all files which need to be emitted are underneath the `rootDir` path.

For example, let's say you had this tree:

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
├── helpers.ts
```

It would be an error to specify `rootDir` as `core` _and_ [`include`](#include) as `*` because it creates a file (`helpers.ts`) that would need to be emitted _outside_ the [`outDir`](#outDir) (i.e. `../helpers.js`).
