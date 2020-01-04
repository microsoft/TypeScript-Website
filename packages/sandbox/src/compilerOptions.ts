import { PlaygroundConfig } from '.'

type CompilerOptions = import('monaco-editor').languages.typescript.CompilerOptions
type Monaco = typeof import('monaco-editor')
type Sandbox = ReturnType<typeof import('.').createTypeScriptSandbox>

/**
 * These are the defaults, but they also act as the list of all compiler options
 * which are parsed in the query params.
 */
export function getDefaultSandboxCompilerOptions(config: PlaygroundConfig, monaco: Monaco) {
  const settings: CompilerOptions = {
    noImplicitAny: true,
    strictNullChecks: !config.useJavaScript,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    strictBindCallApply: true,
    noImplicitThis: true,
    noImplicitReturns: true,

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

    checkJs: config.useJavaScript,
    allowJs: config.useJavaScript,
    declaration: true,

    experimentalDecorators: true,
    emitDecoratorMetadata: true,

    target: monaco.languages.typescript.ScriptTarget.ES2017,
    jsx: monaco.languages.typescript.JsxEmit.None,
    module: monaco.languages.typescript.ModuleKind.ESNext,
  }

  return settings
}

/**
 * Loop through all of the entries in the existing compiler options then compare them with the
 * query params and return an object which is the changed settings via the query params
 */
export const getCompilerOptionsFromParams = (options: CompilerOptions, params: URLSearchParams): CompilerOptions => {
  const urlDefaults = Object.entries(options).reduce((acc: any, [key, value]) => {
    if (params.has(key)) {
      const urlValue = params.get(key)!

      if (urlValue === 'true') {
        acc[key] = true
      } else if (urlValue === 'false') {
        acc[key] = false
      } else if (!isNaN(parseInt(urlValue, 10))) {
        acc[key] = parseInt(urlValue, 10)
      }
    }

    return acc
  }, {})

  return urlDefaults
}

// http://stackoverflow.com/questions/1714786/ddg#1714899
function objectToQueryParams(obj: any) {
  const str = []
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  return str.join('&')
}

/** Gets a query string representation (hash + queries) */
export const setURLQueryWithCompilerOptions = (sandbox: Sandbox) => {
  const compilerOptions = sandbox.getCompilerOptions()
  const diff = Object.entries(compilerOptions).reduce((acc, [key, value]) => {
    if (value !== compilerOptions[key]) {
      // @ts-ignore
      acc[key] = compilerOptions[key]
    }

    return acc
  }, {})

  // The text of the TS/JS as the hash
  const hash = `code/${sandbox.lzstring.compressToEncodedURIComponent(sandbox.getText())}`

  const urlParams: any = Object.assign({}, diff)
  for (const param of ['lib', 'ts']) {
    const params = new URLSearchParams(location.search)
    if (params.has(param)) {
      // Special case the nightly where it uses the TS version to hardcode
      // the nightly build
      if (param === 'ts' && params.get(param) === 'Nightly') {
        urlParams['ts'] = sandbox.ts.version
      } else {
        urlParams['ts'] = params.get(param)
      }
    }
  }

  // Support sending the selection
  const s = sandbox.editor.getSelection()
  if (
    (s && s.selectionStartLineNumber !== s.positionLineNumber) ||
    (s && s.selectionStartColumn !== s.positionColumn)
  ) {
    urlParams['ssl'] = s.selectionStartLineNumber
    urlParams['ssc'] = s.selectionStartColumn
    urlParams['pln'] = s.positionLineNumber
    urlParams['pc'] = s.positionColumn
  }

  if (sandbox.config.useJavaScript) urlParams['useJavaScript'] = true

  if (Object.keys(urlParams).length > 0) {
    const queryString = Object.entries(urlParams)
      .map(([key, value]) => {
        return `${key}=${encodeURIComponent(value as string)}`
      })
      .join('&')

    return `?${queryString}#${hash}`
    // window.history.replaceState({}, '', `${window.CONFIG.baseUrl}?${queryString}#${hash}`)
  } else {
    return `#${hash}`
    // window.history.replaceState({}, '', `${window.CONFIG.baseUrl}#${hash}`)
  }
}
