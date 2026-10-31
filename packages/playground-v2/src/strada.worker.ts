import type { StradaLoadingProgress } from "./strada"
import { loadStradaLibraries } from "./strada-libraries"
import { createStradaFileSystem, normalizeStradaPath as normalizePath } from "./strada-project"

type TS = typeof import("typescript")

type InitMessage = {
  id: number
  method: "init"
  args: {
    compilerSource: string
    files: Record<string, string>
    sourceFiles: string[]
    version: string
    baseUrl: string
  }
}

type RequestMessage = {
  id: number
  method: string
  args: any
}

type FileEntry = {
  text: string
  version: number
}

let ts: TS
let version = ""
let baseUrl = ""
let parsedConfig: ReturnType<typeof parseConfig>
let projectVersion = 0
const files = new Map<string, FileEntry>()
const libraries = new Map<string, string>()
let sourceFiles: string[] = []
let filesystem: ReturnType<typeof createStradaFileSystem>
let languageService: import("typescript").LanguageService
let inferredLanguageService: import("typescript").LanguageService | undefined

self.addEventListener("message", (event: MessageEvent<InitMessage | RequestMessage>) => {
  void handleMessage(event.data)
})

async function handleMessage(message: InitMessage | RequestMessage) {
  try {
    const result =
      message.method === "init" ? await initialize(message.args) : await dispatch(message.method, message.args)
    self.postMessage({ id: message.id, result })
  } catch (error) {
    self.postMessage({
      id: message.id,
      error: error instanceof Error ? error.stack ?? error.message : String(error),
    })
  }
}

async function initialize(args: InitMessage["args"]) {
  reportProgress({ phase: "initializing" })
  // The owning page supplies compiler code from our trusted compiler CDN over
  // this dedicated worker's private channel. Evaluating that compiler is intentional.
  ts = new Function(`${args.compilerSource}\nreturn ts;`)() as TS
  filesystem = createStradaFileSystem(ts, () => [...files.keys(), ...libraries.keys()], readFile)
  version = args.version
  baseUrl = args.baseUrl
  replaceFiles(args.files, args.sourceFiles)
  refreshConfig()
  await loadLibraries(parsedConfig.options)
  reportProgress({ phase: "initializing" })
  languageService = ts.createLanguageService(createLanguageServiceHost())
  return { version: ts.version }
}

async function dispatch(method: string, args: any) {
  const service = args.fileName && method !== "readFile" ? languageServiceForFile(args.fileName) : languageService
  switch (method) {
    case "updateFiles":
      replaceFiles(args.files, args.sourceFiles)
      refreshConfig()
      await loadLibraries(parsedConfig.options)
      return
    case "compile":
      return compile()
    case "quickInfo":
      return service.getQuickInfoAtPosition(args.fileName, args.position)
    case "completions": {
      const result = service.getCompletionsAtPosition(args.fileName, args.position, args.options)
      if (
        !result ||
        result.optionalReplacementSpan ||
        !result.entries.some(entry => entry.kind === ts.ScriptElementKind.string)
      ) {
        return result
      }
      // Older compilers omit the replacement span for string-literal completions.
      const source = service.getProgram()?.getSourceFile(normalizePath(args.fileName))
      return {
        ...result,
        optionalReplacementSpan: source && stringLiteralSpan(source, args.position),
      }
    }
    case "completionDetails":
      return service.getCompletionEntryDetails(args.fileName, args.position, args.name, {}, args.source, {}, args.data)
    case "definitions":
      return service.getDefinitionAndBoundSpan
        ? service.getDefinitionAndBoundSpan(args.fileName, args.position)
        : {
            definitions: service.getDefinitionAtPosition(args.fileName, args.position),
          }
    case "references":
      return service.getReferencesAtPosition(args.fileName, args.position)
    case "occurrences": {
      const serviceWithOccurrences = service as import("typescript").LanguageService & {
        getOccurrencesAtPosition?(fileName: string, position: number): readonly any[] | undefined
      }
      if (serviceWithOccurrences.getOccurrencesAtPosition) {
        return serviceWithOccurrences.getOccurrencesAtPosition(args.fileName, args.position)
      }
      const highlights = service.getDocumentHighlights(args.fileName, args.position, [...files.keys()])
      return (
        highlights
          ?.find(result => normalizePath(result.fileName) === normalizePath(args.fileName))
          ?.highlightSpans.map(highlight => ({
            isWriteAccess: highlight.kind === "writtenReference",
            textSpan: highlight.textSpan,
          })) ?? []
      )
    }
    case "signatureHelp":
      return service.getSignatureHelpItems(args.fileName, args.position, args.options)
    case "renameInfo":
      return service.getRenameInfo(args.fileName, args.position, {
        allowRenameOfImportPath: true,
      })
    case "renameLocations":
      return service.findRenameLocations(args.fileName, args.position, false, false, true)
    case "navigationBarItems":
      return service.getNavigationBarItems(args.fileName)
    case "formatDocument":
      return service.getFormattingEditsForDocument(args.fileName, args.options)
    case "formatRange":
      return service.getFormattingEditsForRange(args.fileName, args.start, args.end, args.options)
    case "formatOnType":
      return service.getFormattingEditsAfterKeystroke(args.fileName, args.position, args.key, args.options)
    case "codeFixes":
      return service.getCodeFixesAtPosition(
        args.fileName,
        args.start,
        args.end,
        args.errorCodes,
        args.formatOptions,
        args.preferences
      )
    case "inlayHints": {
      const serviceWithHints = service as import("typescript").LanguageService & {
        provideInlayHints?(
          fileName: string,
          span: import("typescript").TextSpan,
          preferences: import("typescript").UserPreferences
        ): readonly any[]
      }
      return serviceWithHints.provideInlayHints?.(args.fileName, args.span, args.preferences) ?? []
    }
    case "readFile":
      return readFile(args.fileName)
    default:
      throw new Error(`Unknown Strada request: ${method}`)
  }
}

