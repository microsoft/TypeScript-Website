import { API, DiagnosticCategory, type Diagnostic } from "@typescript/typescript/unstable/sync"
import { instantiateWasm, WasmTransport } from "@typescript/typescript-wasip1-wasm"
import LZString from "lz-string"
import { registerConfigSchema } from "./config-schema"
import { monaco, registerPlaygroundLanguages, startTsgoLsp, type TsgoStatus } from "./tsgo-lsp"
import "./styles.css"

declare const __TS_VERSION__: string
declare const __ASSET_CACHE_VERSION__: string
declare const __LOAD_ASSET_SIZES__: {
  libraries: number
  schema: number
  wasm: number
}

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
  language: "javascript" | "json" | "typescript"
  text: string
}

type ProjectState = {
  activeFile?: string
  files: Record<string, string>
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
const entryFileName = `${projectRoot}/src/index.ts`
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
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["./src/**/*"]
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
    path: `${projectRoot}/src/greet.ts`,
    language: "typescript",
    text: `export function greet(name: string) {
  return \`Hello, \${name}!\`
}
`,
  },
]

const inputElement = getElement("input-editor")
const fileList = getElement("file-list")
const newFileButton = getElement<HTMLButtonElement>("new-file-button")
const resetProjectButton = getElement<HTMLButtonElement>("reset-project-button")
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
const loadingProgress = getElement<HTMLProgressElement>("loading-progress")
const loadingDetail = getElement("loading-detail")

let compilerReady = false
let lspReady = false
let lspStatus: TsgoStatus = "mounting files"
let lspServerInfo: string | undefined
let diagnosticCount = 0
let compilerFailure: string | undefined
let lspFailure: string | undefined
let projectFailure: string | undefined
let compilerTransport: WasmTransport | undefined
let emittedFiles = new Map<string, string>()
let emitRenderVersion = 0
const downloadedAssets = new Map<keyof typeof __LOAD_ASSET_SIZES__, number>()
const cachedAssets = new Map<keyof typeof __LOAD_ASSET_SIZES__, boolean>()
const assetCachePrefix = "ts7-playground-assets-"
let assetCachePromise: Promise<Cache | undefined> | undefined

const darkMode = matchMedia("(prefers-color-scheme: dark)").matches
monaco.editor.defineTheme("typescript-playground", {
  base: darkMode ? "vs-dark" : "vs",
  inherit: true,
  rules: [
    { token: "comment", foreground: darkMode ? "7caf3d" : "6c6f2d" },
    { token: "keyword", foreground: darkMode ? "569cd6" : "3757ef" },
    { token: "type", foreground: darkMode ? "4ec9b0" : "1142af" },
    { token: "class", foreground: darkMode ? "4ec9b0" : "267f99" },
    { token: "enum", foreground: darkMode ? "4ec9b0" : "267f99" },
    { token: "interface", foreground: darkMode ? "4ec9b0" : "267f99" },
    { token: "function", foreground: darkMode ? "dcdcaa" : "795e26" },
    { token: "method", foreground: darkMode ? "dcdcaa" : "795e26" },
    { token: "parameter", foreground: darkMode ? "9cdcfe" : "001080" },
    { token: "property", foreground: darkMode ? "9cdcfe" : "001080" },
    { token: "variable", foreground: darkMode ? "9cdcfe" : "001080" },
  ],
  colors: {
    "editor.background": darkMode ? "#1e1e1e" : "#fafafa",
    "editor.inlayHint.background": darkMode ? "#333333" : "#eeeeee",
    "editor.inlayHint.foreground": darkMode ? "#d4d4d4" : "#333333",
  },
})

