import type { IDisposable } from "monaco-editor"
import type { Sandbox } from "@typescript/sandbox"
import { PlaygroundPlugin, PluginFactory, Playground } from ".."
import { localize } from "../localizeWithFallback"

export const showErrors: PluginFactory = (i, utils) => {
  let container: HTMLElement
  let sandbox: Sandbox
  let ds: ReturnType<typeof utils.createDesignSystem>
  let prevMarkers: number[] = []

  const updateUI = () => {
    if (!sandbox) return
    const model = sandbox.getModel()
    const markers = sandbox.monaco.editor.getModelMarkers({ resource: model.uri })

    // Bail early if there's nothing to show
    if (!markers.length) {
      prevMarkers = []
      ds.showEmptyScreen(localize("play_sidebar_errors_no_errors", "No errors"))
      return
    }

    // @ts-ignore
    const playground: Playground = window.playground

    if (!playground) return
    if (playground.getCurrentPlugin().id !== "errors") return

    ds.clearDeltaDecorators(true)

    // The hover can trigger this, so avoid that loop
    const markerIDs = markers.filter(m => m.severity !== 1).map(m => m.startColumn + m.startLineNumber)
    if (markerIDs.length === prevMarkers.length && markerIDs.every((value, index) => value === prevMarkers[index])) return
    prevMarkers = markerIDs

    // Clean any potential empty screens
    ds.clear()
    ds.subtitle("Errors in code")
    ds.listDiags(model, markersToTSDiags(model, markers))
  }

  let changeDecoratorsDispose: IDisposable | undefined

  const plugin: PlaygroundPlugin = {
    id: "errors",
    displayName: i("play_sidebar_errors"),
    didMount: (_sandbox, _container) => {
      sandbox = _sandbox
      container = _container
      ds = utils.createDesignSystem(container)
      changeDecoratorsDispose = sandbox.getModel().onDidChangeDecorations(updateUI)
      prevMarkers = []
      updateUI()
    },
    didUnmount: () => {
      if (changeDecoratorsDispose) changeDecoratorsDispose.dispose()
      if (ds) ds.clearDeltaDecorators(true)
    },
  }
  return plugin
}

const markersToTSDiags = (
  model: import("monaco-editor").editor.IModel,
  markers: import("monaco-editor").editor.IMarker[]
): import("typescript").DiagnosticRelatedInformation[] => {
  return markers
    .map(m => {
      const start = model.getOffsetAt({ column: m.startColumn, lineNumber: m.startLineNumber })
      return {
        code: -1,
        category: markerToDiagSeverity(m.severity),
        file: undefined,
        start,
        length: model.getCharacterCountInRange(m),
        messageText: m.message,
      }
    })
    .sort((lhs, rhs) => lhs.category - rhs.category)
}

/*
export enum MarkerSeverity {
    Hint = 1,
    Info = 2,
    Warning = 4,
    Error = 8
}

to 

export enum DiagnosticCategory {
    Warning = 0,
    Error = 1,
    Suggestion = 2,
    Message = 3
}
  */
const markerToDiagSeverity = (markerSev: number) => {
  switch (markerSev) {
    case 1:
      return 2
    case 2:
      return 3
    case 4:
      return 0
    case 8:
      return 1
    default:
      return 3
  }
}
