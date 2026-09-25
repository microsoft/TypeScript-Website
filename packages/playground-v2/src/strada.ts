import { monaco } from "./tsgo-lsp"

type CompilerDiagnostic = {
  category: number
  code: number
  end: number
  fileName?: string
  pos: number
  text: string
}

type CompileResult = {
  diagnostics: CompilerDiagnostic[]
  emitSkipped: boolean
  outputFiles: Record<string, string>
  rootNames: string[]
}

type StradaBackendOptions = {
  compilerSource: string
  editor: monaco.editor.IStandaloneCodeEditor
  files(): Record<string, string>
  models: Map<string, monaco.editor.ITextModel>
  onNavigate(fileName: string, range: monaco.Range): void
  version: string
  baseUrl: string
}

export class StradaBackend {
  readonly version: string
  readonly #worker = new Worker(new URL("./strada.worker.js", import.meta.url), {
    type: "module",
  })
  readonly #pending = new Map<
    number,
    {
      resolve(value: any): void
      reject(error: Error): void
    }
  >()
  readonly #disposables: monaco.IDisposable[] = []
  readonly #options: StradaBackendOptions
  #nextId = 1

  private constructor(options: StradaBackendOptions) {
    this.#options = options
    this.version = options.version
    this.#worker.addEventListener("message", event => {
      const pending = this.#pending.get(event.data.id)
      if (!pending) return
      this.#pending.delete(event.data.id)
      if (event.data.error) pending.reject(new Error(event.data.error))
      else pending.resolve(event.data.result)
    })
  }

  static async create(options: StradaBackendOptions) {
    const backend = new StradaBackend(options)
    await backend.#request("init", {
      baseUrl: options.baseUrl,
      compilerSource: options.compilerSource,
      files: options.files(),
      version: options.version,
    })
    backend.#registerLanguageFeatures()
    return backend
  }

  async compile() {
    await this.updateFiles()
    return this.#request<CompileResult>("compile", {})
  }

  async updateFiles() {
    await this.#request("updateFiles", {
      files: this.#options.files(),
    })
  }

  async quickInfo(fileName: string, position: number) {
    return this.#request<any>("quickInfo", { fileName, position })
  }

  async readFile(fileName: string) {
    return this.#request<string | undefined>("readFile", { fileName })
  }

  async goToDefinition(model: monaco.editor.ITextModel, position: monaco.Position) {
    await this.updateFiles()
    const result = await this.#request<any>("definitions", {
      fileName: model.uri.path,
      position: model.getOffsetAt(position),
    })
    const definition = result?.definitions?.[0]
    if (!definition) return
    const target = await this.#ensureModel(definition.fileName)
    if (!target) return
    this.#options.onNavigate(target.uri.path, spanToRange(target, definition.textSpan))
  }

  async #formatOptions(model: monaco.editor.ITextModel) {
    const options = model.getOptions()
    return {
      ConvertTabsToSpaces: options.insertSpaces,
      IndentSize: options.indentSize,
      IndentStyle: 2,
      InsertSpaceAfterCommaDelimiter: true,
      InsertSpaceAfterFunctionKeywordForAnonymousFunctions: true,
      InsertSpaceAfterKeywordsInControlFlowStatements: true,
      InsertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
      InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
      InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
      InsertSpaceAfterSemicolonInForStatements: true,
      InsertSpaceBeforeAndAfterBinaryOperators: true,
      NewLineCharacter: model.getEOL(),
      PlaceOpenBraceOnNewLineForControlBlocks: false,
      PlaceOpenBraceOnNewLineForFunctions: false,
      TabSize: options.tabSize,
      baseIndentSize: 0,
      convertTabsToSpaces: options.insertSpaces,
      indentSize: options.indentSize,
      indentStyle: 2,
      insertSpaceAfterCommaDelimiter: true,
      insertSpaceAfterConstructor: false,
      insertSpaceAfterFunctionKeywordForAnonymousFunctions: true,
      insertSpaceAfterKeywordsInControlFlowStatements: true,
      insertSpaceAfterOpeningAndBeforeClosingEmptyBraces: false,
      insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces: false,
      insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
      insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
      insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
      insertSpaceAfterSemicolonInForStatements: true,
      insertSpaceAfterTypeAssertion: false,
      insertSpaceBeforeAndAfterBinaryOperators: true,
      insertSpaceBeforeFunctionParenthesis: false,
      newLineCharacter: model.getEOL(),
      placeOpenBraceOnNewLineForControlBlocks: false,
      placeOpenBraceOnNewLineForFunctions: false,
      semicolons: "ignore",
      tabSize: options.tabSize,
      trimTrailingWhitespace: true,
    }
  }

  dispose() {
    this.#disposables.forEach(disposable => disposable.dispose())
    this.#worker.terminate()
  }

  #registerLanguageFeatures() {
    this.#disposables.push(
      this.#options.editor.addAction({
        id: "strada.goToDefinition",
        label: "Go to Definition",
        keybindings: [monaco.KeyCode.F12],
        run: () => {
          const model = this.#options.editor.getModel()
          const position = this.#options.editor.getPosition()
          if (model && position) void this.goToDefinition(model, position)
        },
      })
    )
    for (const language of ["javascript", "typescript"]) {
      this.#disposables.push(
        monaco.languages.registerCompletionItemProvider(language, {
          triggerCharacters: [".", '"', "'", "/", "@", "<", "#"],
          provideCompletionItems: async (model, position, context) => {
            await this.updateFiles()
            const result = await this.#request<any>("completions", {
              fileName: model.uri.path,
              options: { triggerCharacter: context.triggerCharacter },
              position: model.getOffsetAt(position),
            })
            const word = model.getWordUntilPosition(position)
            const range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn)
            const suggestions = (result?.entries ?? []).map((entry: any) => {
              const suggestion: monaco.languages.CompletionItem & {
                strada?: {
                  data: any
                  fileName: string
                  name: string
                  position: number
                  source: string | undefined
                }
              } = {
                detail: entry.labelDetails?.description,
                filterText: entry.filterText,
                insertText: entry.insertText ?? entry.name,
                kind: completionKind(entry.kind),
                label: entry.name,
                range,
                sortText: entry.sortText,
              }
              suggestion.strada = {
                data: entry.data,
                fileName: model.uri.path,
                name: entry.name,
                position: model.getOffsetAt(position),
                source: entry.source,
              }
              return suggestion
            })
            return {
              incomplete: result?.isIncomplete,
              suggestions,
            }
          },
          resolveCompletionItem: async item => {
            const metadata = (
              item as typeof item & {
                strada?: {
                  data: any
                  fileName: string
                  name: string
                  position: number
                  source: string | undefined
                }
              }
            ).strada
            if (!metadata) return item
            const details = await this.#request<any>("completionDetails", metadata)
            if (!details) return item
            item.detail = displayParts(details.displayParts)
            item.documentation = {
              value: displayParts(details.documentation),
            }
            const changes = (details.codeActions ?? []).flatMap((action: any) => action.changes ?? [])
            item.additionalTextEdits = changes
              .filter((change: any) => normalizePath(change.fileName) === normalizePath(metadata.fileName))
              .flatMap((change: any) =>
                change.textChanges.map((textChange: any) => ({
                  range: spanToRange(this.#options.models.get(metadata.fileName)!, textChange.span),
                  text: textChange.newText,
                }))
              )
            return item
          },
        }),
        monaco.languages.registerHoverProvider(language, {
          provideHover: async (model, position) => {
            await this.updateFiles()
            const info = await this.quickInfo(model.uri.path, model.getOffsetAt(position))
            if (!info) return undefined
            return {
              contents: [
                {
                  value: `\`\`\`typescript\n${displayParts(info.displayParts)}\n\`\`\``,
                },
                {
                  value: displayParts(info.documentation),
                },
              ],
              range: spanToRange(model, info.textSpan),
            }
          },
        }),
        monaco.languages.registerDefinitionProvider(language, {
          provideDefinition: async (model, position) => {
            await this.updateFiles()
            const result = await this.#request<any>("definitions", {
              fileName: model.uri.path,
              position: model.getOffsetAt(position),
            })
            if (!result?.definitions) return undefined
            const locations = []
            for (const definition of result.definitions) {
              const target = await this.#ensureModel(definition.fileName)
              if (!target) continue
              locations.push({
                range: spanToRange(target, definition.textSpan),
                uri: target.uri,
              })
            }
            return locations
          },
        }),
        monaco.languages.registerSignatureHelpProvider(language, {
          signatureHelpTriggerCharacters: ["(", ",", "<"],
          provideSignatureHelp: async (model, position) => {
            await this.updateFiles()
            const help = await this.#request<any>("signatureHelp", {
              fileName: model.uri.path,
              options: {
                triggerReason: {
                  kind: "invoked",
                },
              },
              position: model.getOffsetAt(position),
            })
            if (!help) return undefined
            return {
              dispose() {},
              value: {
                activeParameter: help.argumentIndex,
                activeSignature: help.selectedItemIndex,
                signatures: help.items.map((item: any) => ({
                  documentation: displayParts(item.documentation),
                  label: [
                    displayParts(item.prefixDisplayParts),
                    item.parameters
                      .map((parameter: any) => displayParts(parameter.displayParts))
                      .join(displayParts(item.separatorDisplayParts)),
                    displayParts(item.suffixDisplayParts),
                  ].join(""),
                  parameters: item.parameters.map((parameter: any) => ({
                    documentation: displayParts(parameter.documentation),
                    label: displayParts(parameter.displayParts),
                  })),
                })),
              },
            }
          },
        }),
        monaco.languages.registerReferenceProvider(language, {
          provideReferences: async (model, position) => {
            await this.updateFiles()
            const references = await this.#request<any[]>("references", {
              fileName: model.uri.path,
              position: model.getOffsetAt(position),
            })
            if (!references) return []
            const locations = []
            for (const reference of references) {
              const target = await this.#ensureModel(reference.fileName)
              if (!target) continue
              locations.push({
                range: spanToRange(target, reference.textSpan),
                uri: target.uri,
              })
            }
            return locations
          },
        }),
        monaco.languages.registerDocumentHighlightProvider(language, {
          provideDocumentHighlights: async (model, position) => {
            await this.updateFiles()
            const results = await this.#request<any[]>("occurrences", {
              fileName: model.uri.path,
              position: model.getOffsetAt(position),
            })
            return (results ?? []).map((occurrence: any) => ({
              kind: occurrence.isWriteAccess
                ? monaco.languages.DocumentHighlightKind.Write
                : monaco.languages.DocumentHighlightKind.Text,
              range: spanToRange(model, occurrence.textSpan),
            }))
          },
        }),
        monaco.languages.registerDocumentSymbolProvider(language, {
          provideDocumentSymbols: async model => {
            await this.updateFiles()
            const items = await this.#request<any[]>("navigationBarItems", {
              fileName: model.uri.path,
            })
            return items?.flatMap((item: any) => navigationSymbols(model, item)) ?? []
          },
        }),
        monaco.languages.registerRenameProvider(language, {
          resolveRenameLocation: async (model, position) => {
            await this.updateFiles()
            const info = await this.#request<any>("renameInfo", {
              fileName: model.uri.path,
              position: model.getOffsetAt(position),
            })
            if (!info?.canRename) {
              return {
                range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                rejectReason: info?.localizedErrorMessage ?? "This symbol cannot be renamed.",
                text: "",
              }
            }
            return {
              range: spanToRange(model, info.triggerSpan),
              text: model.getValueInRange(spanToRange(model, info.triggerSpan)),
            }
          },
          provideRenameEdits: async (model, position, newName) => {
            await this.updateFiles()
            const locations = await this.#request<any[]>("renameLocations", {
              fileName: model.uri.path,
              position: model.getOffsetAt(position),
            })
            if (!locations) return { edits: [], rejectReason: "This symbol cannot be renamed." }
            const edits = []
            for (const location of locations) {
              const target = await this.#ensureModel(location.fileName)
              if (!target) continue
              edits.push({
                resource: target.uri,
                textEdit: {
                  range: spanToRange(target, location.textSpan),
                  text: `${location.prefixText ?? ""}${newName}${location.suffixText ?? ""}`,
                },
                versionId: target.getVersionId(),
              })
            }
            return { edits }
          },
        }),
        monaco.languages.registerDocumentFormattingEditProvider(language, {
          provideDocumentFormattingEdits: async model => {
            await this.updateFiles()
            const edits = await this.#request<any[]>("formatDocument", {
              fileName: model.uri.path,
              options: await this.#formatOptions(model),
            })
            return edits.map(edit => ({
              range: spanToRange(model, edit.span),
              text: edit.newText,
            }))
          },
        }),
        monaco.languages.registerDocumentRangeFormattingEditProvider(language, {
          provideDocumentRangeFormattingEdits: async (model, range) => {
            await this.updateFiles()
            const edits = await this.#request<any[]>("formatRange", {
              end: model.getOffsetAt(range.getEndPosition()),
              fileName: model.uri.path,
              options: await this.#formatOptions(model),
              start: model.getOffsetAt(range.getStartPosition()),
            })
            return edits.map(edit => ({
              range: spanToRange(model, edit.span),
              text: edit.newText,
            }))
          },
        }),
        monaco.languages.registerOnTypeFormattingEditProvider(language, {
          autoFormatTriggerCharacters: [";", "}", "\n"],
          provideOnTypeFormattingEdits: async (model, position, ch) => {
            await this.updateFiles()
            const edits = await this.#request<any[]>("formatOnType", {
              fileName: model.uri.path,
              key: ch,
              options: await this.#formatOptions(model),
              position: model.getOffsetAt(position),
            })
            return edits.map(edit => ({
              range: spanToRange(model, edit.span),
              text: edit.newText,
            }))
          },
        }),
        monaco.languages.registerCodeActionProvider(language, {
          provideCodeActions: async (model, range, context) => {
            const errorCodes = context.markers
              .map(marker => Number(String(marker.code ?? "").replace(/^TS/, "")))
              .filter(Number.isFinite)
            if (errorCodes.length === 0) return { actions: [], dispose() {} }
            await this.updateFiles()
            const fixes = await this.#request<any[]>("codeFixes", {
              end: model.getOffsetAt(range.getEndPosition()),
              errorCodes,
              fileName: model.uri.path,
              formatOptions: await this.#formatOptions(model),
              preferences: {},
              start: model.getOffsetAt(range.getStartPosition()),
            })
            const actions = []
            for (const fix of fixes) {
              const edits = []
              for (const change of fix.changes ?? []) {
                const target = await this.#ensureModel(change.fileName)
                if (!target) continue
                for (const textChange of change.textChanges) {
                  edits.push({
                    resource: target.uri,
                    textEdit: {
                      range: spanToRange(target, textChange.span),
                      text: textChange.newText,
                    },
                    versionId: target.getVersionId(),
                  })
                }
              }
              actions.push({
                diagnostics: context.markers,
                edit: { edits },
                isPreferred: fix.fixId !== undefined,
                kind: "quickfix",
                title: fix.description,
              })
            }
            return { actions, dispose() {} }
          },
        }),
        monaco.languages.registerInlayHintsProvider(language, {
          provideInlayHints: async (model, range) => {
            await this.updateFiles()
            const start = model.getOffsetAt(range.getStartPosition())
            const end = model.getOffsetAt(range.getEndPosition())
            const hints = await this.#request<any[]>("inlayHints", {
              fileName: model.uri.path,
              preferences: {
                includeInlayEnumMemberValueHints: true,
                includeInlayFunctionLikeReturnTypeHints: true,
                includeInlayFunctionParameterTypeHints: true,
                includeInlayParameterNameHints: "literals",
                includeInlayParameterNameHintsWhenArgumentMatchesName: false,
                includeInlayPropertyDeclarationTypeHints: true,
                includeInlayVariableTypeHints: true,
                includeInlayVariableTypeHintsWhenTypeMatchesName: false,
              },
              span: { length: end - start, start },
            })
            return {
              dispose() {},
              hints: hints.map(hint => ({
                kind:
                  hint.kind === "Type" ? monaco.languages.InlayHintKind.Type : monaco.languages.InlayHintKind.Parameter,
                label: hint.text,
                paddingLeft: hint.whitespaceBefore,
                paddingRight: hint.whitespaceAfter,
                position: model.getPositionAt(hint.position),
              })),
            }
          },
        })
      )
    }
  }

  async #ensureModel(fileName: string) {
    const normalized = normalizePath(fileName)
    const existing = monaco.editor.getModel(monaco.Uri.file(normalized))
    if (existing) return existing
    const text = await this.readFile(normalized)
    if (text === undefined) return undefined
    return monaco.editor.createModel(text, languageForFile(normalized), monaco.Uri.file(normalized))
  }

  #request<T = void>(method: string, args: any): Promise<T> {
    const id = this.#nextId++
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject })
      this.#worker.postMessage({ id, method, args })
    })
  }
}

