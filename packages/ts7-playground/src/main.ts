import { API, DiagnosticCategory, type Diagnostic } from "@typescript/typescript/unstable/sync"
import { instantiateWasm, WasmTransport } from "@typescript/typescript-wasip1-wasm"
import { monaco, registerPlaygroundLanguages, startTsgoLsp, type TsgoStatus } from "./tsgo-lsp"
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

type ProjectFile = {
  path: string
  language: "json" | "typescript"
  text: string
}

type RuntimeLog = {
  level: "debug" | "error" | "info" | "log" | "warn"
  text: string
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

;(
  self as typeof self & {
    MonacoEnvironment: { getWorker(): Worker }
  }
).MonacoEnvironment = {
  getWorker() {
    return new Worker(new URL("./editor.worker.js", import.meta.url), { type: "module" })
  },
}

const projectRoot = "/workspace"
const configFileName = `${projectRoot}/tsconfig.json`
const entryFileName = `${projectRoot}/index.ts`
const storageKey = "ts7-playground-project"
const defaultFiles: ProjectFile[] = [
  {
    path: configFileName,
    language: "json",
    text: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["./*.ts"]
}
`,
  },
  {
    path: entryFileName,
    language: "typescript",
    text: `import { greet } from "./greet"

const message = greet("TypeScript 7")
//    ^?

console.log(message)
`,
  },
  {
    path: `${projectRoot}/greet.ts`,
    language: "typescript",
    text: `export function greet(name: string) {
  return \`Hello, \${name}!\`
}
`,
  },
]

const inputElement = getElement("input-editor")
const fileList = getElement("file-list")
const currentFile = getElement("current-file")
const editorHint = getElement("editor-hint")
const emitOutput = getElement("emit-output")
const emitSummary = getElement("emit-summary")
const runButton = getElement<HTMLButtonElement>("run-button")
const clearRunOutput = getElement<HTMLButtonElement>("clear-run-output")
const runLog = getElement("run-log")
const status = getElement("status")
const loader = getElement("loader")
const loadingMessage = getElement("loading-message")

let compilerReady = false
let lspReady = false
let lspStatus: TsgoStatus = "loading WebAssembly"
let lspServerInfo: string | undefined
let diagnosticCount = 0
let compilerFailure: string | undefined
let lspFailure: string | undefined
let projectFailure: string | undefined
let compilerTransport: WasmTransport | undefined
let emittedFiles = new Map<string, string>()
let emitRenderVersion = 0

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

registerPlaygroundLanguages()
const storedFiles = loadStoredFiles()
const projectModels = new Map(
  defaultFiles.map(file => {
    const text = storedFiles[file.path] ?? file.text
    const model = monaco.editor.createModel(text, file.language, monaco.Uri.parse(`file://${file.path}`))
    return [file.path, model] as const
  })
)
const fileButtons = new Map<string, HTMLButtonElement>()
const inputEditor = monaco.editor.create(inputElement, {
  automaticLayout: true,
  fontFamily: "Hack, monospace",
  fontLigatures: true,
  fontSize: 14,
  inlayHints: { enabled: "on" },
  minimap: { enabled: false },
  model: projectModels.get(entryFileName),
  padding: { top: 10 },
  scrollBeyondLastLine: false,
  tabSize: 2,
  theme: "typescript-playground",
})

renderFileList()
updateActiveFile()
inputEditor.onDidChangeModel(updateActiveFile)
inputEditor.addAction({
  id: "run-project",
  label: "Run Project",
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
  run: runProject,
})

const inlayEmitter = new monaco.Emitter<void>()
const typeQueries = new Map<string, TypeQuery[]>()
monaco.languages.registerInlayHintsProvider("typescript", {
  onDidChangeInlayHints: inlayEmitter.event,
  provideInlayHints(model) {
    return {
      hints: (typeQueries.get(model.uri.toString()) ?? []).map(query => ({
        kind: monaco.languages.InlayHintKind.Type,
        position: new monaco.Position(query.lineNumber, query.column),
        label: query.label,
        paddingLeft: true,
      })),
      dispose() {},
    }
  },
})

let updateTimer = 0
for (const model of projectModels.values()) {
  model.onDidChangeContent(() => {
    saveProjectFiles()
    window.clearTimeout(updateTimer)
    updateTimer = window.setTimeout(() => {
      if (window.ts) compileProject(window.ts)
    }, 220)
  })
}
runButton.addEventListener("click", runProject)
clearRunOutput.addEventListener("click", () => renderRunLogs([]))

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
      throw new Error(`Unable to load lib-files.json: ${libFilesResponse.status} ${libFilesResponse.statusText}`)
    }

    const [module, libFiles] = await Promise.all([
      WebAssembly.compileStreaming(wasmResponse),
      libFilesResponse.json() as Promise<Record<string, string>>,
    ])
    const instance = await instantiateWasm(module)
    const transport = new WasmTransport({ instance, cwd: projectRoot })
    compilerTransport = transport
    const api = new API({ transport })
    for (const [fileName, content] of Object.entries(libFiles)) {
      transport.setFile(fileName, content)
    }
    window.ts = Object.assign(api, {
      API,
      DiagnosticCategory,
      version: __TS_VERSION__,
    })
    compilerReady = true
    startLanguageServer(module)
    compileProject(api)
    inputEditor.focus()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    compilerFailure = message
    renderStatus()
    console.error(error)
  }
}

