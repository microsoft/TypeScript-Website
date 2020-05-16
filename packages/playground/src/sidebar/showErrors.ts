import { PlaygroundPlugin, PluginFactory, Playground } from ".."
import { localize } from "../localizeWithFallback"

export const showErrors: PluginFactory = (i, utils) => {
  const plugin: PlaygroundPlugin = {
    id: "errors",
    displayName: i("play_sidebar_errors"),
    modelChangedDebounce: async (sandbox, model, container) => {
      const ds = utils.createDesignSystem(container)

      sandbox.getWorkerProcess().then(worker => {
        worker.getSemanticDiagnostics(model.uri.toString()).then(diags => {
          // @ts-ignore
          const playground: Playground = window.playground

          // TODO: We should update a badge with the number of labels or something
          if (playground.getCurrentPlugin().id !== "errors") return

          // Bail early if there's nothing to show
          if (!diags.length) {
            ds.showEmptyScreen(localize("play_sidebar_errors_no_errors", "No errors"))
            return
          }

          // Clean any potential empty screens
          ds.clear()
          ds.listDiags(model, diags)
        })
      })
    },
  }

  return plugin
}
