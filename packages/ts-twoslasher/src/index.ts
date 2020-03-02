import debug from 'debug'

type LZ = typeof import('lz-string')
type TS = typeof import('typescript')
type CompilerOptions = import('typescript').CompilerOptions

import {
  parsePrimitive,
  escapeHtml,
  cleanMarkdownEscaped,
  typesToExtension,
  getIdentifierTextSpans,
  stringAroundIndex,
} from './utils'
import { validateInput, validateCodeForErrors } from './validation'

import { createSystem, createVirtualTypeScriptEnvironment, createDefaultMapFromNodeModules } from 'typescript-vfs'

const log = debug('twoslasher')

// Hacking in some internal stuff
declare module 'typescript' {
  type Option = {
    name: string
    type: 'list' | 'boolean' | 'number' | 'string' | import('typescript').Map<number>
    element?: Option
  }

  const optionDeclarations: Array<Option>
}

type QueryPosition = {
  kind: 'query'
  position: number
  offset: number
  text: string | undefined
  docs: string | undefined
  line: number
}

type HighlightPosition = {
  kind: 'highlight'
  position: number
  length: number
  description: string
  line: number
}

function filterHighlightLines(codeLines: string[]): { highlights: HighlightPosition[]; queries: QueryPosition[] } {
  const highlights: HighlightPosition[] = []
  const queries: QueryPosition[] = []

  let nextContentOffset = 0
  let contentOffset = 0
  for (let i = 0; i < codeLines.length; i++) {
    const line = codeLines[i]
    const highlightMatch = /^\/\/\s*\^+( .+)?$/.exec(line)
    const queryMatch = /^\/\/\s*\^\?\s*$/.exec(line)
    if (queryMatch !== null) {
      const start = line.indexOf('^')
      const position = contentOffset + start
      queries.push({ kind: 'query', offset: start, position, text: undefined, docs: undefined, line: i })
      log(`Removing line ${i} for having a query`)
      codeLines.splice(i, 1)
      i--
    } else if (highlightMatch !== null) {
      const start = line.indexOf('^')
      const length = line.lastIndexOf('^') - start + 1
      const position = contentOffset + start
      const description = highlightMatch[1] ? highlightMatch[1].trim() : ''
      highlights.push({ kind: 'highlight', position, length, description, line: i })
      log(`Removing line ${i} for having a highlight`)
      codeLines.splice(i, 1)
      i--
    } else {
      contentOffset = nextContentOffset
      nextContentOffset += line.length + 1
    }
  }
  return { highlights, queries }
}

function setOption(name: string, value: string, opts: CompilerOptions, ts: TS) {
  log(`Setting ${name} to ${value}`)

  for (const opt of ts.optionDeclarations) {
    if (opt.name.toLowerCase() === name.toLowerCase()) {
      switch (opt.type) {
        case 'number':
        case 'string':
        case 'boolean':
          opts[opt.name] = parsePrimitive(value, opt.type)
          break

        case 'list':
          opts[opt.name] = value.split(',').map(v => parsePrimitive(v, opt.element!.type as string))
          break

        default:
          opts[opt.name] = opt.type.get(value.toLowerCase())
          log(`Set ${opt.name} to ${opts[opt.name]}`)
          if (opts[opt.name] === undefined) {
            const keys = Array.from(opt.type.keys() as any)
            throw new Error(`Invalid value ${value} for ${opt.name}. Allowed values: ${keys.join(',')}`)
          }
          break
      }
      return
    }
  }

  throw new Error(`No compiler setting named '${name}' exists!`)
}

const booleanConfigRegexp = /^\/\/\s?@(\w+)$/

// https://regex101.com/r/8B2Wwh/1
const valuedConfigRegexp = /^\/\/\s?@(\w+):\s?(.+)$/

function filterCompilerOptions(codeLines: string[], defaultCompilerOptions: CompilerOptions, ts: TS) {
  const options = { ...defaultCompilerOptions }
  for (let i = 0; i < codeLines.length; ) {
    let match
    if ((match = booleanConfigRegexp.exec(codeLines[i]))) {
      options[match[1]] = true
      setOption(match[1], 'true', options, ts)
    } else if ((match = valuedConfigRegexp.exec(codeLines[i]))) {
      // Skip a filename tag, which should propagate through this stage
      if (match[1] === 'filename') {
        i++
        continue
      }
      setOption(match[1], match[2], options, ts)
    } else {
      i++
      continue
    }
    codeLines.splice(i, 1)
  }
  return options
}

