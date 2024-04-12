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
