type TwoSlashReturns = import("@typescript/twoslash").TwoSlashReturn
type PluginFactory = import("../../../../static/js/playground").PluginFactory

export const workbenchDebugPlugin: PluginFactory = (i, utils) => {
  let pluginContainer: HTMLDivElement

  return {
    id: "results",
    displayName: "Debug",
    didMount: (_sandbox, container) => {
      pluginContainer = container
    },
    noResults: () => {
      const ds = utils.createDesignSystem(pluginContainer)
      ds.clear()

      ds.p("No results")
    },
    getResults: (
      _sandbox: any,
      results: TwoSlashReturns,
      dtsMap: Map<string, string>
    ) => {
      const ds = utils.createDesignSystem(pluginContainer)
      ds.clear()

      ds.p(
        "This tab shows the raw data passed back from Twoslash. This can be useful in debugging if something isn't working as you would expect. That said, if you're struggling with a repro - ask in the <a href='https://discord.gg/typescript'>#compiler-api channel of the TypeScript Discord</a>."
      )

      ds.subtitle(`Output Code as ${results.extension}`)
      ds.code(results.code)

      // @ts-ignore
      results.staticQuickInfos = ["..."]

      ds.subtitle(`Twoslash JSON`)
      ds.code(JSON.stringify(results, null, "  "))

      ds.subtitle("Virtual File System")

      const files = Array.from(dtsMap.keys()).reverse()
      const dtsFiles: string[] = []
      files.forEach(filename => {
        if (filename.startsWith("/lib.")) {
          dtsFiles.push(filename.replace("/lib", "lib"))
        } else {
          ds.p("<strong>" + filename + "</strong>")
          ds.code(dtsMap.get(filename)!.trim())
        }
      })
      ds.subtitle("Lib files")
      ds.p(dtsFiles.join(", "))
    },
  }
}
