import { DiagnosticCategory, type Diagnostic } from "@typescript/typescript/unstable/sync"
import "monaco-editor/editor/contrib/links/browser/links.js"
import LZString from "lz-string"
import "reflect-metadata"
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
import { NativeBackend } from "./native"
import {
  PackageTypeAcquirer,
  stradaDiscovery,
  type AcquisitionResult,
  type AcquisitionProgress,
  type DiscoverDependencies,
} from "./ata"
import { acquisitionOptions } from "./ata/config"
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
      source: "Playground",
    }
  })
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
  selection?: {
    positionColumn: number
    positionLineNumber: number
    selectionStartColumn: number
    selectionStartLineNumber: number
  }
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
  theme: "dark" | "light" | "system"
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
const pendingReloadKey = "ts7-playground-pending-reload"
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
    text: `const message: string = "Hello, TypeScript Playground v2!"
//    ^?

console.log(message)
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
const showFilesButton = getElement<HTMLButtonElement>("show-files-button")
const showOutputButton = getElement<HTMLButtonElement>("show-output-button")
const toggleEmitButton = getElement<HTMLButtonElement>("toggle-emit-button")
const toggleRunOutputButton = getElement<HTMLButtonElement>("toggle-run-output-button")
const navigateBackButton = getElement<HTMLButtonElement>("navigate-back-button")
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
const settingTheme = getElement<HTMLSelectElement>("setting-theme")
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
let languageServer: TsgoLspController | undefined
let stradaBackend: StradaBackend | undefined
let nativeBackend: NativeBackend | undefined
let nativeCompileVersion = 0
let projectPersistTimer = 0
let projectPersistenceEnabled = true
let lastStoredProject: string | undefined
let lastUrlProject: string | undefined
let compileActiveProject: (() => Promise<void> | void) | undefined
let emittedFiles = new Map<string, string>()
let emitRenderVersion = 0
let hasShownDiagnostics = false
let typeAcquisitionFailure: string | undefined
let typeAcquisitionProgress: AcquisitionProgress | undefined
const typeAcquirer = new PackageTypeAcquirer()
let discoverDependencies: DiscoverDependencies | undefined
let typeAcquisitionController: AbortController | undefined
let typeAcquisitionTimer = 0
const acquiredTypeFiles = new Map<string, string>()
const acquiredTypePackages = new Set<string>()
const acquiredTypeModels = new Map<string, monaco.editor.ITextModel>()
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

const darkMode =
  playgroundSettings.theme === "dark" ||
  (playgroundSettings.theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
monaco.editor.defineTheme("typescript-playground", {
  base: darkMode ? "vs-dark" : "vs",
  inherit: true,
  rules: [
    { token: "comment", foreground: darkMode ? "7caf3d" : "6c6f2d" },
    { token: "keyword", foreground: darkMode ? "7fc7ff" : "2b45c7" },
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
    "editor.inactiveSelectionBackground": darkMode ? "#3a3d41" : "#e8e8e8",
    "editor.selectionBackground": darkMode ? "#264f78" : "#dbeafe",
    "editorInlayHint.background": darkMode ? "#333333" : "#eeeeee",
    "editorInlayHint.foreground": darkMode ? "#d4d4d4" : "#333333",
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

let projectReturnLocation: EditorLocation | undefined
let trackedEditorLocation: EditorLocation | undefined
const mobileLayout = matchMedia("(max-width: 700px), (max-width: 900px) and (max-height: 600px)")
const layoutState = loadLayoutState()
applyLayoutState()
setupWorkspaceResizer(fileResizer, "files")
setupWorkspaceResizer(outputResizer, "output")
window.addEventListener("resize", applyLayoutState)
updateResponsiveEditorOptions()
mobileLayout.addEventListener("change", updateResponsiveEditorOptions)

renderFileList()
restoreProjectSelection(initialState)
restoreLegacySelection()
updateActiveFile()
trackedEditorLocation = getEditorLocation()
updateNavigationButtons()
inputEditor.onDidChangeModel(() => {
  const nextLocation = getEditorLocation()
  if (
    trackedEditorLocation &&
    nextLocation &&
    trackedEditorLocation.uri !== nextLocation.uri &&
    projectModels.get(monaco.Uri.parse(trackedEditorLocation.uri).path)
  ) {
    projectReturnLocation = trackedEditorLocation
  }
  trackedEditorLocation = nextLocation
  updateActiveFile()
  updateNavigationButtons()
})
inputEditor.onDidChangeCursorSelection(() => {
  trackedEditorLocation = getEditorLocation()
  scheduleProjectPersistence()
})
window.addEventListener("pagehide", persistProjectState)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") persistProjectState()
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
// Monaco subscribes to refresh events only after its first hint request completes.
let resolveInitialTypeQueries: (() => void) | undefined
const initialTypeQueriesReady = new Promise<void>(resolve => {
  resolveInitialTypeQueries = resolve
})
function completeInitialTypeQueries() {
  resolveInitialTypeQueries?.()
  resolveInitialTypeQueries = undefined
}
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
    theme: "system",
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
      theme: stored.theme === "light" || stored.theme === "dark" ? stored.theme : defaults.theme,
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
  settingTheme.value = settings.theme
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
    theme: settingTheme.value === "light" || settingTheme.value === "dark" ? settingTheme.value : "system",
    wordWrap: settingWordWrap.checked,
  }
  const ataChanged = next.automaticTypeAcquisition !== playgroundSettings.automaticTypeAcquisition
  const themeChanged = next.theme !== playgroundSettings.theme
  playgroundSettings = next
  try {
    localStorage.setItem(settingsStorageKey, JSON.stringify(playgroundSettings))
  } catch (error) {
    console.warn("Could not save playground settings", error)
  }
  settingsDialog.close()
  applyEditorSettings()
  if (playgroundSettings.saveToUrl) persistProjectState()
  if (ataChanged || themeChanged) {
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

  showFilesButton.hidden = layoutState.filesVisible
  showOutputButton.hidden = layoutState.outputVisible
  showFilesButton.setAttribute("aria-expanded", String(layoutState.filesVisible))
  showOutputButton.setAttribute("aria-expanded", String(layoutState.outputVisible))
  toggleFilesButton.setAttribute("aria-expanded", String(layoutState.filesVisible))
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

function toggleWorkspacePanel(panel: "files" | "output") {
  if (panel === "files") layoutState.filesVisible = !layoutState.filesVisible
  else layoutState.outputVisible = !layoutState.outputVisible
  applyLayoutState()
  persistLayoutState()
  const button = panel === "files"
    ? (layoutState.filesVisible ? toggleFilesButton : showFilesButton)
    : (layoutState.outputVisible ? toggleOutputButton : showOutputButton)
  button.focus()
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
    async provideInlayHints(model) {
      await initialTypeQueriesReady
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
toggleFilesButton.addEventListener("click", () => toggleWorkspacePanel("files"))
showFilesButton.addEventListener("click", () => toggleWorkspacePanel("files"))
toggleOutputButton.addEventListener("click", () => toggleWorkspacePanel("output"))
showOutputButton.addEventListener("click", () => toggleWorkspacePanel("output"))
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
    setLoadingProgress(78, "Starting compiler worker...", "Preparing WebAssembly")
    const libFiles = JSON.parse(new TextDecoder().decode(libFilesBytes)) as Record<string, string>
    const configSchema = JSON.parse(new TextDecoder().decode(configSchemaBytes))
    registerConfigSchema(configSchema)
    nativeBackend = await NativeBackend.create(module, libFiles)
    const backend = nativeBackend
    discoverDependencies = file => backend.discover(file)
    compileActiveProject = compileNativeProject
    compilerReady = true
    startLanguageServer(module, libFiles)
    await compileNativeProject()
    void refreshTypeAcquisition()
    inputEditor.focus()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    compilerFailure = message
    completeInitialTypeQueries()
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
    discoverDependencies = stradaDiscovery(classicTS)
    stradaBackend = await StradaBackend.create({
      baseUrl: `https://playgroundcdn.typescriptlang.org/cdn/${version}/typescript/lib/`,
      compilerSource,
      editor: inputEditor,
      files: compilerFileContents,
      models: projectModels,
      onNavigate: navigateToModel,
      onCreateExternalModel(model) {
        if (acquiredTypeFiles.has(model.uri.path)) acquiredTypeModels.set(model.uri.path, model)
      },
      version,
    })
    compileActiveProject = compileStradaProject
    compilerReady = true
    lspReady = true
    lspServerInfo = `TypeScript ${version}`
    await compileStradaProject()
    void refreshTypeAcquisition()
    renderStatus()
    inputEditor.focus()
  } catch (error) {
    compilerFailure = error instanceof Error ? error.message : String(error)
    completeInitialTypeQueries()
    renderStatus()
    console.error(error)
  }
}

