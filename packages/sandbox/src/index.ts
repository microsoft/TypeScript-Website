import { detectNewImportsToAcquireTypeFor } from "./typeAcquisition"
import { sandboxTheme, sandboxThemeDark } from "./theme"
import { TypeScriptWorker } from "./tsWorker"
import {
  getDefaultSandboxCompilerOptions,
  getCompilerOptionsFromParams,
  createURLQueryWithCompilerOptions,
} from "./compilerOptions"
import lzstring from "./vendor/lzstring.min"
import { supportedReleases } from "./releases"
import { getInitialCode } from "./getInitialCode"
import { extractTwoSlashCompilerOptions, twoslashCompletions } from "./twoslashSupport"
import * as tsvfs from "./vendor/typescript-vfs"

type CompilerOptions = import("monaco-editor").languages.typescript.CompilerOptions
type Monaco = typeof import("monaco-editor")

/**
 * These are settings for the playground which are the equivalent to props in React
 * any changes to it should require a new setup of the playground
 */
export type SandboxConfig = {
  /** The default source code for the playground */
  text: string
  /** @deprecated */
  useJavaScript?: boolean
  /** The default file for the plaayground  */
  filetype: "js" | "ts" | "d.ts"
  /** Compiler options which are automatically just forwarded on */
  compilerOptions: CompilerOptions
  /** Optional monaco settings overrides */
  monacoSettings?: import("monaco-editor").editor.IEditorOptions
  /** Acquire types via type acquisition */
  acquireTypes: boolean
  /** Support twoslash compiler options */
  supportTwoslashCompilerOptions: boolean
  /** Get the text via query params and local storage, useful when the editor is the main experience */
  suppressAutomaticallyGettingDefaultText?: true
  /** Suppress setting compiler options from the compiler flags from query params */
  suppressAutomaticallyGettingCompilerFlags?: true
  /** Optional path to TypeScript worker wrapper class script, see https://github.com/microsoft/monaco-typescript/pull/65  */
  customTypeScriptWorkerPath?: string
  /** Logging system */
  logger: {
    log: (...args: any[]) => void
    error: (...args: any[]) => void
    groupCollapsed: (...args: any[]) => void
    groupEnd: (...args: any[]) => void
  }
} & (
    | { /** theID of a dom node to add monaco to */ domID: string }
    | { /** theID of a dom node to add monaco to */ elementToAppend: HTMLElement }
  )

const languageType = (config: SandboxConfig) => (config.filetype === "js" ? "javascript" : "typescript")

// Basically android and monaco is pretty bad, this makes it less bad
// See https://github.com/microsoft/pxt/pull/7099 for this, and the long
// read is in https://github.com/microsoft/monaco-editor/issues/563
const isAndroid = navigator && /android/i.test(navigator.userAgent)

/** Default Monaco settings for playground */
const sharedEditorOptions: import("monaco-editor").editor.IEditorOptions = {
  scrollBeyondLastLine: true,
  scrollBeyondLastColumn: 3,
  minimap: {
    enabled: false,
  },
  lightbulb: {
    enabled: true,
  },
  quickSuggestions: {
    other: !isAndroid,
    comments: !isAndroid,
    strings: !isAndroid,
  },
  acceptSuggestionOnCommitCharacter: !isAndroid,
  acceptSuggestionOnEnter: !isAndroid ? "on" : "off",
  accessibilitySupport: !isAndroid ? "on" : "off",
}

/** The default settings which we apply a partial over */
export function defaultPlaygroundSettings() {
  const config: SandboxConfig = {
    text: "",
    domID: "",
    compilerOptions: {},
    acquireTypes: true,
    filetype: "ts",
    supportTwoslashCompilerOptions: false,
    logger: console,
  }
  return config
}

function defaultFilePath(config: SandboxConfig, compilerOptions: CompilerOptions, monaco: Monaco) {
  const isJSX = compilerOptions.jsx !== monaco.languages.typescript.JsxEmit.None
  const ext = isJSX && config.filetype !== "d.ts" ? config.filetype + "x" : config.filetype
  return "input." + ext
}

