const { createPages } = require("./lib/bootup/createPages")
const { onCreateNode } = require("./lib/bootup/onCreateNode")

/** @type { import("gatsby").GatsbyNode } */
const config = {}
exports.config = config

config.createPages = createPages
config.onCreateNode = onCreateNode

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
  })
}

module.exports = config
