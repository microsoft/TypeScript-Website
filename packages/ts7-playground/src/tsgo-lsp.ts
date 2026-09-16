import { createTransportToWorker, MonacoLspClient } from "@vscode/monaco-lsp-client"
import * as monaco from "monaco-editor-core"
import {
  conf as javascriptConfiguration,
  language as javascriptLanguage,
} from "monaco-editor/languages/definitions/javascript/javascript.js"
import {
  conf as typescriptConfiguration,
  language as typescriptLanguage,
} from "monaco-editor/languages/definitions/typescript/typescript.js"

const headerWords = 4
const readPosition = 0
const writePosition = 1
const closed = 2
const signal = 3
const bufferSize = 4 * 1024 * 1024

export type TsgoStatus = "mounting files" | "starting tsc.wasm" | "initializing LSP" | "ready"

type WorkerMessage = {
  type: "lsp" | "drain" | "status" | "stderr" | "error"
  message?: any
  status?: TsgoStatus
}

type LspRange = {
  start: { line: number; character: number }
  end: { line: number; character: number }
}

type StartTsgoLspOptions = {
  editor: monaco.editor.IStandaloneCodeEditor
  libraries: Record<string, string>
  models: readonly monaco.editor.ITextModel[]
  module: WebAssembly.Module
  onError(message: string): void
  onStatus(status: TsgoStatus, serverInfo?: string): void
}

