import { API, type Diagnostic, type FileNotifications, type Snapshot } from "@typescript/typescript/unstable/sync"
import type { Node } from "@typescript/typescript/unstable/ast"
import type { WasmTransport } from "@typescript/typescript/unstable/wasm"
import { TextDocument } from "vscode-languageserver-textdocument"
import { corsaDiscovery, type Dependency, type SourceFile } from "./ata"

export type NativeCompileInput = {
  files: Record<string, string>
  configFileName: string
  sourceFiles: readonly string[]
}

export type NativeTypeQuery = {
  lineNumber: number
  column: number
  label: string
}

export type NativeCompileResult = {
  diagnostics: readonly Diagnostic[]
  outputFiles: Record<string, string>
  typeQueries: Record<string, NativeTypeQuery[]>
}

export class NativeCompiler {
  private snapshot: Snapshot | undefined
  private readonly files = new Map<string, string>()
  private readonly discoverDependencies: ReturnType<typeof corsaDiscovery>

  constructor(private readonly api: API, private readonly transport: WasmTransport) {
    this.discoverDependencies = corsaDiscovery(api)
  }

  discover(file: SourceFile): readonly Dependency[] {
    return this.discoverDependencies(file)
  }

  compile(input: NativeCompileInput): NativeCompileResult {
    const changed: string[] = []
    const created: string[] = []
    const deleted: string[] = []
    for (const [fileName, text] of Object.entries(input.files)) {
      if (this.files.get(fileName) === text) continue
      this.transport.setFile(fileName, text)
      if (this.files.has(fileName)) changed.push(fileName)
      else created.push(fileName)
    }
    for (const fileName of this.files.keys()) {
      if (fileName in input.files) continue
      this.transport.removeFile(fileName)
      deleted.push(fileName)
    }
    const notifications: FileNotifications = { changed, created, deleted }
    const next = this.snapshot
      ? this.snapshot.update({
          ensurePrograms: true,
          fileNotifications: notifications,
          fileSystem: {
            kind: "layer",
            files: Object.fromEntries([...changed, ...created].map(fileName => [fileName, input.files[fileName]])),
            removedPaths: deleted,
          },
        })
      : this.api.createSnapshot({
          openProjects: [input.configFileName],
          fileSystem: { kind: "layer", files: input.files },
        })
    const previous = this.snapshot
    this.snapshot = next
    if (previous && previous !== next) previous.dispose()
    this.files.clear()
    for (const [fileName, text] of Object.entries(input.files)) this.files.set(fileName, text)

    const project = next.getConfiguredProject(input.configFileName)
    const config = project ? undefined : this.api.readConfigFile(input.configFileName)
    const parsed =
      project?.parsedCommandLine ??
      this.api.parseJsonConfigFileContent(config?.config, { configFileName: input.configFileName })
    const configuredProgram = project && next.getProgram(project.id)
    const program = configuredProgram ?? this.api.createProgram(parsed.fileNames, parsed.options, {
      projectReferences: parsed.projectReferences,
      configFileParsingDiagnostics: parsed.errors,
    })
    try {
      const emit = program.emitToString()
      const diagnostics = [
        ...(config?.error ? [config.error] : []),
        ...parsed.errors,
        ...program.getSyntacticDiagnostics(),
        ...program.getSemanticDiagnostics(),
        ...program.getConfigFileParsingDiagnostics(),
        ...emit.diagnostics,
      ]
      const typeQueries: Record<string, NativeTypeQuery[]> = {}
      this.collectTypeQueries(program, parsed.fileNames, input.files, typeQueries)
      const configuredFiles = new Set(parsed.fileNames)
      const orphanFiles = input.sourceFiles.filter(fileName => !configuredFiles.has(fileName))
      if (orphanFiles.some(fileName => hasTypeQuery(input.files[fileName]))) {
        const inferred = this.api.createProgram(orphanFiles, { ...parsed.options, allowJs: true })
        try {
          this.collectTypeQueries(inferred, orphanFiles, input.files, typeQueries)
        } finally {
          inferred.dispose()
        }
      }
      return {
        diagnostics,
        outputFiles: Object.fromEntries([...emit.outputFiles].map(([fileName, output]) => [fileName, output.text])),
        typeQueries,
      }
    } finally {
      if (!configuredProgram) program.dispose()
    }
  }

  close() {
    this.snapshot?.dispose()
    this.snapshot = undefined
    this.api.close()
  }

  private collectTypeQueries(
    program: ReturnType<API["createProgram"]>,
    fileNames: readonly string[],
    files: Record<string, string>,
    result: Record<string, NativeTypeQuery[]>
  ) {
    for (const fileName of fileNames) {
      const source = files[fileName]
      if (!hasTypeQuery(source)) continue
      const sourceFile = program.getSourceFile(fileName)
      if (!sourceFile) continue
      const document = TextDocument.create(fileName, "typescript", 0, source)
      const queries: NativeTypeQuery[] = []
      const pattern = /^\s*\/\/\s*\^\?\s*$/gm
      let match: RegExpExecArray | null
      while ((match = pattern.exec(source))) {
        const position = document.positionAt(match.index + match[0].lastIndexOf("?"))
        if (position.line === 0) continue
        const offset = document.offsetAt({ line: position.line - 1, character: position.character })
        const node = findNodeAtPosition(sourceFile, offset) ?? findNodeAtPosition(sourceFile, Math.max(0, offset - 1))
        if (!node) continue
        const checker = program.getProject().checker
        const typeText = checker.typeToString(checker.getTypeAtLocation(node), node).replace(/\r?\n\s*/g, " ")
        queries.push({
          lineNumber: position.line + 1,
          column: position.character + 2,
          label: typeText.length > 120 ? `${typeText.slice(0, 119)}…` : typeText,
        })
      }
      result[fileName] = queries
    }
  }
}

function hasTypeQuery(source: string | undefined): source is string {
  return source !== undefined && /^\s*\/\/\s*\^\?\s*$/m.test(source)
}

function findNodeAtPosition(node: Node, position: number): Node | undefined {
  if (position < node.getFullStart() || position > node.getEnd()) return undefined
  let match: Node | undefined
  node.forEachChild(child => {
    const descendant = findNodeAtPosition(child, position)
    if (!descendant) return undefined
    match = descendant
    return true
  })
  return match ?? node
}