function replaceFiles(nextFiles: Record<string, string>, nextSourceFiles: readonly string[]) {
  sourceFiles = nextSourceFiles.map(normalizePath)
  const nextNames = new Set(Object.keys(nextFiles))
  for (const fileName of files.keys()) {
    if (!nextNames.has(fileName)) files.delete(fileName)
  }
  for (const [fileName, text] of Object.entries(nextFiles)) {
    const current = files.get(fileName)
    if (!current || current.text !== text) {
      files.set(fileName, {
        text,
        version: (current?.version ?? 0) + 1,
      })
    }
  }
  projectVersion++
}

function refreshConfig() {
  parsedConfig = parseConfig()
  projectVersion++
}

function parseConfig() {
  const configPath =
    [...files.keys()].find(fileName => /\/tsconfig\.json$/i.test(fileName)) ??
    [...files.keys()].find(fileName => /\/jsconfig\.json$/i.test(fileName))
  const configText = configPath ? files.get(configPath)?.text ?? "{}" : "{}"
  const configResult = ts.parseConfigFileTextToJson(configPath ?? "/workspace/tsconfig.json", configText)
  const config = configResult.config ?? {}
  const configFileName = normalizePath(configPath ?? "/workspace/tsconfig.json")
  const basePath = configFileName.slice(0, configFileName.lastIndexOf("/"))
  const parsed = ts.parseJsonConfigFileContent(config, filesystem, basePath, undefined, configFileName)
  return {
    errors: [
      ...(configResult.error ? [serializeDiagnostic(configResult.error)] : []),
      ...parsed.errors.map(serializeDiagnostic),
    ],
    options: parsed.options,
    rootNames: parsed.fileNames,
    projectReferences: parsed.projectReferences,
  }
}

async function loadLibraries(options: import("typescript").CompilerOptions) {
  if (options.noLib) return
  const roots = options.lib?.length
    ? options.lib.map(lib => (lib.toLowerCase().startsWith("lib.") ? lib : `lib.${lib}.d.ts`))
    : [ts.getDefaultLibFileName(options)]
  for (const { text } of files.values()) {
    for (const reference of ts.preProcessFile(text).libReferenceDirectives ?? []) {
      roots.push(reference.fileName.toLowerCase())
    }
  }
  await loadStradaLibraries(roots, baseUrl, libraries, progress => reportProgress({ phase: "libraries", ...progress }))
}

function reportProgress(progress: StradaLoadingProgress) {
  self.postMessage({ type: "progress", progress })
}

