// prettier-ignore
import { createShikiHighlighter, UserConfigSettings, renderCodeToHTML, runTwoSlash } from "shiki-twoslash"
import type { Lang, Highlighter } from "shiki"

import visit from "unist-util-visit"
import { Node } from "unist"
import { addIncludes, replaceIncludesInCode } from "./includes"

// A set of includes which can be pulled via a set ID
const includes = new Map<string, string>()

/* A rich AST node for uninst with twoslash'd data */
type RichNode = Node & {
  lang: Lang
  type: string
  children: Node[]
  value: string
  meta?: string[] | string
  twoslash?: import("@typescript/twoslash").TwoSlashReturn
}

/**
 * The function doing the work of transforming any codeblock samples
 * which have opted-in to the twoslash pattern.
 */
export const visitor = (highlighter: Highlighter, twoslashSettings: UserConfigSettings = {}) => (node: RichNode) => {
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

  let results
  if ((lang as string) === "twoslash") {
    if (!node.meta) throw new Error("A twoslash code block needs a pragma like 'twoslash include [name]'")
    const metaInfo = typeof node.meta === "string" ? node.meta : node.meta.join(" ")
    addIncludes(includes, node.value, metaInfo || "")
    results = ""
  } else {
    results = renderCodeToHTML(node.value, lang, node.meta as any, {}, highlighter, node.twoslash)
  }
  node.type = "html"
  node.value = results
  node.children = []
}

/**
 * Runs twoslash across an AST node, switching out the text content, and lang
 * and adding a `twoslash` property to the node.
 */
export const runTwoSlashOnNode = (settings: UserConfigSettings = {}) => (node: RichNode) => {
  if (node.meta && node.meta.includes("twoslash")) {
    const code = replaceIncludesInCode(includes, node.value)
    const results = runTwoSlash(code, node.lang, settings)
    node.value = results.code
    node.lang = results.extension as Lang
    node.twoslash = results
  }
}

function remarkTwoslash(shikiSettings: UserConfigSettings = {}) {
  // @ts-ignore
  let settings = shikiSettings || { theme: "light-plus" }

  // Default to assuming you want vfs node_modules set up
  // but don't assume you're on node though
  if (!settings["vfsRoot"]) {
    try {
      // dist > remark-shiki-twoslash > node_modules
      settings.vfsRoot = require("path").join(__dirname, "..", "..", "..")
    } catch (error) {}
  }

  const transform = async (markdownAST: any) => {
    const highlighter = await createShikiHighlighter(settings)
    includes.clear()
    visit(markdownAST, "code", visitor(highlighter, settings))
  }

  return transform
}

export default remarkTwoslash
