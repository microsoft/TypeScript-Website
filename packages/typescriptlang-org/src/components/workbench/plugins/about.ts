type Sandbox = import("@typescript/sandbox").Sandbox
type Factory = import("../../../../static/js/playground").PluginFactory
type PluginUtils = import("../../../../static/js/playground").PluginUtils

const why = `
The bug workbench lets you make reproductions of bugs which are trivial to verify against many different versions of TypeScript over time.
`.trim()

const cta = `
To learn how the tools for making a repro, go to "Docs"

`.trim()

export const workbenchHelpPlugin: Factory = (i, utils) => {
  return {
    id: "about",
    displayName: "About",
    didMount: (sandbox, container) => {
      const ds = utils.createDesignSystem(container)

      ds.title("Twoslash Overview")
      ds.pWithChildren(
        "The bug workbench uses ",
        ds.link("https://www.npmjs.com/package/@typescript/twoslash", "Twoslash"),
        " to help you create accurate bug reports. Twoslash is a markup format for TypeScript files which lets you highlight code, handle-multiple files and show the files the TypeScript compiler creates."
      )

      ds.p(why)
      ds.p("A repro can highlight an issue in a few ways:")
      ds.unorderedList(
        ["Does this code sample fail to compile?"],
        ["Is a type wrong at a position in the file?"],
        ["Is the .js/.d.ts/.map file wrong?"]
      )
      ds.p(cta)
    },
  }
}