class RingBufferWorker {
  readonly #worker = new Worker(new URL("./tsgo-lsp.worker.js", import.meta.url), {
    type: "module",
  })
  readonly #state: Int32Array
  readonly #data: Uint8Array
  readonly #queue: Uint8Array[] = []
  readonly #listeners = new Map<EventListenerOrEventListenerObject, EventListener>()
  readonly #pendingRequests = new Map<string | number, string>()
  #queueOffset = 0

  onStatus?: (status: TsgoStatus) => void
  onError?: (message: string) => void
  onServerInfo?: (serverInfo: string) => void

  constructor(stdin: SharedArrayBuffer) {
    this.#state = new Int32Array(stdin, 0, headerWords)
    this.#data = new Uint8Array(stdin, headerWords * Int32Array.BYTES_PER_ELEMENT)
    this.#worker.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
      if (event.data.type === "drain") {
        this.#flush()
      } else if (event.data.type === "status" && event.data.status) {
        this.onStatus?.(event.data.status)
      } else if (event.data.type === "error") {
        this.onError?.(event.data.message)
      } else if (event.data.type === "stderr") {
        console.warn("[tsgo]", event.data.message)
      } else if (event.data.type === "lsp") {
        void this.#handleLspMessage(event.data.message)
      }
    })
  }

  start(
    stdin: SharedArrayBuffer,
    module: WebAssembly.Module,
    libraries: Record<string, string>,
    files: Record<string, string>
  ) {
    this.#worker.postMessage({
      type: "init",
      stdin,
      libraries,
      module,
      files,
    })
  }

  postMessage(message: unknown) {
    const lspMessage = message as { id?: string | number; method?: string }
    if (lspMessage.id !== undefined && lspMessage.method) {
      this.#pendingRequests.set(lspMessage.id, lspMessage.method)
    }

    const body = new TextEncoder().encode(JSON.stringify(message))
    const header = new TextEncoder().encode(`Content-Length: ${body.length}\r\n\r\n`)
    const framed = new Uint8Array(header.length + body.length)
    framed.set(header)
    framed.set(body, header.length)
    if (framed.length > this.#data.length) {
      throw new Error(`LSP message exceeds the ${this.#data.length}-byte stdin buffer`)
    }
    this.#queue.push(framed)
    this.#flush()
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    if (type !== "message") return
    const callback: EventListener = typeof listener === "function" ? listener : event => listener.handleEvent(event)
    this.#listeners.set(listener, callback)
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    if (type === "message") this.#listeners.delete(listener)
  }

  #flush() {
    while (this.#queue.length > 0) {
      const readPos = Atomics.load(this.#state, readPosition)
      const writePos = Atomics.load(this.#state, writePosition)
      const free = this.#data.length - (writePos - readPos)
      if (free <= 0) return

      const current = this.#queue[0]
      const length = Math.min(free, current.length - this.#queueOffset)
      const start = writePos % this.#data.length
      const first = Math.min(length, this.#data.length - start)
      this.#data.set(current.subarray(this.#queueOffset, this.#queueOffset + first), start)
      if (first < length) {
        this.#data.set(current.subarray(this.#queueOffset + first, this.#queueOffset + length), 0)
      }
      this.#queueOffset += length
      Atomics.store(this.#state, writePosition, writePos + length)
      Atomics.add(this.#state, signal, 1)
      Atomics.notify(this.#state, signal)

      if (this.#queueOffset === current.length) {
        this.#queue.shift()
        this.#queueOffset = 0
      }
    }
  }

  async #handleLspMessage(message: any) {
    const method = message?.method
    const label = method ?? this.#pendingRequests.get(message?.id)
    if (method === "textDocument/publishDiagnostics") return
    if (label === "textDocument/definition") {
      await ensureLibraryModels(message?.result)
      navigateToDefinition(message?.result)
    }
    if (message?.id !== undefined && !method) {
      this.#pendingRequests.delete(message.id)
    }
    if (message?.result?.capabilities) {
      const info = message.result.serverInfo
      if (info?.name) {
        const name = info.name === "typescript-go" ? "TypeScript" : info.name
        this.onServerInfo?.(`${name}${info.version ? ` ${info.version}` : ""}`)
      }
      this.onStatus?.("ready")
    }

    const forwarded = new MessageEvent("message", { data: message })
    for (const listener of this.#listeners.values()) listener(forwarded)
  }
}

let languageRegistered = false
let activeEditor: monaco.editor.IStandaloneCodeEditor | undefined
let libraryFilesPromise: Promise<Record<string, string>> | undefined

export function registerPlaygroundLanguages() {
  if (languageRegistered) return
  languageRegistered = true
  monaco.languages.register({ id: "typescript", extensions: [".ts", ".tsx", ".mts", ".cts"] })
  monaco.languages.setLanguageConfiguration("typescript", typescriptConfiguration)
  monaco.languages.setMonarchTokensProvider("typescript", typescriptLanguage)
  monaco.languages.register({ id: "javascript", extensions: [".js", ".jsx", ".mjs", ".cjs"] })
  monaco.languages.setLanguageConfiguration("javascript", javascriptConfiguration)
  monaco.languages.setMonarchTokensProvider("javascript", javascriptLanguage)
  monaco.languages.register({ id: "json", extensions: [".json"] })
  monaco.languages.setLanguageConfiguration("json", {
    brackets: [
      ["{", "}"],
      ["[", "]"],
    ],
    comments: { lineComment: "//", blockComment: ["/*", "*/"] },
  })
  monaco.languages.setMonarchTokensProvider("json", {
    tokenizer: {
      root: [
        [/"(?:\\.|[^"\\])*"(?=\s*:)/, "string.key.json"],
        [/"(?:\\.|[^"\\])*"/, "string.value.json"],
        [/\b(?:true|false|null)\b/, "keyword.json"],
        [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, "number"],
        [/[{}\[\],:]/, "delimiter"],
        [/\/\/.*$/, "comment"],
      ],
    },
  })
}

export function startTsgoLsp(options: StartTsgoLspOptions) {
  if (!crossOriginIsolated) {
    throw new Error("The TypeScript language server requires cross-origin isolation; reload once to activate it.")
  }

  activeEditor = options.editor
  libraryFilesPromise = Promise.resolve(options.libraries)
  const stdin = new SharedArrayBuffer(headerWords * Int32Array.BYTES_PER_ELEMENT + bufferSize)
  const worker = new RingBufferWorker(stdin)
  let serverInfo: string | undefined
  worker.onStatus = status => options.onStatus(status, serverInfo)
  worker.onServerInfo = info => {
    serverInfo = info
  }
  worker.onError = options.onError
  worker.start(
    stdin,
    options.module,
    options.libraries,
    Object.fromEntries(options.models.map(model => [model.uri.path, model.getValue()]))
  )

  const transport = createTransportToWorker(worker as unknown as Worker)
  new MonacoLspClient(transport)
}

async function ensureLibraryModels(result: unknown) {
  const locations = Array.isArray(result) ? result : [result]
  const uris = new Set<string>()
  for (const location of locations) {
    if (!location || typeof location !== "object") continue
    const candidate = location as { uri?: string; targetUri?: string }
    const uri = candidate.targetUri ?? candidate.uri
    if (uri && isLibraryUri(uri)) uris.add(uri)
  }

  const libraryFiles = uris.size > 0 ? await getLibraryFiles() : {}
  for (const uri of uris) {
    const monacoUri = monaco.Uri.parse(uri)
    if (monaco.editor.getModel(monacoUri)) continue
    const filename = uri.slice(uri.lastIndexOf("/") + 1)
    const contents = libraryFiles[`/${filename}`] ?? libraryFiles[filename]
    if (contents === undefined) throw new Error(`Could not load ${filename}`)
    monaco.editor.createModel(contents, "typescript", monacoUri)
  }
}

function isLibraryUri(uri: string) {
  const parsed = monaco.Uri.parse(uri)
  return (
    (parsed.scheme === "file" && /^\/typescript\/lib\/lib(?:\..*)?\.d\.ts$/i.test(parsed.path)) ||
    (parsed.scheme === "bundled" && /^\/libs\/lib(?:\..*)?\.d\.ts$/i.test(parsed.path))
  )
}

function getLibraryFiles() {
  libraryFilesPromise ??= fetch(new URL("./lib-files.json", import.meta.url)).then(response => {
    if (!response.ok) {
      throw new Error(`Could not load TypeScript libraries: ${response.status} ${response.statusText}`)
    }
    return response.json() as Promise<Record<string, string>>
  })
  return libraryFilesPromise
}

function navigateToDefinition(result: unknown) {
  const location = Array.isArray(result) ? result[0] : result
  if (!activeEditor || !location || typeof location !== "object") return

  const target = location as {
    uri?: string
    targetUri?: string
    range?: LspRange
    targetRange?: LspRange
    targetSelectionRange?: LspRange
  }
  const uri = target.targetUri ?? target.uri
  const range = target.targetSelectionRange ?? target.targetRange ?? target.range
  if (!uri || !range) return
  const model = monaco.editor.getModel(monaco.Uri.parse(uri))
  if (!model || activeEditor.getModel() === model) return

  const monacoRange = new monaco.Range(
    range.start.line + 1,
    range.start.character + 1,
    range.end.line + 1,
    range.end.character + 1
  )
  activeEditor.setModel(model)
  activeEditor.setSelection(monacoRange)
  activeEditor.revealRangeInCenter(monacoRange, monaco.editor.ScrollType.Immediate)
  activeEditor.focus()
}

export { monaco }
