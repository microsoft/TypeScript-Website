import { API } from "@typescript/typescript/unstable/sync"
import { instantiateWasm, WasmTransport } from "@typescript/typescript/unstable/wasm"
import type { SourceFile } from "./ata"
import { NativeCompiler, type NativeCompileInput } from "./native-compiler"

type Message =
  | { id: number; method: "init"; args: { module: WebAssembly.Module; libraries: Record<string, string> } }
  | { id: number; method: "compile"; args: NativeCompileInput }
  | { id: number; method: "discover"; args: SourceFile }

let compiler: NativeCompiler | undefined

self.addEventListener("message", (event: MessageEvent<Message>) => {
  void handle(event.data)
})

async function handle(message: Message) {
  try {
    let result: unknown
    if (message.method === "init") {
      const transport = new WasmTransport({ instance: await instantiateWasm(message.args.module), cwd: "/workspace" })
      for (const [fileName, text] of Object.entries(message.args.libraries)) transport.setFile(fileName, text)
      compiler = new NativeCompiler(new API({ transport }), transport)
    } else {
      if (!compiler) throw new Error("Native compiler worker is not initialized")
      result = message.method === "compile" ? compiler.compile(message.args) : compiler.discover(message.args)
    }
    self.postMessage({ id: message.id, result })
  } catch (error) {
    self.postMessage({ id: message.id, error: error instanceof Error ? error.stack ?? error.message : String(error) })
  }
}
