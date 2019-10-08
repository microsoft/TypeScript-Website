const { redirects } = require("./oldestRedirects")

import {NodePluginArgs} from "gatsby"


export const setupRedirects = (createRedirect: NodePluginArgs["actions"]["createRedirect"] ) => {
  const fromArray = Object.keys(redirects)
  fromArray.forEach(from => {
    const to = redirects[from]

    createRedirect({
      fromPath: from,
      toPath: to
    })
  });
}
