export const redirectDeclarations = [
  { from: "/Playground", to: "/play/", group: "veryOldRedirects" },
  { from: "/Tutorial", to: "/docs", group: "veryOldRedirects" },
  { from: "/Handbook", to: "/docs", group: "veryOldRedirects" },
  { from: "/samples", to: "/docs", group: "veryOldRedirects" },
  { from: "/docs/home.html", to: "/docs/home", group: "veryOldRedirects" },
  { from: "/playground", to: "/play/", group: "veryOldRedirects" },
  { from: "/docs/home", to: "/docs", group: "veryOldRedirects" },
  { from: "/docs/handbook/writing-declaration-files", to: "/docs/handbook/declaration-files/introduction.html", group: "handbookRedirects" },
  { from: "/docs/handbook/writing-declaration-files.html", to: "/docs/handbook/declaration-files/introduction.html", group: "handbookRedirects" },
  { from: "/docs/handbook/writing-definition-files", to: "/docs/handbook/declaration-files/introduction.html", group: "handbookRedirects" },
  { from: "/docs/handbook/typings-for-npm-packages", to: "/docs/handbook/declaration-files/publishing.html", group: "handbookRedirects" },
  { from: "/docs/tutorial.html", to: "/docs/", group: "handbookRedirects" },
  { from: "/docs/handbook/release-notes", to: "/docs/", group: "handbookRedirects" },
  { from: "/docs/handbook/release-notes/overview", to: "/docs/", group: "handbookRedirects" },
  { from: "/docs/handbook/release-notes/overview.html", to: "/docs", group: "handbookRedirects" },
  { from: "/docs/handbook/react-&-webpack.html", to: "https://webpack.js.org/guides/typescript/", group: "handbookRedirects" },
  { from: "/docs/bootstrap", to: "/docs/", group: "handbookRedirects" },
  { from: "/docs/handbook/esm-node", to: "/docs/handbook/modules/reference.html#node16-node18-node20-nodenext", group: "currentHandbookAliases" },
  { from: "/docs/handbook/esm-node.html", to: "/docs/handbook/modules/reference.html#node16-node18-node20-nodenext", group: "currentHandbookAliases" },
  { from: "/docs/handbook/modules", to: "/docs/handbook/modules/introduction.html", group: "currentHandbookAliases" },
  { from: "/docs/handbook/modules.html", to: "/docs/handbook/modules/introduction.html", group: "currentHandbookAliases" },
  { from: "/docs/handbook/module-resolution", to: "/docs/handbook/modules/theory.html#module-resolution", group: "currentHandbookAliases" },
  { from: "/docs/handbook/module-resolution.html", to: "/docs/handbook/modules/theory.html#module-resolution", group: "currentHandbookAliases" },
]

export const uniqueRedirectOutputPaths = new Map()
for (const redirect of redirectDeclarations) {
  const key = redirect.from.toLowerCase()
  const existing = uniqueRedirectOutputPaths.get(key)
  if (existing && existing.to !== redirect.to) throw new Error(`Conflicting case-insensitive redirect declarations for ${redirect.from}`)
  if (!existing) uniqueRedirectOutputPaths.set(key, redirect)
}

export const redirectDestinationType = destination => {
  if (/^https?:\/\//.test(destination)) return "external"
  return destination.includes("#") ? "internal-fragment" : "internal"
}
