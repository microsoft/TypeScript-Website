import type { Dependency, SourceFile } from "./ata"
import type { NativeCompileInput, NativeCompileResult } from "./native-compiler"

type PendingRequest = {
  resolve(value: unknown): void
  reject(error: Error): void
}

type QueuedCompile = {
  input: NativeCompileInput
  waiters: Array<{ resolve(value: NativeCompileResult): void; reject(error: Error): void }>
}

export class NativeBackend {
  private readonly worker = new Worker(new URL("./native.worker.js", import.meta.url), { type: "module" })
  private readonly pending = new Map<number, PendingRequest>()
  private nextId = 0
  private compiling = false
  private queuedCompile: QueuedCompile | undefined
  private failure: Error | undefined

  private constructor() {
    this.worker.addEventListener("message", (event: MessageEvent<{ id: number; result?: unknown; error?: string }>) => {
      const pending = this.pending.get(event.data.id)
      if (!pending) return
      this.pending.delete(event.data.id)
      if (event.data.error !== undefined) pending.reject(new Error(event.data.error))
      else pending.resolve(event.data.result)
    })
    this.worker.addEventListener("error", event => {
      this.failure = new Error(event.message || "Native compiler worker failed")
      for (const request of this.pending.values()) request.reject(this.failure)
      this.pending.clear()
    })
    this.worker.addEventListener("messageerror", () => {
      this.failure = new Error("Could not decode the native compiler worker response")
      for (const request of this.pending.values()) request.reject(this.failure)
      this.pending.clear()
    })
  }

  static async create(module: WebAssembly.Module, libraries: Record<string, string>) {
    const backend = new NativeBackend()
    try {
      await backend.request("init", { module, libraries })
      return backend
    } catch (error) {
      backend.worker.terminate()
      throw error
    }
  }

  discover(file: SourceFile): Promise<readonly Dependency[]> {
    return this.request("discover", file)
  }

  compile(input: NativeCompileInput): Promise<NativeCompileResult> {
    return new Promise((resolve, reject) => {
      if (this.queuedCompile) {
        this.queuedCompile.input = input
        this.queuedCompile.waiters.push({ resolve, reject })
      } else {
        this.queuedCompile = { input, waiters: [{ resolve, reject }] }
      }
      if (!this.compiling) void this.runCompiles()
    })
  }

  private async runCompiles() {
    this.compiling = true
    try {
      while (this.queuedCompile) {
        const compile = this.queuedCompile
        this.queuedCompile = undefined
        try {
          const result = await this.request<NativeCompileResult>("compile", compile.input)
          for (const waiter of compile.waiters) waiter.resolve(result)
        } catch (error) {
          const failure = error instanceof Error ? error : new Error(String(error))
          for (const waiter of compile.waiters) waiter.reject(failure)
        }
      }
    } finally {
      this.compiling = false
    }
  }

  private request<T>(method: string, args: unknown): Promise<T> {
    if (this.failure) return Promise.reject(this.failure)
    const id = ++this.nextId
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve: value => resolve(value as T), reject })
      try {
        this.worker.postMessage({ id, method, args })
      } catch (error) {
        this.pending.delete(id)
        reject(error)
      }
    })
  }
}
