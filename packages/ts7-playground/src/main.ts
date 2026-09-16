import * as monaco from "monaco-editor/editor/editor.api"
import "monaco-editor/editor/contrib/find/browser/findController"
import "monaco-editor/editor/contrib/gotoError/browser/gotoError"
import "monaco-editor/editor/contrib/hover/browser/hoverContribution"
import "monaco-editor/editor/contrib/inlayHints/browser/inlayHintsContribution"
import "monaco-editor/editor/contrib/tokenization/browser/tokenization"
import "monaco-editor/languages/definitions/typescript/register"
import "monaco-editor/languages/definitions/javascript/register"
import { API, DiagnosticCategory, type Diagnostic } from "@typescript/typescript/unstable/sync"
import { instantiateWasm, WasmTransport } from "@typescript/typescript-wasip1-wasm"
import "./styles.css"

declare const __TS_VERSION__: string

type CompilerNode = {
  forEachChild<T>(visitor: (node: CompilerNode) => T): T | undefined
  getEnd(): number
  getFullStart(): number
}

type TypeQuery = {
  lineNumber: number
  column: number
  label: string
}

declare global {
  interface Window {
    ts: API & {
      API: typeof API
      DiagnosticCategory: typeof DiagnosticCategory
      version: string
    }
  }
}

;(self as typeof self & {
  MonacoEnvironment: { getWorker(): Worker }
}).MonacoEnvironment = {
  getWorker() {
    return new Worker(new URL("./editor.worker.js", import.meta.url), { type: "module" })
  },
}

const sourceFileName = "/index.ts"
const defaultSource = `type Gopher<T> = {
  value: T
  concurrent: true
}

const result = {
  value: "hello from TS 7.1",
  concurrent: true,
} satisfies Gopher<string>
//    ^?

console.log(result.value)
`

const inputElement = getElement("input-editor")
const outputElement = getElement("output-editor")
const status = getElement("status")

const darkMode = matchMedia("(prefers-color-scheme: dark)").matches
monaco.editor.defineTheme("typescript-playground", {
  base: darkMode ? "vs-dark" : "vs",
  inherit: true,
  rules: [
    { token: "comment", foreground: darkMode ? "7caf3d" : "6c6f2d" },
    { token: "keyword", foreground: darkMode ? "569cd6" : "3757ef" },
    { token: "type", foreground: darkMode ? "4ec9b0" : "1142af" },
  ],
  colors: {
    "editor.background": darkMode ? "#1e1e1e" : "#fafafa",
    "editor.inlayHint.background": darkMode ? "#333333" : "#eeeeee",
    "editor.inlayHint.foreground": darkMode ? "#d4d4d4" : "#333333",
  },
})

const inputModel = monaco.editor.createModel(
  localStorage.getItem("ts7-playground-source") ?? defaultSource,
  "typescript",
  monaco.Uri.file(sourceFileName),
)
const outputModel = monaco.editor.createModel("", "javascript", monaco.Uri.file("/index.js"))
const sharedOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  fontFamily: "Hack, monospace",
  fontLigatures: true,
  fontSize: 14,
  minimap: { enabled: false },
  padding: { top: 10 },
  scrollBeyondLastLine: false,
  tabSize: 2,
  theme: "typescript-playground",
}
const inputEditor = monaco.editor.create(inputElement, {
  ...sharedOptions,
  model: inputModel,
  inlayHints: { enabled: "on" },
})
monaco.editor.create(outputElement, {
  ...sharedOptions,
  model: outputModel,
  readOnly: true,
  renderValidationDecorations: "off",
})

const inlayEmitter = new monaco.Emitter<void>()
let typeQueries: TypeQuery[] = []
monaco.languages.registerInlayHintsProvider("typescript", {
  onDidChangeInlayHints: inlayEmitter.event,
  provideInlayHints() {
    return {
      hints: typeQueries.map(query => ({
        kind: monaco.languages.InlayHintKind.Type,
        position: new monaco.Position(query.lineNumber, query.column),
        label: query.label,
        paddingLeft: true,
      })),
      dispose() {},
    }
  },
})

void initializeCompiler()

async function initializeCompiler() {
  try {
    const [wasmResponse, libFilesResponse] = await Promise.all([
      fetch(new URL("./tsc.wasm", import.meta.url)),
      fetch(new URL("./lib-files.json", import.meta.url)),
    ])
    if (!wasmResponse.ok) {
      throw new Error(`Unable to load tsc.wasm: ${wasmResponse.status} ${wasmResponse.statusText}`)
    }
    if (!libFilesResponse.ok) {
      throw new Error(
        `Unable to load lib-files.json: ${libFilesResponse.status} ${libFilesResponse.statusText}`,
      )
    }

    const [module, libFiles] = await Promise.all([
      WebAssembly.compileStreaming(wasmResponse),
      libFilesResponse.json() as Promise<Record<string, string>>,
    ])
    const instance = await instantiateWasm(module)
    const transport = new WasmTransport({ instance, cwd: "/" })
    const api = new API({ transport })
    for (const [fileName, content] of Object.entries(libFiles)) {
      transport.setFile(fileName, content)
    }
    window.ts = Object.assign(api, {
      API,
      DiagnosticCategory,
      version: __TS_VERSION__,
    })

    let updateTimer = 0
    const update = () => {
      window.clearTimeout(updateTimer)
      updateTimer = window.setTimeout(() => compile(api, transport), 180)
    }

    inputModel.onDidChangeContent(() => {
      localStorage.setItem("ts7-playground-source", inputModel.getValue())
      update()
    })
    compile(api, transport)
    inputEditor.focus()
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    setStatus(message, "error")
    outputModel.setValue(`// Failed to initialize TypeScript 7.1\n// ${message}`)
    console.error(error)
  }
}

