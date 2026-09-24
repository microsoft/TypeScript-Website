import { API, DiagnosticCategory, type Diagnostic } from "@typescript/typescript/unstable/sync"
import { instantiateWasm, WasmTransport } from "@typescript/typescript-wasip1-wasm"
import "monaco-editor/editor/contrib/links/browser/links.js"
import LZString from "lz-string"
import examplesCatalog from "../vendor/examples.json"
import {
  compilerOptionsNode,
  computeCompilerOverrides,
  configOptionNode,
  setCompilerOption,
  type CompilerOverride,
  type CompilerOverrideState,
} from "./compiler-overrides"
import { registerConfigSchema } from "./config-schema"
import { StradaBackend } from "./strada"
import { createTypeAcquisition, hasPackageImports } from "./type-acquisition"
import { monaco, registerPlaygroundLanguages, startTsgoLsp, type TsgoLspController, type TsgoStatus } from "./tsgo-lsp"
import "./styles.css"

declare const __TS_VERSION__: string
declare const __ASSET_CACHE_VERSION__: string
declare const __LOAD_ASSET_SIZES__: {
  libraries: number
  schema: number
  wasm: number
}

function remapCompilerOverrideDiagnostics(diagnostics: readonly Diagnostic[]) {
  return diagnostics.map(diagnostic => {
    const text = diagnostic.text.toLowerCase()
    const matchingOverride = compilerOverrideState.overrides.find(override => {
      if (!override.applied) return false
      if (
        text.includes(`'${override.option.toLowerCase()}'`) ||
        text.includes(`"--${override.option.toLowerCase()}"`) ||
        text.includes(`'--${override.option.toLowerCase()}'`)
      ) {
        return true
      }
      if (diagnostic.fileName !== configFileName) return false
      const node = configOptionNode(compilerOverrideState.effectiveConfigText, override.option)
      return node !== undefined && diagnostic.pos <= node.offset + node.length && diagnostic.end >= node.offset
    })
    if (!matchingOverride) return diagnostic
    return {
      ...diagnostic,
      end: matchingOverride.end,
      fileName: matchingOverride.fileName,
      pos: matchingOverride.start,
    }
  })
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

type VersionedProjectState = ProjectState & {
  version: 2
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
  docs: Array<{ html: string; legacyIndexes?: number[]; title: string }>
}

type LayoutState = {
  emitVisible: boolean
  filesVisible: boolean
  filesWidth: number
  outputVisible: boolean
  outputWidth: number
  runVisible: boolean
}

type PlaygroundSettings = {
  automaticTypeAcquisition: boolean
  fontLigatures: boolean
  fontSize: number
  minimap: boolean
  saveToUrl: boolean
  tabSize: number
  wordWrap: boolean
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
const projectHashPrefix = "#code/v2/"
const legacyCodeHashPrefix = "#code/"
const projectStateVersion = 2
const bundledExamples = examplesCatalog as PlaygroundExamples
const initialHash = location.hash
const initialLegacyExample = legacyExampleFromHash(initialHash)
if (initialLegacyExample?.compilerSettings?.ts && !new URLSearchParams(location.search).has("ts")) {
  const url = new URL(location.href)
  url.searchParams.set("ts", String(initialLegacyExample.compilerSettings.ts))
  history.replaceState({}, "", url)
}
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
const compilerVersion = getElement<HTMLDetailsElement>("compiler-version")
const compilerVersionButton = getElement("compiler-version-button")
const compilerVersionLabel = getElement("compiler-version-label")
const compilerVersionMenu = getElement("compiler-version-menu")
const newFileButton = getElement<HTMLButtonElement>("new-file-button")
const resetProjectButton = getElement<HTMLButtonElement>("reset-project-button")
const applyCompilerOverridesButton = getElement<HTMLButtonElement>("apply-compiler-overrides-button")
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
const settingsButton = getElement<HTMLButtonElement>("settings-button")
const settingsDialog = getElement<HTMLDialogElement>("settings-dialog")
const settingsForm = getElement<HTMLFormElement>("settings-form")
const settingsCancelButton = getElement<HTMLButtonElement>("settings-cancel-button")
const settingsResetButton = getElement<HTMLButtonElement>("settings-reset-button")
const settingAta = getElement<HTMLInputElement>("setting-ata")
const settingSaveUrl = getElement<HTMLInputElement>("setting-save-url")
const settingFontSize = getElement<HTMLSelectElement>("setting-font-size")
const settingTabSize = getElement<HTMLSelectElement>("setting-tab-size")
const settingWordWrap = getElement<HTMLInputElement>("setting-word-wrap")
const settingMinimap = getElement<HTMLInputElement>("setting-minimap")
const settingLigatures = getElement<HTMLInputElement>("setting-ligatures")
const confirmationDialog = getElement<HTMLDialogElement>("confirmation-dialog")
const confirmationForm = getElement<HTMLFormElement>("confirmation-form")
const confirmationTitle = getElement("confirmation-title")
const confirmationMessage = getElement("confirmation-message")
const confirmationCancelButton = getElement<HTMLButtonElement>("confirmation-cancel-button")
const confirmationSubmitButton = getElement<HTMLButtonElement>("confirmation-submit-button")
const textInputDialog = getElement<HTMLDialogElement>("text-input-dialog")
const textInputForm = getElement<HTMLFormElement>("text-input-form")
const textInputTitle = getElement("text-input-title")
const textInputLabel = getElement("text-input-label")
const textInputValue = getElement<HTMLInputElement>("text-input-value")
const textInputError = getElement("text-input-error")
const textInputCancelButton = getElement<HTMLButtonElement>("text-input-cancel-button")
const textInputSubmitButton = getElement<HTMLButtonElement>("text-input-submit-button")
const resourcesDialog = getElement<HTMLDialogElement>("resources-dialog")
const resourcesTitle = getElement("resources-title")
const resourcesCloseButton = getElement<HTMLButtonElement>("resources-close-button")
const newFileDialog = getElement<HTMLDialogElement>("new-file-dialog")
const newFileForm = getElement<HTMLFormElement>("new-file-form")
const newFilePath = getElement<HTMLInputElement>("new-file-path")
const newFileError = getElement("new-file-error")
const newFileCancelButton = getElement<HTMLButtonElement>("new-file-cancel-button")
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
const loadingAnimation = getElement("loading-animation")
const loadingCopy = getElement("loading-copy")
const loadingMessage = getElement("loading-message")
const loadingProgress = getElement<HTMLProgressElement>("loading-progress")
const loadingDetail = getElement("loading-detail")
const downloadConsent = getElement("download-consent")
const downloadSize = getElement("download-size")
const rememberDownloadConsent = getElement<HTMLInputElement>("remember-download-consent")
const confirmDownloadButton = getElement<HTMLButtonElement>("confirm-download-button")

let compilerReady = false
let lspReady = false
let lspStatus: TsgoStatus = "mounting files"
let lspServerInfo: string | undefined
let diagnosticCount = 0
let compilerFailure: string | undefined
let lspFailure: string | undefined
let projectFailure: string | undefined
let compilerTransport: WasmTransport | undefined
let languageServer: TsgoLspController | undefined
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
const pendingAcquiredTypeModels = new Set<string>()
let examplesPromise: Promise<PlaygroundExamples> | undefined
let helpPromise: Promise<PlaygroundHelp> | undefined
let confirmationResolver: ((value: boolean) => void) | undefined
let textInputResolver: ((value: string | null) => void) | undefined
const downloadedAssets = new Map<keyof typeof __LOAD_ASSET_SIZES__, number>()
const cachedAssets = new Map<keyof typeof __LOAD_ASSET_SIZES__, boolean>()
const assetCachePrefix = "ts7-playground-assets-"
let assetCachePromise: Promise<Cache | undefined> | undefined
const layoutStorageKey = "ts7-playground-layout"
const downloadConsentStorageKey = "ts7-playground-skip-download-warning"
const settingsStorageKey = "ts7-playground-settings"
let compilerOverrideState: CompilerOverrideState
let playgroundSettings = loadPlaygroundSettings()

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
registerExampleLinks()
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
compilerOverrideState = computeCompilerOverrides(
  projectTextMap(),
  projectModels.get(configFileName)?.getValue() ?? "{}"
)
const fileButtons = new Map<string, HTMLButtonElement>()
const inputEditor = monaco.editor.create(inputElement, {
  automaticLayout: true,
  fontFamily: "Hack, monospace",
  fontLigatures: playgroundSettings.fontLigatures,
  fontSize: playgroundSettings.fontSize,
  inlayHints: { enabled: "on" },
  minimap: { enabled: playgroundSettings.minimap },
  model: projectModels.get(initialState.activeFile ?? entryFileName) ?? projectModels.get(entryFileName),
  padding: { top: 10 },
  scrollBeyondLastLine: false,
  "semanticHighlighting.enabled": true,
  tabSize: playgroundSettings.tabSize,
  theme: "typescript-playground",
})
let effectiveConfigModel: monaco.editor.ITextModel | undefined

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
updateResponsiveEditorOptions()
mobileLayout.addEventListener("change", updateResponsiveEditorOptions)

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
  const example = exampleAtPosition(inputEditor.getModel(), position)
  if (example) {
    navigateToExample(example)
    return
  }
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

const inlayEmitter = new monaco.Emitter<void>()
const typeQueries = new Map<string, TypeQuery[]>()
const compilerOverrideHints = new Map<string, monaco.languages.InlayHint[]>()
const overrideCodeLensEmitter = new monaco.Emitter<monaco.languages.CodeLensProvider>()
let overrideCodeLensProvider: monaco.languages.CodeLensProvider | undefined
registerCompilerOverrideFeatures()
refreshCompilerOverrides()

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

function defaultPlaygroundSettings(): PlaygroundSettings {
  return {
    automaticTypeAcquisition: true,
    fontLigatures: true,
    fontSize: 14,
    minimap: false,
    saveToUrl: true,
    tabSize: 2,
    wordWrap: false,
  }
}

function loadPlaygroundSettings() {
  const defaults = defaultPlaygroundSettings()
  try {
    const stored = JSON.parse(localStorage.getItem(settingsStorageKey) ?? "{}")
    return {
      automaticTypeAcquisition:
        typeof stored.automaticTypeAcquisition === "boolean"
          ? stored.automaticTypeAcquisition
          : defaults.automaticTypeAcquisition,
      fontLigatures: typeof stored.fontLigatures === "boolean" ? stored.fontLigatures : defaults.fontLigatures,
      fontSize: [12, 14, 16, 18, 20].includes(stored.fontSize) ? stored.fontSize : defaults.fontSize,
      minimap: typeof stored.minimap === "boolean" ? stored.minimap : defaults.minimap,
      saveToUrl: typeof stored.saveToUrl === "boolean" ? stored.saveToUrl : defaults.saveToUrl,
      tabSize: stored.tabSize === 4 ? 4 : defaults.tabSize,
      wordWrap: typeof stored.wordWrap === "boolean" ? stored.wordWrap : defaults.wordWrap,
    } satisfies PlaygroundSettings
  } catch {
    return defaults
  }
}

function openSettings() {
  populateSettingsForm(playgroundSettings)
  settingsDialog.showModal()
  settingAta.focus()
}

function populateSettingsForm(settings: PlaygroundSettings) {
  settingAta.checked = settings.automaticTypeAcquisition
  settingSaveUrl.checked = settings.saveToUrl
  settingFontSize.value = String(settings.fontSize)
  settingTabSize.value = String(settings.tabSize)
  settingWordWrap.checked = settings.wordWrap
  settingMinimap.checked = settings.minimap
  settingLigatures.checked = settings.fontLigatures
}

function saveSettings() {
  const next: PlaygroundSettings = {
    automaticTypeAcquisition: settingAta.checked,
    fontLigatures: settingLigatures.checked,
    fontSize: Number(settingFontSize.value),
    minimap: settingMinimap.checked,
    saveToUrl: settingSaveUrl.checked,
    tabSize: Number(settingTabSize.value),
    wordWrap: settingWordWrap.checked,
  }
  const ataChanged = next.automaticTypeAcquisition !== playgroundSettings.automaticTypeAcquisition
  playgroundSettings = next
  try {
    localStorage.setItem(settingsStorageKey, JSON.stringify(playgroundSettings))
  } catch (error) {
    console.warn("Could not save playground settings", error)
  }
  settingsDialog.close()
  applyEditorSettings()
  if (playgroundSettings.saveToUrl) persistProjectState()
  if (ataChanged) {
    if (playgroundSettings.saveToUrl) {
      location.reload()
    } else {
      const url = new URL(location.href)
      url.hash = ""
      location.replace(url)
    }
  }
}

function applyEditorSettings() {
  inputEditor.updateOptions({
    fontLigatures: playgroundSettings.fontLigatures,
    fontSize: playgroundSettings.fontSize,
    minimap: { enabled: playgroundSettings.minimap },
    tabSize: playgroundSettings.tabSize,
  })
  updateResponsiveEditorOptions()
}

function requestConfirmation(options: {
  cancelLabel?: string | null
  confirmLabel: string
  danger?: boolean
  message: string
  title: string
}) {
  if (confirmationResolver) finishConfirmation(false)
  confirmationTitle.textContent = options.title
  confirmationMessage.textContent = options.message
  confirmationCancelButton.hidden = options.cancelLabel === null
  confirmationCancelButton.textContent = options.cancelLabel ?? "Cancel"
  confirmationSubmitButton.textContent = options.confirmLabel
  confirmationSubmitButton.classList.toggle("danger", options.danger === true)
  confirmationDialog.showModal()
  confirmationSubmitButton.focus()
  return new Promise<boolean>(resolve => {
    confirmationResolver = resolve
  })
}

function finishConfirmation(value: boolean) {
  const resolve = confirmationResolver
  confirmationResolver = undefined
  if (confirmationDialog.open) confirmationDialog.close()
  resolve?.(value)
}

function requestTextInput(options: { initialValue?: string; label: string; submitLabel: string; title: string }) {
  if (textInputResolver) finishTextInput(null)
  textInputTitle.textContent = options.title
  textInputLabel.textContent = options.label
  textInputValue.value = options.initialValue ?? ""
  textInputError.hidden = true
  textInputError.textContent = ""
  textInputSubmitButton.textContent = options.submitLabel
  textInputDialog.showModal()
  textInputValue.focus()
  textInputValue.select()
  return new Promise<string | null>(resolve => {
    textInputResolver = resolve
  })
}

function finishTextInput(value: string | null) {
  const resolve = textInputResolver
  textInputResolver = undefined
  if (textInputDialog.open) textInputDialog.close()
  resolve?.(value)
}

function updateResponsiveEditorOptions() {
  const mobile = mobileLayout.matches
  inputEditor.updateOptions({
    folding: !mobile,
    lineNumbersMinChars: mobile ? 3 : 5,
    scrollbar: {
      horizontal: mobile ? "hidden" : "auto",
      horizontalScrollbarSize: mobile ? 0 : 12,
      verticalScrollbarSize: mobile ? 8 : 14,
    },
    scrollBeyondLastColumn: mobile ? 0 : 5,
    wordWrap: mobile || playgroundSettings.wordWrap ? "on" : "off",
    wrappingIndent: "indent",
  })
  requestAnimationFrame(() => inputEditor.layout())
}

function applyLayoutState() {
  if (!matchMedia("(max-width: 1000px)").matches) {
    layoutState.filesWidth = clampPanelWidth("files", layoutState.filesWidth)
    layoutState.outputWidth = clampPanelWidth("output", layoutState.outputWidth)
  }
  workspace.style.setProperty("--files-width", layoutState.filesVisible ? `${layoutState.filesWidth}px` : "0px")
  workspace.style.setProperty("--output-width", layoutState.outputVisible ? `${layoutState.outputWidth}px` : "0px")
  workspace.dataset.filesCollapsed = String(!layoutState.filesVisible)
  workspace.dataset.outputCollapsed = String(!layoutState.outputVisible)
  emitOutput.hidden = !layoutState.emitVisible
  runOutput.dataset.collapsed = String(!layoutState.runVisible)

  toggleFilesButton.textContent = layoutState.filesVisible ? "Hide files" : "Show files"
  toggleFilesButton.setAttribute("aria-expanded", String(layoutState.filesVisible))
  toggleOutputButton.textContent = layoutState.outputVisible ? "Hide output" : "Show output"
  toggleOutputButton.setAttribute("aria-expanded", String(layoutState.outputVisible))
  toggleEmitButton.textContent = layoutState.emitVisible ? "▾" : "▸"
  toggleEmitButton.title = layoutState.emitVisible ? "Collapse Emit" : "Expand Emit"
  toggleEmitButton.setAttribute("aria-label", toggleEmitButton.title)
  toggleEmitButton.setAttribute("aria-expanded", String(layoutState.emitVisible))
  toggleRunOutputButton.textContent = layoutState.runVisible ? "▾" : "▸"
  toggleRunOutputButton.title = layoutState.runVisible ? "Collapse Run output" : "Expand Run output"
  toggleRunOutputButton.setAttribute("aria-label", toggleRunOutputButton.title)
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

for (const language of ["javascript", "typescript"]) {
  monaco.languages.registerInlayHintsProvider(language, {
    onDidChangeInlayHints: inlayEmitter.event,
    provideInlayHints(model) {
      return {
        hints: [
          ...(typeQueries.get(model.uri.toString()) ?? []).map(query => ({
            kind: monaco.languages.InlayHintKind.Type,
            position: new monaco.Position(query.lineNumber, query.column),
            label: query.label,
            paddingLeft: true,
          })),
          ...(compilerOverrideHints.get(model.uri.toString()) ?? []),
        ],
        dispose() {},
      }
    },
  })
}
monaco.languages.registerInlayHintsProvider("json", {
  onDidChangeInlayHints: inlayEmitter.event,
  provideInlayHints(model) {
    return {
      dispose() {},
      hints: compilerOverrideHints.get(model.uri.toString()) ?? [],
    }
  },
})

let updateTimer = 0
for (const model of projectModels.values()) {
  registerProjectModel(model)
}
newFileButton.addEventListener("click", createNewFile)
newFileCancelButton.addEventListener("click", () => newFileDialog.close())
newFileForm.addEventListener("submit", event => {
  event.preventDefault()
  finishCreatingFile()
})
resetProjectButton.addEventListener("click", () => void resetProject())
applyCompilerOverridesButton.addEventListener("click", applyCompilerOverridesToConfig)
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
settingsButton.addEventListener("click", openSettings)
settingsCancelButton.addEventListener("click", () => settingsDialog.close())
settingsResetButton.addEventListener("click", () => populateSettingsForm(defaultPlaygroundSettings()))
settingsForm.addEventListener("submit", event => {
  event.preventDefault()
  saveSettings()
})
resourcesCloseButton.addEventListener("click", () => resourcesDialog.close())
examplesSearch.addEventListener("input", () => void renderExamples())
helpBackButton.addEventListener("click", showHelpTopics)
clearRunOutput.addEventListener("click", () => renderRunLogs([]))
confirmationCancelButton.addEventListener("click", () => finishConfirmation(false))
confirmationForm.addEventListener("submit", event => {
  event.preventDefault()
  finishConfirmation(true)
})
confirmationDialog.addEventListener("cancel", event => {
  event.preventDefault()
  finishConfirmation(false)
})
textInputCancelButton.addEventListener("click", () => finishTextInput(null))
textInputForm.addEventListener("submit", event => {
  event.preventDefault()
  const value = textInputValue.value.trim()
  if (value === "") {
    textInputError.textContent = "Enter a value."
    textInputError.hidden = false
    textInputValue.focus()
    return
  }
  finishTextInput(value)
})
textInputDialog.addEventListener("cancel", event => {
  event.preventDefault()
  finishTextInput(null)
})

void openLegacyResourceRoute(initialHash)
void initializeVersionSelector()
void (useNativeCompiler ? initializeNativeCompiler() : initializeStradaCompiler(selectedCompiler!))

async function initializeNativeCompiler() {
  try {
    await confirmLargeDownloadIfNeeded()
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
    setLoadingIndeterminate("Loading TypeScript...", requestedVersion)
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
    languageServer = startTsgoLsp({
      configFileName,
      editor: inputEditor,
      effectiveConfigText: compilerOverrideState.effectiveConfigText,
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
        if (lspReady) {
          for (const fileName of pendingAcquiredTypeModels) {
            const text = acquiredTypeFiles.get(fileName)
            if (text !== undefined) mountAcquiredTypeModel(fileName, text)
          }
          pendingAcquiredTypeModels.clear()
        }
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
  compilerVersionButton.setAttribute("aria-disabled", "true")
  try {
    const response = await fetch(new URL("./versions.json", import.meta.url))
    if (!response.ok) throw new Error(`Could not load versions: ${response.status}`)
    const releases = (await response.json()) as { versions: string[] }
    const unsupported = new Set(["3.1.6", "3.0.1", "2.8.1", "2.7.2", "2.4.1"])
    const seenMinorVersions = new Set<string>()
    const versions: Array<{ label: string; value: string }> = [{ label: __TS_VERSION__, value: "native" }]
    for (const version of releases.versions) {
      if (unsupported.has(version)) continue
      const minorVersion = version.split(".").slice(0, 2).join(".")
      if (seenMinorVersions.has(minorVersion)) continue
      seenMinorVersions.add(minorVersion)
      versions.push({ label: version, value: version })
    }
    const selectedValue = useNativeCompiler ? "native" : normalizeRequestedVersion(selectedCompiler!)
    if (!versions.some(version => version.value === selectedValue)) {
      versions.push({ label: selectedCompiler!, value: selectedValue })
    }
    compilerVersionMenu.replaceChildren()
    for (const version of versions) {
      compilerVersionMenu.appendChild(createVersionMenuItem(version.label, version.value, selectedValue))
    }
    const separator = document.createElement("div")
    separator.className = "version-menu-separator"
    separator.setAttribute("role", "separator")
    compilerVersionMenu.appendChild(separator)
    compilerVersionMenu.appendChild(createVersionMenuItem("Custom / PR build…", "__custom__", selectedValue))

    compilerVersionLabel.textContent =
      versions.find(version => version.value === selectedValue)?.label ?? selectedCompiler ?? __TS_VERSION__
    compilerVersion.addEventListener("toggle", () => {
      compilerVersionButton.setAttribute("aria-expanded", String(compilerVersion.open))
      if (compilerVersion.open) {
        compilerVersionMenu.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus()
      }
    })
    compilerVersionMenu.addEventListener("keydown", handleVersionMenuKeydown)
    document.addEventListener("pointerdown", event => {
      if (compilerVersion.open && !compilerVersion.contains(event.target as Node)) compilerVersion.open = false
    })
  } catch (error) {
    console.warn("Could not initialize the compiler version selector", error)
  } finally {
    compilerVersionButton.removeAttribute("aria-disabled")
  }
}

function createVersionMenuItem(label: string, value: string, selectedValue: string) {
  const button = document.createElement("button")
  button.type = "button"
  button.className = "version-menu-item"
  button.dataset.value = value
  button.setAttribute("role", "menuitemradio")
  button.setAttribute("aria-checked", String(value === selectedValue))
  button.appendChild(createText("span", label))
  button.addEventListener("click", () => void selectCompilerVersion(value))
  return button
}

async function selectCompilerVersion(value: string) {
  compilerVersion.open = false
  const url = new URL(location.href)
  if (value === "native") {
    url.searchParams.delete("ts")
  } else if (value === "__custom__") {
    const custom = await requestTextInput({
      label: "Playground CDN build ID",
      submitLabel: "Load build",
      title: "Custom TypeScript build",
    })
    if (!custom) {
      compilerVersionButton.focus()
      return
    }
    url.searchParams.set("ts", custom)
  } else {
    url.searchParams.set("ts", value)
  }
  location.href = url.href
}

function handleVersionMenuKeydown(event: KeyboardEvent) {
  const items = [...compilerVersionMenu.querySelectorAll<HTMLButtonElement>(".version-menu-item")]
  const current = items.indexOf(document.activeElement as HTMLButtonElement)
  let next = current
  if (event.key === "ArrowDown") next = (current + 1) % items.length
  else if (event.key === "ArrowUp") next = (current - 1 + items.length) % items.length
  else if (event.key === "Home") next = 0
  else if (event.key === "End") next = items.length - 1
  else if (event.key === "Escape") {
    compilerVersion.open = false
    compilerVersionButton.focus()
    event.preventDefault()
    return
  } else {
    return
  }
  items[next]?.focus()
  event.preventDefault()
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
      button.addEventListener("click", () => void loadExample(example))
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

async function openLegacyResourceRoute(hash: string) {
  if (hash === "#show-examples") {
    await openExamples()
    return
  }
  const handbook = /^#handbook(?:-(\d+))?$/.exec(hash)
  if (!handbook) return
  await openHelp()
  const index = Number(handbook[1] ?? 0)
  const help = await getHelp()
  const topic = help.docs.find(candidate => candidate.legacyIndexes?.includes(index))
  if (topic) showHelpDocument(topic)
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

async function loadExample(example: PlaygroundExample) {
  const confirmed = await requestConfirmation({
    confirmLabel: "Replace project",
    danger: true,
    message: `Replace the current project with “${example.title}”? Unsaved project files will be replaced.`,
    title: "Open example",
  })
  if (!confirmed) return
  navigateToExample(example)
}

function createExampleProjectState(example: PlaygroundExample) {
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
  return state
}

function navigateToExample(example: PlaygroundExample) {
  const settings = example.compilerSettings ?? {}
  const state = createExampleProjectState(example)
  const serialized = serializeProjectState(state)
  localStorage.setItem(storageKey, serialized)
  const url = new URL(location.pathname, location.origin)
  const requestedVersion = typeof settings.ts === "string" ? settings.ts : selectedCompiler
  if (requestedVersion && !isNativeCompilerVersion(requestedVersion)) {
    url.searchParams.set("ts", requestedVersion)
  }
  url.hash = `${projectHashPrefix.slice(1)}${LZString.compressToEncodedURIComponent(serialized)}`
  history.replaceState({}, "", url)
  location.reload()
}

function exampleFileType(example: PlaygroundExample, settings: PlaygroundExample["compilerSettings"]) {
  if (settings?.useJavaScript === true) return example.name.endsWith("x") ? "jsx" : "js"
  const match = /(\.d\.[cm]?ts|\.d\.ts|\.tsx|\.ts|\.jsx|\.js)$/i.exec(example.name)
  return match?.[1].replace(/^\./, "") ?? "ts"
}

function getExamples() {
  examplesPromise ??= Promise.resolve(bundledExamples)
  return examplesPromise
}

function getHelp() {
  helpPromise ??= fetch(new URL("./help.json", import.meta.url)).then(async response => {
    if (!response.ok) throw new Error(`Could not load help: ${response.status} ${response.statusText}`)
    return response.json() as Promise<PlaygroundHelp>
  })
  return helpPromise
}

function registerExampleLinks() {
  const examplesById = new Map(bundledExamples.examples.map(example => [example.id, example]))
  for (const language of ["javascript", "typescript"]) {
    monaco.languages.registerLinkProvider(language, {
      provideLinks(model) {
        const links: monaco.languages.ILink[] = []
        for (let lineNumber = 1; lineNumber <= model.getLineCount(); lineNumber++) {
          const line = model.getLineContent(lineNumber)
          const match = /\/\/\s*example:\s*([\w-]+)/i.exec(line)
          if (!match) continue
          const example = examplesById.get(match[1])
          if (!example) continue
          const startColumn = match.index + match[0].lastIndexOf(match[1]) + 1
          const url = legacyExampleUrl(example)
          links.push({
            range: new monaco.Range(lineNumber, startColumn, lineNumber, startColumn + match[1].length),
            tooltip: `Open example: ${example.title}`,
            url: monaco.Uri.parse(url.href),
          })
        }
        return { links }
      },
    })
  }
}

function exampleAtPosition(model: monaco.editor.ITextModel | null, position: monaco.Position) {
  if (!model) return undefined
  const line = model.getLineContent(position.lineNumber)
  const match = /\/\/\s*example:\s*([\w-]+)/i.exec(line)
  if (!match) return undefined
  const startColumn = match.index + match[0].lastIndexOf(match[1]) + 1
  if (position.column < startColumn || position.column > startColumn + match[1].length) return undefined
  return bundledExamples.examples.find(example => example.id === match[1])
}

function legacyExampleUrl(example: PlaygroundExample) {
  const url = new URL(location.pathname, location.origin)
  for (const [key, value] of Object.entries(example.compilerSettings ?? {})) {
    url.searchParams.set(key, String(value))
  }
  if (!url.searchParams.has("ts") && selectedCompiler && !isNativeCompilerVersion(selectedCompiler)) {
    url.searchParams.set("ts", selectedCompiler)
  }
  url.hash = `example/${example.id}`
  return url
}

function projectFileContents() {
  return Object.fromEntries([...projectModels].map(([fileName, model]) => [fileName, model.getValue()]))
}

function projectTextMap() {
  return new Map([...projectModels].map(([fileName, model]) => [fileName, model.getValue()]))
}

function compilerFileContents() {
  const files = {
    ...Object.fromEntries(acquiredTypeFiles),
    ...projectFileContents(),
  }
  files[configFileName] = compilerOverrideState.effectiveConfigText
  return files
}

function refreshCompilerOverrides() {
  compilerOverrideState = computeCompilerOverrides(
    projectTextMap(),
    projectModels.get(configFileName)?.getValue() ?? defaultFiles[0].text
  )
  languageServer?.updateEffectiveConfig(compilerOverrideState.effectiveConfigText)
  renderCompilerOverrides()
}

function renderCompilerOverrides() {
  const byFile = new Map<string, CompilerOverride[]>()
  for (const override of compilerOverrideState.overrides) {
    const entries = byFile.get(override.fileName) ?? []
    entries.push(override)
    byFile.set(override.fileName, entries)
  }

  for (const [fileName, model] of projectModels) {
    const hints: monaco.languages.InlayHint[] = []
    for (const override of byFile.get(fileName) ?? []) {
      if (!override.applied) continue
      const end = model.getPositionAt(override.end)
      const baseValue =
        override.tsconfigValue === undefined
          ? "not set in tsconfig"
          : `tsconfig: ${formatOverrideValue(override.tsconfigValue)}`
      hints.push({
        kind: monaco.languages.InlayHintKind.Type,
        label: `· overrides ${baseValue}`,
        paddingLeft: true,
        position: end,
      })
    }
    if (fileName === configFileName) {
      for (const override of compilerOverrideState.overrides) {
        if (!override.applied) continue
        const node = configOptionNode(model.getValue(), override.option)
        if (!node) continue
        const end = model.getPositionAt(node.offset + node.length)
        hints.push({
          kind: monaco.languages.InlayHintKind.Type,
          label: `· overridden by ${relativeProjectPath(override.fileName)}:${
            override.lineNumber
          } → ${formatOverrideValue(override.value)}`,
          paddingLeft: true,
          position: end,
        })
      }
    }
    compilerOverrideHints.set(model.uri.toString(), hints)
    const markers = compilerOverrideState.diagnostics
      .filter(diagnostic => diagnostic.fileName === fileName)
      .map(diagnostic => {
        const start = model.getPositionAt(diagnostic.start)
        const end = model.getPositionAt(Math.max(diagnostic.start + 1, diagnostic.end))
        return {
          code: "PLAYGROUND_OVERRIDE",
          endColumn: end.column,
          endLineNumber: end.lineNumber,
          message: diagnostic.message,
          severity: monaco.MarkerSeverity.Error,
          source: "Playground",
          startColumn: start.column,
          startLineNumber: start.lineNumber,
        }
      })
    monaco.editor.setModelMarkers(model, "compiler-overrides", markers)
  }

  if (effectiveConfigModel && effectiveConfigModel.getValue() !== compilerOverrideState.effectiveConfigText) {
    effectiveConfigModel.setValue(compilerOverrideState.effectiveConfigText)
  }
  const activeOverrides = compilerOverrideState.overrides.filter(override => override.applied)
  applyCompilerOverridesButton.hidden = activeOverrides.length === 0
  applyCompilerOverridesButton.textContent = `Apply ${activeOverrides.length} override${
    activeOverrides.length === 1 ? "" : "s"
  }`
  inlayEmitter.fire()
  if (overrideCodeLensProvider) overrideCodeLensEmitter.fire(overrideCodeLensProvider)
}

function registerCompilerOverrideFeatures() {
  monaco.editor.registerCommand("playground.showEffectiveConfig", () => {
    const uri = monaco.Uri.parse("playground:///effective-tsconfig.json")
    effectiveConfigModel ??= monaco.editor.createModel(compilerOverrideState.effectiveConfigText, "json", uri)
    inputEditor.setModel(effectiveConfigModel)
    inputEditor.focus()
  })
  monaco.editor.registerCommand(
    "playground.goToCompilerOverride",
    (_accessor, fileName: string, start: number, end: number) => {
      const model = projectModels.get(fileName)
      if (!model) return
      navigateToModel(fileName, spanRange(model, start, end))
    }
  )
  monaco.editor.registerCommand("playground.goToConfigOption", (_accessor, option: string) => {
    const model = projectModels.get(configFileName)
    if (!model) return
    const node = configOptionNode(model.getValue(), option) ?? compilerOptionsNode(model.getValue())
    const range = node ? spanRange(model, node.offset, node.offset + node.length) : model.getFullModelRange()
    navigateToModel(configFileName, range)
  })
  for (const language of ["javascript", "typescript"]) {
    monaco.languages.registerHoverProvider(language, {
      provideHover(model, position) {
        const override = compilerOverrideAt(model, model.getOffsetAt(position))
        if (!override) return undefined
        return {
          contents: [
            { value: `**Playground compiler override**` },
            {
              value: `\`${override.option}\`: ${formatOverrideValue(override.tsconfigValue)} → **${formatOverrideValue(
                override.value
              )}**`,
            },
            { value: "This project-wide directive takes precedence over `tsconfig.json`." },
          ],
          range: spanRange(model, override.start, override.end),
        }
      },
    })
    monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ["@"],
      async provideCompletionItems(model, position) {
        const line = model.getLineContent(position.lineNumber).slice(0, position.column - 1)
        const match = /\/\/\s*@([\w-]*)$/.exec(line)
        if (!match) return { suggestions: [] }
        const metadata = await getCompilerOptionMetadata()
        const range = new monaco.Range(
          position.lineNumber,
          position.column - match[1].length,
          position.lineNumber,
          position.column
        )
        return {
          suggestions: [...metadata].map(([name, info]) => ({
            detail: info.description,
            insertText: `${name}: `,
            kind: monaco.languages.CompletionItemKind.Property,
            label: name,
            range,
          })),
        }
      },
    })
    monaco.languages.registerCodeActionProvider(language, {
      provideCodeActions(model, range) {
        const override = compilerOverrideAt(model, model.getOffsetAt(range.getStartPosition()))
        if (!override) return { actions: [], dispose() {} }
        const removeEdit = removeOverrideEdit(model, override)
        const actions: monaco.languages.CodeAction[] = [
          {
            edit: { edits: [removeEdit] },
            kind: "quickfix",
            title: `Remove @${override.option} override`,
          },
          {
            command: {
              arguments: [override.option],
              id: "playground.goToConfigOption",
              title: "Go to tsconfig option",
            },
            kind: "quickfix",
            title: `Go to ${override.option} in tsconfig.json`,
          },
        ]
        if (override.applied) {
          const configModel = projectModels.get(configFileName)
          if (configModel) {
            actions.unshift({
              edit: {
                edits: [
                  {
                    resource: configModel.uri,
                    textEdit: {
                      range: configModel.getFullModelRange(),
                      text: setCompilerOption(configModel.getValue(), override.option, override.value),
                    },
                    versionId: configModel.getVersionId(),
                  },
                  removeEdit,
                ],
              },
              isPreferred: true,
              kind: "quickfix",
              title: `Move @${override.option} to tsconfig.json`,
            })
          }
        }
        return { actions, dispose() {} }
      },
    })
  }

  monaco.languages.registerHoverProvider("json", {
    provideHover(model, position) {
      if (model.uri.path !== configFileName) return undefined
      const offset = model.getOffsetAt(position)
      const override = compilerOverrideState.overrides.find(candidate => {
        if (!candidate.applied) return false
        const node = configOptionNode(model.getValue(), candidate.option)
        return node && offset >= node.offset && offset <= node.offset + node.length
      })
      if (!override) return undefined
      return {
        contents: [
          { value: `**Overridden by ${relativeProjectPath(override.fileName)}:${override.lineNumber}**` },
          {
            value: `Effective \`${override.option}\`: **${formatOverrideValue(override.value)}**`,
          },
        ],
      }
    },
  })
  overrideCodeLensProvider = {
    onDidChange: overrideCodeLensEmitter.event,
    provideCodeLenses(model) {
      if (model.uri.path !== configFileName) return { lenses: [], dispose() {} }
      const active = compilerOverrideState.overrides.filter(override => override.applied)
      if (active.length === 0) return { lenses: [], dispose() {} }
      const node = compilerOptionsNode(model.getValue())
      const position = node ? model.getPositionAt(node.offset) : new monaco.Position(1, 1)
      return {
        dispose() {},
        lenses: [
          {
            command: {
              id: "playground.showEffectiveConfig",
              title: `${active.length} inline compiler override${
                active.length === 1 ? "" : "s"
              } active · View effective config`,
            },
            range: new monaco.Range(position.lineNumber, 1, position.lineNumber, 1),
          },
        ],
      }
    },
  }
  monaco.languages.registerCodeLensProvider("json", overrideCodeLensProvider)
  monaco.languages.registerCodeActionProvider("json", {
    provideCodeActions(model, range) {
      if (model.uri.path !== configFileName) return { actions: [], dispose() {} }
      const offset = model.getOffsetAt(range.getStartPosition())
      const override = compilerOverrideState.overrides.find(candidate => {
        if (!candidate.applied) return false
        const node = configOptionNode(model.getValue(), candidate.option)
        return node && offset >= node.offset && offset <= node.offset + node.length
      })
      if (!override) return { actions: [], dispose() {} }
      const sourceModel = projectModels.get(override.fileName)
      return {
        actions: [
          {
            command: {
              arguments: [override.fileName, override.start, override.end],
              id: "playground.goToCompilerOverride",
              title: "Go to overriding directive",
            },
            kind: "quickfix",
            title: `Go to @${override.option} override`,
          },
          ...(sourceModel
            ? [
                {
                  edit: { edits: [removeOverrideEdit(sourceModel, override)] },
                  kind: "quickfix",
                  title: `Use tsconfig value and remove @${override.option}`,
                } satisfies monaco.languages.CodeAction,
              ]
            : []),
        ],
        dispose() {},
      }
    },
  })
}

let compilerOptionMetadataPromise: Promise<Map<string, { description: string }>> | undefined

function getCompilerOptionMetadata() {
  compilerOptionMetadataPromise ??= fetch(new URL("./tsconfig.schema.json", import.meta.url)).then(async response => {
    if (!response.ok) throw new Error(`Could not load TSConfig options: ${response.status}`)
    const schema = await response.json()
    const properties = schema.definitions?.compilerOptionsDefinition?.properties?.compilerOptions?.properties ?? {}
    return new Map(
      Object.entries(properties).map(([name, value]: [string, any]) => [
        name,
        { description: value.markdownDescription ?? value.description ?? "" },
      ])
    )
  })
  return compilerOptionMetadataPromise
}

function compilerOverrideAt(model: monaco.editor.ITextModel, offset: number) {
  return compilerOverrideState.overrides.find(
    override => override.fileName === model.uri.path && offset >= override.start && offset <= override.end
  )
}

function removeOverrideEdit(model: monaco.editor.ITextModel, override: CompilerOverride) {
  const start = model.getPositionAt(override.start)
  const end =
    start.lineNumber < model.getLineCount()
      ? new monaco.Position(start.lineNumber + 1, 1)
      : model.getPositionAt(override.end)
  return {
    resource: model.uri,
    textEdit: {
      range: new monaco.Range(start.lineNumber, 1, end.lineNumber, end.column),
      text: "",
    },
    versionId: model.getVersionId(),
  }
}

function applyCompilerOverridesToConfig() {
  const overrides = compilerOverrideState.overrides.filter(override => override.applied)
  const configModel = projectModels.get(configFileName)
  if (overrides.length === 0 || !configModel) return

  let configText = configModel.getValue()
  for (const override of overrides) {
    configText = setCompilerOption(configText, override.option, override.value)
  }
  configModel.pushEditOperations([], [{ range: configModel.getFullModelRange(), text: configText }], () => null)

  const byFile = new Map<string, CompilerOverride[]>()
  for (const override of overrides) {
    const entries = byFile.get(override.fileName) ?? []
    entries.push(override)
    byFile.set(override.fileName, entries)
  }
  for (const [fileName, fileOverrides] of byFile) {
    const model = projectModels.get(fileName)
    if (!model) continue
    const edits = [...fileOverrides]
      .sort((left, right) => right.start - left.start)
      .map(override => {
        const edit = removeOverrideEdit(model, override).textEdit
        return { range: edit.range, text: edit.text }
      })
    model.pushEditOperations([], edits, () => null)
  }
}

function spanRange(model: monaco.editor.ITextModel, start: number, end: number) {
  const startPosition = model.getPositionAt(start)
  const endPosition = model.getPositionAt(end)
  return new monaco.Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column)
}

function formatOverrideValue(value: unknown) {
  if (value === undefined) return "(unset)"
  return typeof value === "string" ? value : JSON.stringify(value)
}

function compilerOverrideDiagnostics(): Diagnostic[] {
  return compilerOverrideState.diagnostics.map((diagnostic, index) => ({
    category: DiagnosticCategory.Error,
    code: 98000 + index,
    end: diagnostic.end,
    fileName: diagnostic.fileName,
    pos: diagnostic.start,
    source: "Playground",
    text: diagnostic.message,
  }))
}

function scheduleTypeAcquisition() {
  if (!playgroundSettings.automaticTypeAcquisition) return
  window.clearTimeout(typeAcquisitionTimer)
  typeAcquisitionTimer = window.setTimeout(() => {
    typeAcquisitionQueue = typeAcquisitionQueue.then(() => refreshTypeAcquisition(false))
  }, 900)
}

async function refreshTypeAcquisition(initial: boolean) {
  if (!playgroundSettings.automaticTypeAcquisition) {
    typeAcquisitionFailure = undefined
    if (compilerReady) renderStatus()
    return
  }
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
          if (lspReady) mountAcquiredTypeModel(fileName, text)
          else if (languageServer) pendingAcquiredTypeModels.add(fileName)
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
    if (addedFiles > 0 && stradaBackend) {
      await compileStradaProject()
    } else if (addedFiles > 0 && useNativeCompiler) {
      await compileActiveProject?.()
    }
    renderStatus()
  } catch (error) {
    typeAcquisitionFailure = error instanceof Error ? error.message : String(error)
    console.error("Could not acquire package types", error)
    renderStatus()
  }
}

function mountAcquiredTypeModel(fileName: string, text: string) {
  const uri = monaco.Uri.file(fileName)
  const existing = monaco.editor.getModel(uri)
  if (existing) {
    if (existing.getValue() !== text) existing.setValue(text)
    return
  }
  monaco.editor.createModel(text, languageForFile(fileName), uri)
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

async function confirmLargeDownloadIfNeeded() {
  if (downloadWarningSuppressed() || (await compilerAssetsAreCached())) return

  const totalBytes = Object.values(__LOAD_ASSET_SIZES__).reduce((total, value) => total + value, 0)
  downloadSize.textContent = formatBytes(totalBytes)
  rememberDownloadConsent.checked = true
  loadingAnimation.hidden = true
  loadingCopy.hidden = true
  downloadConsent.hidden = false
  loader.hidden = false
  loader.dataset.state = "consent"

  await new Promise<void>(resolve => {
    confirmDownloadButton.addEventListener(
      "click",
      () => {
        try {
          if (rememberDownloadConsent.checked) localStorage.setItem(downloadConsentStorageKey, "true")
          else localStorage.removeItem(downloadConsentStorageKey)
        } catch (error) {
          console.warn("Could not save the download warning preference", error)
        }
        resolve()
      },
      { once: true }
    )
    confirmDownloadButton.focus()
  })

  downloadConsent.hidden = true
  loadingAnimation.hidden = false
  loadingCopy.hidden = false
  delete loader.dataset.state
}

function downloadWarningSuppressed() {
  try {
    return localStorage.getItem(downloadConsentStorageKey) === "true"
  } catch {
    return false
  }
}

async function compilerAssetsAreCached() {
  const cache = await getAssetCache()
  if (!cache) return false
  const urls = [
    new URL("./tsc.wasm", import.meta.url),
    new URL("./lib-files.json", import.meta.url),
    new URL("./tsconfig.schema.json", import.meta.url),
  ]
  const matches = await Promise.all(
    urls.map(url => {
      url.searchParams.set("v", __ASSET_CACHE_VERSION__)
      return cache.match(new Request(url))
    })
  )
  return matches.every(response => response !== undefined)
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
      const diagnostics = deduplicateDiagnostics(
        remapCompilerOverrideDiagnostics([
          ...(config.error ? [config.error] : []),
          ...parsed.errors,
          ...program.getSyntacticDiagnostics(),
          ...program.getSemanticDiagnostics(),
          ...program.getConfigFileParsingDiagnostics(),
          ...emit.diagnostics,
          ...compilerOverrideDiagnostics(),
        ])
      )
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
    const diagnostics = remapCompilerOverrideDiagnostics([
      ...(result.diagnostics as Diagnostic[]),
      ...compilerOverrideDiagnostics(),
    ])
    diagnosticCount = diagnostics.length
    setDiagnostics(diagnostics)
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
      deleteButton.addEventListener("click", () => void deleteProjectFile(fileName))
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
    refreshCompilerOverrides()
    scheduleTypeAcquisition()
    window.clearTimeout(updateTimer)
    updateTimer = window.setTimeout(() => {
      void compileActiveProject?.()
    }, 220)
  })
}

function createNewFile() {
  newFilePath.value = "src/new-file.ts"
  newFileError.hidden = true
  newFileError.textContent = ""
  newFileDialog.showModal()
  newFilePath.focus()
  newFilePath.select()
}

function finishCreatingFile() {
  const relativePath = newFilePath.value.trim().replaceAll("\\", "/").replace(/^\/+/, "")
  const parts = relativePath.split("/")
  if (relativePath === "" || parts.some(part => part === "" || part === "." || part === "..")) {
    showNewFileError("Enter a file path inside /workspace.")
    return
  }

  const fileName = `${projectRoot}/${relativePath}`
  if (projectModels.has(fileName)) {
    showNewFileError(`${relativePath} already exists.`)
    return
  }

  newFileDialog.close()
  const model = monaco.editor.createModel("", languageForFile(fileName), monaco.Uri.parse(`file://${fileName}`))
  projectModels.set(fileName, model)
  registerProjectModel(model)
  refreshCompilerOverrides()
  renderFileList()
  inputEditor.setModel(model)
  inputEditor.focus()
  persistProjectState()
  void compileActiveProject?.()
}

function showNewFileError(message: string) {
  newFileError.textContent = message
  newFileError.hidden = false
  newFilePath.focus()
}

async function deleteProjectFile(fileName: string) {
  const model = projectModels.get(fileName)
  if (!model) return
  if (projectModels.size === 1) {
    await requestConfirmation({
      cancelLabel: null,
      confirmLabel: "OK",
      message: "The project must contain at least one file.",
      title: "Cannot delete file",
    })
    return
  }

  const relativePath = relativeProjectPath(fileName)
  const confirmed = await requestConfirmation({
    confirmLabel: "Delete file",
    danger: true,
    message: `Delete ${relativePath}? This cannot be undone.`,
    title: "Delete file",
  })
  if (!confirmed) return

  const deletedUri = model.uri.toString()
  projectModels.delete(fileName)
  refreshCompilerOverrides()
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

async function resetProject() {
  const confirmed = await requestConfirmation({
    confirmLabel: "Reset project",
    danger: true,
    message: "Reset the project to the TypeScript 7 defaults? All current project files will be replaced.",
    title: "Reset project",
  })
  if (!confirmed) return
  localStorage.removeItem(storageKey)
  const url = new URL(location.href)
  url.hash = ""
  location.replace(url)
}

function loadProjectState(): ProjectState {
  if (initialLegacyExample) {
    return createExampleProjectState(initialLegacyExample)
  }

  if (location.hash.startsWith(projectHashPrefix)) {
    const decoded = decodeCompressedHash(location.hash.slice(projectHashPrefix.length))
    if (decoded) {
      try {
        return normalizeVersionedProjectState(JSON.parse(decoded))
      } catch (error) {
        console.warn("Could not restore the versioned playground project", error)
        return { files: {}, useDefaults: true }
      }
    }
  }

  if (location.hash.startsWith("#src=")) {
    try {
      return createLegacyProjectState(decodeURIComponent(location.hash.slice("#src=".length)))
    } catch (error) {
      console.warn("Could not decode the legacy playground source", error)
    }
  }

  if (location.hash.startsWith(legacyCodeHashPrefix)) {
    const decoded = decodeCompressedHash(location.hash.slice(legacyCodeHashPrefix.length))
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

function legacyExampleFromHash(hash: string) {
  if (!hash.startsWith("#example/")) return undefined
  const id = decodeURIComponent(hash.slice("#example/".length))
  return bundledExamples.examples.find(example => example.id === id)
}

function decodeCompressedHash(encoded: string) {
  const decoded = LZString.decompressFromEncodedURIComponent(encoded)
  if (decoded) return decoded
  try {
    return LZString.decompressFromEncodedURIComponent(decodeURIComponent(encoded))
  } catch {
    return null
  }
}

function serializeProjectState(state: ProjectState) {
  const versioned: VersionedProjectState = {
    activeFile: state.activeFile,
    files: state.files,
    version: projectStateVersion,
  }
  return JSON.stringify(versioned)
}

function normalizeVersionedProjectState(value: unknown) {
  if (!value || typeof value !== "object" || (value as { version?: unknown }).version !== projectStateVersion) {
    throw new Error("Unsupported playground project URL version")
  }
  return normalizeProjectState(value)
}

function normalizeProjectState(value: unknown): ProjectState {
  if (!value || typeof value !== "object") return { files: {}, useDefaults: true }
  const candidate = value as { activeFile?: unknown; files?: unknown; version?: unknown }
  if (candidate.version !== undefined && candidate.version !== projectStateVersion) {
    console.warn(`Ignoring unsupported playground project version: ${String(candidate.version)}`)
    return { files: {}, useDefaults: true }
  }
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
  const fileNamePattern = /^\s*\/\/\s*@filename:\s*(.+)$/i
  if (!code.split(/\r\n?|\n/g).some(line => fileNamePattern.test(line))) {
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

  const fourSlashStyle = /^\s*\/\/\s*@Filename:/m.test(code)
  const files: Record<string, string> = {
    [configFileName]: defaultFiles[0].text,
  }
  let currentFile = `src/index.${fileType}`
  let currentLines: string[] = []
  let hasFileDirective = false
  const flush = (allowEmpty = false) => {
    if (currentLines.length === 0 && !allowEmpty) return
    const relativePath = sanitizeLegacyPath(currentFile) || `src/index.${fileType}`
    const fileName = `${projectRoot}/${relativePath}`
    files[fileName] = currentLines.join("\n")
  }
  for (const line of code.split(/\r\n?|\n/g)) {
    const match = fileNamePattern.exec(line)
    if (match) {
      flush(hasFileDirective)
      currentFile = match[1].trim()
      currentLines = []
      hasFileDirective = true
    } else {
      currentLines.push(fourSlashStyle ? line.replace(/^(\s*)\/\/\/\//, "$1") : line)
    }
  }
  flush(hasFileDirective)
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
  return fileType && (fileType === "d.ts" || /^[cm]?[jt]sx?$/.test(fileType)) ? fileType : "ts"
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
    const serialized = serializeProjectState(state)
    localStorage.setItem(storageKey, serialized)
    if (!playgroundSettings.saveToUrl) return
    const url = new URL(location.href)
    url.hash = `${projectHashPrefix.slice(1)}${LZString.compressToEncodedURIComponent(serialized)}`
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
