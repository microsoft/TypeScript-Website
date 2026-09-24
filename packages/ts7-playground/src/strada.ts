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
            return {
              incomplete: result?.isIncomplete,
              suggestions: (result?.entries ?? []).map((entry: any) => ({
                detail: entry.labelDetails?.description,
                filterText: entry.filterText,
                insertText: entry.insertText ?? entry.name,
                kind: completionKind(entry.kind),
                label: entry.name,
                range,
                sortText: entry.sortText,
              })),
            }
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
