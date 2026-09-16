import {
  CompletionItemKind,
  DiagnosticSeverity,
  getLanguageService,
  InsertTextFormat,
  MarkupKind,
  type CompletionItem,
  type Diagnostic,
  type Hover,
  type JSONSchema,
  type MarkedString,
  type MarkupContent,
  type Range,
} from "vscode-json-languageservice"
import { TextDocument } from "vscode-languageserver-textdocument"
import { monaco } from "./tsgo-lsp"

const schemaUri = "https://json.schemastore.org/tsconfig"
const markerOwner = "tsconfig-schema"

export function registerConfigSchema(schema: JSONSchema) {
  const service = getLanguageService({})
  service.configure({
    allowComments: true,
    schemas: [
      {
        fileMatch: ["**/tsconfig.json", "**/jsconfig.json"],
        schema,
        uri: schemaUri,
      },
    ],
    validate: true,
  })

  monaco.languages.registerCompletionItemProvider("json", {
    triggerCharacters: ['"', ":"],
    async provideCompletionItems(model, position) {
      if (!isConfigModel(model)) return { suggestions: [] }
      const document = createDocument(model)
      const jsonDocument = service.parseJSONDocument(document)
      const completions = await service.doComplete(document, toLspPosition(position), jsonDocument)
      return {
        incomplete: completions?.isIncomplete,
        suggestions: (completions?.items ?? []).map(item => toMonacoCompletion(model, position, item)),
      }
    },
  })

  monaco.languages.registerHoverProvider("json", {
    async provideHover(model, position) {
      if (!isConfigModel(model)) return undefined
      const document = createDocument(model)
      const hover = await service.doHover(document, toLspPosition(position), service.parseJSONDocument(document))
      return hover ? toMonacoHover(hover) : undefined
    },
  })

  const timers = new Map<string, number>()
  const registerModel = (model: monaco.editor.ITextModel) => {
    if (!isConfigModel(model)) return
    const validate = () => {
      window.clearTimeout(timers.get(model.uri.toString()))
      timers.set(
        model.uri.toString(),
        window.setTimeout(async () => {
          if (model.isDisposed()) return
          const document = createDocument(model)
          const diagnostics = await service.doValidation(document, service.parseJSONDocument(document), {
            comments: "ignore",
            trailingCommas: "warning",
          })
          monaco.editor.setModelMarkers(model, markerOwner, diagnostics.map(toMonacoDiagnostic))
        }, 150)
      )
    }
    model.onDidChangeContent(validate)
    validate()
  }

  monaco.editor.getModels().forEach(registerModel)
  monaco.editor.onDidCreateModel(registerModel)
}

function isConfigModel(model: monaco.editor.ITextModel) {
  return /\/(?:js|ts)config\.json$/i.test(model.uri.path)
}

function createDocument(model: monaco.editor.ITextModel) {
  return TextDocument.create(model.uri.toString(), "json", model.getVersionId(), model.getValue())
}

function toMonacoCompletion(
  model: monaco.editor.ITextModel,
  position: monaco.Position,
  item: CompletionItem
): monaco.languages.CompletionItem {
  const word = model.getWordUntilPosition(position)
  const fallbackRange = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn)
  const textEdit = item.textEdit && "range" in item.textEdit ? item.textEdit : undefined
  return {
    detail: item.detail,
    documentation: toMarkdown(item.documentation),
    filterText: item.filterText,
    insertText: textEdit?.newText ?? item.insertText ?? item.label,
    insertTextRules:
      item.insertTextFormat === InsertTextFormat.Snippet
        ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        : undefined,
    kind: toMonacoCompletionKind(item.kind),
    label: item.label,
    range: textEdit ? toMonacoRange(textEdit.range) : fallbackRange,
    sortText: item.sortText,
  }
}

function toMonacoCompletionKind(kind: CompletionItemKind | undefined) {
  switch (kind) {
    case CompletionItemKind.Value:
      return monaco.languages.CompletionItemKind.Value
    case CompletionItemKind.Enum:
    case CompletionItemKind.EnumMember:
      return monaco.languages.CompletionItemKind.Enum
    case CompletionItemKind.Keyword:
      return monaco.languages.CompletionItemKind.Keyword
    case CompletionItemKind.Property:
    case CompletionItemKind.Field:
      return monaco.languages.CompletionItemKind.Property
    default:
      return monaco.languages.CompletionItemKind.Text
  }
}

function toMonacoHover(hover: Hover): monaco.languages.Hover {
  return {
    contents: Array.isArray(hover.contents)
      ? hover.contents.map(toMarkdown).filter(isMarkdown)
      : [toMarkdown(hover.contents)].filter(isMarkdown),
    range: hover.range ? toMonacoRange(hover.range) : undefined,
  }
}

function toMarkdown(value: string | MarkedString | MarkupContent | undefined): monaco.IMarkdownString | undefined {
  if (value === undefined) return undefined
  if (typeof value === "string") return { value }
  if ("language" in value) {
    return { value: `\`\`\`${value.language}\n${value.value}\n\`\`\`` }
  }
  return {
    value: value.kind === MarkupKind.Markdown ? value.value : value.value.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&"),
  }
}

function isMarkdown(value: monaco.IMarkdownString | undefined): value is monaco.IMarkdownString {
  return value !== undefined
}

function toMonacoDiagnostic(diagnostic: Diagnostic): monaco.editor.IMarkerData {
  return {
    code: diagnostic.code?.toString(),
    endColumn: diagnostic.range.end.character + 1,
    endLineNumber: diagnostic.range.end.line + 1,
    message: typeof diagnostic.message === "string" ? diagnostic.message : diagnostic.message.value,
    severity: toMonacoSeverity(diagnostic.severity),
    source: diagnostic.source ?? "TSConfig",
    startColumn: diagnostic.range.start.character + 1,
    startLineNumber: diagnostic.range.start.line + 1,
  }
}

function toMonacoSeverity(severity: DiagnosticSeverity | undefined) {
  switch (severity) {
    case DiagnosticSeverity.Error:
      return monaco.MarkerSeverity.Error
    case DiagnosticSeverity.Warning:
      return monaco.MarkerSeverity.Warning
    case DiagnosticSeverity.Information:
      return monaco.MarkerSeverity.Info
    default:
      return monaco.MarkerSeverity.Hint
  }
}

function toLspPosition(position: monaco.Position) {
  return {
    character: position.column - 1,
    line: position.lineNumber - 1,
  }
}

function toMonacoRange(range: Range) {
  return new monaco.Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1)
}
