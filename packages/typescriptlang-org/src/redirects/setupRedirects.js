const { redirects } = require("./oldestRedirects")


/**
 * Whoah yeah!
 * @param { import("gatsby").NodePluginArgs["actions"]["createRedirect"]} createRedirect 
 */
const setupRedirects = (createRedirect) => {
  const fromArray = Object.keys(redirects)
  fromArray.forEach(from => {
    const to = redirects[from]

    createRedirect({
      fromPath: from,
      toPath: to
    })
  });
}

module.exports = {
  setupRedirects
}
