import type { Highlighter } from "shiki/dist/highlighter"
import type { TLang } from "shiki-languages"
// prettier-ignore
import { createShikiHighlighter, ShikiTwoslashSettings, renderCodeToHTML, runTwoSlash } from "shiki-twoslash"

import visit from "unist-util-visit"
import { Node } from "unist"

/* A rich AST node for uninst with twoslash'd data */
type RichNode = Node & {
  lang: TLang
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
    const results = runTwoSlash(node.value, node.lang, settings)
    node.value = results.code
    node.lang = results.extension as TLang
    node.twoslash = results
  }
}

function remarkTwoslash(shikiSettings: ShikiTwoslashSettings & import("shiki/dist/highlighter").HighlighterOptions) {
  // @ts-ignore
  const transform = async (markdownAST: any) => {
    const highlighter = await createShikiHighlighter(shikiSettings)
    visit(markdownAST, "code", visitor(highlighter, shikiSettings))
  }

  return transform
}

export default remarkTwoslash
