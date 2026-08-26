import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const packages = path.resolve(root, "..")

const requiredArtifacts = [
  path.join(packages, "documentation", "output", "navigation.json"),
  path.join(packages, "documentation", "output", "attribution.json"),
  path.join(packages, "glossary", "output", "en.md"),
  path.join(packages, "playground-examples", "generated", "en.json"),
  path.join(packages, "playground-handbook", "output"),
  path.join(packages, "tsconfig-reference", "output", "en.md"),
  path.join(packages, "typescript-vfs", "dist"),
  path.join(packages, "ts-twoslasher", "dist"),
  path.join(packages, "sandbox", "dist"),
  path.join(root, ".generated-public"),
  path.join(root, ".generated", "documentation-html", "manifest.json"),
]

const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, stdio: "inherit" })
const runPnpm = args => {
  if (process.platform === "win32") run(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", `pnpm ${args.join(" ")}`])
  else run("pnpm", args)
}

const latestMarkdownChange = directory => {
  let latest = 0
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) latest = Math.max(latest, latestMarkdownChange(target))
    else if (entry.name.endsWith(".md")) latest = Math.max(latest, fs.statSync(target).mtimeMs)
  }
  return latest
}

const missing = requiredArtifacts.filter(artifact => !fs.existsSync(artifact))
if (missing.length) {
  console.log(`Preparing development assets (${missing.length} required artifact(s) missing)...`)
  runPnpm(["dev:prepare"])
} else {
  const documentationRoot = path.join(packages, "documentation", "copy")
  const documentationManifest = path.join(root, ".generated", "documentation-html", "manifest.json")
  if (latestMarkdownChange(documentationRoot) > fs.statSync(documentationManifest).mtimeMs) {
    console.log("Documentation changed while the dev server was stopped; refreshing it...")
    runPnpm(["--dir", "../documentation", "bootstrap"])
    run(process.execPath, [path.join(root, "scripts", "compile-documentation.mjs")])
  } else {
    console.log("Development assets are current; skipping full preparation.")
  }
}
