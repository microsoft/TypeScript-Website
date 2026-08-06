import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const source = path.resolve(root, "../typescriptlang-org/public/index.html")
const output = path.join(root, "src/generated/gatsby-home.json")
const html = fs.readFileSync(source, "utf8")
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
if (!bodyMatch) throw new Error(`Could not extract Gatsby body from ${source}`)
const mainMatch = bodyMatch[1].match(/<main[^>]*>([\s\S]*?)<\/main>/i)
if (!mainMatch) throw new Error(`Could not extract Gatsby main content from ${source}`)
const footerMatch = bodyMatch[1].match(/<footer[^>]*>([\s\S]*?)<\/footer>/i)
if (!footerMatch) throw new Error(`Could not extract Gatsby footer from ${source}`)
const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1])
const styles = styleMatches.filter(style => style.includes("#index-2") || style.includes(".container>.row") || style.includes(".version-bar")).join("\n")
const sanitized = mainMatch[1]
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/\sdata-reactroot=""/g, "")
  .replace(/\sdata-react-helmet="true"/g, "")
fs.mkdirSync(path.dirname(output), { recursive: true })
const footer = footerMatch[0].replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\sdata-reactroot=""/g, "")
fs.writeFileSync(output, JSON.stringify({ source: "Retained Gatsby production output", html: sanitized, footer, styles }, null, 2) + "\n")
console.log(`Extracted Gatsby homepage markup and styles to ${output}`)
