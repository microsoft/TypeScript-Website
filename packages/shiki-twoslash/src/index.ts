import { getHighlighter, Highlighter, HighlighterOptions, IThemedToken } from "shiki"
import { twoslasher, TwoSlashOptions, TwoSlashReturn } from "@typescript/twoslash"
import { twoslashRenderer } from "./renderers/twoslash"
import { HtmlRendererOptions, plainTextRenderer } from "./renderers/plain"
import { defaultShikiRenderer } from "./renderers/shiki"
import { tsconfigJSONRenderer } from "./renderers/tsconfig"
import { parseCodeFenceInfo } from "./parseCodeFenceInfo"

/** The possible user config, a combination of all shiki and twoslash options */
export type UserConfigSettings = HighlighterOptions & TwoSlashOptions

/**
 * This gets filled in by the promise below, then should
 * hopefully be more or less synchronous access by each parse
 * of the highlighter
 */
let storedHighlighter: Highlighter = null as any

/**
 * Creates a Shiki highlighter, this is an async call because of the call to WASM to get the regex parser set up.
 *
 * In other functions, passing a the result of this highlighter function is kind of optional but it's the author's
 * opinion that you should be in control of the highlighter, and not this library.
 *
 */
export const createShikiHighlighter = (options: HighlighterOptions) => {
  if (storedHighlighter) return Promise.resolve(storedHighlighter)

  return getHighlighter(options).then(newHighlighter => {
    storedHighlighter = newHighlighter
    return storedHighlighter
  })
}

/**
 * Renders a code sample to HTML, automatically taking into account:
 *
 *  - rendering overrides for twoslash and tsconfig
 *  - whether the language exists in shiki
 *
 * @param code the source code to render
 * @param lang the language to use in highlighting
 * @param info additional metadata which lives after the codefence lang (e.g. ["twoslash"])
 * @param highlighter optional, but you should use it, highlighter
 * @param twoslash optional, but required when info contains 'twoslash' as a string
 */
export const renderCodeToHTML = (
  code: string,
  lang: string,
  info: string[],
  shikiOptions?: HtmlRendererOptions,
  highlighter?: Highlighter,
  twoslash?: TwoSlashReturn
) => {
  if (!highlighter && !storedHighlighter) {
    throw new Error(
      "The highlighter object hasn't been initialised via `setupHighLighter` yet in render-shiki-twoslash"
    )
  }

  // Shiki does know the lang, so tokenize
  const renderHighlighter = highlighter || storedHighlighter

  let tokens: IThemedToken[][]
  try {
    // Shiki does know the lang, so tokenize
    tokens = renderHighlighter.codeToThemedTokens(code, lang as any)
  } catch (error) {
    // Shiki doesn't know this lang
    return plainTextRenderer(code, shikiOptions || {})
  }

  // Twoslash specific renderer
  if (info.includes("twoslash") && twoslash) {
    const metaInfo = info && typeof info === "string" ? info : info.join(" ")
    const codefenceMeta = parseCodeFenceInfo(lang, metaInfo || "")
    return twoslashRenderer(tokens, shikiOptions || {}, twoslash, codefenceMeta.meta)
  }

  // TSConfig renderer
  if (lang && lang.startsWith("json") && info.includes("tsconfig")) {
    return tsconfigJSONRenderer(tokens, shikiOptions || {})
  }

  // Otherwise just the normal shiki renderer
  return defaultShikiRenderer(tokens, { langId: lang })
}

/**
 * Runs Twoslash over the code passed in with a particular language as the default file.
 */
export const runTwoSlash = (code: string, lang: string, settings: UserConfigSettings = {}): TwoSlashReturn => {
  // Shiki doesn't respect json5 as an input, so switch it
  // to json, which can handle comments in the syntax highlight
  const replacer = {
    json5: "json",
    yml: "yaml",
  }

  // @ts-ignore
  if (replacer[lang]) lang = replacer[lang]

  console.log({ runTwoSlash, settings })
  const results = twoslasher(code, lang, settings)
  return results
}

export { parseCodeFenceInfo } from "./parseCodeFenceInfo"

/** Set of renderers if you want to explicitly call one instead of using renderCodeToHTML */
export const renderers = {
  plainTextRenderer,
  defaultShikiRenderer,
  twoslashRenderer,
  tsconfigJSONRenderer,
}
