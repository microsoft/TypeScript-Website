const {setupRedirects} = require("../src/redirects/setupRedirects")
const {createOldHandbookPages} = require("./ingestion/createPagesForOldHandbook")

import { GatsbyNode } from "gatsby"

export const createPages: GatsbyNode["createPages"] = async (args) => {

  // Basically this function should be passing the right
  // functions down to other places to handle their own
  // creation of the pages

  setupRedirects(args.actions.createRedirect)
  createOldHandbookPages(args.graphql, args.actions.createPage)

  return null
}
