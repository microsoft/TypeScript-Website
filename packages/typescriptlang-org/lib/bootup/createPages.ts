import { setupRedirects } from "../../src/redirects/setupRedirects"
import { createOldHandbookPages } from "./ingestion/createPagesForOldHandbook"
import { createTSConfigReference } from "./ingestion/createTSConfigReference"

import { GatsbyNode } from "gatsby"
import { createPlaygrounds } from "./ingestion/createPlaygrounds"

export const createPages: GatsbyNode["createPages"] = async args => {
  // Basically this function should be passing the right
  // functions down to other places to handle their own
  // creation of the pages

  setupRedirects(args.actions.createRedirect)
  await createOldHandbookPages(args.graphql, args.actions.createPage)
  await createTSConfigReference(args.graphql, args.actions.createPage)
  await createPlaygrounds(args.graphql, args.actions.createPage)

  return null
}