/** Available inline flags which are not compiler flags */
export interface ExampleOptions {
  /** Let's the sample suppress all error diagnostics */
  noErrors: false
  /** An array of TS error codes, which you write as space separated - this is so the tool can know about unexpected errors */
  errors: number[]
  /** Shows the JS equivalent of the TypeScript code instead */
  showEmit: false
  /**
   * When mixed with showEmit, lets you choose the file to present instead of the source - defaults to index.js which
   * means when you just use `showEmit` above it shows the transpiled JS.
   */
  showEmittedFile: string

  /** Whether to disable the pre-cache of LSP calls for interesting identifiers */
  noStaticSemanticInfo: false
}

const defaultHandbookOptions: ExampleOptions = {
  errors: [],
  noErrors: false,
  showEmit: false,
  showEmittedFile: 'index.js',
  noStaticSemanticInfo: false,
}

function filterHandbookOptions(codeLines: string[]): ExampleOptions {
  const options: any = { ...defaultHandbookOptions }
  for (let i = 0; i < codeLines.length; i++) {
    let match
    if ((match = booleanConfigRegexp.exec(codeLines[i]))) {
      if (match[1] in options) {
        options[match[1]] = true
        log(`Setting options.${match[1]} to true`)
        codeLines.splice(i, 1)
        i--
      }
    } else if ((match = valuedConfigRegexp.exec(codeLines[i]))) {
      if (match[1] in options) {
        options[match[1]] = match[2]
        log(`Setting options.${match[1]} to ${match[2]}`)
        codeLines.splice(i, 1)
        i--
      }
    }
  }

  // Edge case the errors object to turn it into a string array
  if ('errors' in options && typeof options.errors === 'string') {
    options.errors = options.errors.split(' ').map(Number)
    log('Setting options.error to ', options.errors)
  }

  return options
}

export interface TwoSlashReturn {
  /** The output code, could be TypeScript, but could also be a JS/JSON/d.ts */
  code: string

  /** The new extension type for the code, potentially changed if they've requested emitted results */
  extension: string

  /** Sample requests to highlight a particular part of the code */
  highlights: {
    kind: 'highlight'
    position: number
    length: number
    description: string
    line: number
  }[]

  /** An array of LSP responses identifiers in the sample  */
  staticQuickInfos: {
    /** The string content of the node this represents (mainly for debugging) */
    targetString: string
    /** The base LSP response (the type) */
    text: string
    /** Attached JSDoc info */
    docs: string | undefined
    /** The index of the text in the file */
    start: number
    /** how long the identifier */
    length: number
    /** line number where this is found */
    line: number
    /** The character on the line */
    character: number
  }[]

  /** Requests to use the LSP to get info for a particular symbol in the source */
  queries: {
    kind: 'query'
    /** The index of the text in the file */
    start: number
    /** how long the identifier */
    length: number
    offset: number
    // TODO: Add these so we can present something
    text: string
    docs: string | undefined
  }[]

  /** Diagnostic error messages which came up when creating the program */
  errors: {
    renderedMessage: string
    id: string
    category: 0 | 1 | 2 | 3
    code: number
    start: number | undefined
    length: number | undefined
    line: number | undefined
    character: number | undefined
  }[]

  /** The URL for this sample in the playground */
  playgroundURL: string
}

/**
 * Runs the checker against a TypeScript/JavaScript code sample returning potentially
 * difference code, and a set of annotations around how it works.
 *
 * @param code The twoslash markup'd code
 * @param extension For example: ts, tsx, typescript, javascript, js
 * @param tsModule An optional copy of the TypeScript import, if missing it will be require'd
 * @param lzstringModule An optional copy of the lz-string import, if missing it will be require'd
 * @param sysModule TBD
 */
