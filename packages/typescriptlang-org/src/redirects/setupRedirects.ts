// These are redirects from a very long time ago
export const veryOldRedirects = {
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
export const handbookRedirects = {
  "/docs/handbook/writing-declaration-files": "/docs/handbook/declaration-files/introduction.html",
  "/docs/handbook/writing-declaration-files.html": "/docs/handbook/declaration-files/introduction.html",
  "/docs/handbook/writing-definition-files": "/docs/handbook/declaration-files/introduction.html",
  "/docs/handbook/typings-for-npm-packages": "/docs/handbook/declaration-files/publishing.html",
  "/docs/handbook/typings-for-npm-packages.html": "/docs/handbook/declaration-files/publishing.html",
  "/docs/handbook/release-notes": "/docs/handbook/release-notes/overview.html",
  "/docs/tutorial.html": "/docs/handbook/release-notes/overview.html",
  "/docs/handbook/release-notes/overview": "/docs/handbook/release-notes/overview.html",
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
        redirectInBrowser: true,
        fromPath: from,
        toPath: to,
      })
    })
  }

  addRedirects(veryOldRedirects)
  addRedirects(handbookRedirects)
}
