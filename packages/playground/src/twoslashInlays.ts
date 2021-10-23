import { Sandbox } from "typescriptlang-org/static/js/sandbox"

export const createTwoslashInlayProvider = (sandbox: Sandbox) => {
  const provider: import("monaco-editor").languages.InlayHintsProvider = {
    provideInlayHints: async (model, _, cancel) => {
      const text = model.getValue()
      const queryRegex = /^\s*\/\/\s*\^\?$/gm
      let match
      const results: import("monaco-editor").languages.InlayHint[] = []
      const worker = await sandbox.getWorkerProcess()
      if (model.isDisposed()) {
        return []
      }

      while ((match = queryRegex.exec(text)) !== null) {
        const end = match.index + match[0].length - 1
        const endPos = model.getPositionAt(end)
        const inspectionPos = new sandbox.monaco.Position(endPos.lineNumber - 1, endPos.column)
        const inspectionOff = model.getOffsetAt(inspectionPos)

        if (cancel.isCancellationRequested) return []

        const hint = await worker.getQuickInfoAtPosition("file://" + model.uri.path, inspectionOff)
        if (!hint || !hint.displayParts) continue
        console.log({ hint })

        const inlay: import("monaco-editor").languages.InlayHint = {
          // @ts-ignore
          kind: 0,
          position: new sandbox.monaco.Position(endPos.lineNumber, endPos.column + 1),
          text: hint.displayParts.map(d => d.text).join(""),
          whitespaceBefore: true,
        }
        results.push(inlay)
      }
      return results
    },
  }
  return provider
}

// class InlayHintsAdapter extends Adapter implements import("monaco-editor").editor.languages.InlayHintsProvider {
//   public async provideInlayHints(
//     model: import("monaco-editor").ITextModel,
//     range: Range,
//     token: CancellationToken
//   ): Promise<languages.InlayHint[]> {
//     const resource = model.uri
//     const fileName = resource.toString()
//     const start = model.getOffsetAt({
//       lineNumber: range.startLineNumber,
//       column: range.startColumn,
//     })

//     const end = model.getOffsetAt({
//       lineNumber: range.endLineNumber,
//       column: range.endColumn,
//     })
//     const worker = await this._worker(resource)
//     if (model.isDisposed()) {
//       return []
//     }

//     const hints = await worker.provideInlayHints(fileName, start, end)

//     return hints.map(hint => {
//       return {
//         ...hint,
//         position: model.getPositionAt(hint.position),
//         kind: this._convertHintKind(hint.kind),
//       }
//     })
//   }

//   private _convertHintKind(kind?: ts.InlayHintKind) {
//     switch (kind) {
//       case "Parameter":
//         return languages.InlayHintKind.Parameter
//       case "Type":
//         return languages.InlayHintKind.Type
//       default:
//         return languages.InlayHintKind.Other
//     }
//   }
// }
