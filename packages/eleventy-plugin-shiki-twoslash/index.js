// @ts-check
const { setupForFile, transformAttributesToHTML } = require("remark-shiki-twoslash")
const { sleep } = require("deasync")

/**
 * @param {*} eleventyConfig
 * @param {import("shiki-twoslash").UserConfigSettings} options
 */
module.exports = function (eleventyConfig, options = {}) {
  /** @type {import("shiki").Highlighter[]} */
  let highlighters = undefined
  setupForFile(options).then(h => (highlighters = h.highlighters))

  if (!highlighters) {
    let count = 10000 / 200
    while (!highlighters) {
      sleep(200)
      count -= 1
      if (count <= 0)
        throw new Error(
          "Could not get Shiki loaded async via 'deasync'. 11ty doesn't have an API for async plugins, and Shiki needs this for the WASM syntax highlighter. You can try using a different version of node, or requesting APIs at https://github.com/11ty/eleventy"
        )
    }
  }

  eleventyConfig.addMarkdownHighlighter((code, lang, fence) =>
    transformAttributesToHTML(code, lang, fence, highlighters, options)
  )
}
