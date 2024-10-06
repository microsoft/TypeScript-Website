let hasLocalStorage = false
try {
  hasLocalStorage = typeof localStorage !== `undefined`
} catch (error) { }
const hasProcess = typeof process !== `undefined`
const shouldDebug = (hasLocalStorage && localStorage.getItem("DEBUG")) || (hasProcess && process.env.DEBUG)

type LZ = typeof import("lz-string")
type TS = typeof import("typescript")
type CompilerOptions = import("typescript").CompilerOptions
type CustomTransformers = import("typescript").CustomTransformers

import { parsePrimitive, cleanMarkdownEscaped, typesToExtension, getIdentifierTextSpans, getClosestWord } from "./utils"
import { validateInput, validateCodeForErrors } from "./validation"

import { createSystem, createVirtualTypeScriptEnvironment, createFSBackedSystem } from "@typescript/vfs"

const log = shouldDebug ? console.log : (_message?: any, ..._optionalParams: any[]) => ""

// Hacking in some internal stuff
declare module "typescript" {
  type Option = {
    name: string
    type: "list" | "boolean" | "number" | "string" | Map<string, any>
    element?: Option
  }

  const optionDeclarations: Array<Option>
}

type QueryPosition = {
  kind: "query" | "completion"
  offset: number
  text: string | undefined
  docs: string | undefined
  line: number
}

type PartialQueryResults = {
  kind: "query"
  text: string
  docs: string | undefined
  line: number
  offset: number
  file: string
}

type PartialCompletionResults = {
  kind: "completions"
  completions: import("typescript").CompletionEntry[]
  completionPrefix: string

  line: number
  offset: number
  file: string
}

type HighlightPosition = TwoSlashReturn["highlights"][number]

export class TwoslashError extends Error {
  public title: string
  public description: string
  public recommendation: string
  public code: string | undefined

  constructor(title: string, description: string, recommendation: string, code?: string | undefined) {
    let message = `
## ${title}

${description}
`
    if (recommendation) {
      message += `\n${recommendation}`
    }

    if (code) {
      message += `\n${code}`
    }

    super(message)
    this.title = title
    this.description = description
    this.recommendation = recommendation
    this.code = code
  }
}

function filterHighlightLines(codeLines: string[]): { highlights: HighlightPosition[]; queries: QueryPosition[] } {
  const highlights: HighlightPosition[] = []
  const queries: QueryPosition[] = []

  let nextContentOffset = 0
  let contentOffset = 0
  let removedLines = 0

  for (let i = 0; i < codeLines.length; i++) {
    const line = codeLines[i]
    const moveForward = () => {
      contentOffset = nextContentOffset
      nextContentOffset += line.length + 1
    }

    const stripLine = (logDesc: string) => {
      log(`Removing line ${i} for ${logDesc}`)

      removedLines++
      codeLines.splice(i, 1)
      i--
    }

    // We only need to run regexes over lines with comments
    if (!line.includes("//")) {
      moveForward()
    } else {
      const highlightMatch = /^\s*\/\/\s*\^+( .+)?$/.exec(line)
      const queryMatch = /^\s*\/\/\s*\^\?\s*$/.exec(line)
      // https://regex101.com/r/2yDsRk/1
      const removePrettierIgnoreMatch = /^\s*\/\/ prettier-ignore$/.exec(line)
      const completionsQuery = /^\s*\/\/\s*\^\|$/.exec(line)

      if (queryMatch !== null) {
        const start = line.indexOf("^")
        queries.push({ kind: "query", offset: start, text: undefined, docs: undefined, line: i + removedLines - 1 })
        stripLine("having a query")
      } else if (highlightMatch !== null) {
        const start = line.indexOf("^")
        const length = line.lastIndexOf("^") - start + 1
        const description = highlightMatch[1] ? highlightMatch[1].trim() : ""
        highlights.push({
          kind: "highlight",
          offset: start + contentOffset,
          length,
          text: description,
          line: i + removedLines - 1,
          start,
        })

        stripLine("having a highlight")
      } else if (removePrettierIgnoreMatch !== null) {
        stripLine("being a prettier ignore")
      } else if (completionsQuery !== null) {
        const start = line.indexOf("^")
        // prettier-ignore
        queries.push({ kind: "completion", offset: start, text: undefined, docs: undefined, line: i + removedLines - 1 })
        stripLine("having a completion query")
      } else {
        moveForward()
      }
    }
  }
  return { highlights, queries }
}

