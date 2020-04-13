type TwoSlashReturns = import("@typescript/twoslash").TwoSlashReturn
type PluginFactory = import("../../../../static/js/playground").PluginFactory

export const workbenchResultsPlugin: PluginFactory = (i, utils) => {
  let pluginContainer: HTMLDivElement

  return {
    id: "results",
    displayName: "Results",
    didMount: (sandbox, container) => {
      pluginContainer = container
    },
    noResults: () => {},
    getResults: (sandbox: any, results: TwoSlashReturns) => {
      const ds = utils.createDesignSystem(pluginContainer)
      ds.clear()

      ds.subtitle(`Output Code as ${results.extension}`)
      ds.code(results.code)

      // This is a lot of stuff
      const showInfo = !!localStorage.getItem("bug-workbench-show-quick-infos")
      if (!showInfo) {
        // @ts-ignore
        results.staticQuickInfos = ["..."]
      }

      ds.subtitle(`Twoslash JSON`)
      ds.code(JSON.stringify(results, null, "  "))

      ds.localStorageOption({
        display: "Show static quick infos",
        flag: "bug-workbench-show-quick-infos",
        blurb: "Include the extra info used for showing the hovers",
      })
    },
  }
}
