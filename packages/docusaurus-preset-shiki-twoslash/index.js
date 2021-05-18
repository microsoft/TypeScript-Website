function theme(context, pluginOptions) {
  // So, how do we hijack the code renderer? We mostly override the user's configuration for
  // preset classic.

  const preset = context.siteConfig.presets.find(p => p[0] === "@docusaurus/preset-classic")
  if (!preset) throw new Error("Couldn't find a preset of @docusaurus/preset-classic")

  // Step 1 - Add the remark pre-processor to the three sections it should be in
  const keys = ["docs", "blog", "pages"]
  for (const key of keys) {
    if (!preset[1][key]) preset[1][key] = {}
    if (!preset[1][key].beforeDefaultRemarkPlugins) preset[1][key].beforeDefaultRemarkPlugins = []

    // Add to before - because otherwise it would have been set by the existing code syntax renderer
    // now all they have is divs which will NOOP
    preset[1][key].beforeDefaultRemarkPlugins.push([require("remark-shiki-twoslash").default, pluginOptions])
  }

  // Step 2 - Add the CSS
  if (!preset[1].theme) preset[1].theme = {}
  const existingCSS = preset[1].theme.customCss
  let newCSS = [require.resolve("docusaurus-plugin-shiki-twoslash/twoslash.css")]
  if (existingCSS && typeof existingCSS === "string") newCSS.push(existingCSS)
  if (existingCSS && typeof existingCSS === "object") newCSS = newCSS.concat(existingCSS)
  preset[1].theme.customCss = newCSS

  // Step 3 - Inject the hover via the internal 'theme' - this is a real nasty hack
  return {
    name: "docusaurus-preset-shiki-twoslash",
    plugins: [require.resolve("./shiki-twoslash-theme")],
  }
}

module.exports = theme
