import { Sandbox } from "@typescript/sandbox"

export const createTwoslashInlayProvider = (sandbox: Sandbox) => {
  const provider: import("monaco-editor").languages.InlayHintsProvider = {
    provideInlayHints: async (model, _, cancel) => {
      const text = model.getValue()
      const queryRegex = /^\s*\/\/\s*\^\?$/gm
      let match
      const results: import("monaco-editor").languages.InlayHint[] = []
      const worker = await sandbox.getWorkerProcess()
      if (model.isDisposed()) {
        return {
          hints: [],
          dispose: () => {},
        }
      }

      while ((match = queryRegex.exec(text)) !== null) {
        const end = match.index + match[0].length - 1
        const endPos = model.getPositionAt(end)
        const inspectionPos = new sandbox.monaco.Position(endPos.lineNumber - 1, endPos.column)
        const inspectionOff = model.getOffsetAt(inspectionPos)

        if (cancel.isCancellationRequested) {
          return {
            hints: [],
            dispose: () => {},
          }
        }

        const hint = await worker.getQuickInfoAtPosition("file://" + model.uri.path, inspectionOff)
        if (!hint || !hint.displayParts) continue

        // Make a one-liner
        let text = hint.displayParts.map(d => d.text).join("").replace(/\\n/g, "").replace(/  /g, "")
        if (text.length > 120) text = text.slice(0, 119) + "..."

        const inlay: import("monaco-editor").languages.InlayHint = {
          // @ts-ignore
          kind: 0,
          position: new sandbox.monaco.Position(endPos.lineNumber, endPos.column + 1),
          label: text,
          paddingLeft: true,
        }
        results.push(inlay)
      }
      return {
        hints: results,
        dispose: () => {},
      }
    },
  }
  return provider
}
