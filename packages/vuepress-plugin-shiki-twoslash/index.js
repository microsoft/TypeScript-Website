console.log({ a: require("markdown-it-shiki-twoslash") })
const { markdownItShikiTwoslashSetup } = require("markdown-it-shiki-twoslash")

module.exports = settings => ({
  name: "vuepress-plugin-shiki-twoslash",
  extendsMarkdown: async md => {
    console.log({ a: require("markdown-it-shiki-twoslash") })

    const shiki = await markdownItShikiTwoslashSetup(settings)
    md.use(shiki)
  },
})
