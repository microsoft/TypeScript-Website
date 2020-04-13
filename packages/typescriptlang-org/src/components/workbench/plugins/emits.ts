type TwoSlashReturns = import("@typescript/twoslash").TwoSlashReturn
type PluginFactory = import("../../../../static/js/playground").PluginFactory

export const workbenchEmitPlugin: PluginFactory = (i, utils) => {
  let pluginContainer: HTMLDivElement

  return {
    id: "emit",
    displayName: "Emit",
    didMount: (sandbox, container) => {
      pluginContainer = container
    },
    noResults: () => {},
    getResults: (
      sandbox: any,
      results: TwoSlashReturns,
      dtsMap: Map<string, string>
    ) => {
      const ds = utils.createDesignSystem(pluginContainer)
      if (!dtsMap) {
        ds.showEmptyScreen("No emit yet")
        return
      }
      ds.clear()

      // prettier-ignore
      ds.p("This section is a WIP, and will eventually show the emitted files from your twoslash run.")

      const files = Array.from(dtsMap.keys()).reverse()
      files.forEach(filename => {
        if (filename.startsWith("/lib.")) {
          // Do something?
          ds.subtitle(filename)
        } else {
          ds.subtitle(filename)
          ds.code(dtsMap.get(filename)!.trim())
        }
      })
    },
  }
}
