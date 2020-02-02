import typescript from '@rollup/plugin-typescript'
import node from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

// You can have more root bundles by extending this array
export default ['index.ts'].map(name => ({
  input: `src/${name}`,
  output: {
    name,
    dir: 'dist',
    format: 'amd',
  },
  plugins: [typescript({ tsconfig: 'tsconfig.json' }), commonjs(), node(), json()],
}))
