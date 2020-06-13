import { loadTheme, getHighlighter, getTheme } from "shiki"
import { Highlighter } from "shiki/dist/highlighter"
import { commonLangIds, commonLangAliases, otherLangIds, TLang } from "shiki-languages"
import { twoslasher } from "@typescript/twoslash"
import { createDefaultMapFromNodeModules, addAllFilesFromFolder } from "@typescript/vfs"

import visit from "unist-util-visit"
import { Node } from "unist"

import { renderToHTML } from "./renderer"

const languages = [...commonLangIds, ...commonLangAliases, ...otherLangIds]

/**
 * This gets filled in by the promise below, then should
 * hopefully be more or less synchronous access by each parse
 * of the highlighter
 */
let highlighter: Highlighter = null as any

const getHighlighterObj = (options: import("shiki/dist/highlighter").HighlighterOptions) => {
  if (highlighter) return highlighter

  var settings = options || {}
  var theme: any = settings.theme || "nord"
  var shikiTheme

  try {
    shikiTheme = getTheme(theme)
  } catch (error) {
    try {
      shikiTheme = loadTheme(theme)
    } catch (error) {
      throw new Error("Unable to load theme: " + theme + " - " + error.message)
    }
  }

  return getHighlighter({ theme: shikiTheme, langs: languages }).then(newHighlighter => {
    highlighter = newHighlighter
    return highlighter
  })
}

type RichNode = Node & {
  lang: TLang
  type: string
  children: Node[]
  value: string
  meta?: string[]
  twoslash?: import("@typescript/twoslash").TwoSlashReturn
}

type ShikiTwoslashSettings = {
  useNodeModules?: true
  nodeModulesTypesPath?: string
}

const defaultSettings: ShikiTwoslashSettings = {}

/**
 * The function doing the work of transforming any codeblock samples
 * which have opted-in to the twoslash pattern.
 */
const visitor = (twoslashSettings?: ShikiTwoslashSettings) => (node: RichNode) => {
  let lang = node.lang
  let settings = twoslashSettings || defaultSettings

  // Run twoslash
  runTwoSlashOnNode(settings)(node)

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
  await getHighlighterObj(shikiSettings)
  visit(markdownAST, "code", visitor(settings))
}

/////////////////// Mainly for internal use, but tests could use this, not considered public API, so could change

/** @internal */
export const runTwoSlashOnNode = (settings: ShikiTwoslashSettings) => (node: RichNode) => {
  // Run twoslash and replace the main contents if
  // the ``` has 'twoslash' after it
  if (node.meta && node.meta.includes("twoslash")) {
    let map: Map<string, string> | undefined = undefined

    if (settings.useNodeModules) {
      const laterESVersion = 6 // we don't want a hard dep on TS, so that browsers can run this code)
      map = createDefaultMapFromNodeModules({ target: laterESVersion })
      // Add @types to the fsmap
      addAllFilesFromFolder(map, settings.nodeModulesTypesPath || "node_modules/@types")
    }

    const results = twoslasher(node.value, node.lang, undefined, undefined, undefined, map)
    node.value = results.code
    node.lang = results.extension as TLang
    node.twoslash = results
  }
}

/** Sends the twoslash visitor over the existing MD AST and replaces the code samples inline, does not do highlighting  */
export const runTwoSlashAcrossDocument = ({ markdownAST }: any, settings?: ShikiTwoslashSettings) =>
  visit(markdownAST, "code", runTwoSlashOnNode(settings || defaultSettings))

export default remarkShiki
