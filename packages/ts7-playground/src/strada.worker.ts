type TS = typeof import("typescript")

type InitMessage = {
  id: number
  method: "init"
  args: {
    compilerSource: string
    files: Record<string, string>
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
let compilerOptions: import("typescript").CompilerOptions = {}
let projectVersion = 0
const files = new Map<string, FileEntry>()
const libraries = new Map<string, string>()
let languageService: import("typescript").LanguageService

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
  ts = new Function(`${args.compilerSource}\nreturn ts;`)() as TS
  version = args.version
  baseUrl = args.baseUrl
  replaceFiles(args.files)
  refreshConfig()
  await loadLibraries(compilerOptions)
  languageService = ts.createLanguageService(createLanguageServiceHost())
  return { version: ts.version }
}

async function dispatch(method: string, args: any) {
  switch (method) {
    case "updateFiles":
      replaceFiles(args.files)
      refreshConfig()
      await loadLibraries(compilerOptions)
      return
    case "compile":
      return compile()
    case "quickInfo":
      return languageService.getQuickInfoAtPosition(args.fileName, args.position)
    case "completions":
      return languageService.getCompletionsAtPosition(args.fileName, args.position, args.options)
    case "completionDetails":
      return languageService.getCompletionEntryDetails(
        args.fileName,
        args.position,
        args.name,
        {},
        args.source,
        {},
        args.data
      )
    case "definitions":
      return languageService.getDefinitionAndBoundSpan
        ? languageService.getDefinitionAndBoundSpan(args.fileName, args.position)
        : {
            definitions: languageService.getDefinitionAtPosition(args.fileName, args.position),
          }
    case "references":
      return languageService.getReferencesAtPosition(args.fileName, args.position)
    case "occurrences": {
      const service = languageService as import("typescript").LanguageService & {
        getOccurrencesAtPosition?(fileName: string, position: number): readonly any[] | undefined
      }
      if (service.getOccurrencesAtPosition) {
        return service.getOccurrencesAtPosition(args.fileName, args.position)
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
      return languageService.getSignatureHelpItems(args.fileName, args.position, args.options)
    case "renameInfo":
      return languageService.getRenameInfo(args.fileName, args.position, {
        allowRenameOfImportPath: true,
      })
    case "renameLocations":
      return languageService.findRenameLocations(args.fileName, args.position, false, false, true)
    case "navigationBarItems":
      return languageService.getNavigationBarItems(args.fileName)
    case "formatDocument":
      return languageService.getFormattingEditsForDocument(args.fileName, args.options)
    case "formatRange":
      return languageService.getFormattingEditsForRange(args.fileName, args.start, args.end, args.options)
    case "formatOnType":
      return languageService.getFormattingEditsAfterKeystroke(args.fileName, args.position, args.key, args.options)
    case "codeFixes":
      return languageService.getCodeFixesAtPosition(
        args.fileName,
        args.start,
        args.end,
        args.errorCodes,
        args.formatOptions,
        args.preferences
      )
    case "inlayHints": {
      const service = languageService as import("typescript").LanguageService & {
        provideInlayHints?(
          fileName: string,
          span: import("typescript").TextSpan,
          preferences: import("typescript").UserPreferences
        ): readonly any[]
      }
      return service.provideInlayHints?.(args.fileName, args.span, args.preferences) ?? []
    }
    case "readFile":
      return readFile(args.fileName)
    default:
      throw new Error(`Unknown Strada request: ${method}`)
  }
}

function replaceFiles(nextFiles: Record<string, string>) {
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
  const parsed = parseConfig()
  compilerOptions = parsed.options
  projectVersion++
}

function parseConfig() {
  const configPath =
    [...files.keys()].find(fileName => /\/tsconfig\.json$/i.test(fileName)) ??
    [...files.keys()].find(fileName => /\/jsconfig\.json$/i.test(fileName))
  const configText = configPath ? files.get(configPath)?.text ?? "{}" : "{}"
  const configResult = ts.parseConfigFileTextToJson(configPath ?? "/workspace/tsconfig.json", configText)
  const config = configResult.config ?? {}
  const converted = ts.convertCompilerOptionsFromJson(config.compilerOptions ?? {}, "/workspace", configPath)
  const options: import("typescript").CompilerOptions = {
    ...converted.options,
    allowJs: converted.options.allowJs ?? configPath?.endsWith("/jsconfig.json") ?? false,
    checkJs: converted.options.checkJs ?? configPath?.endsWith("/jsconfig.json") ?? false,
  }
  const rootNames = getRootNames(config)
  return {
    errors: [
      ...(configResult.error ? [serializeDiagnostic(configResult.error)] : []),
      ...converted.errors.map(serializeDiagnostic),
    ],
    options,
    rootNames,
  }
}

function getRootNames(config: any) {
  const sourceFiles = [...files.keys()].filter(fileName => /\.[cm]?[jt]sx?$/i.test(fileName))
  if (Array.isArray(config.files)) {
    return config.files
      .filter((fileName: unknown): fileName is string => typeof fileName === "string")
      .map((fileName: string) => normalizePath(`/workspace/${fileName}`))
      .filter((fileName: string) => files.has(fileName))
  }
  const includes = Array.isArray(config.include) ? config.include : ["**/*"]
  const excludes = Array.isArray(config.exclude)
    ? config.exclude
    : ["node_modules", "bower_components", "jspm_packages"]
  return sourceFiles.filter(fileName => {
    const relative = fileName.replace(/^\/workspace\//, "")
    return (
      includes.some((pattern: string) => matchesGlob(relative, pattern)) &&
      !excludes.some((pattern: string) => matchesGlob(relative, pattern))
    )
  })
}

function matchesGlob(fileName: string, pattern: string) {
  const normalized = pattern.replace(/^\.\//, "")
  const expression = normalized
    .replaceAll("**/", "\u0000")
    .replaceAll("**", "\u0001")
    .replaceAll("*", "\u0002")
    .replaceAll("?", "\u0003")
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replaceAll("\u0000", "(?:.*/)?")
    .replaceAll("\u0001", ".*")
    .replaceAll("\u0002", "[^/]*")
    .replaceAll("\u0003", ".")
  return new RegExp(`^${expression}$`, "i").test(fileName)
}

async function loadLibraries(options: import("typescript").CompilerOptions) {
  if (options.noLib) return
  const roots = options.lib?.length
    ? options.lib.map(lib => (lib.toLowerCase().startsWith("lib.") ? lib : `lib.${lib}.d.ts`))
    : [ts.getDefaultLibFileName(options)]
  for (const root of roots) await loadLibrary(root)
}

async function loadLibrary(fileName: string) {
  const normalized = fileName.startsWith("lib.") ? fileName : `lib.${fileName}.d.ts`
  const path = `/typescript/lib/${normalized}`
  if (libraries.has(path)) return
  const response = await fetch(`${baseUrl}${normalized}`)
  if (!response.ok) {
    if (response.status === 404) return
    throw new Error(`Could not load ${normalized}: ${response.status}`)
  }
  const text = await response.text()
  libraries.set(path, text)
  const references = [...text.matchAll(/<reference\s+(?:lib|path)="([^"]+)"/g)].map(match => {
    const referenced = match[1]
    return referenced.endsWith(".d.ts") ? referenced.split("/").at(-1)! : `lib.${referenced}.d.ts`
  })
  for (const reference of references) await loadLibrary(reference)
}

function compile() {
  const parsed = parseConfig()
  compilerOptions = parsed.options
  const outputFiles: Record<string, string> = {}
  const host = createCompilerHost(outputFiles)
  const program = ts.createProgram(parsed.rootNames, parsed.options, host)
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
    directoryExists: directoryName =>
      [...files.keys(), ...libraries.keys()].some(fileName =>
        fileName.startsWith(`${normalizePath(directoryName).replace(/\/$/, "")}/`)
      ),
    fileExists: fileName => readFile(fileName) !== undefined,
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => "/workspace",
    getDefaultLibFileName: options => `/typescript/lib/${ts.getDefaultLibFileName(options)}`,
    getDirectories: directoryName => {
      const prefix = `${normalizePath(directoryName).replace(/\/$/, "")}/`
      return [
        ...new Set(
          [...files.keys(), ...libraries.keys()]
            .filter(fileName => fileName.startsWith(prefix))
            .map(fileName => fileName.slice(prefix.length).split("/")[0])
            .filter(name => name && !name.includes("."))
        ),
      ]
    },
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

function createLanguageServiceHost(): import("typescript").LanguageServiceHost {
  return {
    fileExists: fileName => readFile(fileName) !== undefined,
    getCompilationSettings: () => ({
      ...compilerOptions,
      allowJs: true,
    }),
    getCurrentDirectory: () => "/workspace",
    getDefaultLibFileName: options => `/typescript/lib/${ts.getDefaultLibFileName(options)}`,
    getProjectVersion: () => String(projectVersion),
    getScriptFileNames: () => [...files.keys(), ...libraries.keys()],
    getScriptKind: scriptKind,
    getScriptSnapshot: fileName => {
      const text = readFile(fileName)
      return text === undefined ? undefined : ts.ScriptSnapshot.fromString(text)
    },
    getScriptVersion: fileName => files.get(normalizePath(fileName))?.version.toString() ?? "1",
    readFile,
    readDirectory: () => [...files.keys()],
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

function normalizePath(fileName: string) {
  return fileName.replaceAll("\\", "/").replace(/^file:\/\//, "")
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
