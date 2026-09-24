import { API, DiagnosticCategory, type Diagnostic } from "@typescript/typescript/unstable/sync"
import { instantiateWasm, WasmTransport } from "@typescript/typescript-wasip1-wasm"
import LZString from "lz-string"
import { registerConfigSchema } from "./config-schema"
import { StradaBackend } from "./strada"
import { createTypeAcquisition, hasPackageImports } from "./type-acquisition"
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
  useDefaults?: boolean
}

type PlaygroundExample = {
  code: string
  compilerSettings?: Record<string, boolean | number | string>
  id: string
  name: string
  path: string[]
  title: string
}

type PlaygroundExamples = {
  examples: PlaygroundExample[]
}

type PlaygroundHelp = {
  docs: Array<{ html: string; title: string }>
}

type LayoutState = {
  emitVisible: boolean
  filesVisible: boolean
  filesWidth: number
  outputVisible: boolean
  outputWidth: number
  runVisible: boolean
}

type RuntimeLog = {
  level: "debug" | "error" | "info" | "log" | "warn"
  text: string
}

declare global {
  interface Window {
    ts: any
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
const selectedCompiler = new URLSearchParams(location.search).get("ts")
const useNativeCompiler = isNativeCompilerVersion(selectedCompiler)
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
const workspace = document.querySelector<HTMLElement>(".workspace")!
const fileExplorer = getElement("file-explorer")
const fileList = getElement("file-list")
const fileResizer = getElement("file-resizer")
const outputResizer = getElement("output-resizer")
const compilerVersion = getElement<HTMLSelectElement>("compiler-version")
const newFileButton = getElement<HTMLButtonElement>("new-file-button")
const resetProjectButton = getElement<HTMLButtonElement>("reset-project-button")
const toggleFilesButton = getElement<HTMLButtonElement>("toggle-files-button")
const toggleOutputButton = getElement<HTMLButtonElement>("toggle-output-button")
const toggleEmitButton = getElement<HTMLButtonElement>("toggle-emit-button")
const toggleRunOutputButton = getElement<HTMLButtonElement>("toggle-run-output-button")
const navigateBackButton = getElement<HTMLButtonElement>("navigate-back-button")
const navigateForwardButton = getElement<HTMLButtonElement>("navigate-forward-button")
const currentFile = getElement("current-file")
const editorHint = getElement("editor-hint")
const emitOutput = getElement("emit-output")
const emitSummary = getElement("emit-summary")
const diagnosticsPanel = getElement<HTMLDetailsElement>("diagnostics-panel")
const diagnosticsSummary = getElement("diagnostics-summary")
const diagnosticsList = getElement("diagnostics-list")
const runButton = getElement<HTMLButtonElement>("run-button")
const examplesButton = getElement<HTMLButtonElement>("examples-button")
const helpButton = getElement<HTMLButtonElement>("help-button")
const resourcesDialog = getElement<HTMLDialogElement>("resources-dialog")
const resourcesTitle = getElement("resources-title")
const resourcesCloseButton = getElement<HTMLButtonElement>("resources-close-button")
const examplesView = getElement("examples-view")
const examplesSearch = getElement<HTMLInputElement>("examples-search")
const examplesList = getElement("examples-list")
const helpView = getElement("help-view")
const helpList = getElement("help-list")
const helpDocument = getElement("help-document")
const helpBackButton = getElement<HTMLButtonElement>("help-back-button")
const helpContent = getElement("help-content")
const clearRunOutput = getElement<HTMLButtonElement>("clear-run-output")
const runOutput = getElement("run-output")
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
let stradaBackend: StradaBackend | undefined
let stradaCompilerNamespace: typeof import("typescript") | undefined
let compileActiveProject: (() => Promise<void> | void) | undefined
let emittedFiles = new Map<string, string>()
let emitRenderVersion = 0
let hasShownDiagnostics = false
let typeAcquisitionFailure: string | undefined
let typeAcquisitionCompilerPromise: Promise<typeof import("typescript")> | undefined
let acquireTypes: ((source: string) => Promise<number>) | undefined
let typeAcquisitionQueue = Promise.resolve()
let typeAcquisitionTimer = 0
const acquiredTypeFiles = new Map<string, string>()
let examplesPromise: Promise<PlaygroundExamples> | undefined
let helpPromise: Promise<PlaygroundHelp> | undefined
const downloadedAssets = new Map<keyof typeof __LOAD_ASSET_SIZES__, number>()
const cachedAssets = new Map<keyof typeof __LOAD_ASSET_SIZES__, boolean>()
const assetCachePrefix = "ts7-playground-assets-"
let assetCachePromise: Promise<Cache | undefined> | undefined
const layoutStorageKey = "ts7-playground-layout"

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
const initialFiles =
  initialState.useDefaults === false
    ? { ...initialState.files }
    : {
        ...Object.fromEntries(defaultFiles.map(file => [file.path, file.text])),
        ...initialState.files,
      }
applyLegacyCompilerOptions(initialFiles)
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

type EditorLocation = {
  selection: monaco.Selection
  uri: string
}

const backLocations: EditorLocation[] = []
const forwardLocations: EditorLocation[] = []
let trackedEditorLocation: EditorLocation | undefined
let applyingEditorNavigation = false
const mobileLayout = matchMedia("(max-width: 700px), (max-width: 900px) and (max-height: 600px)")
const layoutState = loadLayoutState()
applyLayoutState()
setupWorkspaceResizer(fileResizer, "files")
setupWorkspaceResizer(outputResizer, "output")
window.addEventListener("resize", applyLayoutState)

renderFileList()
updateActiveFile()
restoreLegacySelection()
trackedEditorLocation = getEditorLocation()
updateNavigationButtons()
inputEditor.onDidChangeModel(() => {
  const nextLocation = getEditorLocation()
  if (
    !applyingEditorNavigation &&
    trackedEditorLocation &&
    nextLocation &&
    trackedEditorLocation.uri !== nextLocation.uri
  ) {
    pushEditorLocation(backLocations, trackedEditorLocation)
    forwardLocations.length = 0
  }
  trackedEditorLocation = nextLocation
  updateActiveFile()
  updateNavigationButtons()
})
inputEditor.onDidChangeCursorSelection(() => {
  trackedEditorLocation = getEditorLocation()
})
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
    if (stradaBackend) {
      const model = inputEditor.getModel()
      if (model) void stradaBackend.goToDefinition(model, position)
    } else {
      void inputEditor.getAction("editor.action.revealDefinition")?.run()
    }
  })
})

