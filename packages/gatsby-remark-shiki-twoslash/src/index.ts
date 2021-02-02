// prettier-ignore
import { createShikiHighlighter, ShikiTwoslashSettings, renderCodeToHTML, runTwoSlash } from "shiki-twoslash"
import type { Highlighter, Lang, HighlighterOptions } from "shiki"

import visit from "unist-util-visit"
import { Node } from "unist"

import { createHash } from "crypto"
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"
import { TwoSlashOptions } from "@typescript/twoslash"

/* A rich AST node for uninst with twoslash'd data */
type RichNode = Node & {
  lang: Lang
  type: string
  children: Node[]
  value: string
  meta?: string[]
  twoslash?: import("@typescript/twoslash").TwoSlashReturn
}

/**
 * The function doing the work of transforming any codeblock samples
 * which have opted-in to the twoslash pattern.
 */
export const visitor = (highlighter: Highlighter, twoslashSettings?: ShikiTwoslashSettings) => (node: RichNode) => {
  let lang = node.lang
  let settings = twoslashSettings || {}

  const shouldDisableTwoslash = process && process.env && !!process.env.TWOSLASH_DISABLE

  // Run twoslash
  if (!shouldDisableTwoslash) runTwoSlashOnNode(settings)(node)

  // Shiki doesn't respect json5 as an input, so switch it
  // to json, which can handle comments in the syntax highlight
  const replacer = {
    json5: "json",
  }

  // @ts-ignore
  if (replacer[lang]) lang = replacer[lang]

  const results = renderCodeToHTML(node.value, lang, node.meta || [], {}, highlighter, node.twoslash)
  node.type = "html"
  node.value = results
  node.children = []
}

/**
 * Runs twoslash across an AST node, switching out the text content, and lang
 * and adding a `twoslash` property to the node.
 */
export const runTwoSlashOnNode = (settings: ShikiTwoslashSettings) => (node: RichNode) => {
  if (node.meta && node.meta.includes("twoslash")) {
    const results = cachedTwoslashCall(node.value, node.lang, settings)

    node.value = results.code
    node.lang = results.extension as Lang
    node.twoslash = results
  }
}

/** Keeps a cache of the JSON responses in node_modules/.cache/twoslash */
export const cachedTwoslashCall = (
  code: string,
  lang: string,
  settings?: ShikiTwoslashSettings,
  twoslashDefaults?: TwoSlashOptions
) => {
  const shasum = createHash("sha1")
  const codeSha = shasum.update(code).digest("hex")
  const cacheRoot = join(__dirname, "..", "..", ".cache", "twoslash")
  const cachePath = join(cacheRoot, `${codeSha}.json`)

  if (existsSync(cachePath)) {
    return JSON.parse(readFileSync(cachePath, "utf8"))
  } else {
    const results = runTwoSlash(code, lang, settings, twoslashDefaults)
    if (!existsSync(cacheRoot)) mkdirSync(cacheRoot, { recursive: true })
    writeFileSync(cachePath, JSON.stringify(results), "utf8")
    return results
  }
}

/**
 * The main interface for the remark shiki API, sets up the
 * highlighter then runs a visitor across all code tags in
 * the markdown running twoslash, then shiki.
 * */
const remarkShiki = async function (
  { markdownAST }: any,
  shikiSettings: HighlighterOptions,
  settings: ShikiTwoslashSettings
) {
  const highlighter = await createShikiHighlighter(shikiSettings)
  visit(markdownAST, "code", visitor(highlighter, settings))
}

/** Sends the twoslash visitor over the existing MD AST and replaces the code samples inline, does not do highlighting  */
export const runTwoSlashAcrossDocument = ({ markdownAST }: any, settings?: ShikiTwoslashSettings) =>
  visit(markdownAST, "code", runTwoSlashOnNode(settings || {}))

export default remarkShiki
