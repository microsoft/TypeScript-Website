
const { createPages } = require("./bootup/createPages")
const { onCreateNode } = require("./bootup/onCreateNode")

/** @type { import("gatsby").GatsbyNode } */
const config = {};
exports.config = config

config.createPages = createPages
config.onCreateNode = onCreateNode

module.exports = config
