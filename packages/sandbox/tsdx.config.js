const commonjs = require("@rollup/plugin-commonjs");

// Modify the default tsdx rollup config
module.exports = {
  rollup(config, options) {
    // Required to import lzstring
    config.plugins.push(commonjs());

    return config;
  },
};
