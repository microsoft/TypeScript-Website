type TwoSlashReturns = import("@typescript/twoslash").TwoSlashReturn

export const workbenchAssertionsPlugin: import("../../../../static/js/playground").PluginFactory = (
  i,
  utils
) => {
  let pluginContainer: HTMLDivElement
  return {
    id: "assertions",
    displayName: "Asserts",
    didMount: (sandbox, container) => {
      pluginContainer = container
    },
    noResults: (sandbox, err) => {
      const ds = utils.createDesignSystem(pluginContainer)
      ds.clear()

      ds.title("Exception Raised")
      ds.p(
        "This could be a successful repro of a crashing compiler bug, or potentially an issue in Twoslash."
      )

      ds.subtitle("Error:")
      if (err.message) ds.p(err.message)
      if (err.stack) ds.code(err.stack)
    },
    getResults: (
      sandbox: any,
      results: TwoSlashReturns,
      _dtsMap: Map<string, string>,
      emitRequested: boolean
    ) => {
      const ds = utils.createDesignSystem(pluginContainer)
      ds.clear()

      const anyOutput =
        results.queries.length > 0 || emitRequested || results.errors.length > 0

      if (!anyOutput) {
        ds.title("No Assertions")
        ds.p(
          "Assuming that this repro is for code which compiles but should not."
        )
      } else {
        ds.title("Assertions Found")
      }

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
          length: 0,
          messageText: msg || "-",
          start: 0,
        }
        return diag
      })
      if (queriesAsDiags.length) {
        ds.subtitle("Queries in Code")
        ds.listDiags(sandbox.getModel(), queriesAsDiags)
      }

      const errorsAsDiags = results.errors.map(t => {
        const diag: import("typescript").DiagnosticRelatedInformation = {
          category: 1, // ts.DiagnosticCategory.Message,
          code: t.code,
          file: undefined,
          length: 0,
          messageText: t.renderedMessage,
          start: 0,
        }
        return diag
      })

      if (errorsAsDiags.length) {
        ds.subtitle("Compiler Errors")
        ds.listDiags(sandbox.getModel(), errorsAsDiags)

        ds.subtitle("If want these errors:")
        ds.code(`// @errors: ${results.errors.map(e => e.code).join(" ")}`)
      }

      if (emitRequested) {
        ds.subtitle("Output")
        ds.code(results.code)
      }
    },
  }
}
