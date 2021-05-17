import { UserConfigSettings, renderCodeToHTML, runTwoSlash } from "shiki-twoslash"
import { Lang, Highlighter, getHighlighter, IThemeRegistration } from "shiki"

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
export const visitor = (highlighters: Highlighter[], twoslashSettings: UserConfigSettings = {}) => (node: RichNode) => {
  let lang = node.lang
  let settings = twoslashSettings || {}

  // Offer a way to do high-perf iterations, this is less useful
  // given that we cache the results of twoslash in the file-system
  const shouldDisableTwoslash = process && process.env && !!process.env.TWOSLASH_DISABLE
  if (!shouldDisableTwoslash) runTwoSlashOnNode(settings)(node)

  // Shiki doesn't respect json5 as an input, so switch it
  // to json, which can handle comments in the syntax highlight
  const replacer = {
    json5: "json",
  }

  // @ts-ignore
  if (replacer[lang]) lang = replacer[lang]

  // The meta is the bit after lang in: ```lang [this bit]
  const metaString = !node.meta ? "" : typeof node.meta === "string" ? node.meta : node.meta.join(" ")

  let results
  // Support 'twoslash' codesamples
  if ((lang as string) === "twoslash") {
    if (!node.meta) throw new Error("A twoslash code block needs a pragma like 'twoslash include [name]'")
    addIncludes(includes, node.value, metaString)
    results = ""
  } else {
    // All good, get each
    const output = highlighters.map(highlighter => {
      // @ts-ignore
      const themeName: string = highlighter.customName.split("/").pop().replace(".json", "")
      return renderCodeToHTML(node.value, lang, metaString.split(" "), { themeName }, highlighter, node.twoslash)
    })
    results = output.join("\n")
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
    try {
      const code = replaceIncludesInCode(includes, node.value)
      const results = cachedTwoslashCall(code, node.lang, settings)
      node.value = results.code
      node.lang = results.extension as Lang
      node.twoslash = results
    } catch (error) {
      const pos = (node.position && node.position.start.line) || -1
      error.message = `remark-shiki-twoslash: Error thrown in code sample on line ${pos}\n\n${error.message}`
      throw error
    }
  }
}

/**
 * Keeps a cache of the JSON responses to a twoslash call in node_modules/.cache/twoslash
 * which should keep CI times down (e.g. the epub vs the handbook etc) - but also during
 * dev time, this is useful.
 *
 */
export const cachedTwoslashCall = (code: string, lang: string, settings: UserConfigSettings) => {
  try {
    require("crypto")
  } catch (err) {
    // Not in Node, run un-cached
    return runTwoSlash(code, lang, settings)
  }

  const { createHash } = require("crypto")
  const { readFileSync, existsSync, mkdirSync, writeFileSync } = require("fs")
  const { join } = require("path")

  const shasum = createHash("sha1")
  const codeSha = shasum.update(code).digest("hex")
  const cacheRoot = join(__dirname, "..", "..", ".cache", "twoslash")
  const cachePath = join(cacheRoot, `${codeSha}.json`)

  if (existsSync(cachePath)) {
    return JSON.parse(readFileSync(cachePath, "utf8"))
  } else {
    const results = runTwoSlash(code, lang, settings)
    if (!existsSync(cacheRoot)) mkdirSync(cacheRoot, { recursive: true })
    writeFileSync(cachePath, JSON.stringify(results), "utf8")
    return results
  }
}

// The remark API

// So we only have one highlighter per theme in a process
const highlighterCache = new Map<IThemeRegistration, Highlighter>()

function remarkTwoslash(settings: UserConfigSettings = {}) {
  const themes = settings.themes || (settings.theme ? [settings.theme] : ["light-plus"])

  if (!settings["vfsRoot"]) {
    // Default to assuming you want vfs node_modules set up
    // but don't assume you're on node though
    try {
      // dist > remark-shiki-twoslash > node_modules
      settings.vfsRoot = require("path").join(__dirname, "..", "..", "..")
    } catch (error) {}
  }

  const transform = async (markdownAST: any) => {
    const highlighters = await Promise.all(
      themes.map(async theme => {
        // You can put a string, a path, or the JSON theme obj
        const themeName = (theme as any).name || theme
        const cached = highlighterCache.get(themeName)
        if (cached) {
          return cached
        }

        const highlighter = await getHighlighter({ ...settings, theme, themes: undefined })
        // @ts-ignore - https://github.com/shikijs/shiki/pull/162 will fix this
        highlighter.customName = themeName
        highlighterCache.set(themeName, highlighter)
        return highlighter
      })
    )

    includes.clear()
    visit(markdownAST, "code", visitor(highlighters, settings))
  }

  return transform
}

export default remarkTwoslash
