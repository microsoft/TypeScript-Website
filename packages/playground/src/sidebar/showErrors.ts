import type { Sandbox } from "typescriptlang-org/static/js/sandbox"
import { PlaygroundPlugin, PluginFactory, Playground } from ".."
import { localize } from "../localizeWithFallback"

export const showErrors: PluginFactory = (i, utils) => {
  let model: import("monaco-editor").editor.ITextModel
  let container: HTMLElement
  let sandbox: Sandbox
  let timer: any

  const updateUI = () => {
    const ds = utils.createDesignSystem(container)
    const markers = sandbox.monaco.editor.getModelMarkers({ resource: model.uri })

    // @ts-ignore
    const playground: Playground = window.playground

    if (!playground) return
    if (playground.getCurrentPlugin().id !== "errors") return

    // Bail early if there's nothing to show
    if (!markers.length) {
      ds.showEmptyScreen(localize("play_sidebar_errors_no_errors", "No errors"))
      return
    }

    // Clean any potential empty screens
    ds.clear()

    ds.listDiags(model, markersToTSDiags(model, markers))
  }

  const plugin: PlaygroundPlugin = {
    id: "errors",
    displayName: i("play_sidebar_errors"),
    didMount: () => {
      updateUI()
      timer = setInterval(() => updateUI(), 500)
    },
    didUnmount: () => {
      clearInterval(timer)
    },
    modelChangedDebounce: async (_sandbox, _model, _container) => {
      sandbox = _sandbox
      container = _container
      model = _model
    },
  }
  return plugin
}

const markersToTSDiags = (
  model: import("monaco-editor").editor.IModel,
  markers: import("monaco-editor").editor.IMarker[]
): import("typescript").DiagnosticRelatedInformation[] => {
  return markers.map(m => {
    const start = model.getOffsetAt({ column: m.startColumn, lineNumber: m.startLineNumber })
    return {
      code: -1,
      category: 1,
      file: undefined,
      start,
      length: model.getCharacterCountInRange(m),
      messageText: m.message,
    }
  })
}
