import { build } from "esbuild"
import { spawnSync } from "node:child_process"
import { mkdir, rm } from "node:fs/promises"
import { resolve } from "node:path"

const packageDirectory = resolve(import.meta.dirname, "..")
const testFiles = ["ata.test.mjs", "native-compiler.test.mjs", "lsp-filesystem.test.mjs"].map(name =>
  resolve(packageDirectory, "dist", name)
)
await mkdir(resolve(packageDirectory, "dist"), { recursive: true })
try {
  await build({
    absWorkingDir: packageDirectory,
    bundle: true,
    conditions: ["browser"],
    entryPoints: ["src/ata/ata.test.ts", "src/native-compiler.test.ts", "src/lsp-filesystem.test.ts"],
    entryNames: "[name]",
    outExtension: { ".js": ".mjs" },
    external: ["jsonc-parser"],
    format: "esm",
    outdir: resolve(packageDirectory, "dist"),
    platform: "node",
    target: ["es2022"],
  })
  const result = spawnSync(process.execPath, ["--test", ...testFiles], {
    env: { ...process.env, PLAYGROUND_DIR: packageDirectory },
    stdio: "inherit",
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exitCode = result.status ?? 1
} finally {
  await Promise.all(testFiles.map(file => rm(file, { force: true })))
}
