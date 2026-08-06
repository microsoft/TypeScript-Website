import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceRoot = path.resolve(root, "../typescriptlang-org/public")
const output = path.join(root, "src/generated/gatsby-p23-pages.json")
const pages = {
  docs: "docs/index.html",
  downloadJa: "ja/download/index.html",
  developerPlugins: "dev/playground-plugins/index.html",
}

const extracted = {}
for (const [name, relative] of Object.entries(pages)) {
  const source = path.join(sourceRoot, relative)
  const document = fs.readFileSync(source, "utf8")
  const body = document.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (!body) throw new Error(`Could not extract body from ${source}`)
  const main = document.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  if (!main) throw new Error(`Could not extract main from ${source}`)
  const header = document.match(/<header[^>]*>[\s\S]*?<\/header>/i)
  if (!header) throw new Error(`Could not extract header from ${source}`)
  const footer = document.match(/<footer[^>]*>[\s\S]*?<\/footer>/i)
  if (!footer) throw new Error(`Could not extract footer from ${source}`)
  const styles = [...document.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1]).join("\n")
  extracted[name] = {
    body: body[1].replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\sdata-reactroot=""/g, ""),
    html: main[1].replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\sdata-reactroot=""/g, ""),
    header: header[0].replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\sdata-reactroot=""/g, ""),
    footer: footer[0].replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\sdata-reactroot=""/g, ""),
    styles,
  }
}
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, `${JSON.stringify({ source: "Frozen retained Gatsby production output", pages: extracted }, null, 2)}\n`)
console.log(`Extracted ${Object.keys(pages).length} P23 pages to ${output}`)
