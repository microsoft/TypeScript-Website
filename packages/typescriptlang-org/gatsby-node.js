
const { createPages } = require("./lib/bootup/createPages")
const { onCreateNode } = require("./lib/bootup/onCreateNode")

/** @type { import("gatsby").GatsbyNode } */
const config = {};
exports.config = config

config.createPages = createPages
config.onCreateNode = onCreateNode

module.exports = config
