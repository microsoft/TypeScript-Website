import { setupRedirects } from "../../src/redirects/setupRedirects"
import { createDocumentationPages } from "./ingestion/createPagesForDocumentation"
import { createTSConfigReference } from "./ingestion/createTSConfigReference"

import { GatsbyNode } from "gatsby"
import { createPlaygrounds } from "./ingestion/createPlaygrounds"
import { createPlaygroundExamplePages } from "./ingestion/createPlaygroundExamplePages"
import { createRootPagesLocalized } from "./ingestion/createRootPagesLocalized"
import { createGlossaryPages } from "./ingestion/createGlossaryPages"
import { createTSConfigSingleFlagPages } from "./ingestion/createTSConfigSingleFlagPages"
import { createPlaygroundHandbookPages } from "./ingestion/createPlaygroundHandbook"

export const createPages: GatsbyNode["createPages"] = async args => {
  // Basically this function should be passing the right
  // functions down to other places to handle their own
  // creation of the pages

  setupRedirects(args.actions.createRedirect)
  await createDocumentationPages(args.graphql, args.actions.createPage)
  await createTSConfigReference(args.graphql, args.actions.createPage)
  await createGlossaryPages(args.graphql, args.actions.createPage)
  await createPlaygrounds(args.graphql, args.actions.createPage)
  await createPlaygroundExamplePages(args.graphql, args.actions.createPage)
  await createTSConfigSingleFlagPages(args.graphql, args.actions.createPage)
  await createRootPagesLocalized(args.graphql, args.actions.createPage)
  await createPlaygroundHandbookPages(args.graphql, args.actions.createPage)

  return undefined
}
