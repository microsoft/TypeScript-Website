// These are redirects from a very long time ago
const veryOldRedirects = {
  Playground: "/play/",
  Tutorial: "/docs",
  Handbook: "/docs",
  samples: "/docs",
  "/docs/home.html": "/docs/home",
  "/playground": "/play/",
  "/docs/home": "/docs",
}

// These were .html files in the handbook with some redirection work
// prettier-ignore
const handbookRedirects = {
  "/docs/handbook/writing-declaration-files": "/docs/handbook/declaration-files/introduction.html",
  "/docs/handbook/writing-declaration-files.html": "/docs/handbook/declaration-files/introduction.html",
  "/docs/handbook/writing-definition-files": "/docs/handbook/declaration-files/introduction.html",
  "/docs/handbook/typings-for-npm-packages": "/docs/handbook/declaration-files/publishing.html",
  "/docs/tutorial.html": "/docs/",
  "/docs/handbook/release-notes": "/docs/",
  "/docs/handbook/release-notes/overview": "/docs/",
  "/docs/handbook/release-notes/overview.html": "/docs",
  "/docs/handbook/react-&-webpack.html": "https://webpack.js.org/guides/typescript/"
}

import { NodePluginArgs } from "gatsby"

export const setupRedirects = (
  createRedirect: NodePluginArgs["actions"]["createRedirect"]
) => {
  const addRedirects = obj => {
    const fromArray = Object.keys(obj)
    fromArray.forEach(from => {
      const to = obj[from]
      if (process.env.CI) {
        console.log(`Making redirect from ${from} to ${to}`)
      }
      createRedirect({
        isPermanent: true,
        // TODO: when we move to Azure Static Web Apps, we can disable `redirectInBrowser` and
        // use https://www.gatsbyjs.com/plugins/gatsby-plugin-azure-static-web-app-redirects/,
        // or probably just delete this file altogether and maintain routes.json instead.
        redirectInBrowser: true,
        fromPath: from,
        toPath: to,
      })
    })
  }

  addRedirects(veryOldRedirects)
  addRedirects(handbookRedirects)
  addRedirects({
    "/assets/typescript-handbook.epub": "/docs/handbook/intro.html",
    "/assets/typescript-handbook.pdf": "/docs/handbook/intro.html"
  })
}
