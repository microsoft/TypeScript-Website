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

      ds.subtitle("Assertions Found")

      const queriesAsDiags = results.queries.map(t => {
        let msg = ""
        switch (t.kind) {
          case "query": {
            msg = t.text || "No text found for query"
            break
          }
          case "completions": {
            if (!t.completions) {
              msg = "Could not get completions"
            } else {
              const all = t.completions.map(c => c.name).join(", ")
              // prettier-ignore
              const prefixed = t.completions.filter(c => c.name.startsWith(t.completionsPrefix || "____")).map(c => c.name).join(", ")
              const prefix = t.completionsPrefix?.length
                ? `Filtered Completions: ${prefixed}.\n\n`
                : ""
              msg = `${prefix}All: ${all}.`
            }
          }
        }

        const diag: import("typescript").DiagnosticRelatedInformation = {
          category: 3, // ts.DiagnosticCategory.Message,
          code: 0,
          file: undefined,
          length: t.length,
          messageText: msg || "-",
          start: t.start,
        }
        return diag
      })
      ds.listDiags(sandbox.getModel(), queriesAsDiags)

      const errorsAsDiags = results.errors.map(t => {
        const diag: import("typescript").DiagnosticRelatedInformation = {
          category: 1, // ts.DiagnosticCategory.Message,
          code: t.code,
          file: undefined,
          length: t.length,
          messageText: t.renderedMessage,
          start: t.start,
        }
        return diag
      })

      ds.listDiags(sandbox.getModel(), errorsAsDiags)

      ds.subtitle("TLDR")
      ds.p(
        "You can highlight code which doesn't work as you expect by starting a comment and then adding ^? under the code which is wrong."
      )
    },
  }
}
