import typescript from '@rollup/plugin-typescript'
import node from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

// You can have more root bundles by extending this array
const rootFiles = ['index.ts']

export default rootFiles.map(name => {
  /** @type { import("rollup").RollupOptions } */
  const options = {
    input: `src/${name}`,
    external: ['typescript'],
    output: {
      name,
      dir: 'dist',
      format: 'amd',
    },
    plugins: [typescript({ tsconfig: 'tsconfig.json' }), commonjs(), node(), json()],
  }

  return options
})

/** Note:
 * if you end up wanting to import a dependency which relies on typescript, you will need
 * settings which adds these extra options. It will re-use the window.ts for the typescript
 * dependency, and I've not figured a way to remove fs and path.
 *
    const options = {
      external: ['typescript', 'fs', 'path'],
      output: {
        paths: {
          "typescript":"typescript-sandbox/index",
          "fs":"typescript-sandbox/index",
          "path":"typescript-sandbox/index",
        },
      },
      plugins: [typescript({ tsconfig: "tsconfig.json" }), externalGlobals({ typescript: "window.ts" }), commonjs(), node(), json()]
    };
 *
 */