function getOptionValueFromMap(name: string, key: string, optMap: Map<string, string>) {
  const result = optMap.get(key.toLowerCase())
  log(`Get ${name} mapped option: ${key} => ${result}`)
  if (result === undefined) {
    const keys = Array.from(optMap.keys() as any)

    throw new TwoslashError(
      `Invalid inline compiler value`,
      `Got ${key} for ${name} but it is not a supported value by the TS compiler.`,
      `Allowed values: ${keys.join(",")}`
    )
  }
  return result
}

function setOption(name: string, value: string, opts: CompilerOptions, ts: TS) {
  log(`Setting ${name} to ${value}`)

  for (const opt of ts.optionDeclarations) {
    if (opt.name.toLowerCase() === name.toLowerCase()) {
      switch (opt.type) {
        case "number":
        case "string":
        case "boolean":
          opts[opt.name] = parsePrimitive(value, opt.type)
          break

        case "list":
          const elementType = opt.element!.type
          const strings = value.split(",")
          if (typeof elementType === "string") {
            opts[opt.name] = strings.map(v => parsePrimitive(v, elementType))
          } else {
            opts[opt.name] = strings.map(v => getOptionValueFromMap(opt.name, v, elementType as Map<string, string>))
          }
          break

        default:
          // It's a map!
          const optMap = opt.type as Map<string, string>
          opts[opt.name] = getOptionValueFromMap(opt.name, value, optMap)
          break
      }
      return
    }
  }

  throw new TwoslashError(
    `Invalid inline compiler flag`,
    `There isn't a TypeScript compiler flag called '${name}'.`,
    `This is likely a typo, you can check all the compiler flags in the TSConfig reference, or check the additional Twoslash flags in the npm page for @typescript/twoslash.`
  )
}

const booleanConfigRegexp = /^\/\/\s?@(\w+)$/

// https://regex101.com/r/8B2Wwh/1
const valuedConfigRegexp = /^\/\/\s?@(\w+):\s?(.+)$/

