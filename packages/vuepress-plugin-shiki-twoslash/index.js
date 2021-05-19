const { markdownItShikiTwoslashSetup } = require("markdown-it-shiki-twoslash")

module.exports = settings => ({
  name: "vuepress-plugin-shiki-twoslash",
  extendsMarkdown: async md => {
    const shiki = await markdownItShikiTwoslashSetup(settings)
    md.use(shiki)
  },
})