function startLanguageServer(module: WebAssembly.Module) {
  try {
    startTsgoLsp({
      editor: inputEditor,
      models: [...projectModels.values()],
      module,
      onError(message) {
        lspFailure = message
        renderStatus()
      },
      onStatus(nextStatus, serverInfo) {
        lspStatus = nextStatus
        lspReady = nextStatus === "ready"
        lspServerInfo = serverInfo ?? lspServerInfo
        renderStatus()
      },
    })
  } catch (error) {
    lspFailure = error instanceof Error ? error.message : String(error)
    renderStatus()
  }
}

function compileProject(api: API) {
  setStatus("Checking project...", "loading")
  runButton.disabled = true

  try {
    const transport = compilerTransport
    if (!transport) throw new Error("The compiler transport is not initialized")
    for (const [fileName, model] of projectModels) {
      transport.setFile(fileName, model.getValue())
    }

    const config = api.readConfigFile(configFileName)
    const parsed = api.parseJsonConfigFileContent(config.config, { configFileName })
    const program = api.createProgram(parsed.fileNames, {
      compilerOptions: parsed.options,
      projectReferences: parsed.projectReferences,
      configFileParsingDiagnostics: parsed.errors,
    })

    try {
      const emit = program.emitToString()
      const diagnostics = deduplicateDiagnostics([
        ...(config.error ? [config.error] : []),
        ...parsed.errors,
        ...program.getSyntacticDiagnostics(),
        ...program.getSemanticDiagnostics(),
        ...program.getConfigFileParsingDiagnostics(),
        ...emit.diagnostics,
      ])
      diagnosticCount = diagnostics.length
      setDiagnostics(diagnostics)

      emittedFiles = new Map([...emit.outputFiles].map(([fileName, output]) => [fileName, output.text]))
      runButton.disabled = ![...emittedFiles.keys()].some(fileName => fileName.endsWith(".js"))
      void renderEmittedFiles()

      typeQueries.clear()
      for (const fileName of parsed.fileNames) {
        const model = projectModels.get(fileName)
        const sourceFile = program.getSourceFile(fileName)
        if (!model || !sourceFile) continue
        typeQueries.set(
          model.uri.toString(),
          collectTypeQueries(model.getValue(), sourceFile, program.getProject().checker, model)
        )
      }
      inlayEmitter.fire()
      projectFailure = undefined
      compilerFailure = undefined
      renderStatus()
    } finally {
      program.dispose()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    diagnosticCount = 0
    emittedFiles = new Map()
    runButton.disabled = true
    setDiagnostics([])
    typeQueries.clear()
    inlayEmitter.fire()
    renderEmitError(message)
    projectFailure = message
    renderStatus()
    console.error(error)
  }
}

function deduplicateDiagnostics(diagnostics: readonly Diagnostic[]) {
  const seen = new Set<string>()
  return diagnostics.filter(diagnostic => {
    const key = [diagnostic.fileName, diagnostic.pos, diagnostic.end, diagnostic.code, diagnostic.text].join(":")
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function collectTypeQueries(
  source: string,
  sourceFile: CompilerNode,
  checker: ReturnType<ReturnType<API["createProgram"]>["getProject"]>["checker"],
  model: monaco.editor.ITextModel
) {
  const queryPattern = /^\s*\/\/\s*\^\?\s*$/gm
  const queries: TypeQuery[] = []
  let match: RegExpExecArray | null

  while ((match = queryPattern.exec(source))) {
    const queryEnd = match.index + match[0].lastIndexOf("?")
    const queryPosition = model.getPositionAt(queryEnd)
    if (queryPosition.lineNumber === 1) continue

    const inspectedPosition = model.getOffsetAt({
      lineNumber: queryPosition.lineNumber - 1,
      column: queryPosition.column,
    })
    const node =
      findNodeAtPosition(sourceFile, inspectedPosition) ??
      findNodeAtPosition(sourceFile, Math.max(0, inspectedPosition - 1))
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
  for (const [fileName, model] of projectModels) {
    const markers = diagnostics
      .filter(diagnostic => diagnostic.fileName === fileName)
      .map(diagnostic => {
        const start = model.getPositionAt(Math.max(0, diagnostic.pos))
        const end = model.getPositionAt(Math.max(diagnostic.pos + 1, diagnostic.end))
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
      })
    monaco.editor.setModelMarkers(model, "typescript-7", markers)
  }
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

async function renderEmittedFiles() {
  const renderVersion = ++emitRenderVersion
  emitOutput.replaceChildren()
  const files = [...emittedFiles].sort(([left], [right]) => left.localeCompare(right))
  emitSummary.textContent =
    files.length === 0 ? "No files emitted" : `${files.length} emitted file${files.length === 1 ? "" : "s"}`

  if (files.length === 0) {
    emitOutput.appendChild(createText("p", "No files emitted.", "empty-message"))
    return
  }

  for (const [fileName, text] of files) {
    const section = document.createElement("section")
    section.className = "emit-file"
    section.appendChild(createText("h3", relativeProjectPath(fileName)))
    const pre = document.createElement("pre")
    pre.tabIndex = 0
    const code = document.createElement("code")
    code.textContent = text
    pre.appendChild(code)
    section.appendChild(pre)
    emitOutput.appendChild(section)

    const language = fileName.endsWith(".js") ? "javascript" : fileName.endsWith(".json") ? "json" : "typescript"
    const highlighted = await monaco.editor.colorize(text, language, { tabSize: 2 })
    if (renderVersion !== emitRenderVersion) return
    code.innerHTML = highlighted
  }
}

function renderEmitError(message: string) {
  emitRenderVersion++
  emitSummary.textContent = "Compile failed"
  emitOutput.replaceChildren(createText("p", message, "empty-message"))
}

function runProject() {
  const logs: RuntimeLog[] = []
  const javascriptFiles = new Map([...emittedFiles].filter(([fileName]) => fileName.endsWith(".js")))
  const entryFile =
    [...javascriptFiles.keys()].find(fileName => fileName.endsWith("/index.js")) ?? javascriptFiles.keys().next().value

  if (!entryFile) {
    renderRunLogs([{ level: "error", text: "No JavaScript entry file was emitted." }])
    return
  }
  if ([...javascriptFiles.values()].some(code => /^\s*(?:export|import)\b/m.test(code))) {
    renderRunLogs([
      {
        level: "error",
        text: 'Run supports CommonJS output. Set compilerOptions.module to "CommonJS" in tsconfig.json.',
      },
    ])
    return
  }

  try {
    executeCommonJs(entryFile, javascriptFiles, createRuntimeConsole(logs))
  } catch (error) {
    logs.push({
      level: "error",
      text: error instanceof Error ? error.stack ?? error.message : String(error),
    })
  }
  renderRunLogs(logs)
  runLog.scrollIntoView({ block: "nearest" })
}

function executeCommonJs(entryFile: string, files: ReadonlyMap<string, string>, runtimeConsole: Console) {
  const cache = new Map<string, { exports: any }>()

  const load = (fileName: string): any => {
    const cached = cache.get(fileName)
    if (cached) return cached.exports
    const code = files.get(fileName)
    if (code === undefined) throw new Error(`Cannot find emitted module ${fileName}`)

    const module = { exports: {} as any }
    cache.set(fileName, module)
    const require = (specifier: string) => {
      if (!specifier.startsWith(".")) {
        throw new Error(`Run cannot load package import "${specifier}".`)
      }
      const resolved = new URL(specifier, `file://${fileName}`).pathname
      const candidates = [resolved, `${resolved}.js`, `${resolved}/index.js`]
      const target = candidates.find(candidate => files.has(candidate))
      if (!target) throw new Error(`Cannot resolve "${specifier}" from ${fileName}`)
      return load(target)
    }
    const directory = fileName.slice(0, fileName.lastIndexOf("/")) || "/"
    const evaluate = new Function("exports", "require", "module", "__filename", "__dirname", "console", code)
    evaluate(module.exports, require, module, fileName, directory, runtimeConsole)
    return module.exports
  }

  load(entryFile)
}

function createRuntimeConsole(logs: RuntimeLog[]) {
  const runtimeConsole = Object.create(console) as Console
  for (const level of ["debug", "error", "info", "log", "warn"] as const) {
    runtimeConsole[level] = (...values: any[]) => {
      logs.push({ level, text: values.map(formatRuntimeValue).join(" ") })
      renderRunLogs(logs)
      console[level](...values)
    }
  }
  runtimeConsole.clear = () => {
    logs.splice(0)
    renderRunLogs(logs)
  }
  return runtimeConsole
}

function formatRuntimeValue(value: unknown): string {
  if (typeof value === "string") return value
  if (typeof value === "bigint") return `${value}n`
  if (typeof value === "symbol") return String(value)
  if (value instanceof Error) return value.stack ?? value.message
  try {
    const json = JSON.stringify(value, undefined, 2)
    return json ?? String(value)
  } catch {
    return String(value)
  }
}

function renderRunLogs(logs: readonly RuntimeLog[]) {
  runLog.replaceChildren()
  if (logs.length === 0) {
    runLog.appendChild(createText("p", "Run the project to see console output.", "empty-message"))
    return
  }
  for (const log of logs) {
    const row = document.createElement("div")
    row.className = `run-log-entry ${log.level}`
    row.appendChild(createText("strong", log.level.slice(0, 3).toUpperCase()))
    row.appendChild(document.createTextNode(log.text))
    runLog.appendChild(row)
  }
}

function renderFileList() {
  for (const file of defaultFiles) {
    const button = document.createElement("button")
    button.type = "button"
    button.dataset.kind = file.language === "json" ? "{}" : "TS"
    button.textContent = relativeProjectPath(file.path)
    button.addEventListener("click", () => {
      inputEditor.setModel(projectModels.get(file.path)!)
      inputEditor.focus()
    })
    fileButtons.set(file.path, button)
    fileList.appendChild(button)
  }
}

function updateActiveFile() {
  const model = inputEditor.getModel()
  if (!model) return
  currentFile.textContent = relativeProjectPath(model.uri.path)
  const projectModel = projectModels.has(model.uri.path)
  inputEditor.updateOptions({ readOnly: !projectModel })
  editorHint.textContent =
    model.getLanguageId() === "typescript"
      ? "Twoslash: align ^? below an expression"
      : model.getLanguageId() === "json"
      ? "Edit compiler options directly"
      : "Read-only library file"
  for (const [fileName, button] of fileButtons) {
    if (fileName === model.uri.path) button.setAttribute("aria-current", "page")
    else button.removeAttribute("aria-current")
  }
}

function renderStatus() {
  const failure = compilerFailure ?? lspFailure
  if (failure) {
    loader.hidden = false
    loader.dataset.state = "error"
    loadingMessage.textContent = failure
    setStatus(failure, "error")
    return
  }
  if (!compilerReady) {
    loadingMessage.textContent = "Downloading TypeScript..."
    setStatus("Loading compiler API...", "loading")
    return
  }
  if (!lspReady) {
    loadingMessage.textContent = `Starting language server: ${lspStatus}`
    setStatus(`LSP: ${lspStatus}`, "loading")
    return
  }

  loader.hidden = true
  loader.dataset.state = "ready"
  if (projectFailure) {
    setStatus(projectFailure, "error")
    inputEditor.layout()
    return
  }
  const compiler = lspServerInfo ?? __TS_VERSION__
  const diagnostics = `${diagnosticCount} diagnostic${diagnosticCount === 1 ? "" : "s"}`
  setStatus(`${compiler} ready · ${diagnostics}`, "ready")
  inputEditor.layout()
}

function setStatus(message: string, state: "loading" | "ready" | "error") {
  status.textContent = message
  status.dataset.state = state
}

function loadStoredFiles(): Record<string, string> {
  const stored = localStorage.getItem(storageKey)
  if (!stored) return {}
  try {
    const parsed = JSON.parse(stored)
    if (!parsed || typeof parsed !== "object") return {}
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string")
    )
  } catch (error) {
    console.warn("Could not restore the TypeScript 7 project", error)
    return {}
  }
}

function saveProjectFiles() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(Object.fromEntries([...projectModels].map(([fileName, model]) => [fileName, model.getValue()])))
    )
  } catch (error) {
    console.warn("Could not save the TypeScript 7 project", error)
  }
}

function relativeProjectPath(fileName: string) {
  return fileName.startsWith(`${projectRoot}/`) ? fileName.slice(projectRoot.length + 1) : fileName
}

function truncate(value: string, maxLength: number) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`
}

function createText<K extends keyof HTMLElementTagNameMap>(tagName: K, text: string, className?: string) {
  const element = document.createElement(tagName)
  element.textContent = text
  if (className) element.className = className
  return element
}

function getElement<T extends HTMLElement = HTMLElement>(id: string) {
  const element = document.getElementById(id)
  if (!element) throw new Error(`Missing #${id}`)
  return element as T
}
