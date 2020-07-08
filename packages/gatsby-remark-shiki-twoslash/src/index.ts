import { TLang } from "shiki-languages"
import { ShikiTwoslashSettings, runTwoSlash, renderCodeToHTML, canHighlightLang } from "render-shiki-twoslash"

import visit from "unist-util-visit"
import { Node } from "unist"
import { setupHighLighter } from "../../render-shiki-twoslash/dist"

type RichNode = Node & {
  lang: TLang
  type: string
  children: Node[]
  value: string
  meta?: string[]
}

/**
 * The function doing the work of transforming any codeblock samples
 * which have opted-in to the twoslash pattern.
 */
const visitor = (twoslashSettings?: ShikiTwoslashSettings) => (node: RichNode) => {
  let lang = node.lang

  // Allow skipping twoslash runs
  const shouldDisableTwoslash = process && process.env && !!process.env.TWOSLASH_DISABLE
  const canRunTwoslash = node.meta && node.meta.includes("twoslash")
  const code = node.value
  const twoslash = !shouldDisableTwoslash && canRunTwoslash ? runTwoSlash(code, lang, twoslashSettings) : undefined

  if (canHighlightLang(lang)) {
    node.type = "html"
    node.value = renderCodeToHTML(code, lang, twoslash)
    node.children = []
    node.twoslash = twoslash
  }
}

/**
 * The main interface for the remark shiki API, sets up the
 * highlighter then runs a visitor across all code tags in
 * the markdown running twoslash, then shiki.
 * */
const remarkShiki = async function (
  { markdownAST }: any,
  shikiSettings: import("shiki/dist/highlighter").HighlighterOptions,
  settings: ShikiTwoslashSettings
) {
  await setupHighLighter(shikiSettings)

  visit(markdownAST, "code", visitor(settings))
}

export default remarkShiki
