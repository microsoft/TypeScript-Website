// @ts-enable
/**
 * Loops through the tsconfig markdown docs and generates a .ts files
 * with the one-liners so they can show up in the rendered output for tsconfig JSONs

   yarn workspace shiki-twoslash bootstrap
 */

const { readdirSync, writeFileSync } = require("fs")
const { join } = require("path")
const { read } = require("gray-matter")
const { format } = require("prettier")

const englishRoot = join(__dirname, "..", "..", "tsconfig-reference", "copy", "en", "options")
const options = readdirSync(englishRoot).filter(p => !p.startsWith(".") && p.endsWith(".md"))

const lines = []
options.forEach(optFilename => {
  const optPath = join(englishRoot, optFilename)
  const md = read(optPath)
  const name = optFilename.replace(".md", "")
  lines.push(`${name}: \`${md.data.oneline.replace(/`/g, "\\`")}\`,`)
})

const fixturePath = join(__dirname, "..", "src", "tsconfig-oneliners.generated.ts")

const content = `export const tsconfig = {
  ${lines.join("\n  ")}
}
`
writeFileSync(fixturePath, format(content, { filepath: fixturePath }))
