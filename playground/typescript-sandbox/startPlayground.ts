// import ts from 'monaco-typescript/src/lib/typescriptServices';
import { monacoTSVersions } from "./monacoTSVersions"
import { detectNewImportsToAcquireTypeFor } from "./typeAcquisition"

type CompilerOptions = import("monaco-editor").languages.typescript.CompilerOptions
type Monaco = typeof import("monaco-editor")

/**
 * These are settings for the playground which are the equivalent to props in React
 * any changes to it should require a new setup of the playground
 */
type PlaygroundConfig = {
  /** The default source code for the playground */
  text: string
  /** Should it run the ts or js IDE services */
  useJavaScript: boolean
  /** Compiler options which are automatically just forwarded on */
  compilerOptions: CompilerOptions
  /** Optional monaco settings overrides */
  monacoSettings?: import("monaco-editor").editor.IEditorOptions
  /** Acquire types via type acquisition */
  acquireTypes: boolean
  /** Logging system */
  logger: { log: (...args) => void, error: (...args) => void }
}
&
  ({ /** theID of a dom node to add monaco to */ domID: string }
  |{/** theID of a dom node to add monaco to */  elementToAppend: HTMLElement })

const languageType = (config: PlaygroundConfig) => config.useJavaScript ? "javascript" : "typescript"

/** Default Monaco settings for playground */
const sharedEditorOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: true,
  scrollBeyondLastColumn: 3
};

/** Our defaults for the playground */
export function getDefaultSandboxCompilerOptions(config: PlaygroundConfig, monaco: Monaco) {
  const settings: CompilerOptions = {
    noImplicitAny: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    noImplicitThis: true,
    noImplicitReturns: true,

    alwaysStrict: true,
    allowUnreachableCode: false,
    allowUnusedLabels: false,

    downlevelIteration: false,
    noEmitHelpers: false,
    noLib: false,
    noStrictGenericChecks: false,
    noUnusedLocals: false,
    noUnusedParameters: false,

    esModuleInterop: false,
    preserveConstEnums: false,
    removeComments: false,
    skipLibCheck: false,

    checkJs: config.useJavaScript,
    allowJs: config.useJavaScript,

    experimentalDecorators: false,
    emitDecoratorMetadata: false,

    target: monaco.languages.typescript.ScriptTarget.ES2017,
    jsx: monaco.languages.typescript.JsxEmit.None,
  };

  return settings;
}

export function defaultPlaygroundSettings() {
  const config: PlaygroundConfig = {
    text:"",
    domID: undefined,
    elementToAppend: undefined,
    compilerOptions: {},
    acquireTypes: true,
    useJavaScript: false,
    logger: {
      error: () => {},
      log: () => {}
    }
  }
  return config
}

/** Creates a monaco file reference, basically a fancy path */
function createFileUri(config: PlaygroundConfig, compilerOptions: CompilerOptions, monaco: Monaco) {
  const isJSX = compilerOptions.jsx !== monaco.languages.typescript.JsxEmit.None
  const fileExt = config.useJavaScript ? "js" : "ts"
  const ext = isJSX ? fileExt + "x" : fileExt
  const filepath = "input." + ext
  return monaco.Uri.file(filepath)
}

type SetupOptions = {
  /** The module to grab for monaco-editor */
  monacoModule?: string
} &
{
  /** The version to grab of monaco-editor directly */
  monacoVersion: string }
| {
  /** The TypeScript versions which you can used directly */
  tsVersion: import("./monacoTSVersions").SupportedTSVersions
}


/** Sets up monaco with your TypeScript version */
export function requireConfig(opts: SetupOptions) {
  let module = "monacoModule" in opts ? opts.monacoModule : "monaco-editor"
  let versionViaTS = "monacoVersion" in opts ? opts.monacoVersion : undefined

  if ("tsVersion" in opts) {
    const meta = monacoTSVersions[opts.tsVersion]
    if (!meta) throw new Error("You did not provide a known tsVersion, known versions are: " + Object.keys(monacoTSVersions))
    module = meta.module
    versionViaTS = meta.monaco
  }

  const versionViaEditor = "monacoVersion" in opts ? opts.monacoVersion : undefined
  const monacoVersion = versionViaTS || versionViaEditor

  if (!monacoVersion) throw new Error("You did not provide a known tsVersion or monacoVersion to prepareMonaco")

  return {
    paths:{
      vs: `https://unpkg.com/${module}@${monacoVersion}/min/vs` },
      ignoreDuplicateModules: ["vs/editor/editor.main"]
  }
}

/** Creates a sandbox editor, and returns a set of useful functions and the editor */
export async function createTypeScriptSandbox(partialConfig: Partial<PlaygroundConfig>, monaco: Monaco) {
  const config = { ...defaultPlaygroundSettings(), ...partialConfig }
  if (!("domID" in config) && !("elementToAppend" in config)) throw new Error("You did not provide a domID or elementToAppend")

  const compilerDefaults = getDefaultSandboxCompilerOptions(config, monaco)
  const language = languageType(config)
  const filePath = createFileUri(config, compilerDefaults, monaco)
  const element = "domID" in config ? document.getElementById(config.domID) : config.elementToAppend
  const model = monaco.editor.createModel(config.text, language, filePath);

  const monacoSettings = Object.assign({ model }, sharedEditorOptions, config.monacoSettings || {})
  const editor = monaco.editor.create(element, monacoSettings);

  const getWorker = config.useJavaScript ? monaco.languages.typescript.getJavaScriptWorker : monaco.languages.typescript.getTypeScriptWorker
  const defaults = config.useJavaScript ? monaco.languages.typescript.javascriptDefaults : monaco.languages.typescript.typescriptDefaults

  if (config.acquireTypes) {
    editor.onDidChangeModelContent(() => {

      // In the future it'd be good to add support for an 'add many files'
      const addLibraryToRuntime = (code: string, path: string) => {
         defaults.addExtraLib(code, path);
         config.logger.log(`Adding ${path} to runtime`)
      }

      const code = editor.getModel().getValue()
      detectNewImportsToAcquireTypeFor(code, addLibraryToRuntime)
    })
  }

  const getRunnableJS = async () => {
    const model = editor.getModel()
    if (config.useJavaScript) {
      return model.getValue()
    }

    const worker = await getWorker()
    const client = await worker(model.uri)
    const jsResult = client.getEmitOutput(model.uri.toString())

    console.log("JS results", jsResult)
    return jsResult[0].text
  }

  return { config, editor, getWorker, getRunnableJS }
}


window.sandbox = {
  requireConfig: requireConfig,
  create: createTypeScriptSandbox,
}
