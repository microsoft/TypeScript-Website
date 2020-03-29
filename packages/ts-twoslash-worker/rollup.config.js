import typescript from "@rollup/plugin-typescript";
import node from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

// You can have more root bundles by extending this array
const rootFiles = ["index.ts"];

export default rootFiles.map(name => {
  /** @type { import("rollup").RollupOptions } */
  const options = {
    input: name,
    output: {
      name: "twoslash.worker.js",
      dir: "dist",
      format: "iife",
      paths: {
        tty: "vs/language/typescript/tsWorker",
        os: "vs/language/typescript/tsWorker"
      },
      globals: {
        tty: "{}",
        os: "{}"
      }
    },
    external: ["os", "tty"],
    plugins: [
      typescript({ tsconfig: "tsconfig.json", exclude: ["**/dist/**"] }),
      commonjs(),
      node({ rootDir: "../../", mainFields: ["main"] }),
      json()
    ]
  };

  return options;
});