function compile() {
  const parsed = parseConfig()
  parsedConfig = parsed
  const outputFiles: Record<string, string> = {}
  const host = createCompilerHost(outputFiles)
  const program = ts.createProgram({
    rootNames: parsed.rootNames,
    options: parsed.options,
    host,
    projectReferences: parsed.projectReferences,
  })
  const emit = program.emit()
  const diagnostics = [
    ...parsed.errors,
    ...ts.getPreEmitDiagnostics(program).map(serializeDiagnostic),
    ...emit.diagnostics.map(serializeDiagnostic),
  ]
  return {
    diagnostics,
    emitSkipped: emit.emitSkipped,
    outputFiles,
    rootNames: parsed.rootNames,
  }
}

function createCompilerHost(outputFiles: Record<string, string>) {
  const host: import("typescript").CompilerHost = {
    ...filesystem,
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => "/workspace",
    getDefaultLibFileName: options => `/typescript/lib/${ts.getDefaultLibFileName(options)}`,
    getNewLine: () => "\n",
    getSourceFile: (fileName, languageVersion) => {
      const text = readFile(fileName)
      return text === undefined
        ? undefined
        : ts.createSourceFile(fileName, text, languageVersion, true, scriptKind(fileName))
    },
    readFile,
    useCaseSensitiveFileNames: () => true,
    writeFile: (fileName, text) => {
      outputFiles[normalizePath(fileName)] = text
    },
  }
  return host
}

function languageServiceForFile(fileName: string) {
  if (languageService.getProgram()?.getSourceFile(normalizePath(fileName))) return languageService
  inferredLanguageService ??= ts.createLanguageService(createLanguageServiceHost(true))
  return inferredLanguageService
}

function stringLiteralSpan(source: import("typescript").SourceFile, position: number) {
  function visit(node: import("typescript").Node): import("typescript").TextSpan | undefined {
    if (position < node.getFullStart() || position > node.getEnd()) return undefined
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const start = node.getStart(source) + 1
      const end = node.getEnd()
      if (position < start) return undefined
      return { start, length: end - start - (node.isUnterminated ? 0 : 1) }
    }
    return ts.forEachChild(node, visit)
  }
  return visit(source)
}

function createLanguageServiceHost(inferred = false): import("typescript").LanguageServiceHost {
  return {
    ...filesystem,
    getCompilationSettings: () => ({
      ...parsedConfig.options,
      ...(inferred ? { allowJs: true } : {}),
    }),
    getCurrentDirectory: () => "/workspace",
    getDefaultLibFileName: options => `/typescript/lib/${ts.getDefaultLibFileName(options)}`,
    getProjectVersion: () => String(projectVersion),
    getScriptFileNames: () => {
      if (!inferred) return parsedConfig.rootNames.slice()
      const configuredProgram = languageService.getProgram()
      return sourceFiles.filter(fileName => !configuredProgram?.getSourceFile(fileName))
    },
    getProjectReferences: () => (inferred ? undefined : parsedConfig.projectReferences),
    getScriptKind: scriptKind,
    getScriptSnapshot: fileName => {
      const text = readFile(fileName)
      return text === undefined ? undefined : ts.ScriptSnapshot.fromString(text)
    },
    getScriptVersion: fileName => files.get(normalizePath(fileName))?.version.toString() ?? "1",
    readFile,
    useCaseSensitiveFileNames: () => true,
  }
}

function readFile(fileName: string) {
  const normalized = normalizePath(fileName)
  return files.get(normalized)?.text ?? libraries.get(normalized)
}

function scriptKind(fileName: string) {
  if (/\.tsx$/i.test(fileName)) return ts.ScriptKind.TSX
  if (/\.jsx$/i.test(fileName)) return ts.ScriptKind.JSX
  if (/\.[cm]?js$/i.test(fileName)) return ts.ScriptKind.JS
  if (/\.json$/i.test(fileName)) return ts.ScriptKind.JSON
  return ts.ScriptKind.TS
}

function serializeDiagnostic(diagnostic: import("typescript").Diagnostic) {
  return {
    category: diagnostic.category,
    code: diagnostic.code,
    end: (diagnostic.start ?? 0) + (diagnostic.length ?? 1),
    fileName: diagnostic.file?.fileName,
    pos: diagnostic.start ?? 0,
    text: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
  }
}
