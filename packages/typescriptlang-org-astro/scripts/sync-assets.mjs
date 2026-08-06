import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const output = path.join(root, ".generated-public")
const ownedStatic = path.join(root, "public")
const packages = path.resolve(root, "..")

const copy = (source, destination) => {
	if (!fs.existsSync(source)) return
	fs.mkdirSync(path.dirname(destination), { recursive: true })
	fs.cpSync(source, destination, { recursive: true })
}

fs.rmSync(output, { recursive: true, force: true })
fs.mkdirSync(output, { recursive: true })
copy(ownedStatic, output)
copy(path.join(packages, "typescriptlang-org", "static", "images", "index"), path.join(output, "images", "index"))
copy(path.join(packages, "documentation", "copy"), path.join(output, "documentation-assets"))
copy(path.join(packages, "documentation", "copy", "en", "modules-reference", "diagrams"), path.join(output, "docs", "handbook", "modules", "diagrams"))
copy(path.join(packages, "documentation", "copy", "en", "declaration-files", "templates", "global-modifying-module.d.ts.md"), path.join(output, "docs", "handbook", "declaration-files", "templates", "global-modifying-module.d.ts.md"))
copy(path.join(ownedStatic, "images", "docs"), path.join(output, "images", "docs"))
copy(path.join(ownedStatic, "images", "tutorials", "aspnet"), path.join(output, "images", "tutorials", "aspnet"))
copy(path.join(packages, "playground-examples", "copy"), path.join(output, "js", "examples"))
copy(path.join(packages, "playground-examples", "generated"), path.join(output, "js", "examples"))
copy(path.join(packages, "playground-examples", "generated"), path.join(output, "js", "example-index"))
copy(path.join(packages, "playground-handbook", "output"), path.join(output, "playground-handbook"))

const compile = (packageName, binary, args) => execFileSync(process.execPath, [path.join(packages, packageName, "node_modules", binary), ...args], { cwd: path.join(packages, packageName), stdio: "inherit" })
compile("sandbox", "typescript/bin/tsc", ["-p", "tsconfig.json", "--outDir", path.join(output, "js", "sandbox")])
compile("playground", "typescript/bin/tsc", ["-p", "tsconfig.json", "--outDir", path.join(output, "js", "playground")])
compile("playground-worker", "esbuild/bin/esbuild", ["index.ts", `--outdir=${path.join(output, "js", "playground-worker")}`, "--format=esm", "--target=es2020", "--bundle"])
const licensePath = path.join(packages, "typescript6", "LICENSE.txt")
if (fs.existsSync(licensePath)) {
	const escaped = fs.readFileSync(licensePath, "utf8").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
	fs.writeFileSync(path.join(output, "License.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>TypeScript License</title></head><body><main><h1>TypeScript License</h1><pre>${escaped}</pre></main></body></html>`)
}
console.log(`Synchronized target-owned and framework-independent assets into ${output}`)
