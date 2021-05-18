import { UserConfigSettings, runTwoSlash } from "shiki-twoslash"
import type { TwoSlashReturn } from "@typescript/twoslash"

/**
 * Keeps a cache of the JSON responses to a twoslash call in node_modules/.cache/twoslash
 * which should keep CI times down (e.g. the epub vs the handbook etc) - but also during
 * dev time, where it can be super useful.
 */
export const cachedTwoslashCall = (
  code: string,
  lang: string,
  settings: UserConfigSettings
): TwoSlashReturn | undefined => {
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
