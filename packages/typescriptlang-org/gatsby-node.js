const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { createPages } = require("./lib/bootup/createPages");
const {
  addPathToSite,
  writeAllPathsToFixture,
} = require("./lib/bootup/pathsOnSiteTracker");

/** @type { import("gatsby").GatsbyNode } */
const config = {};
exports.config = config;

config.createPages = createPages;

// So we don't need to query for all pages
config.onCreatePage = p => addPathToSite(p.page.path);
config.onPostBootstrap = () => writeAllPathsToFixture();

// To ensure canvas (used by JSDom) doesn't break builds during SSR
// see: https://github.com/gatsbyjs/gatsby/issues/17661

config.onCreateWebpackConfig = ({ loaders, actions, plugins, stage }) => {
  const isSSR = stage === `build-html` || stage === `develop-html`;

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
      module: "commonjs module",
      // In SSR stages, use Node's native util module instead of the browser
      // polyfill (util@0.12.5), which lacks TextEncoder and breaks react-dom
      // server rendering on Node >= 19.
      ...(isSSR ? { util: "commonjs util" } : {}),
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
  });
};

module.exports = config;