function displayParts(parts: readonly { text: string }[] | undefined) {
  return parts?.map(part => part.text).join("") ?? ""
}

function spanToRange(model: monaco.editor.ITextModel, span: { start: number; length: number }) {
  const start = model.getPositionAt(span.start)
  const end = model.getPositionAt(span.start + span.length)
  return new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column)
}

function navigationSymbols(model: monaco.editor.ITextModel, item: any): monaco.languages.DocumentSymbol[] {
  const range = spanToRange(model, item.spans?.[0] ?? { start: 0, length: 0 })
  return [
    {
      children: item.childItems?.flatMap((child: any) => navigationSymbols(model, child)) ?? [],
      detail: "",
      kind: symbolKind(item.kind),
      name: item.text,
      range,
      selectionRange: range,
      tags: [],
    },
  ]
}

function symbolKind(kind: string | undefined) {
  switch (kind) {
    case "class":
      return monaco.languages.SymbolKind.Class
    case "const":
    case "let":
    case "var":
      return monaco.languages.SymbolKind.Variable
    case "enum":
      return monaco.languages.SymbolKind.Enum
    case "enum member":
      return monaco.languages.SymbolKind.EnumMember
    case "function":
      return monaco.languages.SymbolKind.Function
    case "interface":
      return monaco.languages.SymbolKind.Interface
    case "method":
      return monaco.languages.SymbolKind.Method
    case "module":
      return monaco.languages.SymbolKind.Module
    case "property":
      return monaco.languages.SymbolKind.Property
    case "type":
      return monaco.languages.SymbolKind.TypeParameter
    default:
      return monaco.languages.SymbolKind.Object
  }
}

function completionKind(kind: string | undefined) {
  switch (kind) {
    case "class":
      return monaco.languages.CompletionItemKind.Class
    case "const":
    case "let":
    case "var":
      return monaco.languages.CompletionItemKind.Variable
    case "function":
      return monaco.languages.CompletionItemKind.Function
    case "interface":
      return monaco.languages.CompletionItemKind.Interface
    case "method":
      return monaco.languages.CompletionItemKind.Method
    case "property":
      return monaco.languages.CompletionItemKind.Property
    case "keyword":
      return monaco.languages.CompletionItemKind.Keyword
    default:
      return monaco.languages.CompletionItemKind.Text
  }
}

function languageForFile(fileName: string) {
  if (/\.json$/i.test(fileName)) return "json"
  if (/\.[cm]?jsx?$/i.test(fileName)) return "javascript"
  return "typescript"
}

function normalizePath(fileName: string) {
  return fileName.replaceAll("\\", "/").replace(/^file:\/\//, "")
}
