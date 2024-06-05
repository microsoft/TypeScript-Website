# @typescript/vfs

## 1.5.3

### Patch Changes

- [#3038](https://github.com/microsoft/TypeScript-Website/pull/3038) [`0ea84b5`](https://github.com/microsoft/TypeScript-Website/commit/0ea84b59ae291aba677fe77ca059c4112e45fb9b) Thanks [@xiaoxiyao](https://github.com/xiaoxiyao)! - Fix the exception when file content is empty

- [#3038](https://github.com/microsoft/TypeScript-Website/pull/3038) [`0ea84b5`](https://github.com/microsoft/TypeScript-Website/commit/0ea84b59ae291aba677fe77ca059c4112e45fb9b) Thanks [@xiaoxiyao](https://github.com/xiaoxiyao)! - Fix `moduleDetection` compiler option is not working

- [#3015](https://github.com/microsoft/TypeScript-Website/pull/3015) [`6168ef4`](https://github.com/microsoft/TypeScript-Website/commit/6168ef49a4d08c0b5658732d23625bbcc6049109) Thanks [@antfu](https://github.com/antfu)! - support non-hoisted `node_module` structure

- [#3072](https://github.com/microsoft/TypeScript-Website/pull/3072) [`9f8dea2`](https://github.com/microsoft/TypeScript-Website/commit/9f8dea2c19a3b6028148090f5e8cba8eea086ec3) Thanks [@KiranJKurian](https://github.com/KiranJKurian)! - Fix missing typescript peer dependency

- [#3140](https://github.com/microsoft/TypeScript-Website/pull/3140) [`26f3e56`](https://github.com/microsoft/TypeScript-Website/commit/26f3e566aa8fff235a8f6927ef2c33b28be4fe89) Thanks [@jakebailey](https://github.com/jakebailey)! - Don't depend on DOM types in createDefaultMapFromCDN

- [#3000](https://github.com/microsoft/TypeScript-Website/pull/3000) [`71776ae`](https://github.com/microsoft/TypeScript-Website/commit/71776aecc1b56289ab56d240a9272ce83686ef1a) Thanks [@antfu](https://github.com/antfu)! - Handle `.d.cts` and `.d.mts` files

## 1.5.2

### Patch Changes

- 642ea11: Move playground CDN to new, stable URL

## 1.5.1

### Patch Changes

- 46eba14: Initial bump for changesets

### 1.5

- Makes `createDefaultMapFromNodeModules` pull all the `.d.ts` files from the node_modules folder, not just the `.d.ts` files which were known ahead of time.
- Updates the known .d.s files to include ones from TypeScript 5.1 beta.

### 1.3

- Adds a JS file into the npm tarball for using with a vanilla script tag, which sets `global.tsvfs` with exported function.

Unpkg URLS:

- https://unpkg.com/browse/@typescript/vfs@dist/vfs.globals.js

### 1.2

Updates `createFSBackedSystem` to rely more on the default TypeScript system object which should see twoslash code samples re-using the node_modules from the local project.

### 0.0 - 1.0 - 1.1

Created the lib, got it working
