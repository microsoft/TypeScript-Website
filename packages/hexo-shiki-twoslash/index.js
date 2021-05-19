const { sleep } = require("deasync")
const { setupForFile, transformAttributesToHTML } = require("remark-shiki-twoslash")

// Register to the marked markdown renderer that we want to take over
// rendering code blocks

hexo.extend.filter.register("marked:renderer", function (renderer) {
  const { config } = this

  /** @type {import("shiki").Highlighter[]} */
  let highlighters = undefined
  setupForFile(config.shiki_twoslash).then(h => (highlighters = h.highlighters))
  if (!highlighters) {
    let count = 10000 / 200
    while (!highlighters) {
      sleep(200)
      count -= 1
      if (count <= 0)
        throw new Error(
          "Could not get Shiki loaded async via 'deasync'. Hexo doesn't have an API for async plugins, and Shiki needs this for the WASM syntax highlighter. You can try using a different version of node, or requesting APIs at https://github.com/11ty/eleventy"
        )
    }
  }

  renderer.code = function (code, infostring) {
    const [lang, ...rest] = infostring.split(" ")
    const fence = rest.join(" ")

    return transformAttributesToHTML(code, lang, fence, highlighters, config.shikiTwoslash)
  }
})