function loadLayoutState(): LayoutState {
  const defaults: LayoutState = {
    emitVisible: true,
    filesVisible: true,
    filesWidth: 208,
    outputVisible: true,
    outputWidth: 440,
    runVisible: true,
  }
  try {
    const stored = JSON.parse(localStorage.getItem(layoutStorageKey) ?? "{}")
    return {
      emitVisible: typeof stored.emitVisible === "boolean" ? stored.emitVisible : defaults.emitVisible,
      filesVisible: typeof stored.filesVisible === "boolean" ? stored.filesVisible : defaults.filesVisible,
      filesWidth: typeof stored.filesWidth === "number" ? stored.filesWidth : defaults.filesWidth,
      outputVisible: typeof stored.outputVisible === "boolean" ? stored.outputVisible : defaults.outputVisible,
      outputWidth: typeof stored.outputWidth === "number" ? stored.outputWidth : defaults.outputWidth,
      runVisible: typeof stored.runVisible === "boolean" ? stored.runVisible : defaults.runVisible,
    }
  } catch {
    return defaults
  }
}

function applyLayoutState() {
  if (!matchMedia("(max-width: 1000px)").matches) {
    layoutState.filesWidth = clampPanelWidth("files", layoutState.filesWidth)
    layoutState.outputWidth = clampPanelWidth("output", layoutState.outputWidth)
  }
  workspace.style.setProperty("--files-width", `${layoutState.filesWidth}px`)
  workspace.style.setProperty("--output-width", `${layoutState.outputWidth}px`)
  workspace.dataset.filesCollapsed = String(!layoutState.filesVisible)
  workspace.dataset.outputCollapsed = String(!layoutState.outputVisible)
  emitOutput.hidden = !layoutState.emitVisible
  runOutput.dataset.collapsed = String(!layoutState.runVisible)

  toggleFilesButton.textContent = layoutState.filesVisible ? "Hide files" : "Show files"
  toggleFilesButton.setAttribute("aria-expanded", String(layoutState.filesVisible))
  toggleOutputButton.textContent = layoutState.outputVisible ? "Hide output" : "Show output"
  toggleOutputButton.setAttribute("aria-expanded", String(layoutState.outputVisible))
  toggleEmitButton.textContent = layoutState.emitVisible ? "Hide emit" : "Show emit"
  toggleEmitButton.setAttribute("aria-expanded", String(layoutState.emitVisible))
  toggleRunOutputButton.textContent = layoutState.runVisible ? "Hide run" : "Show run"
  toggleRunOutputButton.setAttribute("aria-expanded", String(layoutState.runVisible))

  fileResizer.setAttribute("aria-valuenow", String(Math.round(layoutState.filesWidth)))
  outputResizer.setAttribute("aria-valuenow", String(Math.round(layoutState.outputWidth)))
  requestAnimationFrame(() => inputEditor.layout())
}

function persistLayoutState() {
  try {
    localStorage.setItem(layoutStorageKey, JSON.stringify(layoutState))
  } catch (error) {
    console.warn("Could not save playground layout", error)
  }
}

function setupWorkspaceResizer(element: HTMLElement, target: "files" | "output") {
  element.addEventListener("pointerdown", event => {
    if (matchMedia("(max-width: 1000px)").matches) return
    event.preventDefault()
    const startX = event.clientX
    const startWidth = target === "files" ? layoutState.filesWidth : layoutState.outputWidth
    element.setPointerCapture(event.pointerId)
    document.body.dataset.resizing = target

    const move = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX
      const width = target === "files" ? startWidth + delta : startWidth - delta
      if (target === "files") layoutState.filesWidth = width
      else layoutState.outputWidth = width
      applyLayoutState()
    }
    const stop = () => {
      element.removeEventListener("pointermove", move)
      element.removeEventListener("pointerup", stop)
      element.removeEventListener("pointercancel", stop)
      delete document.body.dataset.resizing
      persistLayoutState()
    }
    element.addEventListener("pointermove", move)
    element.addEventListener("pointerup", stop)
    element.addEventListener("pointercancel", stop)
  })

  element.addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const direction = event.key === "ArrowRight" ? 1 : -1
    if (target === "files") layoutState.filesWidth += direction * 16
    else layoutState.outputWidth -= direction * 16
    applyLayoutState()
    persistLayoutState()
  })
}

