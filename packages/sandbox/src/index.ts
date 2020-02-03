import { createCompilerHost } from './createCompilerHost'
import { detectNewImportsToAcquireTypeFor } from './typeAcquisition'
import { sandboxTheme, sandboxThemeDark } from './theme'
import { TypeScriptWorker } from './tsWorker'
import {
  getDefaultSandboxCompilerOptions,
  getCompilerOptionsFromParams,
  getURLQueryWithCompilerOptions,
} from './compilerOptions'
import lzstring from './vendor/lzstring.min'
import { supportedReleases } from './releases'
import { getInitialCode } from './getInitialCode'
import { extractTwoSlashComplierOptions } from './twoslashSupport'

type CompilerOptions = import('monaco-editor').languages.typescript.CompilerOptions
type Monaco = typeof import('monaco-editor')

/**
 * These are settings for the playground which are the equivalent to props in React
 * any changes to it should require a new setup of the playground
 */
export type PlaygroundConfig = {
  /** The default source code for the playground */
  text: string
  /** Should it run the ts or js IDE services */
  useJavaScript: boolean
  /** Compiler options which are automatically just forwarded on */
  compilerOptions: CompilerOptions
  /** Optional monaco settings overrides */
  monacoSettings?: import('monaco-editor').editor.IEditorOptions
  /** Acquire types via type acquisition */
  acquireTypes: boolean
  /** Support twoslash compiler options */
  supportTwoslashCompilerOptions: boolean
  /** Get the text via query params and local storage, useful when the editor is the main experience */
  suppressAutomaticallyGettingDefaultText?: true
  /** Suppress setting compiler options from the compiler flags from query params */
  suppressAutomaticallyGettingCompilerFlags?: true
  /** Logging system */
  logger: { log: (...args: any[]) => void; error: (...args: any[]) => void }
} & (
  | { /** theID of a dom node to add monaco to */ domID: string }
  | { /** theID of a dom node to add monaco to */ elementToAppend: HTMLElement }
)

const languageType = (config: PlaygroundConfig) => (config.useJavaScript ? 'javascript' : 'typescript')

/** Default Monaco settings for playground */
const sharedEditorOptions: import('monaco-editor').editor.IEditorOptions = {
  automaticLayout: true,
  scrollBeyondLastLine: true,
  scrollBeyondLastColumn: 3,
  minimap: {
    enabled: false,
  },
}

/** The default settings which we apply a partial over */
export function defaultPlaygroundSettings() {
  const config: PlaygroundConfig = {
    text: '',
    domID: '',
    compilerOptions: {},
    acquireTypes: true,
    useJavaScript: false,
    supportTwoslashCompilerOptions: false,
    logger: {
      error: () => {},
      log: () => {},
    },
  }
  return config
}

function defaultFilePath(config: PlaygroundConfig, compilerOptions: CompilerOptions, monaco: Monaco) {
  const isJSX = compilerOptions.jsx !== monaco.languages.typescript.JsxEmit.None
  const fileExt = config.useJavaScript ? 'js' : 'ts'
  const ext = isJSX ? fileExt + 'x' : fileExt
  return 'input.' + ext
}

/** Creates a monaco file reference, basically a fancy path */
function createFileUri(config: PlaygroundConfig, compilerOptions: CompilerOptions, monaco: Monaco) {
  return monaco.Uri.file(defaultFilePath(config, compilerOptions, monaco))
}

