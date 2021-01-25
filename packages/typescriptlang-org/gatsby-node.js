const { createPages } = require("./lib/bootup/createPages")
const { onCreateNode } = require("./lib/bootup/onCreateNode")
const {
  addPathToSite,
  writeAllPathsToFixture,
} = require("./lib/bootup/pathsOnSiteTracker")

/** @type { import("gatsby").GatsbyNode } */
const config = {}
exports.config = config

config.createPages = createPages
config.onCreateNode = onCreateNode

// So we don't need to query for all pages
config.onCreatePage = p => addPathToSite(p.page.path)
config.onPostBootstrap = () => writeAllPathsToFixture()

// To ensure canvas (used by JSDom) doesn't break builds during SSR
// see: https://github.com/gatsbyjs/gatsby/issues/17661

config.onCreateWebpackConfig = ({ loaders, actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /canvas/,
          use: loaders.null(),
        },
      ],
    },
    externals: {
      pnpapi: "commonjs pnpapi",
      fs: "commonjs fs",
    },
  })
}

module.exports = config
