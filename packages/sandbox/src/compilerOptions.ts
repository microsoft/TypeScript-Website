import { PlaygroundConfig } from '.'
import LZString from './vendor/lzstring.min'

type CompilerOptions = import('monaco-editor').languages.typescript.CompilerOptions
type Monaco = typeof import('monaco-editor')

/** Our defaults for the playground */
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

    experimentalDecorators: false,
    emitDecoratorMetadata: false,

    target: monaco.languages.typescript.ScriptTarget.ES2017,
    jsx: monaco.languages.typescript.JsxEmit.None,
    module: monaco.languages.typescript.ModuleKind.ESNext,
  }

  return settings
}

export const compilerOptionsFromLocation = (options: CompilerOptions, params: Map<string, any>) => {
  const defaultCompilerOptions = {}

  const urlDefaults = Object.entries(defaultCompilerOptions).reduce((acc: any, [key, value]) => {
    if (params.has(key)) {
      const urlValue = params.get(key)

      if (urlValue === 'true') {
        acc[key] = true
      } else if (urlValue === 'false') {
        acc[key] = false
      } else if (!isNaN(parseInt(urlValue, 10))) {
        acc[key] = parseInt(params.get(key), 10)
      }
    }

    return acc
  }, {})

  return urlDefaults
}

export const getInitialCode = (location: Location) => {
  if (location.hash.startsWith('#src')) {
    const code = location.hash.replace('#src=', '').trim()
    return decodeURIComponent(code)
  }

  if (location.hash.startsWith('#code')) {
    const code = location.hash.replace('#code/', '').trim()
    let userCode = LZString.decompressFromEncodedURIComponent(code)
    // Fallback incase there is an extra level of decoding:
    // https://gitter.im/Microsoft/TypeScript?at=5dc478ab9c39821509ff189a
    if (!userCode) userCode = LZString.decompressFromEncodedURIComponent(decodeURIComponent(code))
    return userCode
  }

  if (location.hash.startsWith('#example')) {
    return '// Loading example...'
  }

  if (localStorage.getItem('playground-history')) {
    return localStorage.getItem('playground-history')
  }

  return `
const message: string = 'hello world';
console.log(message);
`.trim()
}