registerPlaygroundLanguages()
const initialState = loadProjectState()
const initialFiles = {
  ...Object.fromEntries(defaultFiles.map(file => [file.path, file.text])),
  ...initialState.files,
}
const projectModels = new Map(
  Object.entries(initialFiles).map(([fileName, text]) => {
    const model = monaco.editor.createModel(text, languageForFile(fileName), monaco.Uri.parse(`file://${fileName}`))
    return [fileName, model] as const
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
  model: projectModels.get(initialState.activeFile ?? entryFileName) ?? projectModels.get(entryFileName),
  padding: { top: 10 },
  scrollBeyondLastLine: false,
  "semanticHighlighting.enabled": true,
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
inputEditor.onMouseDown(event => {
  if (!event.target.position || (!event.event.ctrlKey && !event.event.metaKey)) {
    return
  }
  const position = event.target.position
  window.setTimeout(() => {
    inputEditor.setPosition(position)
    void inputEditor.getAction("editor.action.revealDefinition")?.run()
  })
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
  registerProjectModel(model)
}
newFileButton.addEventListener("click", createNewFile)
resetProjectButton.addEventListener("click", resetProject)
runButton.addEventListener("click", runProject)
clearRunOutput.addEventListener("click", () => renderRunLogs([]))

void initializeCompiler()

async function initializeCompiler() {
  try {
    setLoadingProgress(0, "Downloading TypeScript...", "Preparing downloads")
    const [wasmBytes, libFilesBytes, configSchemaBytes] = await Promise.all([
      downloadAsset("wasm", new URL("./tsc.wasm", import.meta.url)),
      downloadAsset("libraries", new URL("./lib-files.json", import.meta.url)),
      downloadAsset("schema", new URL("./tsconfig.schema.json", import.meta.url)),
    ])

    setLoadingIndeterminate("Compiling TypeScript...", "")
    const module = await WebAssembly.compile(wasmBytes)
    setLoadingProgress(78, "Starting compiler API...", "Instantiating WebAssembly")
    const libFiles = JSON.parse(new TextDecoder().decode(libFilesBytes)) as Record<string, string>
    const configSchema = JSON.parse(new TextDecoder().decode(configSchemaBytes))
    registerConfigSchema(configSchema)
    const instance = await instantiateWasm(module)
    const transport = new WasmTransport({ instance, cwd: projectRoot })
    compilerTransport = transport
    const api = new API({ transport })
    const libraries = Object.entries(libFiles)
    for (const [index, [fileName, content]] of libraries.entries()) {
      transport.setFile(fileName, content)
      setLoadingProgress(
        82 + ((index + 1) / libraries.length) * 8,
        "Mounting TypeScript libraries...",
        `${index + 1} of ${libraries.length} files`
      )
    }
    window.ts = Object.assign(api, {
      API,
      DiagnosticCategory,
      version: __TS_VERSION__,
    })
    compilerReady = true
    startLanguageServer(module, libFiles)
    compileProject(api)
    inputEditor.focus()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    compilerFailure = message
    renderStatus()
    console.error(error)
  }
}

function startLanguageServer(module: WebAssembly.Module, libraries: Record<string, string>) {
  try {
    startTsgoLsp({
      editor: inputEditor,
      libraries,
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
        const progress = {
          "mounting files": 92,
          "starting tsc.wasm": 95,
          "initializing LSP": 98,
          ready: 100,
        }[nextStatus]
        setLoadingProgress(
          progress,
          nextStatus === "ready" ? "TypeScript is ready" : `Starting language server: ${nextStatus}`,
          nextStatus === "ready" ? lspServerInfo ?? __TS_VERSION__ : ""
        )
        renderStatus()
      },
    })
  } catch (error) {
    lspFailure = error instanceof Error ? error.message : String(error)
    renderStatus()
  }
}

async function downloadAsset(name: keyof typeof __LOAD_ASSET_SIZES__, url: URL): Promise<Uint8Array<ArrayBuffer>> {
  url.searchParams.set("v", __ASSET_CACHE_VERSION__)
  const request = new Request(url)
  const cache = await getAssetCache()
  let response = await cache?.match(request)
  cachedAssets.set(name, response !== undefined)
  let cacheWrite: Promise<void> | undefined
  if (!response) {
    response = await fetch(request)
    if (cache) cacheWrite = cache.put(request, response.clone())
  }
  if (!response.ok) {
    throw new Error(`Unable to load ${url.pathname}: ${response.status} ${response.statusText}`)
  }
  if (!response.body) {
    const bytes = new Uint8Array(await response.arrayBuffer())
    await cacheWrite
    downloadedAssets.set(name, bytes.length)
    updateDownloadProgress()
    return bytes
  }

  const chunks: Uint8Array[] = []
  const reader = response.body.getReader()
  let length = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    length += value.length
    downloadedAssets.set(name, length)
    updateDownloadProgress()
  }

  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  await cacheWrite
  return bytes
}

function getAssetCache() {
  assetCachePromise ??= openAssetCache()
  return assetCachePromise
}

async function openAssetCache() {
  if (!("caches" in globalThis)) return undefined
  const cacheName = `${assetCachePrefix}${__ASSET_CACHE_VERSION__}`
  try {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames
        .filter(name => name.startsWith(assetCachePrefix) && name !== cacheName)
        .map(name => caches.delete(name))
    )
    return caches.open(cacheName)
  } catch (error) {
    console.warn("Could not open the TypeScript asset cache", error)
    return undefined
  }
}

function updateDownloadProgress() {
  const totalBytes = Object.values(__LOAD_ASSET_SIZES__).reduce((total, value) => total + value, 0)
  const downloadedBytes = [...downloadedAssets.values()].reduce((total, value) => total + value, 0)
  const loadingFromNetwork = [...cachedAssets.values()].some(cached => !cached)
  setLoadingProgress(
    Math.min(70, (downloadedBytes / totalBytes) * 70),
    loadingFromNetwork ? "Downloading TypeScript..." : "Loading cached TypeScript...",
    `${formatBytes(downloadedBytes)} of ${formatBytes(totalBytes)}`
  )
}

function setLoadingProgress(value: number, message: string, detail: string) {
  loadingProgress.value = Math.max(loadingProgress.value, value)
  loadingMessage.textContent = message
  loadingDetail.textContent = detail
}

function setLoadingIndeterminate(message: string, detail: string) {
  loadingProgress.removeAttribute("value")
  loadingMessage.textContent = message
  loadingDetail.textContent = detail
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`
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
    const displayText = text.replace(/(?:\r?\n)+$/, "")
    const section = document.createElement("section")
    section.className = "emit-file"
    section.appendChild(createText("h3", relativeProjectPath(fileName)))
    const pre = document.createElement("pre")
    pre.tabIndex = 0
    const code = document.createElement("code")
    code.textContent = displayText
    pre.appendChild(code)
    section.appendChild(pre)
    emitOutput.appendChild(section)

    const language = fileName.endsWith(".js") ? "javascript" : fileName.endsWith(".json") ? "json" : "typescript"
    const highlighted = await monaco.editor.colorize(displayText, language, { tabSize: 2 })
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
  type Tree = {
    directories: Map<string, Tree>
    files: string[]
  }

  const root: Tree = { directories: new Map(), files: [] }
  for (const fileName of [...projectModels.keys()].sort()) {
    const parts = relativeProjectPath(fileName).split("/")
    const basename = parts.pop()!
    let tree = root
    for (const part of parts) {
      let child = tree.directories.get(part)
      if (!child) {
        child = { directories: new Map(), files: [] }
        tree.directories.set(part, child)
      }
      tree = child
    }
    tree.files.push(basename)
  }

  fileButtons.clear()
  fileList.replaceChildren(renderTree(root, ""))
  updateActiveFile()

  function renderTree(tree: Tree, parentPath: string): HTMLUListElement {
    const list = document.createElement("ul")
    list.className = "file-tree"
    for (const [directory, child] of [...tree.directories].sort(([left], [right]) => left.localeCompare(right))) {
      const item = document.createElement("li")
      const details = document.createElement("details")
      details.open = true
      details.appendChild(createText("summary", directory, "file-tree-folder"))
      details.appendChild(renderTree(child, `${parentPath}${directory}/`))
      item.appendChild(details)
      list.appendChild(item)
    }
    for (const basename of tree.files.sort()) {
      const relativePath = `${parentPath}${basename}`
      const fileName = `${projectRoot}/${relativePath}`
      const button = document.createElement("button")
      button.type = "button"
      button.dataset.kind = fileKind(fileName)
      button.textContent = basename
      button.addEventListener("click", () => {
        inputEditor.setModel(projectModels.get(fileName)!)
        inputEditor.focus()
      })
      fileButtons.set(fileName, button)
      const item = document.createElement("li")
      item.appendChild(button)
      list.appendChild(item)
    }
    return list
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
      ? "Type query: align ^? below an expression"
      : model.getLanguageId() === "json"
      ? "Edit compiler options directly"
      : "Read-only library file"
  for (const [fileName, button] of fileButtons) {
    if (fileName === model.uri.path) button.setAttribute("aria-current", "page")
    else button.removeAttribute("aria-current")
  }
  if (projectModel) persistProjectState()
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

function registerProjectModel(model: monaco.editor.ITextModel) {
  model.onDidChangeContent(() => {
    persistProjectState()
    window.clearTimeout(updateTimer)
    updateTimer = window.setTimeout(() => {
      if (window.ts) compileProject(window.ts)
    }, 220)
  })
}

function createNewFile() {
  const requested = prompt("New file path", "src/new-file.ts")
  if (requested === null) return
  const relativePath = requested.trim().replaceAll("\\", "/").replace(/^\/+/, "")
  const parts = relativePath.split("/")
  if (relativePath === "" || parts.some(part => part === "" || part === "." || part === "..")) {
    alert("Enter a file path inside /workspace.")
    return
  }

  const fileName = `${projectRoot}/${relativePath}`
  if (projectModels.has(fileName)) {
    alert(`${relativePath} already exists.`)
    return
  }

  const model = monaco.editor.createModel("", languageForFile(fileName), monaco.Uri.parse(`file://${fileName}`))
  projectModels.set(fileName, model)
  registerProjectModel(model)
  renderFileList()
  inputEditor.setModel(model)
  inputEditor.focus()
  persistProjectState()
  if (window.ts) compileProject(window.ts)
}

function resetProject() {
  if (!confirm("Reset the project to the TypeScript 7 defaults?")) return
  localStorage.removeItem(storageKey)
  const url = new URL(location.href)
  url.hash = ""
  location.replace(url)
}

function loadProjectState(): ProjectState {
  if (location.hash.startsWith("#code/")) {
    const encoded = location.hash.slice("#code/".length)
    const decoded =
      LZString.decompressFromEncodedURIComponent(encoded) ??
      LZString.decompressFromEncodedURIComponent(decodeURIComponent(encoded))
    if (decoded) {
      try {
        return normalizeProjectState(JSON.parse(decoded))
      } catch {
        return {
          activeFile: entryFileName,
          files: { [entryFileName]: decoded },
        }
      }
    }
  }

  const stored = localStorage.getItem(storageKey)
  if (!stored) return { files: {} }
  try {
    return normalizeProjectState(JSON.parse(stored))
  } catch (error) {
    console.warn("Could not restore the TypeScript 7 project", error)
    return { files: {} }
  }
}

function normalizeProjectState(value: unknown): ProjectState {
  if (!value || typeof value !== "object") return { files: {} }
  const candidate = value as { activeFile?: unknown; files?: unknown }
  const filesValue = candidate.files && typeof candidate.files === "object" ? candidate.files : value
  const files = Object.fromEntries(
    Object.entries(filesValue).filter(
      (entry): entry is [string, string] => entry[0].startsWith(`${projectRoot}/`) && typeof entry[1] === "string"
    )
  )
  const migrations = new Map([
    [`${projectRoot}/index.ts`, entryFileName],
    [`${projectRoot}/greet.ts`, `${projectRoot}/src/greet.ts`],
  ])
  const hasLegacyRootFiles = [...migrations.keys()].some(fileName => files[fileName] !== undefined)
  for (const [oldPath, newPath] of migrations) {
    if (files[oldPath] !== undefined && files[newPath] === undefined) {
      files[newPath] = files[oldPath]
    }
    delete files[oldPath]
  }
  if (hasLegacyRootFiles && files[configFileName]) {
    try {
      const config = JSON.parse(files[configFileName])
      if (Array.isArray(config.include) && config.include.length === 1 && config.include[0] === "./*.ts") {
        config.include = ["./src/**/*"]
      }
      config.compilerOptions ??= {}
      config.compilerOptions.declaration ??= true
      files[configFileName] = `${JSON.stringify(config, undefined, 2)}\n`
    } catch {
      files[configFileName] = files[configFileName].replace(
        /"include"\s*:\s*\[\s*"\.\/\*\.ts"\s*\]/,
        '"include": ["./src/**/*"]'
      )
    }
  }
  const requestedActiveFile =
    typeof candidate.activeFile === "string" ? migrations.get(candidate.activeFile) ?? candidate.activeFile : undefined
  return {
    activeFile: requestedActiveFile?.startsWith(`${projectRoot}/`) ? requestedActiveFile : undefined,
    files,
  }
}

function persistProjectState() {
  const activeModel = inputEditor.getModel()
  const state: ProjectState = {
    activeFile: activeModel && projectModels.has(activeModel.uri.path) ? activeModel.uri.path : entryFileName,
    files: Object.fromEntries([...projectModels].map(([fileName, model]) => [fileName, model.getValue()])),
  }
  try {
    const serialized = JSON.stringify(state)
    localStorage.setItem(storageKey, serialized)
    const url = new URL(location.href)
    url.hash = `code/${LZString.compressToEncodedURIComponent(serialized)}`
    history.replaceState({}, "", url)
  } catch (error) {
    console.warn("Could not save the TypeScript 7 project", error)
  }
}

function languageForFile(fileName: string): ProjectFile["language"] {
  if (fileName.endsWith(".json")) return "json"
  if (/\.[cm]?jsx?$/i.test(fileName)) return "javascript"
  return "typescript"
}

function fileKind(fileName: string) {
  const language = languageForFile(fileName)
  return language === "json" ? "{}" : language === "javascript" ? "JS" : "TS"
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
