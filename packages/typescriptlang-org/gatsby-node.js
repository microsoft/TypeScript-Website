const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const { createPages } = require("./lib/bootup/createPages")
const {
  addPathToSite,
  writeAllPathsToFixture,
} = require("./lib/bootup/pathsOnSiteTracker")

/** @type { import("gatsby").GatsbyNode } */
const config = {}
exports.config = config

config.createPages = createPages

// So we don't need to query for all pages
config.onCreatePage = p => addPathToSite(p.page.path)
config.onPostBootstrap = () => writeAllPathsToFixture()

// To ensure canvas (used by JSDom) doesn't break builds during SSR
// see: https://github.com/gatsbyjs/gatsby/issues/17661

config.onCreateWebpackConfig = ({ loaders, actions, plugins, stage }) => {
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
    resolve: {
      fallback: {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        inspector: false,
        jsdom: false,
      },
    },

    plugins: [
      plugins.define({
        __DEVELOPMENT__: stage === `develop` || stage === `develop-html`,
      }),
      new NodePolyfillPlugin(),
    ],
  })
}

module.exports = config
