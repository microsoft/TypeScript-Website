import ts from 'typescript'
import { SupportedTSVersions } from './monacoTSVersions'

/**
 * These are settings for the playground which are the equivalent to props in React
 * any changes to it should require a new setup of the playground
 */
type PlaygroundConfig = {
  /** The default source code for the playground */
  text: string
  /** Should it run the ts or js IDE services */
  useJavaScript: boolean
  /** The version of TS we should use */
  typeScriptVersion: 'bundled' | SupportedTSVersions | 'nightly'
  /** Compiler options which are automatically just forwarded on */
  compilerOptions: ts.CompilerOptions
  /** Optional monaco settings overrides */
  monacoSettings?: any // TODO: types
} & (
  | { /** theID of a dom node to add monaco to */ domID: string }
  | { /** theID of a dom node to add monaco to */ elementToAppend: Element }
)

const languageType = (config: PlaygroundConfig) => (config.useJavaScript ? 'javascript' : 'typescript')
// const monacoLanguageDefaults = (config: PlaygroundConfig) => config.useJavaScript ? monaco.languages.typescript.javascriptDefaults : monaco.languages.typescript.typescriptDefaults
// const monacoLanguageWorker = (config: PlaygroundConfig) => config.useJavaScript ? monaco.languages.typescript.getJavaScriptWorker : monaco.languages.typescript.getTypeScriptWorker

/** Default Monaco settings for the sandbox */
const sharedEditorOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: true,
  scrollBeyondLastColumn: 3,
}

export function getDefaultCompilerOptions(
  config: PlaygroundConfig,
  monaco: typeof import('monaco-editor')
): ts.CompilerOptions {
  return {
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

    target: 4, // ts.ScriptTarget.ES2017,
    jsx: monaco.languages.typescript.JsxEmit.None,
  }
}

export function defaultPlaygroundSettings(text: string, domID: string) {
  const config: PlaygroundConfig = {
    text,
    domID,
    compilerOptions: {},
    typeScriptVersion: 'bundled',
    useJavaScript: false,
  }
  return config
}

/** Creates a monaco file reference, basically a fancy path */
function createFileUri(
  config: PlaygroundConfig,
  compilerOptions: ts.CompilerOptions,
  monaco: typeof import('monaco-editor')
) {
  const isJSX = compilerOptions.jsx !== monaco.languages.typescript.JsxEmit.None
  const fileExt = config.useJavaScript ? 'js' : 'ts'
  const ext = isJSX ? fileExt + 'x' : fileExt
  const filepath = 'input.' + ext
  return monaco.Uri.file(filepath)
}

export async function setupPlayground(config: PlaygroundConfig, monaco: typeof import('monaco-editor')) {
  // const defaults = monacoLanguageDefaults(config)

  const language = languageType(config)
  const filePath = createFileUri(config, config.compilerOptions, monaco)
  const element = 'domID' in config ? document.getElementById(config.domID) : config.elementToAppend
  const model = monaco.editor.createModel(config.text, language, filePath)

  const monacoSettings = Object.assign({ model }, sharedEditorOptions, config.monacoSettings || {})
  const editor = monaco.editor.create(element as any, monacoSettings)

  return editor
}

export { detectNewImportsToAcquireTypeFor } from './typeAcquisition'
export { monacoTSVersions } from './monacoTSVersions'