/** Creates a monaco file reference, basically a fancy path */
function createFileUri(config: SandboxConfig, compilerOptions: CompilerOptions, monaco: Monaco) {
  return monaco.Uri.file(defaultFilePath(config, compilerOptions, monaco))
}

/** Creates a sandbox editor, and returns a set of useful functions and the editor */
export const createTypeScriptSandbox = (
  partialConfig: Partial<SandboxConfig>,
  monaco: Monaco,
  ts: typeof import("typescript")
) => {
  const config = { ...defaultPlaygroundSettings(), ...partialConfig }
  if (!("domID" in config) && !("elementToAppend" in config))
    throw new Error("You did not provide a domID or elementToAppend")

  const defaultText = config.suppressAutomaticallyGettingDefaultText
    ? config.text
    : getInitialCode(config.text, document.location)

  // Defaults
  const compilerDefaults = getDefaultSandboxCompilerOptions(config, monaco)

  // Grab the compiler flags via the query params
  let compilerOptions: CompilerOptions
  if (!config.suppressAutomaticallyGettingCompilerFlags) {
    const params = new URLSearchParams(location.search)
    let queryParamCompilerOptions = getCompilerOptionsFromParams(compilerDefaults, ts, params)
    if (Object.keys(queryParamCompilerOptions).length)
      config.logger.log("[Compiler] Found compiler options in query params: ", queryParamCompilerOptions)
    compilerOptions = { ...compilerDefaults, ...queryParamCompilerOptions }
  } else {
    compilerOptions = compilerDefaults
  }

  const isJSLang = config.filetype === "js"
  // Don't allow a state like allowJs = false
  if (isJSLang) {
    compilerOptions.allowJs = true
  }

  const language = languageType(config)
  const filePath = createFileUri(config, compilerOptions, monaco)
  const element = "domID" in config ? document.getElementById(config.domID) : (config as any).elementToAppend


  const model = monaco.editor.createModel(defaultText, language, filePath)
  monaco.editor.defineTheme("sandbox", sandboxTheme)
  monaco.editor.defineTheme("sandbox-dark", sandboxThemeDark)
  monaco.editor.setTheme("sandbox")

  const monacoSettings = Object.assign({ model }, sharedEditorOptions, config.monacoSettings || {})
  const editor = monaco.editor.create(element, monacoSettings)

  const getWorker = isJSLang
    ? monaco.languages.typescript.getJavaScriptWorker
    : monaco.languages.typescript.getTypeScriptWorker

  const defaults = isJSLang
    ? monaco.languages.typescript.javascriptDefaults
    : monaco.languages.typescript.typescriptDefaults


  // @ts-ignore - these exist
  if (config.customTypeScriptWorkerPath && defaults.setWorkerOptions) {
    // @ts-ignore - this func must exist to have got here
    defaults.setWorkerOptions({
      customWorkerPath: config.customTypeScriptWorkerPath
    });
  }

  defaults.setDiagnosticsOptions({
    ...defaults.getDiagnosticsOptions(),
    noSemanticValidation: false,
    // This is when tslib is not found
    diagnosticCodesToIgnore: [2354],
  })

  // In the future it'd be good to add support for an 'add many files'
  const addLibraryToRuntime = (code: string, path: string) => {
    defaults.addExtraLib(code, path)
    const uri = monaco.Uri.file(path)
    if (monaco.editor.getModel(uri) === null) {
      monaco.editor.createModel(code, "javascript", uri)
    }
    config.logger.log(`[ATA] Adding ${path} to runtime`)
  }

  const getTwoSlashCompilerOptions = extractTwoSlashCompilerOptions(ts)

  // Auto-complete twoslash comments
  if (config.supportTwoslashCompilerOptions) {
    const langs = ["javascript", "typescript"]
    langs.forEach(l =>
      monaco.languages.registerCompletionItemProvider(l, {
        triggerCharacters: ["@", "/", "-"],
        provideCompletionItems: twoslashCompletions(ts, monaco),
      })
    )
  }

  const textUpdated = () => {
    const code = editor.getModel()!.getValue()

    if (config.supportTwoslashCompilerOptions) {
      const configOpts = getTwoSlashCompilerOptions(code)
      updateCompilerSettings(configOpts)
    }

    if (config.acquireTypes) {
      detectNewImportsToAcquireTypeFor(code, addLibraryToRuntime, window.fetch.bind(window), config)
    }
  }

  // Debounced sandbox features like twoslash and type acquisition to once every second
  let debouncingTimer = false
  editor.onDidChangeModelContent(_e => {
    if (debouncingTimer) return
    debouncingTimer = true
    setTimeout(() => {
      debouncingTimer = false
      textUpdated()
    }, 1000)
  })

  config.logger.log("[Compiler] Set compiler options: ", compilerOptions)
  defaults.setCompilerOptions(compilerOptions)

  // To let clients plug into compiler settings changes
  let didUpdateCompilerSettings = (opts: CompilerOptions) => { }

  const updateCompilerSettings = (opts: CompilerOptions) => {
    const newKeys = Object.keys(opts)
    if (!newKeys.length) return

    // Don't update a compiler setting if it's the same
    // as the current setting
    newKeys.forEach(key => {
      if (compilerOptions[key] == opts[key]) delete opts[key]
    })

    if (!Object.keys(opts).length) return

    config.logger.log("[Compiler] Updating compiler options: ", opts)

    compilerOptions = { ...compilerOptions, ...opts }
    defaults.setCompilerOptions(compilerOptions)
    didUpdateCompilerSettings(compilerOptions)
  }

  const updateCompilerSetting = (key: keyof CompilerOptions, value: any) => {
    config.logger.log("[Compiler] Setting compiler options ", key, "to", value)
    compilerOptions[key] = value
    defaults.setCompilerOptions(compilerOptions)
    didUpdateCompilerSettings(compilerOptions)
  }

  const setCompilerSettings = (opts: CompilerOptions) => {
    config.logger.log("[Compiler] Setting compiler options: ", opts)
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
    // This isn't quite _right_ in theory, we can downlevel JS -> JS
    // but a browser is basically always esnext-y and setting allowJs and
    // checkJs does not actually give the downlevel'd .js file in the output
    // later down the line.
    if (isJSLang) {
      return getText()
    }
    const result = await getEmitResult()
    const firstJS = result.outputFiles.find((o: any) => o.name.endsWith(".js") || o.name.endsWith(".jsx"))
    return (firstJS && firstJS.text) || ""
  }

  /** Gets the DTS for the JS/TS  of compiling your editor's code */
  const getDTSForCode = async () => {
    const result = await getEmitResult()
    return result.outputFiles.find((o: any) => o.name.endsWith(".d.ts"))!.text
  }

  const getWorkerProcess = async (): Promise<TypeScriptWorker> => {
    const worker = await getWorker()
    // @ts-ignore
    return await worker(model.uri)
  }

  const getDomNode = () => editor.getDomNode()!
  const getModel = () => editor.getModel()!
  const getText = () => getModel().getValue()
  const setText = (text: string) => getModel().setValue(text)

  const setupTSVFS = async (fsMapAdditions?: Map<string, string>) => {
    const fsMap = await tsvfs.createDefaultMapFromCDN(compilerOptions, ts.version, true, ts, lzstring)
    fsMap.set(filePath.path, getText())
    if (fsMapAdditions) {
      fsMapAdditions.forEach((v, k) => fsMap.set(k, v))
    }

    const system = tsvfs.createSystem(fsMap)
    const host = tsvfs.createVirtualCompilerHost(system, compilerOptions, ts)

    const program = ts.createProgram({
      rootNames: [...fsMap.keys()],
      options: compilerOptions,
      host: host.compilerHost,
    })

    return {
      program,
      system,
      host,
      fsMap,
    }
  }

  /**
   * Creates a TS Program, if you're doing anything complex
   * it's likely you want setupTSVFS instead and can pull program out from that
   *
   * Warning: Runs on the main thread
   */
  const createTSProgram = async () => {
    const tsvfs = await setupTSVFS()
    return tsvfs.program
  }

  const getAST = async () => {
    const program = await createTSProgram()
    program.emit()
    return program.getSourceFile(filePath.path)!
  }

  // Pass along the supported releases for the playground
  const supportedVersions = supportedReleases

  textUpdated()

  return {
    /** The same config you passed in */
    config,
    /** A list of TypeScript versions you can use with the TypeScript sandbox */
    supportedVersions,
    /** The monaco editor instance */
    editor,
    /** Either "typescript" or "javascript" depending on your config */
    language,
    /** The outer monaco module, the result of require("monaco-editor")  */
    monaco,
    /** Gets a monaco-typescript worker, this will give you access to a language server. Note: prefer this for language server work because it happens on a webworker . */
    getWorkerProcess,
    /** A copy of require("@typescript/vfs") this can be used to quickly set up an in-memory compiler runs for ASTs, or to get complex language server results (anything above has to be serialized when passed)*/
    tsvfs,
    /** Get all the different emitted files after TypeScript is run */
    getEmitResult,
    /** Gets just the JavaScript for your sandbox, will transpile if in TS only */
    getRunnableJS,
    /** Gets the DTS output of the main code in the editor */
    getDTSForCode,
    /** The monaco-editor dom node, used for showing/hiding the editor */
    getDomNode,
    /** The model is an object which monaco uses to keep track of text in the editor. Use this to directly modify the text in the editor */
    getModel,
    /** Gets the text of the main model, which is the text in the editor */
    getText,
    /** Shortcut for setting the model's text content which would update the editor */
    setText,
    /** Gets the AST of the current text in monaco - uses `createTSProgram`, so the performance caveat applies there too */
    getAST,
    /** The module you get from require("typescript") */
    ts,
    /** Create a new Program, a TypeScript data model which represents the entire project. As well as some of the
     * primitive objects you would normally need to do work with the files.
     *
     * The first time this is called it has to download all the DTS files which is needed for an exact compiler run. Which
     * at max is about 1.5MB - after that subsequent downloads of dts lib files come from localStorage.
     *
     * Try to use this sparingly as it can be computationally expensive, at the minimum you should be using the debounced setup.
     *
     * Accepts an optional fsMap which you can use to add any files, or overwrite the default file.
     *
     * TODO: It would be good to create an easy way to have a single program instance which is updated for you
     * when the monaco model changes.
     */
    setupTSVFS,
    /** Uses the above call setupTSVFS, but only returns the program */
    createTSProgram,
    /** The Sandbox's default compiler options  */
    compilerDefaults,
    /** The Sandbox's current compiler options */
    getCompilerOptions,
    /** Replace the Sandbox's compiler options */
    setCompilerSettings,
    /** Overwrite the Sandbox's compiler options */
    updateCompilerSetting,
    /** Update a single compiler option in the SAndbox */
    updateCompilerSettings,
    /** A way to get callbacks when compiler settings have changed */
    setDidUpdateCompilerSettings,
    /** A copy of lzstring, which is used to archive/unarchive code */
    lzstring,
    /** Returns compiler options found in the params of the current page */
    createURLQueryWithCompilerOptions,
    /**
     * @deprecated Use `getTwoSlashCompilerOptions` instead.
     *
     * Returns compiler options in the source code using twoslash notation
     */
    getTwoSlashComplierOptions: getTwoSlashCompilerOptions,
    /** Returns compiler options in the source code using twoslash notation */
    getTwoSlashCompilerOptions,
    /** Gets to the current monaco-language, this is how you talk to the background webworkers */
    languageServiceDefaults: defaults,
    /** The path which represents the current file using the current compiler options */
    filepath: filePath.path,
    /** Adds a file to the vfs used by the editor */
    addLibraryToRuntime,
  }
}

export type Sandbox = ReturnType<typeof createTypeScriptSandbox>
