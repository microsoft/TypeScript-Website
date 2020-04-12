type Factory = import("../../../../static/js/playground").PluginFactory

export const workbenchHelpPlugin: Factory = (i, utils) => {
  return {
    id: "help",
    displayName: "Help",
    didMount: (sandbox, container) => {
      const ds = utils.createDesignSystem(container)

      ds.subtitle("Help")
      ds.p("Some text")
    },
  }
}
