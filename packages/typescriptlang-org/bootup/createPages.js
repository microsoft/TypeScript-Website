const {setupRedirects} = require("../src/redirects/setupRedirects")
const {createOldHandbookPages} = require("./ingestion/createPagesForOldHandbook")

/** @type { import("gatsby").GatsbyNode["createPages"] } */
const createPages = async (args) => {
  // Basically this function should be passing the right
  // functions down to other places to handle their own
  // creation of the pages

  setupRedirects(args.actions.createRedirect)
  createOldHandbookPages(args.graphql, args.actions.createPage)

  return null
}

module.export = {
  createPages,
}
