import type { API, Diagnostic, FileNotifications, Snapshot } from "@typescript/typescript/sync"
import type * as Ast from "@typescript/typescript/ast"
import type { Node, SourceFile as AstSourceFile } from "@typescript/typescript/ast"
import type { AstNode } from "./ast-types"
import type { WasmTransport } from "@typescript/typescript/wasm"
import { TextDocument } from "vscode-languageserver-textdocument"
import { corsaDiscovery, type Dependency, type SourceFile as DependencySourceFile } from "./ata"
import type { Symlinks } from "./symlinks"

export type NativeCompileInput = {
  files: Record<string, string>
  configFileName: string
  sourceFiles: readonly string[]
  symlinks?: Symlinks
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
  private symlinkKey = ""
  private lastInput: NativeCompileInput | undefined
  private readonly discoverDependencies: ReturnType<typeof corsaDiscovery>

  constructor(private readonly api: API, private readonly transport: WasmTransport, private readonly ast: typeof Ast) {
    this.discoverDependencies = corsaDiscovery(api, ast)
  }

  discover(file: DependencySourceFile): readonly Dependency[] {
    return this.discoverDependencies(file)
  }

  private prepareProgram(input: NativeCompileInput) {
    this.lastInput = input
    const symlinkKey = JSON.stringify(input.symlinks ?? {})
    if (this.snapshot && this.symlinkKey !== symlinkKey) {
      this.snapshot.dispose()
      this.snapshot = undefined
    }
    this.symlinkKey = symlinkKey
    const symlinks = Object.fromEntries(
      Object.entries(input.symlinks ?? {}).map(([path, target]) => [path, { target }])
    )
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
    const hasChanges = changed.length > 0 || created.length > 0 || deleted.length > 0
    const next = this.snapshot
      ? hasChanges
        ? this.snapshot.update({
            ensurePrograms: true,
            fileNotifications: notifications,
            fileSystem: {
              kind: "layer",
              files: Object.fromEntries([...changed, ...created].map(fileName => [fileName, input.files[fileName]])),
              removedPaths: deleted,
            },
          })
        : this.snapshot
      : this.api.createSnapshot({
          openProjects: [input.configFileName],
          fileSystem: { kind: "layer", files: input.files, symlinks },
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
    const program =
      configuredProgram ??
      this.api.createProgram(parsed.fileNames, parsed.options, {
        projectReferences: parsed.projectReferences,
        configFileParsingDiagnostics: parsed.errors,
      })
    return { config, next, parsed, program, configuredProgram }
  }

  compile(input: NativeCompileInput): NativeCompileResult {
    const { config, next, parsed, program, configuredProgram } = this.prepareProgram(input)
    try {
      const emit = program.emitToString()
      const diagnostics = [
        ...(config?.error ? [config.error] : []),
        ...parsed.errors,
        ...program.getProgramDiagnostics(),
        ...program.getGlobalDiagnostics(),
        ...program.getSyntacticDiagnostics(),
        ...program.getSemanticDiagnostics(),
        ...program.getConfigFileParsingDiagnostics(),
        ...emit.diagnostics,
      ]
      const typeQueries: Record<string, NativeTypeQuery[]> = {}
      const configuredFiles = input.sourceFiles.filter(fileName => program.getSourceFile(fileName) !== undefined)
      this.collectTypeQueries(program, configuredFiles, input.files, typeQueries)
      const configuredFileNames = new Set(configuredFiles)
      const orphanFiles = input.sourceFiles.filter(fileName => !configuredFileNames.has(fileName))
      if (orphanFiles.some(fileName => hasTypeQuery(input.files[fileName]))) {
        const inferred = next.update({
          createPrograms: [{ rootFiles: orphanFiles, compilerOptions: { ...parsed.options, allowJs: true } }],
        })
        try {
          this.collectTypeQueries(inferred.operation.createdPrograms[0], orphanFiles, input.files, typeQueries)
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

  astRoot(input: NativeCompileInput, fileName: string): AstNode | undefined {
    return this.withAstSource(input, fileName, sourceFile =>
      describeAstNode(sourceFile, sourceFile, [], this.ast.SyntaxKind)
    )
  }

  astChildren(fileName: string, id: string): AstNode[] {
    if (!this.lastInput) return []
    const path = parseAstPath(id)
    return (
      this.withAstSource(this.lastInput, fileName, sourceFile => {
        const node = nodeAtPath(sourceFile, path)
        return node
          ? astChildren(node).map(({ child, index }) =>
              describeAstNode(child, sourceFile, [...path, index], this.ast.SyntaxKind)
            )
          : []
      }) ?? []
    )
  }

  astPath(fileName: string, position: number): AstNode[] {
    if (!this.lastInput) return []
    return (
      this.withAstSource(this.lastInput, fileName, sourceFile => {
        const path: Node[] = [sourceFile]
        let node: Node = sourceFile
        let indices: number[] = []
        while (true) {
          const child = astChildren(node).find(
            ({ child }) => position >= child.getStart(sourceFile) && position <= child.getEnd()
          )
          if (!child) break
          node = child.child
          indices = [...indices, child.index]
          path.push(node)
        }
        return path.map((entry, index) =>
          describeAstNode(entry, sourceFile, indices.slice(0, index), this.ast.SyntaxKind)
        )
      }) ?? []
    )
  }

  private withAstSource<T>(input: NativeCompileInput, fileName: string, callback: (sourceFile: AstSourceFile) => T) {
    const { next, parsed, program, configuredProgram } = this.prepareProgram(input)
    let inferred: Snapshot | undefined
    try {
      let sourceFile = program.getSourceFile(fileName)
      if (!sourceFile && input.files[fileName] !== undefined) {
        inferred = next.update({
          createPrograms: [{ rootFiles: [fileName], compilerOptions: { ...parsed.options, allowJs: true } }],
        })
        sourceFile = inferred.operation.createdPrograms?.[0]?.getSourceFile(fileName)
      }
      return sourceFile ? callback(sourceFile) : undefined
    } finally {
      inferred?.dispose()
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

function parseAstPath(id: string) {
  return id === "" ? [] : id.split(".").map(Number)
}

function nodeAtPath(sourceFile: Node, path: number[]) {
  let node = sourceFile
  for (const index of path) {
    const child = astChildren(node).find(candidate => candidate.index === index)
    if (!child) return undefined
    node = child.child
  }
  return node
}

function astChildren(node: Node) {
  const children: Array<{ child: Node; index: number }> = []
  node.forEachChild(child => {
    children.push({ child, index: children.length })
  })
  return children
}

function describeAstNode(
  node: Node,
  sourceFile: AstSourceFile,
  path: number[],
  syntaxKind: typeof Ast.SyntaxKind
): AstNode {
  const properties = node as Node & { text?: string; escapedText?: string }
  const text =
    typeof properties.text === "string"
      ? properties.text
      : typeof properties.escapedText === "string"
      ? properties.escapedText
      : ""
  const preview = text ? JSON.stringify(text.length > 60 ? `${text.slice(0, 57)}…` : text) : ""
  const flags = typeof node.flags === "number" && node.flags !== 0 ? `flags=${node.flags}` : ""
  return {
    detail: [preview, flags].filter(Boolean).join(" · "),
    end: node.getEnd(),
    hasChildren: node.forEachChild(() => true) === true,
    id: path.join("."),
    kind: syntaxKind[node.kind] ?? String(node.kind),
    start: node.getStart(sourceFile),
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
