// These are redirects from a very long time ago
export const veryOldRedirects = {
  Playground: "/play",
  Tutorial: "docs/home",
  Handbook: "docs/home",
  samples: "docs/home",
}

// These were .html files in the handbook with some redirection work
export const handbookRedirects = {
  "/docs/handbook/writing-declaration-files":
    "/docs/handbook/declaration-files/introduction.html",
  "/docs/handbook/writing-definition-files":
    "/docs/handbook/declaration-files/introduction.html",
  "/docs/handbook/typings-for-npm-packages":
    "/docs/handbook/declaration-files/publishing.html",

  "/docs/handbook/release-notes": "/docs/handbook/release-notes/overview",
}

import { NodePluginArgs } from "gatsby"

export const setupRedirects = (
  createRedirect: NodePluginArgs["actions"]["createRedirect"]
) => {
  const addRedirects = obj => {
    const fromArray = Object.keys(obj)
    fromArray.forEach(from => {
      const to = obj[from]
      createRedirect({
        fromPath: from,
        toPath: to,
      })
    })

    addRedirects(veryOldRedirects)
    addRedirects(handbookRedirects)
  }
}
