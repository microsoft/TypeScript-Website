import type { TwoSlashReturn } from "@typescript/twoslash"
import type { Node } from "unist"
import { UserConfigSettings, renderCodeToHTML, runTwoSlash } from "shiki-twoslash"
import { Lang, Highlighter, getHighlighter, IThemeRegistration } from "shiki"
import visit from "unist-util-visit"

import { addIncludes, replaceIncludesInCode } from "./includes"
import { cachedTwoslashCall } from "./caching"

// A set of includes which can be pulled via a set ID
const includes = new Map<string, string>()

// prettier-ignore
function getHTML(code: string, lang: string, metaString: string, highlighters: Highlighter[], twoslash: TwoSlashReturn | undefined) {
  // Shiki doesn't respect json5 as an input, so switch it
  // to json, which can handle comments in the syntax highlight
  const replacer = {
    json5: "json",
  }

  // @ts-ignore
  if (replacer[lang]) lang = replacer[lang]

  let results
  // Support 'twoslash' includes
  if ((lang as string) === "twoslash") {
    if (!metaString) throw new Error("A twoslash code block needs a pragma like 'twoslash include [name]'")
    addIncludes(includes, code, metaString)
    results = ""
  } else {
    // All good, get each highlighter and render the shiki output for it
    const output = highlighters.map(highlighter => {
      // @ts-ignore
      const themeName: string = highlighter.customName.split("/").pop().replace(".json", "")
      return renderCodeToHTML(code, lang, metaString.split(" "), { themeName }, highlighter, twoslash)
    })
    results = output.join("\n")
  }
  return results
}

/**
 * Runs twoslash across an AST node, switching out the text content, and lang
 * and adding a `twoslash` property to the node.
 */
export const runTwoSlashOnNode = (code: string, lang: string, meta: string, settings: UserConfigSettings = {}) => {
  // Offer a way to do high-perf iterations, this is less useful
  // given that we cache the results of twoslash in the file-system=
  const shouldDisableTwoslash = process && process.env && !!process.env.TWOSLASH_DISABLE
  if (shouldDisableTwoslash) return undefined

  // Only run twoslash when the meta has the attribute twoslash
  if (meta && meta.includes("twoslash")) {
    const importedCode = replaceIncludesInCode(includes, code)
    return cachedTwoslashCall(importedCode, lang, settings)
  }

  return undefined
}

// To make sure we only have one highlighter per theme in a process
const highlighterCache = new Map<IThemeRegistration, Highlighter>()

/** Sets up the highlighters, and cache's for recalls */
export const highlightersFromSettings = async (settings: UserConfigSettings) => {
  const themes = settings.themes || (settings.theme ? [settings.theme] : ["light-plus"])

  return await Promise.all(
    themes.map(async theme => {
      // You can put a string, a path, or the JSON theme obj
      const themeName = (theme as any).name || theme
      const cached = highlighterCache.get(themeName)
      if (cached) {
        return cached
      }

      console.log(`making ${themeName}`)
      const highlighter = await getHighlighter({ ...settings, theme, themes: undefined })
      console.log(`made ${themeName}`)

      // @ts-ignore - https://github.com/shikijs/shiki/pull/162 will fix this
      highlighter.customName = themeName
      highlighterCache.set(themeName, highlighter)
      return highlighter
    })
  )
}

const amendSettingsForDefaults = (settings: UserConfigSettings) => {
  if (!settings["vfsRoot"]) {
    // Default to assuming you want vfs node_modules set up
    // but don't assume you're on node though
    try {
      // dist > remark-shiki-twoslash > node_modules
      settings.vfsRoot = require("path").join(__dirname, "..", "..", "..")
    } catch (error) {}
  }
}

const parsingNewFile = () => includes.clear()

////////////////// The Remark API

/* A rich AST node for uninst with twoslash'd data */
type RemarkCodeNode = Node & {
  lang: Lang
  type: string
  children: Node[]
  value: string
  meta?: string[] | string
}

/**
 * Synchronous outer function, async inner function, which is how the remark
 * async API works.
 */
function remarkTwoslash(settings: UserConfigSettings = {}) {
  amendSettingsForDefaults(settings)

  const transform = async (markdownAST: any) => {
    const highlighters = await highlightersFromSettings(settings)
    parsingNewFile()
    visit(markdownAST, "code", remarkVisitor(highlighters, settings))
  }

  return transform
}

/**
 * The function doing the work of transforming any codeblock samples in a remark AST.
 */
export const remarkVisitor = (highlighters: Highlighter[], twoslashSettings: UserConfigSettings = {}) => (
  node: RemarkCodeNode
) => {
  let lang = node.lang
  // The meta is the bit after lang in: ```lang [this bit]
  const metaString = !node.meta ? "" : typeof node.meta === "string" ? node.meta : node.meta.join(" ")
  const code = node.value

  const twoslash = runTwoSlashOnNode(code, lang, metaString, twoslashSettings)
  if (twoslash) {
    node.value = twoslash.code
    node.lang = twoslash.extension as Lang
  }

  const shikiHTML = getHTML(code, lang, metaString, highlighters, twoslash)
  node.type = "html"
  node.value = shikiHTML
  node.children = []
}

export default remarkTwoslash

////////////////// The Markdown-it API

/** Only the inner function exposed as a synchronous API for markdown-it */

export const setupForFile = async (settings: UserConfigSettings = {}) => {
  amendSettingsForDefaults(settings)
  console.log("starting")

  parsingNewFile()
  let highlighters = await highlightersFromSettings(settings)
  console.log("got")
  return { settings, highlighters }
}

export const transformAttributesToHTML = (
  code: string,
  lang: string,
  attrs: string,
  highlighters: Highlighter[],
  settings: UserConfigSettings
) => {
  const twoslash = runTwoSlashOnNode(code, lang, attrs, settings)
  return getHTML(code, lang, attrs, highlighters, twoslash)
}