function startLanguageServer(module: WebAssembly.Module, libraries: Record<string, string>) {
  try {
    languageServer = startTsgoLsp({
      configFileName,
      editor: inputEditor,
      effectiveConfigText: effectiveCompilerConfigText(),
      libraries,
      models: [...projectModels.values()],
      module,
      onError(message) {
        lspFailure = message
        renderStatus()
      },
      onNavigate: navigateToModel,
      shouldHandleDiagnostics: model => projectModels.get(model.uri.path) === model,
      readPackageFile: fileName => acquiredTypeFiles.get(fileName),
      onPackageModel: model => acquiredTypeModels.set(model.uri.path, model),
      onStatus(nextStatus, serverInfo) {
        lspStatus = nextStatus
        lspReady = nextStatus === "ready"
        if (lspReady) {
          void synchronizeAcquiredTypes().then(
            () => languageServer?.refreshDiagnostics(),
            error => {
              lspFailure = error instanceof Error ? error.message : String(error)
              console.error("Could not synchronize package types", error)
              renderStatus()
            }
          )
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
  persistProjectState()
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
  try {
    const help = await getHelp()
    helpList.replaceChildren()
    for (const topic of help.docs) {
      const details = document.createElement("details")
      details.className = "help-topic"
      details.dataset.title = topic.title
      details.appendChild(createText("summary", topic.title))
      const content = document.createElement("article")
      content.innerHTML = topic.html
      details.appendChild(content)
      helpList.appendChild(details)
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

function showHelpDocument(topic: PlaygroundHelp["docs"][number]) {
  const details = [...helpList.querySelectorAll<HTMLDetailsElement>(".help-topic")]
    .find(element => element.dataset.title === topic.title)
  if (!details) return
  details.open = true
  details.querySelector("summary")?.focus()
  details.scrollIntoView({ block: "nearest" })
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
  projectPersistenceEnabled = false
  window.clearTimeout(projectPersistTimer)
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
  files[configFileName] = effectiveCompilerConfigText()
  return files
}

function effectiveCompilerConfigText() {
  const configText = compilerOverrideState.effectiveConfigText
  const typePackages = implicitTypePackages()
  return typePackages.length === 0 ? configText : setCompilerOption(configText, "types", typePackages)
}

function implicitTypePackages() {
  if (acquiredTypePackages.size === 0 || configOptionNode(compilerOverrideState.effectiveConfigText, "types")) {
    return []
  }
  return [...acquiredTypePackages].sort()
}

function refreshCompilerOverrides() {
  compilerOverrideState = computeCompilerOverrides(
    projectTextMap(),
    projectModels.get(configFileName)?.getValue() ?? defaultFiles[0].text
  )
  languageServer?.updateEffectiveConfig(effectiveCompilerConfigText())
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

  const effectiveConfigText = effectiveCompilerConfigText()
  if (effectiveConfigModel && effectiveConfigModel.getValue() !== effectiveConfigText) {
    effectiveConfigModel.setValue(effectiveConfigText)
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
  monaco.editor.registerCommand("playground.showSettings", openSettings)
  monaco.editor.registerCommand("playground.showEffectiveConfig", () => {
    const uri = monaco.Uri.parse("playground:///effective-tsconfig.json")
    effectiveConfigModel ??= monaco.editor.createModel(effectiveCompilerConfigText(), "json", uri)
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
      const typePackages = implicitTypePackages()
      const disabledBySettings = !playgroundSettings.automaticTypeAcquisition
      if (active.length === 0 && typePackages.length === 0 && !disabledBySettings) return { lenses: [], dispose() {} }
      const node = compilerOptionsNode(model.getValue())
      const position = node ? model.getPositionAt(node.offset) : new monaco.Position(1, 1)
      const range = new monaco.Range(position.lineNumber, 1, position.lineNumber, 1)
      const lenses: monaco.languages.CodeLens[] = []
      if (disabledBySettings) {
        lenses.push({
          command: {
            id: "playground.showSettings",
            title: "Automatic package types disabled in Playground settings · Settings",
          },
          range,
        })
      }
      if (active.length > 0) {
        lenses.push({
          command: {
            id: "playground.showEffectiveConfig",
            title: `${active.length} inline compiler override${
              active.length === 1 ? "" : "s"
            } active · View effective config`,
          },
          range,
        })
      }
      if (typePackages.length > 0) {
        lenses.push({
          command: {
            id: "playground.showEffectiveConfig",
            title: `Automatic package types add compilerOptions.types: ${typePackages.join(
              ", "
            )} · View effective config`,
          },
          range,
        })
      }
      return {
        dispose() {},
        lenses,
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
  if (!compilerReady || !discoverDependencies) return
  typeAcquisitionController?.abort()
  window.clearTimeout(typeAcquisitionTimer)
  typeAcquisitionProgress = undefined
  typeAcquisitionFailure = undefined
  setStatus("Checking project...", "loading")
  typeAcquisitionTimer = window.setTimeout(() => {
    void refreshTypeAcquisition()
  }, 900)
}

async function refreshTypeAcquisition() {
  const discover = discoverDependencies
  if (!discover || !compilerReady) return
  typeAcquisitionController?.abort()
  const controller = new AbortController()
  typeAcquisitionController = controller
  typeAcquisitionFailure = undefined
  typeAcquisitionProgress = { downloaded: 0, total: 0, completedPackages: 0, totalPackages: 0, pendingPackages: [] }
  renderStatus()
  try {
    const result = await typeAcquirer.acquire({
      discover,
      files: [...projectModels.values()]
        .filter(model => model.getLanguageId() === "javascript" || model.getLanguageId() === "typescript")
        .map(model => ({ path: model.uri.path, text: model.getValue() })),
      options: acquisitionOptions(
        compilerOverrideState.effectiveConfigText,
        playgroundSettings.automaticTypeAcquisition
      ),
      signal: controller.signal,
      onProgress(progress) {
        if (controller.signal.aborted) return
        typeAcquisitionProgress = progress
        renderStatus()
      },
    })
    controller.signal.throwIfAborted()
    const changed = (
      result.files.size !== acquiredTypeFiles.size ||
      [...result.files].some(([path, text]) => acquiredTypeFiles.get(path) !== text) ||
      result.ambientTypes.length !== acquiredTypePackages.size ||
      result.ambientTypes.some(name => !acquiredTypePackages.has(name))
    )
    if (changed) applyAcquiredTypes(result)
    await synchronizeAcquiredTypes()
    controller.signal.throwIfAborted()
    typeAcquisitionProgress = undefined
    typeAcquisitionFailure = result.errors.length
      ? result.errors.map(error => `${error.packageName}: ${error.message}`).join("; ")
      : undefined
    for (const error of result.errors) console.error("Could not acquire package types", error)
    if (changed) {
      languageServer?.updateEffectiveConfig(effectiveCompilerConfigText())
      languageServer?.refreshDiagnostics()
      renderCompilerOverrides()
      await compileActiveProject?.()
    }
    renderStatus()
  } catch (error) {
    if (controller.signal.aborted) return
    typeAcquisitionProgress = undefined
    typeAcquisitionFailure = error instanceof Error ? error.message : String(error)
    console.error("Could not acquire package types", error)
    renderStatus()
  }
}

function applyAcquiredTypes(result: AcquisitionResult) {
  for (const fileName of acquiredTypeFiles.keys()) {
    if (result.files.has(fileName)) continue
    const model = acquiredTypeModels.get(fileName)
    if (model && inputEditor.getModel() === model) {
      inputEditor.setModel(projectModels.get(entryFileName) ?? [...projectModels.values()][0])
    }
    model?.dispose()
    acquiredTypeModels.delete(fileName)
  }
  acquiredTypeFiles.clear()
  acquiredTypePackages.clear()
  for (const name of result.ambientTypes) acquiredTypePackages.add(name)
  for (const [fileName, text] of result.files) {
    if (projectModels.has(fileName)) continue
    acquiredTypeFiles.set(fileName, text)
    const model = acquiredTypeModels.get(fileName)
    if (model && model.getValue() !== text) model.setValue(text)
  }
}

function synchronizeAcquiredTypes() {
  if (!lspReady) return Promise.resolve()
  return languageServer?.updatePackageFiles(acquiredTypeFiles) ?? Promise.resolve()
}

function navigateToModel(fileName: string, range?: monaco.IRange) {
  const model = monaco.editor.getModel(monaco.Uri.file(fileName))
  if (!model) return
  if (inputEditor.getModel() === model && !range) {
    inputEditor.focus()
    return
  }
  const current = getEditorLocation()
  if (current && projectModels.has(monaco.Uri.parse(current.uri).path)) projectReturnLocation = current
  inputEditor.setModel(model)
  if (range) {
    inputEditor.setSelection(range)
    inputEditor.revealRangeInCenter(range, monaco.editor.ScrollType.Immediate)
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

function updateNavigationButtons() {
  const model = inputEditor.getModel()
  navigateBackButton.hidden = !model || projectModels.get(model.uri.path) === model
}

function navigateBack() {
  if (projectReturnLocation && projectModels.has(monaco.Uri.parse(projectReturnLocation.uri).path)) {
    applyEditorLocation(projectReturnLocation)
  } else {
    const model = projectModels.get(entryFileName) ?? [...projectModels.values()][0]
    if (model) navigateToModel(model.uri.path)
  }
}

function applyEditorLocation(location: EditorLocation) {
  const model = monaco.editor.getModel(monaco.Uri.parse(location.uri))
  if (!model) return
  inputEditor.setModel(model)
  inputEditor.setSelection(location.selection)
  inputEditor.revealRangeInCenter(location.selection, monaco.editor.ScrollType.Immediate)
  trackedEditorLocation = getEditorLocation()
  updateNavigationButtons()
  inputEditor.focus()
}

async function downloadAsset(name: keyof typeof __LOAD_ASSET_SIZES__, url: URL): Promise<Uint8Array<ArrayBuffer>> {
  url.searchParams.set("v", __ASSET_CACHE_VERSION__)
  const request = new Request(url)
  const cache = await getAssetCache()
  let response = await cachedCompilerAsset(cache, url)
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

async function cachedCompilerAsset(cache: Cache | undefined, url: URL) {
  if (!cache) return undefined
  const exact = await cache.match(url)
  if (exact) return exact
  const fileName = url.pathname.slice(url.pathname.lastIndexOf("/") + 1)
  const previous = (await cache.keys()).find(request => {
    const cachedUrl = new URL(request.url)
    return (
      cachedUrl.origin === url.origin &&
      cachedUrl.pathname.endsWith(`/${fileName}`) &&
      cachedUrl.searchParams.get("v") === __ASSET_CACHE_VERSION__
    )
  })
  return previous ? cache.match(previous) : undefined
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
      return cachedCompilerAsset(cache, url)
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

async function compileNativeProject() {
  const backend = nativeBackend
  if (!backend) return
  const compileVersion = ++nativeCompileVersion
  setStatus("Checking project...", "loading")
  runButton.disabled = true

  try {
    const result = await backend.compile({
      files: compilerFileContents(),
      configFileName,
      sourceFiles: [...projectModels]
        .filter(([, model]) => model.getLanguageId() === "javascript" || model.getLanguageId() === "typescript")
        .map(([fileName]) => fileName),
    })
    if (compileVersion !== nativeCompileVersion) return
    const diagnostics = deduplicateDiagnostics(
      remapCompilerOverrideDiagnostics([...result.diagnostics, ...compilerOverrideDiagnostics()])
    )
    diagnosticCount = diagnostics.length
    setDiagnostics(diagnostics)
    emittedFiles = new Map(Object.entries(result.outputFiles))
    runButton.disabled = ![...emittedFiles.keys()].some(fileName => fileName.endsWith(".js"))
    void renderEmittedFiles()
    typeQueries.clear()
    for (const [fileName, queries] of Object.entries(result.typeQueries)) {
      typeQueries.set(monaco.Uri.file(fileName).toString(), queries)
    }
    completeInitialTypeQueries()
    inlayEmitter.fire()
    projectFailure = undefined
    compilerFailure = undefined
    renderStatus()
  } catch (error) {
    if (compileVersion !== nativeCompileVersion) return
    const message = error instanceof Error ? error.message : String(error)
    diagnosticCount = 0
    emittedFiles = new Map()
    runButton.disabled = true
    setDiagnostics([])
    typeQueries.clear()
    completeInitialTypeQueries()
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
    completeInitialTypeQueries()
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
    completeInitialTypeQueries()
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
      label: truncate(text, 120),
    })
  }
  typeQueries.set(model.uri.toString(), queries)
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

function setDiagnostics(diagnostics: readonly Diagnostic[]) {
  for (const [fileName, model] of projectModels) {
    const markers = diagnostics
      .filter(diagnostic => diagnostic.fileName === fileName && (!useNativeCompiler || diagnostic.source === "Playground"))
      .map(diagnostic => {
        const start = model.getPositionAt(Math.max(0, diagnostic.pos))
        const end = model.getPositionAt(Math.max(diagnostic.pos + 1, diagnostic.end))
        return {
          code: String(diagnostic.code),
          endColumn: end.column,
          endLineNumber: end.lineNumber,
          message: diagnostic.text,
          modelVersionId: model.getVersionId(),
          severity: diagnosticSeverity(diagnostic.category),
          source: diagnostic.source || "ts",
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
      const selection = getSelection()
      if (selection && !selection.isCollapsed && button.contains(selection.anchorNode)) return
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
      if (specifier === "reflect-metadata") return {}
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

function restoreProjectSelection(state: ProjectState) {
  const selection = state.selection
  if (!selection) return
  inputEditor.setSelection(
    new monaco.Selection(
      selection.selectionStartLineNumber,
      selection.selectionStartColumn,
      selection.positionLineNumber,
      selection.positionColumn
    )
  )
  inputEditor.revealRangeInCenter(inputEditor.getSelection()!, monaco.editor.ScrollType.Immediate)
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
    setStatus("Loading compiler...", "loading")
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
  if (typeAcquisitionProgress) {
    const { completedPackages, totalPackages, pendingPackages, downloaded, total } = typeAcquisitionProgress
    if (totalPackages === 0) {
      setStatus("Checking package imports...", "loading")
      return
    }
    const packages = `${completedPackages}/${totalPackages} packages`
    const files = total ? ` · ${downloaded}/${total} files` : ""
    const pending = pendingPackages.length ? ` · ${pendingPackages.join(", ")}` : ""
    setStatus(`Package types: ${packages}${files}${pending}`, "loading")
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
  status.title = message
  status.dataset.state = state
}

function registerProjectModel(model: monaco.editor.ITextModel) {
  model.onDidChangeContent(() => {
    nativeCompileVersion++
    stradaCompileVersion++
    scheduleProjectPersistence()
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
    inputEditor.setModel(projectModels.get(fallbackFile)!)
  }
  model.dispose()
  if (projectReturnLocation?.uri === deletedUri) projectReturnLocation = undefined
  trackedEditorLocation = getEditorLocation()
  renderFileList()
  persistProjectState()
  location.reload()
}

async function resetProject() {
  const confirmed = await requestConfirmation({
    confirmLabel: "Reset project",
    danger: true,
    message: "Reset the project to the TypeScript Playground v2 defaults? All current project files will be replaced.",
    title: "Reset project",
  })
  if (!confirmed) return
  projectPersistenceEnabled = false
  window.clearTimeout(projectPersistTimer)
  localStorage.removeItem(storageKey)
  const url = new URL(location.href)
  url.hash = ""
  location.replace(url)
}

function loadProjectState(): ProjectState {
  try {
    const pendingReload = sessionStorage.getItem(pendingReloadKey)
    sessionStorage.removeItem(pendingReloadKey)
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    if (navigation?.type === "reload" && pendingReload === location.href) {
      const saved = localStorage.getItem(storageKey)
      if (saved) return normalizeVersionedProjectState(JSON.parse(saved))
    }
  } catch (error) {
    console.warn("Could not restore pending playground edits after reload", error)
  }
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
    console.warn("Could not restore the TypeScript Playground v2 project", error)
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
    selection: state.selection,
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
  const candidate = value as { activeFile?: unknown; files?: unknown; selection?: unknown; version?: unknown }
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
  const selection = normalizeSelection(candidate.selection)
  return {
    activeFile: requestedActiveFile?.startsWith(`${projectRoot}/`) ? requestedActiveFile : undefined,
    files,
    selection,
    useDefaults: false,
  }
}

function normalizeSelection(value: unknown): ProjectState["selection"] {
  if (!value || typeof value !== "object") return undefined
  const candidate = value as Record<string, unknown>
  const keys = ["positionColumn", "positionLineNumber", "selectionStartColumn", "selectionStartLineNumber"] as const
  if (keys.some(key => !Number.isInteger(candidate[key]) || Number(candidate[key]) < 1)) return undefined
  return {
    positionColumn: Number(candidate.positionColumn),
    positionLineNumber: Number(candidate.positionLineNumber),
    selectionStartColumn: Number(candidate.selectionStartColumn),
    selectionStartLineNumber: Number(candidate.selectionStartLineNumber),
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

function scheduleProjectPersistence() {
  window.clearTimeout(projectPersistTimer)
  window.addEventListener("beforeunload", flushProjectBeforeUnload)
  projectPersistTimer = window.setTimeout(persistProjectState, 250)
}

function flushProjectBeforeUnload() {
  const previousUrl = location.href
  persistProjectState()
  if (!projectPersistenceEnabled) return
  try {
    // Reload can capture the old hash before the pending save updates it.
    sessionStorage.setItem(pendingReloadKey, previousUrl)
  } catch (error) {
    console.warn("Could not preserve pending playground edits for reload", error)
  }
}

function persistProjectState() {
  window.clearTimeout(projectPersistTimer)
  window.removeEventListener("beforeunload", flushProjectBeforeUnload)
  if (!projectPersistenceEnabled) return
  const activeModel = inputEditor.getModel()
  const selection = activeModel && projectModels.has(activeModel.uri.path) ? inputEditor.getSelection() : undefined
  const state: ProjectState = {
    activeFile: activeModel && projectModels.has(activeModel.uri.path) ? activeModel.uri.path : entryFileName,
    files: Object.fromEntries([...projectModels].map(([fileName, model]) => [fileName, model.getValue()])),
    selection: selection
      ? {
          positionColumn: selection.positionColumn,
          positionLineNumber: selection.positionLineNumber,
          selectionStartColumn: selection.selectionStartColumn,
          selectionStartLineNumber: selection.selectionStartLineNumber,
        }
      : undefined,
  }
  try {
    const serialized = serializeProjectState(state)
    if (serialized !== lastStoredProject) {
      localStorage.setItem(storageKey, serialized)
      lastStoredProject = serialized
    }
    if (!playgroundSettings.saveToUrl) return
    if (serialized === lastUrlProject) return
    const url = new URL(location.href)
    url.hash = `${projectHashPrefix.slice(1)}${LZString.compressToEncodedURIComponent(serialized)}`
    history.replaceState({}, "", url)
    lastUrlProject = serialized
  } catch (error) {
    console.warn("Could not save the TypeScript Playground v2 project", error)
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
