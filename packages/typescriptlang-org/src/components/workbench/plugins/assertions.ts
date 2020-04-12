type TwoSlashReturns = import("@typescript/twoslash").TwoSlashReturn

export const workbenchAssertionsPlugin: import("../../../../static/js/playground").PluginFactory = (
  i,
  utils
) => {
  let pluginContainer: HTMLDivElement
  return {
    id: "assertions",
    displayName: "Assertions",
    didMount: (sandbox, container) => {
      pluginContainer = container
    },
    noResults: () => {},
    getResults: (sandbox: any, results: TwoSlashReturns) => {
      const ds = utils.createDesignSystem(pluginContainer)
      ds.clear()

      const queriesAsDiags = results.queries.map(t => {
        const diag: import("typescript").DiagnosticRelatedInformation = {
          category: 3, // ts.DiagnosticCategory.Message,
          code: 0,
          file: undefined,
          length: t.length,
          messageText: t.text,
          start: t.start,
        }
        return diag
      })

      ds.listDiags(sandbox, sandbox.getModel(), queriesAsDiags)
    },
  }
}
