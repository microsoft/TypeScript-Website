import { loadTheme, getHighlighter, getTheme } from "shiki"
import { Highlighter } from "shiki/dist/highlighter"
import { commonLangIds, commonLangAliases, otherLangIds } from "shiki-languages"
import { twoslasher, TwoSlashReturn } from "@typescript/twoslash"
import { createDefaultMapFromNodeModules, addAllFilesFromFolder } from "@typescript/vfs"
import { renderToHTML } from "./renderer"

const languages = [...commonLangIds, ...commonLangAliases, ...otherLangIds]

/** Checks if it is available in shiki */
export const canHighlightLang = (lang: string) => languages.includes(lang as any)

/**
 * This gets filled in by the promise below, then should
 * hopefully be more or less synchronous access by each parse
 * of the highlighter
 */
let storedHighlighter: Highlighter = null as any

export const createShikiHighlighter = (options: import("shiki/dist/highlighter").HighlighterOptions) => {
  if (storedHighlighter) return storedHighlighter

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
    storedHighlighter = newHighlighter
    return storedHighlighter
  })
}

export type ShikiTwoslashSettings = {
  useNodeModules?: true
  nodeModulesTypesPath?: string
}

export const defaultShikiTwoslashSettings: ShikiTwoslashSettings = {}

/** Uses Shiki to render the code to HTML */
export const renderCodeToHTML = (code: string, lang: string, highlighter?: Highlighter, twoslash?: TwoSlashReturn) => {
  if (!highlighter && !storedHighlighter) {
    throw new Error(
      "The highlighter object hasn't been initialised via `setupHighLighter` yet in render-shiki-twoslash"
    )
  }

  const renderHighlighter = highlighter || storedHighlighter
  const tokens = renderHighlighter.codeToThemedTokens(code, lang as any)
  const results = renderToHTML(tokens, { langId: lang }, twoslash)
  return results
}

// Basically so that we can store this once, then re-use it
let nodeModulesMap: Map<string, string> | undefined = undefined

/** Runs Twoslash over the code in the  */
export const runTwoSlash = (
  code: string,
  lang: string,
  settings: ShikiTwoslashSettings = defaultShikiTwoslashSettings
): TwoSlashReturn => {
  let map: Map<string, string> | undefined = undefined

  // Shiki doesn't respect json5 as an input, so switch it
  // to json, which can handle comments in the syntax highlight
  const replacer = {
    json5: "json",
  }

  // @ts-ignore
  if (replacer[lang]) lang = replacer[lang]

  // Add @types to the fsmap
  if (settings.useNodeModules) {
    // we don't want a hard dep on TS, so that browsers can run this code)
    const laterESVersion = 6

    // Save node modules into a cached object which we re-create from (emits can edit the map)
    if (nodeModulesMap) {
      map = new Map(nodeModulesMap)
    } else {
      map = createDefaultMapFromNodeModules({ target: laterESVersion })
      nodeModulesMap = map
    }

    // Maybe it's worth only doing the imports in the file, but that would break dts deps
    // const imports = parseFileForModuleReferences(code).filter((mod) => !mod.startsWith("."))

    addAllFilesFromFolder(map, settings.nodeModulesTypesPath || "node_modules/@types")
  }

  const results = twoslasher(code, lang, { fsMap: map })
  return results
}