function compile(api: API, transport: WasmTransport) {
  const source = inputModel.getValue()
  setStatus("Checking...", "loading")

  try {
    transport.setFile(sourceFileName, source)
    const transpiled = api.transpileModule(source, {
      compilerOptions: {
        module: 99,
        target: 99,
      },
      fileName: sourceFileName,
      reportDiagnostics: true,
    })
    outputModel.setValue(transpiled.outputText)

    const program = api.createProgram(
      [sourceFileName],
      {
        compilerOptions: {
          module: 99,
          strict: true,
          target: 99,
        },
      },
    )

    try {
      const sourceFile = program.getSourceFile(sourceFileName)
      if (!sourceFile) {
        throw new Error(`Compiler did not return ${sourceFileName}`)
      }

      const project = program.getProject()
      const diagnostics = deduplicateDiagnostics([
        ...program.getSyntacticDiagnostics(sourceFileName),
        ...program.getSemanticDiagnostics(sourceFileName),
        ...(transpiled.diagnostics ?? []),
      ])
      setDiagnostics(diagnostics)
      typeQueries = collectTypeQueries(source, sourceFile, project.checker)
      inlayEmitter.fire()
      setStatus(
        diagnostics.length === 0
          ? `${__TS_VERSION__} ready`
          : `${__TS_VERSION__} · ${diagnostics.length} diagnostic${diagnostics.length === 1 ? "" : "s"}`,
        "ready",
      )
    }
    finally {
      program.dispose()
    }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    monaco.editor.setModelMarkers(inputModel, "typescript-7.1", [])
    typeQueries = []
    inlayEmitter.fire()
    setStatus(message, "error")
    console.error(error)
  }
}

function deduplicateDiagnostics(diagnostics: readonly Diagnostic[]) {
  const seen = new Set<string>()
  return diagnostics.filter(diagnostic => {
    const key = [
      diagnostic.fileName,
      diagnostic.pos,
      diagnostic.end,
      diagnostic.code,
      diagnostic.text,
    ].join(":")
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function collectTypeQueries(
  source: string,
  sourceFile: CompilerNode,
  checker: ReturnType<ReturnType<API["createProgram"]>["getProject"]>["checker"],
): TypeQuery[] {
  const queryPattern = /^\s*\/\/\s*\^\?\s*$/gm
  const queries: TypeQuery[] = []
  let match: RegExpExecArray | null

  while ((match = queryPattern.exec(source))) {
    const queryEnd = match.index + match[0].lastIndexOf("?")
    const queryPosition = inputModel.getPositionAt(queryEnd)
    if (queryPosition.lineNumber === 1) continue

    const inspectedPosition = inputModel.getOffsetAt({
      lineNumber: queryPosition.lineNumber - 1,
      column: queryPosition.column,
    })
    const node = findNodeAtPosition(sourceFile, inspectedPosition)
      ?? findNodeAtPosition(sourceFile, Math.max(0, inspectedPosition - 1))
    if (!node) continue

    const type = checker.getTypeAtLocation(node as never)
    const typeText = checker.typeToString(type, node as never).replace(/\r?\n\s*/g, " ")
    queries.push({
      lineNumber: queryPosition.lineNumber,
      column: queryPosition.column + 1,
      label: truncate(`: ${typeText}`, 120),
    })
  }

  return queries
}

function findNodeAtPosition(node: CompilerNode, position: number): CompilerNode | undefined {
  if (position < node.getFullStart() || position > node.getEnd()) return undefined

  let match: CompilerNode | undefined
  node.forEachChild(child => {
    const descendant = findNodeAtPosition(child, position)
    if (descendant) {
      match = descendant
      return true
    }
    return undefined
  })
  return match ?? node
}

function setDiagnostics(diagnostics: readonly Diagnostic[]) {
  monaco.editor.setModelMarkers(
    inputModel,
    "typescript-7.1",
    diagnostics
      .filter(diagnostic => diagnostic.fileName === undefined || diagnostic.fileName === sourceFileName)
      .map(diagnostic => {
        const start = inputModel.getPositionAt(diagnostic.pos)
        const end = inputModel.getPositionAt(Math.max(diagnostic.pos + 1, diagnostic.end))
        return {
          code: `TS${diagnostic.code}`,
          endColumn: end.column,
          endLineNumber: end.lineNumber,
          message: diagnostic.text,
          severity: diagnosticSeverity(diagnostic.category),
          source: diagnostic.source || "TS",
          startColumn: start.column,
          startLineNumber: start.lineNumber,
        }
      }),
  )
}

function diagnosticSeverity(category: number) {
  switch (category) {
    case DiagnosticCategory.Error:
      return monaco.MarkerSeverity.Error
    case DiagnosticCategory.Warning:
      return monaco.MarkerSeverity.Warning
    case DiagnosticCategory.Suggestion:
      return monaco.MarkerSeverity.Hint
    default:
      return monaco.MarkerSeverity.Info
  }
}

function setStatus(message: string, state: "loading" | "ready" | "error") {
  status.textContent = message
  status.dataset.state = state
}

function truncate(value: string, maxLength: number) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`
}

function getElement(id: string) {
  const element = document.getElementById(id)
  if (!element) throw new Error(`Missing #${id}`)
  return element
}