function filterCompilerOptions(codeLines: string[], defaultCompilerOptions: CompilerOptions, ts: TS) {
  const options = { ...defaultCompilerOptions }
  for (let i = 0; i < codeLines.length;) {
    let match
    if ((match = booleanConfigRegexp.exec(codeLines[i]))) {
      options[match[1]] = true
      setOption(match[1], "true", options, ts)
    } else if ((match = valuedConfigRegexp.exec(codeLines[i]))) {
      // Skip a filename tag, which should propagate through this stage
      if (match[1] === "filename") {
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

function filterCustomTags(codeLines: string[], customTags: string[]) {
  const tags: TwoSlashReturn["tags"] = []

  for (let i = 0; i < codeLines.length;) {
    let match
    if ((match = valuedConfigRegexp.exec(codeLines[i]))) {
      if (customTags.includes(match[1])) {
        tags.push({ name: match[1], line: i, annotation: codeLines[i].split("@" + match[1] + ": ")[1] })
        codeLines.splice(i, 1)
      }
    }
    i++
  }
  return tags
}

/** Available inline flags which are not compiler flags */
export interface ExampleOptions {
  /** Lets the sample suppress all error diagnostics */
  noErrors: boolean
  /** An array of TS error codes, which you write as space separated - this is so the tool can know about unexpected errors */
  errors: number[]
  /** Shows the JS equivalent of the TypeScript code instead */
  showEmit: boolean
  /**
   * Must be used with showEmit, lets you choose the file to present instead of the source - defaults to index.js which
   * means when you just use `showEmit` above it shows the transpiled JS.
   */
  showEmittedFile: string

  /** Whether to disable the pre-cache of LSP calls for interesting identifiers, defaults to false */
  noStaticSemanticInfo: boolean
  /** Declare that the TypeScript program should edit the fsMap which is passed in, this is only useful for tool-makers, defaults to false */
  emit: boolean
  /** Declare that you don't need to validate that errors have corresponding annotations, defaults to false */
  noErrorValidation: boolean
}

// Keys in this object are used to filter out handbook options
// before compiler options are set.

const defaultHandbookOptions: Partial<ExampleOptions> = {
  errors: [],
  noErrors: false,
  showEmit: false,
  showEmittedFile: undefined,
  noStaticSemanticInfo: false,
  emit: false,
  noErrorValidation: false,
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
  if ("errors" in options && typeof options.errors === "string") {
    options.errors = options.errors.split(" ").map(Number)
    log("Setting options.error to ", options.errors)
  }

  return options
}

export interface TwoSlashReturn {
  /** The output code, could be TypeScript, but could also be a JS/JSON/d.ts */
  code: string

  /** The new extension type for the code, potentially changed if they've requested emitted results */
  extension: string

  /** Requests to highlight a particular part of the code */
  highlights: {
    kind: "highlight"
    /** The index of the text in the file */
    start: number
    /** What line is the highlighted identifier on? */
    line: number
    /** At what index in the line does the caret represent  */
    offset: number
    /** The text of the token which is highlighted */
    text?: string
    /** The length of the token */
    length: number
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
    kind: "query" | "completions"
    /** What line is the highlighted identifier on? */
    line: number
    /** At what index in the line does the caret represent  */
    offset: number
    /** The text of the token which is highlighted */
    text?: string
    /** Any attached JSDocs */
    docs?: string | undefined
    /** The token start which the query indicates  */
    start: number
    /** The length of the token */
    length: number
    /** Results for completions at a particular point */
    completions?: import("typescript").CompletionEntry[]
    /* Completion prefix e.g. the letters before the cursor in the word so you can filter */
    completionsPrefix?: string
  }[]

  /** The extracted twoslash commands for any custom tags passed in via customTags */
  tags: {
    /** What was the name of the tag */
    name: string
    /** Where was it located in the original source file */
    line: number
    /** What was the text after the `// @tag: ` string  (optional because you could do // @tag on it's own line without the ':') */
    annotation?: string
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

export interface TwoSlashOptions {
  /** Allows setting any of the handbook options from outside the function, useful if you don't want LSP identifiers */
  defaultOptions?: Partial<ExampleOptions>

  /** Allows setting any of the compiler options from outside the function */
  defaultCompilerOptions?: CompilerOptions

  /** Allows applying custom transformers to the emit result, only useful with the showEmit output */
  customTransformers?: CustomTransformers

  /** An optional copy of the TypeScript import, if missing it will be require'd. */
  tsModule?: TS

  /** Absolute path to the directory to look up built-in TypeScript .d.ts files. */
  tsLibDirectory?: string

  /** An optional copy of the lz-string import, if missing it will be require'd. */
  lzstringModule?: LZ

  /**
   * An optional Map object which is passed into @typescript/vfs - if you are using twoslash on the
   * web then you'll need this to set up your lib *.d.ts files. If missing, it will use your fs.
   */
  fsMap?: Map<string, string>

  /** The cwd for the folder which the virtual fs should be overlaid on top of when using local fs, opts to process.cwd() if not present */
  vfsRoot?: string

  /** A set of known `// @[tags]` tags to extract and not treat as a comment */
  customTags?: string[]
}

/**
 * Runs the checker against a TypeScript/JavaScript code sample returning potentially
 * difference code, and a set of annotations around how it works.
 *
 * @param code The twoslash markup'd code
 * @param extension For example: "ts", "tsx", "typescript", "javascript" or "js".
 * @param options Additional options for twoslash
 */
export function twoslasher(code: string, extension: string, options: TwoSlashOptions = {}): TwoSlashReturn {
  const ts: TS = options.tsModule ?? require("typescript")
  const lzstring: LZ = options.lzstringModule ?? require("lz-string")

  const originalCode = code
  const safeExtension = typesToExtension(extension)
  const defaultFileName = "index." + safeExtension

  log(`\n\nLooking at code: \n\`\`\`${safeExtension}\n${code}\n\`\`\`\n`)

  const defaultCompilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ES2016,
    allowJs: true,
    ...(options.defaultCompilerOptions ?? {}),
  }

  validateInput(code)

  code = cleanMarkdownEscaped(code)

  // NOTE: codeLines is mutated by the below functions:
  const codeLines = code.split(/\r\n?|\n/g)

  let tags: TwoSlashReturn["tags"] = options.customTags ? filterCustomTags(codeLines, options.customTags) : []
  const handbookOptions = { ...filterHandbookOptions(codeLines), ...options.defaultOptions }
  const compilerOptions = filterCompilerOptions(codeLines, defaultCompilerOptions, ts)

  // Handle special casing the lookup for when using jsx preserve which creates .jsx files
  if (!handbookOptions.showEmittedFile) {
    handbookOptions.showEmittedFile =
      compilerOptions.jsx && compilerOptions.jsx === ts.JsxEmit.Preserve ? "index.jsx" : "index.js"
  }

  const getRoot = () => {
    const pa = "pa"
    const path = require(pa + "th") as typeof import("path")
    const rootPath = options.vfsRoot || process.cwd()
    return rootPath.split(path.sep).join(path.posix.sep)
  }

  // In a browser we want to DI everything, in node we can use local infra
  const useFS = !!options.fsMap
  const vfs = useFS && options.fsMap ? options.fsMap : new Map<string, string>()
  const system = useFS ? createSystem(vfs) : createFSBackedSystem(vfs, getRoot(), ts, options.tsLibDirectory)
  const fsRoot = useFS ? "/" : getRoot() + "/"

  const env = createVirtualTypeScriptEnvironment(system, [], ts, compilerOptions, options.customTransformers)
  const ls = env.languageService

  code = codeLines.join("\n")

  let partialQueries = [] as (PartialQueryResults | PartialCompletionResults)[]
  let queries = [] as TwoSlashReturn["queries"]
  let highlights = [] as TwoSlashReturn["highlights"]

  const nameContent = splitTwoslashCodeInfoFiles(code, defaultFileName, fsRoot)
  const sourceFiles = ["js", "jsx", "ts", "tsx"]

  /** All of the referenced files in the markup */
  const filenames = nameContent.map(nc => nc[0])

  for (const file of nameContent) {
    const [filename, codeLines] = file
    const filetype = filename.split(".").pop() || ""

    // Only run the LSP-y things on source files
    const allowJSON = compilerOptions.resolveJsonModule && filetype === "json"
    if (!sourceFiles.includes(filetype) && !allowJSON) {
      continue
    }

    // Create the file in the vfs
    const newFileCode = codeLines.join("\n")
    env.createFile(filename, newFileCode)

    const updates = filterHighlightLines(codeLines)
    highlights = highlights.concat(updates.highlights)

    // ------ Do the LSP lookup for the queries

    const lspedQueries = updates.queries.map((q, i) => {
      const sourceFile = env.getSourceFile(filename)!
      const position = ts.getPositionOfLineAndCharacter(sourceFile, q.line, q.offset)
      switch (q.kind) {
        case "query": {
          const quickInfo = ls.getQuickInfoAtPosition(filename, position)

          // prettier-ignore
          let text: string
          let docs: string | undefined

          if (quickInfo && quickInfo.displayParts) {
            text = quickInfo.displayParts.map(dp => dp.text).join("")
            docs = quickInfo.documentation ? quickInfo.documentation.map(d => d.text).join("<br/>") : undefined
          } else {
            throw new TwoslashError(
              `Invalid QuickInfo query`,
              `The request on line ${q.line} in ${filename} for quickinfo via ^? returned no from the compiler.`,
              `This is likely that the x positioning is off.`
            )
          }

          const queryResult: PartialQueryResults = {
            kind: "query",
            text,
            docs,
            line: q.line - i,
            offset: q.offset,
            file: filename,
          }
          return queryResult
        }

        case "completion": {
          const completions = ls.getCompletionsAtPosition(filename, position - 1, {})
          if (!completions && !handbookOptions.noErrorValidation) {
            throw new TwoslashError(
              `Invalid completion query`,
              `The request on line ${q.line} in ${filename} for completions via ^| returned no completions from the compiler.`,
              `This is likely that the positioning is off.`
            )
          }

          const word = getClosestWord(sourceFile.text, position - 1)
          const prefix = sourceFile.text.slice(word.startPos, position)
          const lastDot = prefix.split(".").pop() || ""

          const queryResult: PartialCompletionResults = {
            kind: "completions",
            completions: completions?.entries || [],
            completionPrefix: lastDot,
            line: q.line - i,
            offset: q.offset,
            file: filename,
          }
          return queryResult
        }
      }
    })
    partialQueries = partialQueries.concat(lspedQueries)

    // Sets the file in the compiler as being without the comments
    const newEditedFileCode = codeLines.join("\n")
    env.updateFile(filename, newEditedFileCode)
  }

  // We need to also strip the highlights + queries from the main file which is shown to people
  const allCodeLines = code.split(/\r\n?|\n/g)
  filterHighlightLines(allCodeLines)
  code = allCodeLines.join("\n")

  // Lets fs changes propagate back up to the fsMap
  if (handbookOptions.emit) {
    filenames.forEach(f => {
      const filetype = f.split(".").pop() || ""
      if (!sourceFiles.includes(filetype)) return

      const output = ls.getEmitOutput(f)
      output.outputFiles.forEach(output => {
        system.writeFile(output.name, output.text)
      })
    })
  }

  // Code should now be safe to compile, so we're going to split it into different files
  let errs: import("typescript").Diagnostic[] = []
  // Let because of a filter when cutting
  let staticQuickInfos: TwoSlashReturn["staticQuickInfos"] = []

  // Iterate through the declared files and grab errors and LSP quickinfos
  // const declaredFiles = Object.keys(fileMap)

  filenames.forEach(file => {
    const filetype = file.split(".").pop() || ""

    // Only run the LSP-y things on source files
    if (!sourceFiles.includes(filetype)) {
      return
    }

    if (!handbookOptions.noErrors) {
      errs = errs.concat(ls.getSemanticDiagnostics(file), ls.getSyntacticDiagnostics(file))
    }

    const source = env.sys.readFile(file)!
    const sourceFile = env.getSourceFile(file)
    if (!sourceFile) {
      throw new TwoslashError(
        `Could not find a  TypeScript sourcefile for '${file}' in the Twoslash vfs`,
        `It's a little hard to provide useful advice on this error. Maybe you imported something which the compiler doesn't think is a source file?`,
        ``
      )
    }

    // Get all of the interesting quick info popover
    if (!handbookOptions.showEmit) {
      const fileContentStartIndexInModifiedFile = code.indexOf(source) == -1 ? 0 : code.indexOf(source)
      const linesAbove = code.slice(0, fileContentStartIndexInModifiedFile).split("\n").length - 1

      // Get all interesting identifiers in the file, so we can show hover info for it
      const identifiers = handbookOptions.noStaticSemanticInfo ? [] : getIdentifierTextSpans(ts, sourceFile)
      for (const identifier of identifiers) {
        const span = identifier.span
        const quickInfo = ls.getQuickInfoAtPosition(file, span.start)

        if (quickInfo && quickInfo.displayParts) {
          const text = quickInfo.displayParts.map(dp => dp.text).join("")
          const targetString = identifier.text
          const docs = quickInfo.documentation ? quickInfo.documentation.map(d => d.text).join("\n") : undefined

          // Get the position of the
          const position = span.start + fileContentStartIndexInModifiedFile
          // Use TypeScript to pull out line/char from the original code at the position + any previous offset
          const burnerSourceFile = ts.createSourceFile("_.ts", code, ts.ScriptTarget.ES2015)
          const { line, character } = ts.getLineAndCharacterOfPosition(burnerSourceFile, position)

          staticQuickInfos.push({ text, docs, start: position, length: span.length, line, character, targetString })
        }
      }

      // Offset the queries for this file because they are based on the line for that one
      // specific file, and not the global twoslash document. This has to be done here because
      // in the above loops, the code for queries/highlights/etc hasn't been stripped yet.
      partialQueries
        .filter((q: any) => q.file === file)
        .forEach(q => {
          const pos =
            ts.getPositionOfLineAndCharacter(sourceFile, q.line, q.offset) + fileContentStartIndexInModifiedFile

          switch (q.kind) {
            case "query": {
              queries.push({
                docs: q.docs,
                kind: "query",
                start: pos + fileContentStartIndexInModifiedFile,
                length: q.text.length,
                text: q.text,
                offset: q.offset,
                line: q.line + linesAbove + 1,
              })
              break
            }
            case "completions": {
              queries.push({
                completions: q.completions,
                kind: "completions",
                start: pos + fileContentStartIndexInModifiedFile,
                completionsPrefix: q.completionPrefix,
                length: 1,
                offset: q.offset,
                line: q.line + linesAbove + 1,
              })
            }
          }
        })
    }
  })

  const relevantErrors = errs.filter(e => e.file && filenames.includes(e.file.fileName))

  // A validator that error codes are mentioned, so we can know if something has broken in the future
  if (!handbookOptions.noErrorValidation && relevantErrors.length) {
    validateCodeForErrors(relevantErrors, handbookOptions, extension, originalCode, fsRoot)
  }

  let errors: TwoSlashReturn["errors"] = []

  // We can't pass the ts.DiagnosticResult out directly (it can't be JSON.stringified)
  for (const err of relevantErrors) {
    const codeWhereErrorLives = env.sys.readFile(err.file!.fileName)!
    const lineOffset =
      codeLines.findIndex(line => {
        if (line.includes(`// @filename: `)) {
          const fileName = line.split("// @filename: ")[1].trim()
          return err.file!.fileName.endsWith(fileName)
        }
        return false
      }) + 1
    const fileContentStartIndexInModifiedFile = code.indexOf(codeWhereErrorLives)
    const renderedMessage = ts.flattenDiagnosticMessageText(err.messageText, "\n")
    const id = `err-${err.code}-${err.start}-${err.length}`
    const { line, character } = ts.getLineAndCharacterOfPosition(err.file!, err.start!)

    errors.push({
      category: err.category,
      code: err.code,
      length: err.length,
      start: err.start ? err.start + fileContentStartIndexInModifiedFile : undefined,
      line: line + lineOffset,
      character,
      renderedMessage,
      id,
    })
  }

  // Handle emitting files
  if (handbookOptions.showEmit) {
    // Get the file which created the file we want to show:
    const emitFilename = handbookOptions.showEmittedFile || defaultFileName
    const emitSourceFilename =
      fsRoot + emitFilename.replace(".jsx", "").replace(".js", "").replace(/\.d\.([^\.]+\.)?[cm]?ts$/i, "").replace(".map", "")

    let emitSource = filenames.find(f => f === emitSourceFilename + ".ts" || f === emitSourceFilename + ".tsx")

    if (!emitSource && !compilerOptions.outFile) {
      const allFiles = filenames.join(", ")
      // prettier-ignore
      throw new TwoslashError(
        `Could not find source file to show the emit for`,
        `Cannot find the corresponding **source** file  ${emitFilename} for completions via ^| returned no quickinfo from the compiler.`,
        `Looked for: ${emitSourceFilename} in the vfs - which contains: ${allFiles}`
      )
    }

    // Allow outfile, in which case you need any file.
    if (compilerOptions.outFile) {
      emitSource = filenames[0]
    }

    const output = ls.getEmitOutput(emitSource!)
    const file = output.outputFiles.find(
      o => o.name === fsRoot + handbookOptions.showEmittedFile || o.name === handbookOptions.showEmittedFile
    )

    if (!file) {
      const allFiles = output.outputFiles.map(o => o.name).join(", ")
      throw new TwoslashError(
        `Cannot find the output file in the Twoslash VFS`,
        `Looking for ${handbookOptions.showEmittedFile} in the Twoslash vfs after compiling`,
        `Looked for" ${fsRoot + handbookOptions.showEmittedFile} in the vfs - which contains ${allFiles}.`
      )
    }

    code = file.text
    extension = file.name.split(".").pop()!

    // Remove highlights and queries, because it won't work across transpiles,
    // though I guess source-mapping could handle the transition
    highlights = []
    partialQueries = []
    staticQuickInfos = []
  }

  const zippedCode = lzstring.compressToEncodedURIComponent(originalCode)
  const playgroundURL = `https://www.typescriptlang.org/play/#code/${zippedCode}`

  // Cutting happens last, and it means editing the lines and character index of all
  // the type annotations which are attached to a location

  const cutString = "// ---cut---\n"
  if (code.includes(cutString)) {
    // Get the place it is, then find the end and the start of the next line
    const cutIndex = code.indexOf(cutString) + cutString.length
    const lineOffset = code.substr(0, cutIndex).split("\n").length - 1

    // Kills the code shown
    code = code.split(cutString).pop()!

    // For any type of metadata shipped, it will need to be shifted to
    // fit in with the new positions after the cut
    staticQuickInfos.forEach(info => {
      info.start -= cutIndex
      info.line -= lineOffset
    })
    staticQuickInfos = staticQuickInfos.filter(s => s.start > -1)

    errors.forEach(err => {
      if (err.start) err.start -= cutIndex
      if (err.line) err.line -= lineOffset
    })
    errors = errors.filter(e => e.start && e.start > -1)

    highlights.forEach(highlight => {
      highlight.start -= cutIndex
      highlight.line -= lineOffset
    })

    highlights = highlights.filter(e => e.start > -1)

    queries.forEach(q => (q.line -= lineOffset))
    queries = queries.filter(q => q.line > -1)

    tags.forEach(q => (q.line -= lineOffset))
    tags = tags.filter(q => q.line > -1)
  }

  const cutAfterString = "// ---cut-after---\n"

  if (code.includes(cutAfterString)) {

    // Get the place it is, then find the end and the start of the next line
    const cutIndex = code.indexOf(cutAfterString) + cutAfterString.length
    const lineOffset = code.substr(0, cutIndex).split("\n").length - 1

    // Kills the code shown, removing any whitespace on the end
    code = code.split(cutAfterString).shift()!.trimEnd()

    // Cut any metadata after the cutAfterString
    staticQuickInfos = staticQuickInfos.filter(s => s.line < lineOffset)
    errors = errors.filter(e => e.line && e.line < lineOffset)
    highlights = highlights.filter(e => e.line < lineOffset)
    queries = queries.filter(q => q.line < lineOffset)
    tags = tags.filter(q => q.line < lineOffset)
  }

  return {
    code,
    extension,
    highlights,
    queries,
    staticQuickInfos,
    errors,
    playgroundURL,
    tags,
  }
}

const splitTwoslashCodeInfoFiles = (code: string, defaultFileName: string, root: string) => {
  const lines = code.split(/\r\n?|\n/g)

  let nameForFile = code.includes(`@filename: ${defaultFileName}`) ? "global.ts" : defaultFileName
  let currentFileContent: string[] = []
  const fileMap: Array<[string, string[]]> = []

  for (const line of lines) {
    if (line.includes("// @filename: ")) {
      fileMap.push([root + nameForFile, currentFileContent])
      nameForFile = line.split("// @filename: ")[1].trim()
      currentFileContent = []
    } else {
      currentFileContent.push(line)
    }
  }
  fileMap.push([root + nameForFile, currentFileContent])

  // Basically, strip these:
  // ["index.ts", []]
  // ["index.ts", [""]]
  const nameContent = fileMap.filter(n => n[1].length > 0 && (n[1].length > 1 || n[1][0] !== ""))
  return nameContent
}
