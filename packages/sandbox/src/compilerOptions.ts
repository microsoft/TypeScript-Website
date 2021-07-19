import { SandboxConfig } from "."

type CompilerOptions = import("monaco-editor").languages.typescript.CompilerOptions
type Monaco = typeof import("monaco-editor")

/**
 * These are the defaults, but they also act as the list of all compiler options
 * which are parsed in the query params.
 */
export function getDefaultSandboxCompilerOptions(config: SandboxConfig, monaco: Monaco) {
  const useJavaScript = config.filetype === "js"
  const settings: CompilerOptions = {
    strict: true,

    noImplicitAny: true,
    strictNullChecks: !useJavaScript,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    strictBindCallApply: true,
    noImplicitThis: true,
    noImplicitReturns: true,
    noUncheckedIndexedAccess: false,

    // 3.7 off, 3.8 on I think
    useDefineForClassFields: false,

    alwaysStrict: true,
    allowUnreachableCode: false,
    allowUnusedLabels: false,

    downlevelIteration: false,
    noEmitHelpers: false,
    noLib: false,
    noStrictGenericChecks: false,
    noUnusedLocals: false,
    noUnusedParameters: false,

    esModuleInterop: true,
    preserveConstEnums: false,
    removeComments: false,
    skipLibCheck: false,

    checkJs: useJavaScript,
    allowJs: useJavaScript,
    declaration: true,

    importHelpers: false,

    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,

    target: monaco.languages.typescript.ScriptTarget.ES2017,
    jsx: monaco.languages.typescript.JsxEmit.React,
    module: monaco.languages.typescript.ModuleKind.ESNext,
  }

  return { ...settings, ...config.compilerOptions }
}

/**
 * Loop through all of the entries in the existing compiler options then compare them with the
 * query params and return an object which is the changed settings via the query params
 */
export const getCompilerOptionsFromParams = (
  playgroundDefaults: CompilerOptions,
  ts: typeof import("typescript"),
  params: URLSearchParams
): CompilerOptions => {
  const returnedOptions: CompilerOptions = {}

  params.forEach((val, key) => {
    // First use the defaults object to drop compiler flags which are already set to the default
    if (playgroundDefaults[key]) {
      let toSet = undefined
      if (val === "true" && playgroundDefaults[key] !== true) {
        toSet = true
      } else if (val === "false" && playgroundDefaults[key] !== false) {
        toSet = false
      } else if (!isNaN(parseInt(val, 10)) && playgroundDefaults[key] !== parseInt(val, 10)) {
        toSet = parseInt(val, 10)
      }

      if (toSet !== undefined) returnedOptions[key] = toSet
    } else {
      // If that doesn't work, double check that the flag exists and allow it through
      // @ts-ignore
      const flagExists = ts.optionDeclarations.find(opt => opt.name === key)
      if (flagExists) {
        let realValue: number | boolean = true
        if (val === "false") realValue = false
        if (!isNaN(parseInt(val, 10))) realValue = parseInt(val, 10)
        returnedOptions[key] = realValue
      }
    }
  })

  return returnedOptions
}

// Can't set sandbox to be the right type because the param would contain this function

/** Gets a query string representation (hash + queries) */
export const createURLQueryWithCompilerOptions = (_sandbox: any, paramOverrides?: any): string => {
  const sandbox = _sandbox as import("./index").Sandbox
  const initialOptions = new URLSearchParams(document.location.search)

  const compilerOptions = sandbox.getCompilerOptions()
  const compilerDefaults = sandbox.compilerDefaults
  const diff = Object.entries(compilerOptions).reduce((acc, [key, value]) => {
    if (value !== compilerDefaults[key]) {
      // @ts-ignore
      acc[key] = compilerOptions[key]
    }

    return acc
  }, {})

  // The text of the TS/JS as the hash
  const hash = `code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`

  let urlParams: any = Object.assign({}, diff)
  for (const param of ["lib", "ts"]) {
    const params = new URLSearchParams(location.search)
    if (params.has(param)) {
      // Special case the nightly where it uses the TS version to hardcode
      // the nightly build
      if (param === "ts" && (params.get(param) === "Nightly" || params.get(param) === "next")) {
        urlParams["ts"] = sandbox.ts.version
      } else {
        urlParams["ts"] = params.get(param)
      }
    }
  }

  // Support sending the selection, but only if there is a selection, and it's not the whole thing
  const s = sandbox.editor.getSelection()

  const isNotEmpty =
    (s && s.selectionStartLineNumber !== s.positionLineNumber) || (s && s.selectionStartColumn !== s.positionColumn)

  const range = sandbox.editor.getModel()!.getFullModelRange()
  const isFull =
    s &&
    s.selectionStartLineNumber === range.startLineNumber &&
    s.selectionStartColumn === range.startColumn &&
    s.positionColumn === range.endColumn &&
    s.positionLineNumber === range.endLineNumber

  if (s && isNotEmpty && !isFull) {
    urlParams["ssl"] = s.selectionStartLineNumber
    urlParams["ssc"] = s.selectionStartColumn
    urlParams["pln"] = s.positionLineNumber
    urlParams["pc"] = s.positionColumn
  } else {
    urlParams["ssl"] = undefined
    urlParams["ssc"] = undefined
    urlParams["pln"] = undefined
    urlParams["pc"] = undefined
  }

  if (sandbox.config.filetype !== "ts") urlParams["filetype"] = sandbox.config.filetype

  if (paramOverrides) {
    urlParams = { ...urlParams, ...paramOverrides }
  }

  // @ts-ignore - this is in MDN but not libdom
  const hasInitialOpts = initialOptions.keys().length > 0

  if (Object.keys(urlParams).length > 0 || hasInitialOpts) {
    let queryString = Object.entries(urlParams)
      .filter(([_k, v]) => v !== undefined)
      .filter(([_k, v]) => v !== null)
      .map(([key, value]) => {
        return `${key}=${encodeURIComponent(value as string)}`
      })
      .join("&")

    // We want to keep around custom query variables, which
    // are usually used by playground plugins, with the exception
    // being the install-plugin param and any compiler options
    // which have a default value

    initialOptions.forEach((value, key) => {
      const skip = ["ssl", "ssc", "pln", "pc"]
      if (skip.includes(key)) return
      if (queryString.includes(key)) return
      if (compilerOptions[key]) return

      queryString += `&${key}=${value}`
    })

    return `?${queryString}#${hash}`
  } else {
    return `#${hash}`
  }
}