function clampPanelWidth(target: "files" | "output", width: number) {
  const workspaceWidth = workspace.clientWidth || innerWidth
  if (target === "files") {
    const maximum = Math.max(160, workspaceWidth - (layoutState.outputVisible ? layoutState.outputWidth : 0) - 420)
    return Math.min(Math.max(width, 144), Math.min(360, maximum))
  }
  const maximum = Math.max(240, workspaceWidth - (layoutState.filesVisible ? layoutState.filesWidth : 0) - 480)
  return Math.min(Math.max(width, 240), Math.min(640, maximum))
}

const inlayEmitter = new monaco.Emitter<void>()
const typeQueries = new Map<string, TypeQuery[]>()
for (const language of ["javascript", "typescript"]) {
  monaco.languages.registerInlayHintsProvider(language, {
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
}

let updateTimer = 0
for (const model of projectModels.values()) {
  registerProjectModel(model)
}
newFileButton.addEventListener("click", createNewFile)
resetProjectButton.addEventListener("click", resetProject)
toggleFilesButton.addEventListener("click", () => {
  layoutState.filesVisible = !layoutState.filesVisible
  applyLayoutState()
  persistLayoutState()
})
toggleOutputButton.addEventListener("click", () => {
  layoutState.outputVisible = !layoutState.outputVisible
  applyLayoutState()
  persistLayoutState()
})
toggleEmitButton.addEventListener("click", () => {
  layoutState.emitVisible = !layoutState.emitVisible
  applyLayoutState()
  persistLayoutState()
})
toggleRunOutputButton.addEventListener("click", () => {
  layoutState.runVisible = !layoutState.runVisible
  applyLayoutState()
  persistLayoutState()
})
navigateBackButton.addEventListener("click", navigateBack)
navigateForwardButton.addEventListener("click", navigateForward)
runButton.addEventListener("click", runProject)
examplesButton.addEventListener("click", () => void openExamples())
helpButton.addEventListener("click", () => void openHelp())
resourcesCloseButton.addEventListener("click", () => resourcesDialog.close())
examplesSearch.addEventListener("input", () => void renderExamples())
helpBackButton.addEventListener("click", showHelpTopics)
clearRunOutput.addEventListener("click", () => renderRunLogs([]))

void initializeVersionSelector()
void (useNativeCompiler ? initializeNativeCompiler() : initializeStradaCompiler(selectedCompiler!))

async function initializeNativeCompiler() {
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
    await refreshTypeAcquisition(true)
    for (const [fileName, text] of acquiredTypeFiles) {
      transport.setFile(fileName, text)
    }
    compileActiveProject = () => compileNativeProject(api)
    compilerReady = true
    startLanguageServer(module, libFiles)
    compileNativeProject(api)
    inputEditor.focus()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    compilerFailure = message
    renderStatus()
    console.error(error)
  }
}

async function initializeStradaCompiler(requestedVersion: string) {
  try {
    setLoadingIndeterminate("Loading classic TypeScript...", requestedVersion)
    const version = await resolveStradaVersion(requestedVersion)
    const compilerUrl = `https://playgroundcdn.typescriptlang.org/cdn/${version}/typescript/lib/typescript.js`
    const compilerResponse = await fetch(compilerUrl)
    if (!compilerResponse.ok) {
      throw new Error(`Unable to load TypeScript ${version}: ${compilerResponse.status} ${compilerResponse.statusText}`)
    }
    const compilerSource = await compilerResponse.text()
    const classicTS = new Function(`${compilerSource}\nreturn ts;`)()
    stradaCompilerNamespace = classicTS
    window.ts = classicTS
    await refreshTypeAcquisition(true)
    stradaBackend = await StradaBackend.create({
      baseUrl: `https://playgroundcdn.typescriptlang.org/cdn/${version}/typescript/lib/`,
      compilerSource,
      editor: inputEditor,
      files: compilerFileContents,
      models: projectModels,
      onNavigate: navigateToModel,
      version,
    })
    compileActiveProject = compileStradaProject
    compilerReady = true
    lspReady = true
    lspServerInfo = `TypeScript ${version}`
    await compileStradaProject()
    renderStatus()
    inputEditor.focus()
  } catch (error) {
    compilerFailure = error instanceof Error ? error.message : String(error)
    renderStatus()
    console.error(error)
  }
}

function startLanguageServer(module: WebAssembly.Module, libraries: Record<string, string>) {
  try {
    startTsgoLsp({
      editor: inputEditor,
      extraFiles: Object.fromEntries(acquiredTypeFiles),
      libraries,
      models: [...projectModels.values()],
      module,
      onError(message) {
        lspFailure = message
        renderStatus()
      },
      onNavigate: navigateToModel,
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

async function initializeVersionSelector() {
  compilerVersion.disabled = true
  const classicGroup = document.createElement("optgroup")
  classicGroup.label = "Classic TypeScript (Strada)"
  classicGroup.appendChild(new Option("Nightly", "next"))
  try {
    const response = await fetch(new URL("./versions.json", import.meta.url))
    if (!response.ok) throw new Error(`Could not load versions: ${response.status}`)
    const releases = (await response.json()) as { versions: string[] }
    const unsupported = new Set(["3.1.6", "3.0.1", "2.8.1", "2.7.2", "2.4.1"])
    for (const version of releases.versions) {
      if (unsupported.has(version)) continue
      classicGroup.appendChild(new Option(version, version))
    }
    classicGroup.appendChild(new Option("Custom / PR build…", "__custom__"))
    compilerVersion.appendChild(classicGroup)
    if (useNativeCompiler) {
      compilerVersion.value = "native"
    } else {
      const selected = normalizeRequestedVersion(selectedCompiler!)
      if (![...compilerVersion.options].some(option => option.value === selected)) {
        classicGroup.insertBefore(new Option(selectedCompiler!, selected), classicGroup.lastElementChild)
      }
      compilerVersion.value = selected
    }
    compilerVersion.addEventListener("change", () => {
      const url = new URL(location.href)
      if (compilerVersion.value === "native") {
        url.searchParams.delete("ts")
      } else if (compilerVersion.value === "__custom__") {
        const custom = prompt("Classic TypeScript CDN build ID")
        if (!custom) {
          compilerVersion.value = useNativeCompiler ? "native" : normalizeRequestedVersion(selectedCompiler!)
          return
        }
        url.searchParams.set("ts", custom.trim())
      } else {
        url.searchParams.set("ts", compilerVersion.value)
      }
      location.href = url.href
    })
  } catch (error) {
    console.warn("Could not initialize the compiler version selector", error)
  } finally {
    compilerVersion.disabled = false
  }
}

function isNativeCompilerVersion(version: string | null) {
  return (
    version === null ||
    version === "" ||
    version === "native" ||
    version === "7" ||
    version === "7.1" ||
    version === __TS_VERSION__
  )
}

function normalizeRequestedVersion(version: string) {
  return version === "Nightly" ? "next" : version
}

async function resolveStradaVersion(requestedVersion: string) {
  const normalized = normalizeRequestedVersion(requestedVersion)
  if (normalized !== "next" && normalized !== "latest") return normalized
  const index = normalized === "next" ? "next.json" : "releases.json"
  const response = await fetch(`https://playgroundcdn.typescriptlang.org/indexes/${index}`, { cache: "no-cache" })
  if (!response.ok) {
    throw new Error(`Could not resolve TypeScript ${requestedVersion}: ${response.status}`)
  }
  const result = await response.json()
  return normalized === "next"
    ? (result.version as string)
    : [...(result.versions as string[])].sort(compareVersions).at(-1)!
}

function compareVersions(left: string, right: string) {
  const leftParts = left.split(/[.-]/).map(part => Number(part) || 0)
  const rightParts = right.split(/[.-]/).map(part => Number(part) || 0)
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index++) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0)
    if (difference !== 0) return difference
  }
  return 0
}

async function openExamples() {
  resourcesTitle.textContent = "Examples"
  examplesView.hidden = false
  helpView.hidden = true
  resourcesDialog.showModal()
  await renderExamples()
  examplesSearch.focus()
}

async function renderExamples() {
  try {
    const examples = await getExamples()
    const query = examplesSearch.value.trim().toLowerCase()
    const filtered = examples.examples
      .filter(example => {
        const searchText = `${example.title} ${example.path.join(" ")}`.toLowerCase()
        return query === "" || searchText.includes(query)
      })
      .sort(
        (left, right) =>
          left.path.join("/").localeCompare(right.path.join("/")) || left.title.localeCompare(right.title)
      )
    examplesList.replaceChildren()
    if (filtered.length === 0) {
      examplesList.appendChild(createText("p", "No matching examples.", "empty-message"))
      return
    }
    for (const example of filtered) {
      const button = document.createElement("button")
      button.type = "button"
      button.appendChild(createText("strong", example.title))
      button.appendChild(createText("small", example.path.join(" / ")))
      button.addEventListener("click", () => loadExample(example))
      examplesList.appendChild(button)
    }
  } catch (error) {
    examplesList.replaceChildren(
      createText("p", error instanceof Error ? error.message : String(error), "resource-error")
    )
  }
}

async function openHelp() {
  resourcesTitle.textContent = "Playground help"
  examplesView.hidden = true
  helpView.hidden = false
  resourcesDialog.showModal()
  showHelpTopics()
  try {
    const help = await getHelp()
    helpList.replaceChildren()
    for (const topic of help.docs) {
      const button = document.createElement("button")
      button.type = "button"
      button.appendChild(createText("strong", topic.title))
      button.addEventListener("click", () => showHelpDocument(topic))
      helpList.appendChild(button)
    }
  } catch (error) {
    helpList.replaceChildren(createText("p", error instanceof Error ? error.message : String(error), "resource-error"))
  }
}

function showHelpTopics() {
  resourcesTitle.textContent = "Playground help"
  helpList.hidden = false
  helpDocument.hidden = true
  helpContent.replaceChildren()
}

function showHelpDocument(topic: PlaygroundHelp["docs"][number]) {
  helpList.hidden = true
  helpDocument.hidden = false
  resourcesTitle.textContent = topic.title
  helpContent.innerHTML = topic.html
}

function loadExample(example: PlaygroundExample) {
  if (!confirm(`Replace the current project with “${example.title}”?`)) return
  const settings = example.compilerSettings ?? {}
  const fileType = exampleFileType(example, settings)
  const state = createLegacyProjectState(example.code, fileType)
  const config = JSON.parse(state.files[configFileName] ?? defaultFiles[0].text)
  config.compilerOptions ??= {}
  for (const [originalKey, value] of Object.entries(settings)) {
    if (originalKey === "ts" || originalKey === "useJavaScript" || originalKey === "filetype") continue
    const key = originalKey === "checkJS" ? "checkJs" : originalKey
    config.compilerOptions[key] = parseLegacyCompilerOption(key, String(value))
  }
  if (fileType === "js" || fileType === "jsx") {
    config.compilerOptions.allowJs = true
    config.compilerOptions.checkJs ??= true
  }
  state.files[configFileName] = `${JSON.stringify(config, undefined, 2)}\n`

  const serialized = JSON.stringify(state)
  localStorage.setItem(storageKey, serialized)
  const url = new URL(location.pathname, location.origin)
  const requestedVersion = typeof settings.ts === "string" ? settings.ts : selectedCompiler
  if (requestedVersion && !isNativeCompilerVersion(requestedVersion)) {
    url.searchParams.set("ts", requestedVersion)
  }
  url.hash = `code/${LZString.compressToEncodedURIComponent(serialized)}`
  history.replaceState({}, "", url)
  location.reload()
}

function exampleFileType(example: PlaygroundExample, settings: PlaygroundExample["compilerSettings"]) {
  if (settings?.useJavaScript === true) return example.name.endsWith("x") ? "jsx" : "js"
  const match = /(\.d\.[cm]?ts|\.d\.ts|\.tsx|\.ts|\.jsx|\.js)$/i.exec(example.name)
  return match?.[1].replace(/^\./, "") ?? "ts"
}

function getExamples() {
  examplesPromise ??= fetch(new URL("./examples.json", import.meta.url)).then(async response => {
    if (!response.ok) throw new Error(`Could not load examples: ${response.status} ${response.statusText}`)
    return response.json() as Promise<PlaygroundExamples>
  })
  return examplesPromise
}

function getHelp() {
  helpPromise ??= fetch(new URL("./help.json", import.meta.url)).then(async response => {
    if (!response.ok) throw new Error(`Could not load help: ${response.status} ${response.statusText}`)
    return response.json() as Promise<PlaygroundHelp>
  })
  return helpPromise
}

function projectFileContents() {
  return Object.fromEntries([...projectModels].map(([fileName, model]) => [fileName, model.getValue()]))
}

function compilerFileContents() {
  return {
    ...Object.fromEntries(acquiredTypeFiles),
    ...projectFileContents(),
  }
}

function scheduleTypeAcquisition() {
  window.clearTimeout(typeAcquisitionTimer)
  typeAcquisitionTimer = window.setTimeout(() => {
    typeAcquisitionQueue = typeAcquisitionQueue.then(() => refreshTypeAcquisition(false))
  }, 900)
}

async function refreshTypeAcquisition(initial: boolean) {
  const source = [...projectModels.values()]
    .filter(model => model.getLanguageId() === "javascript" || model.getLanguageId() === "typescript")
    .map(model => model.getValue())
    .join("\n")
  if (!hasPackageImports(source)) {
    typeAcquisitionFailure = undefined
    if (compilerReady) renderStatus()
    return
  }

  try {
    if (!acquireTypes) {
      const typescript = stradaCompilerNamespace ?? (await getTypeAcquisitionCompiler())
      acquireTypes = createTypeAcquisition({
        onFile(fileName, text) {
          acquiredTypeFiles.set(fileName, text)
          compilerTransport?.setFile(fileName, text)
        },
        onProgress(downloaded, total) {
          const detail = `${downloaded} of ${total} declaration files`
          if (compilerReady) setStatus(`Loading package types · ${detail}`, "loading")
          else setLoadingIndeterminate("Loading package types...", detail)
        },
        onStart() {
          if (compilerReady) setStatus("Loading package types...", "loading")
          else setLoadingIndeterminate("Loading package types...", "Resolving npm imports")
        },
        typescript,
      })
    }

    const addedFiles = await acquireTypes(source)
    typeAcquisitionFailure = undefined
    if (addedFiles > 0 && useNativeCompiler && lspReady && !initial) {
      persistProjectState()
      location.reload()
      return
    }
    if (addedFiles > 0 && stradaBackend) {
      await compileStradaProject()
    }
    renderStatus()
  } catch (error) {
    typeAcquisitionFailure = error instanceof Error ? error.message : String(error)
    console.error("Could not acquire package types", error)
    renderStatus()
  }
}

async function getTypeAcquisitionCompiler() {
  typeAcquisitionCompilerPromise ??= (async () => {
    const version = await resolveStradaVersion("latest")
    const url = `https://playgroundcdn.typescriptlang.org/cdn/${version}/typescript/lib/typescript.js`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Could not load TypeScript for package type acquisition: ${response.status}`)
    }
    const source = await response.text()
    return new Function(`${source}\nreturn ts;`)() as typeof import("typescript")
  })()
  return typeAcquisitionCompilerPromise
}

function navigateToModel(fileName: string, range?: monaco.IRange) {
  const model = monaco.editor.getModel(monaco.Uri.file(fileName))
  if (!model) return
  if (inputEditor.getModel() === model && !range) {
    inputEditor.focus()
    return
  }
  const currentLocation = getEditorLocation()
  if (currentLocation) {
    pushEditorLocation(backLocations, currentLocation)
    forwardLocations.length = 0
  }
  applyingEditorNavigation = true
  try {
    inputEditor.setModel(model)
    if (range) {
      inputEditor.setSelection(range)
      inputEditor.revealRangeInCenter(range, monaco.editor.ScrollType.Immediate)
    }
  } finally {
    applyingEditorNavigation = false
  }
  trackedEditorLocation = getEditorLocation()
  updateNavigationButtons()
  inputEditor.focus()
}

function getEditorLocation(): EditorLocation | undefined {
  const model = inputEditor.getModel()
  const selection = inputEditor.getSelection()
  return model && selection ? { selection, uri: model.uri.toString() } : undefined
}

function pushEditorLocation(stack: EditorLocation[], location: EditorLocation) {
  const previous = stack.at(-1)
  if (previous?.uri === location.uri && sameSelection(previous.selection, location.selection)) return
  stack.push(location)
}

function sameSelection(left: monaco.Selection, right: monaco.Selection) {
  return (
    left.selectionStartLineNumber === right.selectionStartLineNumber &&
    left.selectionStartColumn === right.selectionStartColumn &&
    left.positionLineNumber === right.positionLineNumber &&
    left.positionColumn === right.positionColumn
  )
}

function updateNavigationButtons() {
  navigateBackButton.disabled = backLocations.length === 0
  navigateForwardButton.disabled = forwardLocations.length === 0
}

function navigateBack() {
  navigateThroughHistory(backLocations, forwardLocations)
}

function navigateForward() {
  navigateThroughHistory(forwardLocations, backLocations)
}

function navigateThroughHistory(source: EditorLocation[], destination: EditorLocation[]) {
  let target: EditorLocation | undefined
  while ((target = source.pop())) {
    if (monaco.editor.getModel(monaco.Uri.parse(target.uri))) break
  }
  if (!target) {
    updateNavigationButtons()
    return
  }
  const current = getEditorLocation()
  if (current) pushEditorLocation(destination, current)
  applyEditorLocation(target)
}

function applyEditorLocation(location: EditorLocation) {
  const model = monaco.editor.getModel(monaco.Uri.parse(location.uri))
  if (!model) return
  applyingEditorNavigation = true
  try {
    inputEditor.setModel(model)
    inputEditor.setSelection(location.selection)
    inputEditor.revealRangeInCenter(location.selection, monaco.editor.ScrollType.Immediate)
  } finally {
    applyingEditorNavigation = false
  }
  trackedEditorLocation = getEditorLocation()
  updateNavigationButtons()
  inputEditor.focus()
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

function compileNativeProject(api: API) {
  setStatus("Checking project...", "loading")
  runButton.disabled = true

  try {
    const transport = compilerTransport
    if (!transport) throw new Error("The compiler transport is not initialized")
    for (const [fileName, text] of Object.entries(compilerFileContents())) {
      transport.setFile(fileName, text)
    }

    const config = api.readConfigFile(configFileName)
    const parsed = api.parseJsonConfigFileContent(config.config, { configFileName })
    const program = api.createProgram(parsed.fileNames, parsed.options, {
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
      collectProgramTypeQueries(program, parsed.fileNames)

      const configuredFiles = new Set(parsed.fileNames)
      const orphanSourceFiles = [...projectModels]
        .filter(
          ([fileName, model]) =>
            !configuredFiles.has(fileName) &&
            (model.getLanguageId() === "javascript" || model.getLanguageId() === "typescript")
        )
        .map(([fileName]) => fileName)
      if (orphanSourceFiles.length > 0) {
        const inferredProgram = api.createProgram(orphanSourceFiles, {
          ...parsed.options,
          allowJs: true,
        })
        try {
          collectProgramTypeQueries(inferredProgram, orphanSourceFiles)
        } finally {
          inferredProgram.dispose()
        }
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

let stradaCompileVersion = 0

async function compileStradaProject() {
  const backend = stradaBackend
  if (!backend) return
  const compileVersion = ++stradaCompileVersion
  setStatus("Checking project...", "loading")
  runButton.disabled = true
  try {
    const result = await backend.compile()
    if (compileVersion !== stradaCompileVersion) return
    diagnosticCount = result.diagnostics.length
    setDiagnostics(result.diagnostics as Diagnostic[])
    emittedFiles = new Map(Object.entries(result.outputFiles))
    runButton.disabled = ![...emittedFiles.keys()].some(fileName => fileName.endsWith(".js"))
    void renderEmittedFiles()

    typeQueries.clear()
    await Promise.all(
      [...projectModels.values()]
        .filter(model => model.getLanguageId() === "javascript" || model.getLanguageId() === "typescript")
        .map(model => collectStradaTypeQueries(backend, model))
    )
    if (compileVersion !== stradaCompileVersion) return
    inlayEmitter.fire()
    projectFailure = undefined
    compilerFailure = undefined
    renderStatus()
  } catch (error) {
    if (compileVersion !== stradaCompileVersion) return
    diagnosticCount = 0
    emittedFiles = new Map()
    runButton.disabled = true
    setDiagnostics([])
    typeQueries.clear()
    inlayEmitter.fire()
    const message = error instanceof Error ? error.message : String(error)
    renderEmitError(message)
    projectFailure = message
    renderStatus()
    console.error(error)
  }
}

async function collectStradaTypeQueries(backend: StradaBackend, model: monaco.editor.ITextModel) {
  const source = model.getValue()
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
    const info =
      (await backend.quickInfo(model.uri.path, inspectedPosition)) ??
      (await backend.quickInfo(model.uri.path, Math.max(0, inspectedPosition - 1)))
    if (!info?.displayParts) continue
    const text = info.displayParts
      .map((part: { text: string }) => part.text)
      .join("")
      .replace(/\r?\n\s*/g, " ")
    queries.push({
      lineNumber: queryPosition.lineNumber,
      column: queryPosition.column + 1,
      label: truncate(`: ${text}`, 120),
    })
  }
  typeQueries.set(model.uri.toString(), queries)
}

function collectProgramTypeQueries(program: ReturnType<API["createProgram"]>, fileNames: readonly string[]) {
  const checker = program.getProject().checker
  for (const fileName of fileNames) {
    const model = projectModels.get(fileName)
    const sourceFile = program.getSourceFile(fileName)
    if (!model || !sourceFile) continue
    typeQueries.set(model.uri.toString(), collectTypeQueries(model.getValue(), sourceFile, checker, model))
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
  renderDiagnostics(diagnostics)
}

function renderDiagnostics(diagnostics: readonly Diagnostic[]) {
  const sorted = [...diagnostics].sort(
    (left, right) =>
      diagnosticSortOrder(left.category) - diagnosticSortOrder(right.category) ||
      (left.fileName ?? "").localeCompare(right.fileName ?? "") ||
      left.pos - right.pos ||
      left.code - right.code
  )
  diagnosticsSummary.textContent = String(sorted.length)
  diagnosticsList.replaceChildren()
  diagnosticsPanel.dataset.empty = String(sorted.length === 0)
  if (sorted.length === 0) {
    diagnosticsList.appendChild(createText("p", "No problems found.", "empty-message"))
    return
  }
  if (!hasShownDiagnostics) {
    diagnosticsPanel.open = true
    hasShownDiagnostics = true
  }

  for (const diagnostic of sorted) {
    const fileName =
      diagnostic.fileName && projectModels.has(diagnostic.fileName) ? diagnostic.fileName : configFileName
    const model = projectModels.get(fileName)
    const start = model?.getPositionAt(Math.max(0, diagnostic.pos)) ?? new monaco.Position(1, 1)
    const end =
      model?.getPositionAt(Math.max(diagnostic.pos + 1, diagnostic.end)) ??
      new monaco.Position(start.lineNumber, start.column + 1)
    const button = document.createElement("button")
    button.type = "button"
    button.className = `diagnostic diagnostic-${diagnosticCategoryName(diagnostic.category)}`
    button.appendChild(createText("strong", `TS${diagnostic.code}`))
    button.appendChild(createText("span", diagnostic.text, "diagnostic-message"))
    button.appendChild(
      createText("small", `${relativeProjectPath(fileName)}:${start.lineNumber}:${start.column}`, "diagnostic-location")
    )
    button.addEventListener("click", () => {
      navigateToModel(fileName, new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column))
    })
    diagnosticsList.appendChild(button)
  }
}

function diagnosticSortOrder(category: number) {
  switch (category) {
    case DiagnosticCategory.Error:
      return 0
    case DiagnosticCategory.Warning:
      return 1
    case DiagnosticCategory.Suggestion:
      return 2
    default:
      return 3
  }
}

function diagnosticCategoryName(category: number) {
  switch (category) {
    case DiagnosticCategory.Error:
      return "error"
    case DiagnosticCategory.Warning:
      return "warning"
    case DiagnosticCategory.Suggestion:
      return "suggestion"
    default:
      return "message"
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
      button.className = "file-tree-file-button"
      button.dataset.kind = fileKind(fileName)
      button.textContent = basename
      button.addEventListener("click", () => {
        navigateToModel(fileName)
        if (mobileLayout.matches) {
          layoutState.filesVisible = false
          applyLayoutState()
          persistLayoutState()
        }
      })
      fileButtons.set(fileName, button)
      const deleteButton = document.createElement("button")
      deleteButton.type = "button"
      deleteButton.className = "file-tree-delete"
      deleteButton.textContent = "×"
      deleteButton.title = `Delete ${relativePath}`
      deleteButton.setAttribute("aria-label", `Delete ${relativePath}`)
      deleteButton.addEventListener("click", () => deleteProjectFile(fileName))
      const item = document.createElement("li")
      item.className = "file-tree-file"
      item.appendChild(button)
      item.appendChild(deleteButton)
      list.appendChild(item)
    }
    return list
  }
}

function updateActiveFile() {
  const model = inputEditor.getModel()
  if (!model) return
  const projectModel = projectModels.has(model.uri.path)
  currentFile.textContent = projectModel
    ? relativeProjectPath(model.uri.path)
    : model.uri.path.startsWith("/typescript/lib/")
    ? `${model.uri.path.slice(model.uri.path.lastIndexOf("/") + 1)} (bundled)`
    : model.uri.path
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

function restoreLegacySelection() {
  const params = new URLSearchParams(location.search)
  const values = ["ssl", "ssc", "pln", "pc"].map(key => Number(params.get(key)))
  if (values.some(value => !Number.isInteger(value) || value <= 0)) return
  inputEditor.setSelection(new monaco.Selection(values[0], values[1], values[2], values[3]))
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
  setStatus(
    `${compiler} ready · ${diagnostics}${typeAcquisitionFailure ? ` · package types: ${typeAcquisitionFailure}` : ""}`,
    typeAcquisitionFailure ? "error" : "ready"
  )
  inputEditor.layout()
}

function setStatus(message: string, state: "loading" | "ready" | "error") {
  status.textContent = message
  status.dataset.state = state
}

function registerProjectModel(model: monaco.editor.ITextModel) {
  model.onDidChangeContent(() => {
    persistProjectState()
    scheduleTypeAcquisition()
    window.clearTimeout(updateTimer)
    updateTimer = window.setTimeout(() => {
      void compileActiveProject?.()
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
  void compileActiveProject?.()
}

function deleteProjectFile(fileName: string) {
  const model = projectModels.get(fileName)
  if (!model) return
  if (projectModels.size === 1) {
    alert("The project must contain at least one file.")
    return
  }

  const relativePath = relativeProjectPath(fileName)
  if (!confirm(`Delete ${relativePath}? This cannot be undone.`)) return

  const deletedUri = model.uri.toString()
  projectModels.delete(fileName)
  if (inputEditor.getModel() === model) {
    const remainingFiles = [...projectModels.keys()]
    const fallbackFile =
      remainingFiles.find(candidate => candidate === entryFileName) ??
      remainingFiles.find(candidate => /\.[cm]?[jt]sx?$/i.test(candidate)) ??
      remainingFiles[0]
    applyingEditorNavigation = true
    try {
      inputEditor.setModel(projectModels.get(fallbackFile)!)
    } finally {
      applyingEditorNavigation = false
    }
  }
  model.dispose()
  removeLocationsForUri(backLocations, deletedUri)
  removeLocationsForUri(forwardLocations, deletedUri)
  trackedEditorLocation = getEditorLocation()
  renderFileList()
  persistProjectState()
  location.reload()
}

function removeLocationsForUri(locations: EditorLocation[], uri: string) {
  for (let index = locations.length - 1; index >= 0; index--) {
    if (locations[index].uri === uri) locations.splice(index, 1)
  }
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
        return createLegacyProjectState(decoded)
      }
    }
  }

  const stored = localStorage.getItem(storageKey)
  if (!stored) return { files: {}, useDefaults: true }
  try {
    return normalizeProjectState(JSON.parse(stored))
  } catch (error) {
    console.warn("Could not restore the TypeScript 7 project", error)
    return { files: {}, useDefaults: true }
  }
}

function normalizeProjectState(value: unknown): ProjectState {
  if (!value || typeof value !== "object") return { files: {}, useDefaults: true }
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
    useDefaults: false,
  }
}

function createLegacyProjectState(code: string, fileType = getLegacyFileType()): ProjectState {
  if (!code.includes("// @filename: ")) {
    const fileName = `${projectRoot}/src/index.${fileType}`
    return {
      activeFile: fileName,
      files: {
        [configFileName]: defaultFiles[0].text,
        [fileName]: code,
      },
      useDefaults: false,
    }
  }

  const files: Record<string, string> = {
    [configFileName]: defaultFiles[0].text,
  }
  let currentFile = `src/index.${fileType}`
  let currentLines: string[] = []
  const flush = () => {
    if (currentLines.length === 0) return
    const fileName = `${projectRoot}/${sanitizeLegacyPath(currentFile)}`
    files[fileName] = currentLines.join("\n")
  }
  for (const line of code.split(/\r\n?|\n/g)) {
    const match = /^\s*\/\/\s*@filename:\s*(.+)$/.exec(line)
    if (match) {
      flush()
      currentFile = match[1].trim()
      currentLines = []
    } else {
      currentLines.push(line)
    }
  }
  flush()
  const sourceFiles = Object.keys(files).filter(fileName => fileName !== configFileName)
  return {
    activeFile: sourceFiles[0] ?? entryFileName,
    files,
    useDefaults: false,
  }
}

function sanitizeLegacyPath(fileName: string) {
  const parts = fileName.replaceAll("\\", "/").replace(/^\/+/, "").split("/")
  return parts.filter(part => part !== "" && part !== "." && part !== "..").join("/")
}

function getLegacyFileType() {
  const params = new URLSearchParams(location.search)
  if (params.has("useJavaScript")) return "js"
  const fileType = params.get("filetype")
  return fileType && /^[cm]?[jt]sx?$/.test(fileType) ? fileType : "ts"
}

function applyLegacyCompilerOptions(files: Record<string, string>) {
  const params = new URLSearchParams(location.search)
  const reserved = new Set(["example", "filetype", "pc", "pln", "ssc", "ssl", "ts", "useJavaScript"])
  let config: any
  try {
    config = JSON.parse(files[configFileName] ?? defaultFiles[0].text)
  } catch {
    config = JSON.parse(defaultFiles[0].text)
  }
  config.compilerOptions ??= {}
  for (const [key, rawValue] of params) {
    if (reserved.has(key)) continue
    const value = parseLegacyCompilerOption(key, rawValue)
    if (value !== undefined) config.compilerOptions[key] = value
  }
  if (params.has("useJavaScript") || params.get("filetype")?.startsWith("js")) {
    config.compilerOptions.allowJs = true
    config.compilerOptions.checkJs = true
  }
  files[configFileName] = `${JSON.stringify(config, undefined, 2)}\n`
}

function parseLegacyCompilerOption(key: string, rawValue: string) {
  if (rawValue === "true") return true
  if (rawValue === "false") return false
  const number = Number(rawValue)
  if (!Number.isFinite(number)) return rawValue
  const enumMaps: Record<string, Record<number, string>> = {
    jsx: {
      0: "preserve",
      1: "react",
      2: "react-native",
      3: "react-jsx",
      4: "react-jsxdev",
    },
    module: {
      0: "none",
      1: "commonjs",
      2: "amd",
      3: "umd",
      4: "system",
      5: "es2015",
      6: "es2020",
      7: "es2022",
      99: "esnext",
      100: "node16",
      199: "nodenext",
      200: "preserve",
    },
    moduleResolution: {
      1: "classic",
      2: "node",
      3: "node16",
      99: "nodenext",
      100: "bundler",
    },
    newLine: {
      0: "crlf",
      1: "lf",
    },
    target: {
      0: "es3",
      1: "es5",
      2: "es2015",
      3: "es2016",
      4: "es2017",
      5: "es2018",
      6: "es2019",
      7: "es2020",
      8: "es2021",
      9: "es2022",
      10: "es2023",
      11: "es2024",
      12: "es2025",
      99: "esnext",
    },
  }
  return enumMaps[key]?.[number] ?? number
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