/** Creates a sandbox editor, and returns a set of useful functions and the editor */
export const createTypeScriptSandbox = (
  partialConfig: Partial<PlaygroundConfig>,
  monaco: Monaco,
  ts: typeof import('typescript')
) => {
  const config = { ...defaultPlaygroundSettings(), ...partialConfig }
  if (!('domID' in config) && !('elementToAppend' in config))
    throw new Error('You did not provide a domID or elementToAppend')

  const compilerDefaults = getDefaultSandboxCompilerOptions(config, monaco)
  const language = languageType(config)
  const filePath = createFileUri(config, compilerDefaults, monaco)
  const element = 'domID' in config ? document.getElementById(config.domID) : (config as any).elementToAppend

  const defaultText = config.suppressAutomaticallyGettingDefaultText
    ? config.text
    : getInitialCode(config.text, document.location)

  const model = monaco.editor.createModel(defaultText, language, filePath)
  monaco.editor.defineTheme('sandbox', sandboxTheme)
  monaco.editor.defineTheme('sandbox-dark', sandboxThemeDark)
  monaco.editor.setTheme('sandbox')

  const monacoSettings = Object.assign({ model }, sharedEditorOptions, config.monacoSettings || {})
  const editor = monaco.editor.create(element, monacoSettings)

  const getWorker = config.useJavaScript
    ? monaco.languages.typescript.getJavaScriptWorker
    : monaco.languages.typescript.getTypeScriptWorker

  const defaults = config.useJavaScript
    ? monaco.languages.typescript.javascriptDefaults
    : monaco.languages.typescript.typescriptDefaults

  // In the future it'd be good to add support for an 'add many files'
  const addLibraryToRuntime = (code: string, path: string) => {
    defaults.addExtraLib(code, path)
    config.logger.log(`[ATA] Adding ${path} to runtime`)
  }

  // Grab types
  if (config.acquireTypes) {
    // Take the code from the editor right away
    const code = editor.getModel()!.getValue()
    detectNewImportsToAcquireTypeFor(code, addLibraryToRuntime, window.fetch.bind(window), config)
  }

  const getTwoSlashComplierOptions = extractTwoSlashComplierOptions(ts)

  // Then update it when the model changes, perhaps this could be a debounced plugin instead in the future?
  editor.onDidChangeModelContent(() => {
    const code = editor.getModel()!.getValue()

    if (config.supportTwoslashCompilerOptions) {
      const configOpts = getTwoSlashComplierOptions(code)
      updateCompilerSettings(configOpts)
    }
    if (config.acquireTypes) {
      detectNewImportsToAcquireTypeFor(code, addLibraryToRuntime, window.fetch.bind(window), config)
    }
  })

  // Grab the compiler flags via the query params
  let compilerOptions: CompilerOptions
  if (!config.suppressAutomaticallyGettingCompilerFlags) {
    const params = new URLSearchParams(location.search)
    let queryParamCompilerOptions = getCompilerOptionsFromParams(compilerDefaults, params)
    if (Object.keys(queryParamCompilerOptions).length)
      config.logger.log('[Compiler] Found compiler options in query params: ', queryParamCompilerOptions)
    compilerOptions = { ...compilerDefaults, ...queryParamCompilerOptions }
  } else {
    compilerOptions = compilerDefaults
  }

  config.logger.log('[Compiler] Set compiler options: ', compilerOptions)
  defaults.setCompilerOptions(compilerOptions)

  // To let clients plug into compiler settings changes
  let didUpdateCompilerSettings = (opts: CompilerOptions) => {}

  const updateCompilerSettings = (opts: CompilerOptions) => {
    config.logger.log('[Compiler] Updating compiler options: ', opts)
    compilerOptions = { ...opts, ...compilerOptions }
    defaults.setCompilerOptions(compilerOptions)
    didUpdateCompilerSettings(compilerOptions)
  }

  const updateCompilerSetting = (key: keyof CompilerOptions, value: any) => {
    config.logger.log('[Compiler] Setting compiler options ', key, 'to', value)
    compilerOptions[key] = value
    defaults.setCompilerOptions(compilerOptions)
    didUpdateCompilerSettings(compilerOptions)
  }

  const setCompilerSettings = (opts: CompilerOptions) => {
    config.logger.log('[Compiler] Setting compiler options: ', opts)
    compilerOptions = opts
    defaults.setCompilerOptions(compilerOptions)
    didUpdateCompilerSettings(compilerOptions)
  }

  const getCompilerOptions = () => {
    return compilerOptions
  }

  const setDidUpdateCompilerSettings = (func: (opts: CompilerOptions) => void) => {
    didUpdateCompilerSettings = func
  }

  /** Gets the results of compiling your editor's code */
  const getEmitResult = async () => {
    const model = editor.getModel()!

    const client = await getWorkerProcess()
    return await client.getEmitOutput(model.uri.toString())
  }

  /** Gets the JS  of compiling your editor's code */
  const getRunnableJS = async () => {
    if (config.useJavaScript) {
      return getText()
    }

    const result = await getEmitResult()
    const firstJS = result.outputFiles.find((o: any) => o.name.endsWith('.js') || o.name.endsWith('.jsx'))
    return (firstJS && firstJS.text) || ''
  }

  /** Gets the DTS for the JS/TS  of compiling your editor's code */
  const getDTSForCode = async () => {
    const result = await getEmitResult()
    return result.outputFiles.find((o: any) => o.name.endsWith('.d.ts'))!.text
  }

  const getWorkerProcess = async (): Promise<TypeScriptWorker> => {
    const worker = await getWorker()
    return await worker(model.uri)
  }

  const getDomNode = () => editor.getDomNode()!
  const getModel = () => editor.getModel()!
  const getText = () => getModel().getValue()
  const setText = (text: string) => getModel().setValue(text)

  /**
   * Warning: Runs on the main thread
   */
  const createTSProgram = () => {
    const langServ = createCompilerHost(getText(), filePath.path)
    return ts.createProgram([filePath.path], compilerDefaults, langServ)
  }

  /**
   * Warning: Runs on the main thread
   * TODO: Does not work
   */
  const getAST = () => {
    const program = createTSProgram()
    program.emit()
    console.log(program)
    console.log(program.getSourceFiles())
    return program.getSourceFile(filePath.path)!
  }

  // Pass along the supported releases for the playground
  const supportedVersions = supportedReleases

  return {
    config,
    editor,
    getWorkerProcess,
    getEmitResult,
    getRunnableJS,
    getDTSForCode,
    getDomNode,
    getModel,
    getText,
    setText,
    getAST,
    ts,
    createTSProgram,
    compilerDefaults,
    getCompilerOptions,
    setCompilerSettings,
    updateCompilerSetting,
    updateCompilerSettings,
    getTwoSlashComplierOptions,
    setDidUpdateCompilerSettings,
    supportedVersions,
    lzstring,
    getURLQueryWithCompilerOptions,
    language,
    monaco,
  }
}