export function twoslasher(
  code: string,
  extension: string,
  tsModule?: TS,
  lzstringModule?: LZ,
  fsMap?: Map<string, string>
): TwoSlashReturn {
  const ts: TS = tsModule ?? require('typescript')
  const lzstring: LZ = lzstringModule ?? require('lz-string')

  const originalCode = code
  const safeExtension = typesToExtension(extension)
  const defaultFileName = 'index.' + safeExtension

  log(`\n\nLooking at code: \n\`\`\`${safeExtension}\n${code}\n\`\`\`\n`)

  const defaultCompilerOptions: CompilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ES2016,
    allowJs: true,
  }

  validateInput(code)

  code = cleanMarkdownEscaped(code)

  // This is mutated as the below functions pull out info
  const codeLines = code.split(/\r\n?|\n/g)

  const handbookOptions = filterHandbookOptions(codeLines)
  const compilerOptions = filterCompilerOptions(codeLines, defaultCompilerOptions, ts)

  const vfs = fsMap ?? createLocallyPoweredVFS(compilerOptions)
  const system = createSystem(vfs)
  const env = createVirtualTypeScriptEnvironment(system, [], ts, compilerOptions)
  const ls = env.languageService

  // Maybe this doesn't work in the future?
  // TODO: figure a better way
  code = codeLines.join('\n')

  let queries = [] as TwoSlashReturn['queries']
  let highlights = [] as TwoSlashReturn['highlights']

  // TODO: This doesn't handle a single file with a name
  const fileContent = code.split('// @filename: ')
  const noFilepaths = fileContent.length === 1

  const makeDefault: [string, string[]] = [defaultFileName, code.split(/\r\n?|\n/g)]
  const makeMultiFile = (filenameSplit: string): [string, string[]] => {
    const [filename, ...content] = filenameSplit.split(/\r\n?|\n/g)
    return [filename, content]
  }

  /**
   * Oof, some hard to grok code in this section. To ensure _one_ code path for both
   * default and multi-file code samples it's all coerced into an array of
   * [name, lines_of_code] basically for each set.
   */
  const unfilteredNameContent: Array<[string, string[]]> = noFilepaths ? [makeDefault] : fileContent.map(makeMultiFile)
  const nameContent = unfilteredNameContent.filter(n => n[0].length)

  /** All of the referenced files in the markup */
  const filenames = nameContent.map(nc => nc[0])

  for (const file of nameContent) {
    const [filename, codeLines] = file

    // Create the file in the vfs
    const newFileCode = codeLines.join('\n')
    env.createFile(filename, newFileCode)

    const updates = filterHighlightLines(codeLines)
    highlights.push(...updates.highlights)

    // ------ Do the LSP lookup for the queries

    // TODO: this is not perfect, it seems to have issues when there are multiple queries
    // in the same sourcefile. Looks like it's about removing the query comments before them.
    let removedChars = 0
    const lspedQueries = updates.queries.map(q => {
      const quickInfo = ls.getQuickInfoAtPosition(filename, q.position - removedChars)
      const token = ls.getDefinitionAtPosition(filename, q.position - removedChars)

      removedChars += ('//' + q.offset + '?^\n').length

      let text = `Could not get LSP result: ${stringAroundIndex(env.getSourceFile(filename)!.text, q.position)}`
      let docs,
        start = 0,
        length = 0

      if (quickInfo && token && quickInfo.displayParts) {
        text = quickInfo.displayParts.map(dp => dp.text).join('')
        docs = quickInfo.documentation ? quickInfo.documentation.map(d => d.text).join('<br/>') : undefined
        length = token[0].textSpan.start
        start = token[0].textSpan.length
      }

      const queryResult = { ...q, text, docs, start, length }
      return queryResult
    })
    queries.push(...lspedQueries)

    // Sets the file in the compiler as being without the comments
    const newEditedFileCode = codeLines.join('\n')
    env.updateFile(filename, newEditedFileCode)
  }

  // We need to also strip the highlights + queries from the main file which is shown to people
  const allCodeLines = code.split(/\r\n?|\n/g)
  filterHighlightLines(allCodeLines)
  code = allCodeLines.join('\n')

  // Code should now be safe to compile, so we're going to split it into different files
  const errs: import('typescript').Diagnostic[] = []
  // Let because of a filter when cutting
  let staticQuickInfos: TwoSlashReturn['staticQuickInfos'] = []

  // Iterate through the declared files and grab errors and LSP quickinfos
  // const declaredFiles = Object.keys(fileMap)

  filenames.forEach(file => {
    if (!handbookOptions.noErrors) {
      errs.push(...ls.getSemanticDiagnostics(file))
      errs.push(...ls.getSyntacticDiagnostics(file))
    }

    // Get all of the interesting quick info popover
    if (!handbookOptions.noStaticSemanticInfo) {
      // const fileRep = fileMap[file]
      const source = env.sys.readFile(file)!
      const fileContentStartIndexInModifiedFile = code.indexOf(source)

      const sourceFile = env.getSourceFile(file)
      if (sourceFile) {
        const idenfiers = getIdentifierTextSpans(ts, sourceFile)

        for (const idenfier of idenfiers) {
          const span = idenfier.span
          const quickInfo = ls.getQuickInfoAtPosition(file, span.start)
          if (quickInfo && quickInfo.displayParts) {
            const text = quickInfo.displayParts.map(dp => dp.text).join('')
            const docs = quickInfo.documentation ? quickInfo.documentation.map(d => d.text).join('\n') : undefined
            const position = span.start + fileContentStartIndexInModifiedFile
            const { line, character } = ts.getLineAndCharacterOfPosition(sourceFile, position)
            const targetString = idenfier.text
            staticQuickInfos.push({ text, docs, start: position, length: span.length, line, character, targetString })
          }
        }
      }
    }
  })

  const relevantErrors = errs.filter(e => e.file && filenames.includes(e.file.fileName))

  // A validator that error codes are mentioned, so we can know if something has broken in the future
  if (relevantErrors.length) {
    validateCodeForErrors(relevantErrors, handbookOptions, extension, originalCode)
  }

  let errors: TwoSlashReturn['errors'] = []

  // We can't pass the ts.DiagnosticResult out directly (it can't be JSON.stringified)
  for (const err of relevantErrors) {
    const codeWhereErrorLives = env.sys.readFile(err.file!.fileName)!
    const fileContentStartIndexInModifiedFile = code.indexOf(codeWhereErrorLives)
    const renderedMessage = escapeHtml(ts.flattenDiagnosticMessageText(err.messageText, '\n'))
    const id = `err-${err.code}-${err.start}-${err.length}`
    const { line, character } = ts.getLineAndCharacterOfPosition(err.file!, err.start!)

    errors.push({
      category: err.category,
      code: err.code,
      length: err.length,
      start: err.start ? err.start + fileContentStartIndexInModifiedFile : undefined,
      line,
      character,
      renderedMessage,
      id,
    })
  }

  // Handle emitting files
  if (handbookOptions.showEmit) {
    const output = ls.getEmitOutput(defaultFileName)
    const file = output.outputFiles.find(o => o.name === handbookOptions.showEmittedFile)
    if (!file) {
      const allFiles = output.outputFiles.map(o => o.name).join(', ')
      throw new Error(`Cannot find the file ${handbookOptions.showEmittedFile} - in ${allFiles}`)
    }

    code = file.text
    extension = file.name.split('.').pop()!

    // Remove highlights and queries, because it won't work across transpiles,
    // though I guess source-mapping could handle the transition
    highlights = []
    queries = []
    staticQuickInfos = []
  }

  const zippedCode = lzstring.compressToEncodedURIComponent(originalCode)
  const playgroundURL = `https://www.typescriptlang.org/play/#code/${zippedCode}`

  const cutString = '// ---cut---\n'
  if (code.includes(cutString)) {
    // Get the place it is, then find the end and the start of the next line
    const cutIndex = code.indexOf(cutString) + cutString.length
    // Kills the code shown
    code = code.split(cutString).pop()!

    // For any type of metadata shipped, it will need to be shifted to
    // fit in with the new positions after the cut
    staticQuickInfos.forEach(info => (info.start -= cutIndex))
    staticQuickInfos = staticQuickInfos.filter(s => s.start > -1)

    errors.forEach(err => {
      if (err.start) err.start -= cutIndex
    })
    errors = errors.filter(e => e.start && e.start > -1)

    highlights.forEach(highlight => (highlight.position -= cutIndex))
    highlights = highlights.filter(e => e.position > -1)

    queries.forEach(q => (q.start -= cutIndex))
    queries = queries.filter(q => q.start > -1)
  }

  return {
    code,
    extension,
    highlights,
    queries,
    staticQuickInfos,
    errors,
    playgroundURL,
  }
}

const createLocallyPoweredVFS = (compilerOptions: CompilerOptions) => {
  return createDefaultMapFromNodeModules(compilerOptions)
}
