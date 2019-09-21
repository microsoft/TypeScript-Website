// import ts from 'monaco-typescript/src/lib/typescriptServices';
import {SupportedTSVersions, monacoTSVersions} from "./monacoTSVersions"

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
  typeScriptVersion: "bundled" | SupportedTSVersions | "nightly"
  /** Compiler options which are automatically just forwarded on */
  compilerOptions: import("monaco-editor").languages.typescript.CompilerOptions
  /** Optional monaco settings overrides */
  monacoSettings?: import("monaco-editor").editor.IEditorOptions
}
&
  ({ /** theID of a dom node to add monaco to */ domID: string }
  |{/** theID of a dom node to add monaco to */  elementToAppend: HTMLElement })

const languageType = (config: PlaygroundConfig) => config.useJavaScript ? "javascript" : "typescript"

const monacoLanguageDefaults = (config: PlaygroundConfig, monaco: typeof import("monaco-editor")) =>
  config.useJavaScript ? monaco.languages.typescript.javascriptDefaults : monaco.languages.typescript.typescriptDefaults

const monacoLanguageWorker = (config: PlaygroundConfig, monaco: typeof import("monaco-editor")) =>
   config.useJavaScript ? monaco.languages.typescript.getJavaScriptWorker : monaco.languages.typescript.getTypeScriptWorker


/** Default Monaco settings for playground */
const sharedEditorOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: true,
  scrollBeyondLastColumn: 3
};

export function getDefaultCompilerOptions(config: PlaygroundConfig, monaco: typeof import("monaco-editor")) {
  const settings: import("monaco-editor").languages.typescript.CompilerOptions = {
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

export function defaultPlaygroundSettings(text: string, domID: string) {
  const config: PlaygroundConfig = {
    text,
    domID,
    compilerOptions: {},
    typeScriptVersion: "bundled",
    useJavaScript: false
  }
  return config
}

/** Creates a monaco file reference, basically a fancy path */
function createFileUri(config: PlaygroundConfig, compilerOptions: import("monaco-editor").languages.typescript.CompilerOptions, monaco: typeof import("monaco-editor")) {
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

declare const monaco: typeof import("monaco-editor")

/** Sets up monaco with your TypeScript version */
export async function prepareMonaco(opts: SetupOptions, callback: (monaco: typeof import("monaco-editor")) => void) { 
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
  console.log(require)
  // if (!("config" in (require as any))) throw new Error("You you have not included require.js in the site")
  
  const r = require as any
  r.config({ 
    paths:{ 
      vs: `https://unpkg.com/${module}@${monacoVersion}/min/vs` }, 
      ignoreDuplicateModules: ["vs/editor/editor.main"] 
  });

  r(["vs/editor/editor.main"], () => {
    callback(monaco)
  });
}

export async function setupPlayground(config: PlaygroundConfig, monaco: typeof import("monaco-editor")) {
  // const defaults = monacoLanguageDefaults(config, monaco)

  const language = languageType(config)
  const filePath = createFileUri(config, config.compilerOptions, monaco)
  const element = "domID" in config ? document.getElementById(config.domID) : config.elementToAppend
  const model = monaco.editor.createModel(config.text, language, filePath);

  const monacoSettings = Object.assign({ model }, sharedEditorOptions, config.monacoSettings || {})
  const editor = monaco.editor.create(element, monacoSettings);

  return editor
}



window.prepareMonaco = prepareMonaco
window.setupPlayground = setupPlayground
