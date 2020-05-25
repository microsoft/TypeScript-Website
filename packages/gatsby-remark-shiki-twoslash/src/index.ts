import { TLang } from "shiki-languages"
import { twoslasher } from "@typescript/twoslash"

import visit from "unist-util-visit"
import { Node } from "unist"

import { renderToHTML } from "./renderer"
import { highlighter, languages, getHighlighterObj } from './highlighter';

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
const visitor = (node: RichNode) => {
  let lang = node.lang

  runTwoSlashOnNode(node)

  // Shiki doesn't respect json5 as an input, so switch it
  // to json, which can handle comments in the syntax highlight
  const replacer = {
    json5: "json",
  }

  // @ts-ignore
  if (replacer[lang]) lang = replacer[lang]

  const shouldDisableTwoslash = process && process.env && !!process.env.TWOSLASH_DISABLE

  // Check we can highlight and render
  const shouldHighlight = lang && languages.includes(lang)

  if (shouldHighlight && !shouldDisableTwoslash) {
    const tokens = highlighter.codeToThemedTokens(node.value, lang)
    const results = renderToHTML(tokens, { langId: lang }, node.twoslash)
    node.type = "html"
    node.value = results
    node.children = []
  }
}

/** The plugin API */
const remarkShiki = async function ({ markdownAST }: any, settings: any) {
  await getHighlighterObj(settings)
  visit(markdownAST, "code", visitor)
}

export const runTwoSlashOnNode = (node: RichNode) => {
  // Run twoslash and replace the main contents if
  // the ``` has 'twoslash' after it
  if (node.meta && node.meta.includes("twoslash")) {
    // Look into owning grabbing @types
    // const fsMap = createDefaultMapFromNodeModules({})
    // const results = twoslasher(node.value, node.lang, undefined, undefined, undefined, fsMap)

    const results = twoslasher(node.value, node.lang)
    node.value = results.code
    node.lang = results.extension as TLang
    node.twoslash = results
  }
}

/** Does a twoslash  */
export const runTwoSlashAcrossDocument = ({ markdownAST }: any) => visit(markdownAST, "code", runTwoSlashOnNode)

export default remarkShiki
