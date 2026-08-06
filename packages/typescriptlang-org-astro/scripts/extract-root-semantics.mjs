import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const targetRoot = path.resolve(here, "..")
const sourcePublic = path.resolve(targetRoot, "../typescriptlang-org/public")
const locales = ["en", "es", "fr", "id", "ja", "ko", "pl", "pt", "vo", "zh"]
const templates = ["", "cheatsheets", "community", "download", "empty", "tools", "why-create-typescript", "docs", "docs/handbook", "dt/search"]
const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"])
const ignoredTags = new Set(["script", "style", "noscript", "svg"])

const decode = value => value
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&nbsp;/g, " ")
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&amp;/g, "&")

const parseAttributes = tag => {
  const attributes = {}
  for (const match of tag.matchAll(/([A-Za-z_:][-A-Za-z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    attributes[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? "")
  }
  return attributes
}

const extractMain = html => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html

const semanticTokens = html => {
  const tokens = []
  const stack = []
  let ignoredDepth = 0
  let heading = null
  for (const part of extractMain(html).match(/<[^>]+>|[^<]+/g) || []) {
    if (!part.startsWith("<")) {
      if (ignoredDepth) continue
      const text = decode(part)
      const pre = [...stack].reverse().find(entry => entry.preToken)
      if (pre) pre.preText += ` ${text} `
      else if (heading) heading.text += text
      else if (text) tokens.push({ type: "text", text })
      continue
    }
    if (/^<!--/.test(part)) continue
    const closing = /^<\//.test(part)
    const name = part.match(/^<\/?\s*([\w:-]+)/)?.[1]?.toLowerCase()
    if (!name) continue
    if (closing) {
      const opened = stack.pop()
      if (ignoredTags.has(name)) ignoredDepth = Math.max(0, ignoredDepth - 1)
      if (/^h[1-6]$/.test(name) && heading) {
        tokens.push({ type: "heading", level: Number(name[1]), text: heading.text })
        heading = null
      }
      if (name === "pre" && opened?.preToken) opened.preToken.text = opened.preText
      continue
    }
    const attributes = parseAttributes(part)
    if (ignoredTags.has(name)) ignoredDepth += 1
    if (ignoredDepth) {
      if (!voidTags.has(name) && !/\/>$/.test(part)) stack.push({ name })
      continue
    }
    if (/^h[1-6]$/.test(name)) heading = { text: "" }
    else if (name === "a" && attributes.href) tokens.push({ type: "link", href: attributes.href })
    else if (name === "img" && attributes.src) tokens.push({ type: "image", src: attributes.src, alt: attributes.alt || "" })
    else if (name === "pre") {
      const preToken = { type: "code", twoslash: /(?:^|\s)twoslash(?:\s|$)/.test(attributes.class || ""), text: "" }
      tokens.push(preToken)
      stack.push({ name, preToken, preText: "" })
      continue
    }
    if (!voidTags.has(name) && !/\/>$/.test(part)) stack.push({ name })
  }

  return tokens
}

const routePath = (locale, template) => `${locale === "en" ? "" : `/${locale}`}${template ? `/${template}` : "/"}`.replace(/\/+/g, "/")
const htmlPath = route => route === "/"
  ? path.join(sourcePublic, "index.html")
  : path.join(sourcePublic, route.replace(/^\//, ""), "index.html")
const content = {}
const copiedAssets = new Set()

for (const locale of locales) {
  for (const template of templates) {
    const route = routePath(locale, template)
    const file = htmlPath(route)
    if (!fs.existsSync(file)) throw new Error(`Missing Gatsby root baseline: ${file}`)
    const tokens = semanticTokens(fs.readFileSync(file, "utf8"))
    content[route] = { locale, template: template || "home", tokens }
    for (const token of tokens) {
      if (token.type !== "image" || !token.src.startsWith("/")) continue
      const relative = decodeURIComponent(token.src.replace(/^\//, "").split(/[?#]/)[0])
      const source = path.join(sourcePublic, relative)
      const destination = path.join(targetRoot, "public", relative)
      if (!fs.existsSync(source)) throw new Error(`Missing root image asset: ${token.src}`)
      fs.mkdirSync(path.dirname(destination), { recursive: true })
      fs.copyFileSync(source, destination)
      copiedAssets.add(relative)
    }
  }
}

const output = path.join(targetRoot, "src", "data", "root-semantics.json")
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, `${JSON.stringify({ generatedFrom: "Gatsby production root-page semantic regions", routeCount: Object.keys(content).length, content }, null, 2)}\n`)
console.log(`Extracted ${Object.keys(content).length} root routes and ${copiedAssets.size} referenced assets to target-owned data.`)
