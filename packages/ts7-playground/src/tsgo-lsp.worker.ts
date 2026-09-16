import {
  Directory,
  Fd,
  File,
  Inode,
  PreopenDirectory,
  WASI,
  wasi,
  WASIProcExit,
} from "@bjorn3/browser_wasi_shim"

const headerWords = 4
const readPosition = 0
const writePosition = 1
const closed = 2
const signal = 3
const subscriptionSize = 48
const eventSize = 32

type InitMessage = {
  type: "init"
  stdin: SharedArrayBuffer
  libsUrl: string
  module: WebAssembly.Module
  files: Record<string, string>
}

class BlockingStdin extends Fd {
  readonly #state: Int32Array
  readonly #data: Uint8Array

  constructor(buffer: SharedArrayBuffer) {
    super()
    this.#state = new Int32Array(buffer, 0, headerWords)
    this.#data = new Uint8Array(buffer, headerWords * Int32Array.BYTES_PER_ELEMENT)
  }

  override fd_fdstat_get() {
    const fdstat = new wasi.Fdstat(
      wasi.FILETYPE_CHARACTER_DEVICE,
      wasi.FDFLAGS_NONBLOCK,
    )
    fdstat.fs_rights_base = BigInt(
      wasi.RIGHTS_FD_READ | wasi.RIGHTS_POLL_FD_READWRITE,
    )
    return { ret: wasi.ERRNO_SUCCESS, fdstat }
  }

  override fd_filestat_get() {
    return {
      ret: wasi.ERRNO_SUCCESS,
      filestat: new wasi.Filestat(
        Inode.issue_ino(),
        wasi.FILETYPE_CHARACTER_DEVICE,
        0n,
      ),
    }
  }

  override fd_fdstat_set_flags() {
    return wasi.ERRNO_SUCCESS
  }

  override fd_read(size: number) {
    let readPos = Atomics.load(this.#state, readPosition)
    let writePos = Atomics.load(this.#state, writePosition)
    if (readPos === writePos && !Atomics.load(this.#state, closed)) {
      const currentSignal = Atomics.load(this.#state, signal)
      Atomics.wait(this.#state, signal, currentSignal, 50)
      readPos = Atomics.load(this.#state, readPosition)
      writePos = Atomics.load(this.#state, writePosition)
    }
    if (readPos !== writePos) {
      const available = writePos - readPos
      const length = Math.min(size, available)
      const result = new Uint8Array(length)
      const start = readPos % this.#data.length
      const first = Math.min(length, this.#data.length - start)
      result.set(this.#data.subarray(start, start + first))
      if (first < length) {
        result.set(this.#data.subarray(0, length - first), first)
      }
      Atomics.store(this.#state, readPosition, readPos + length)
      self.postMessage({ type: "drain" })
      return { ret: wasi.ERRNO_SUCCESS, data: result }
    }
    if (Atomics.load(this.#state, closed)) {
      return { ret: wasi.ERRNO_SUCCESS, data: new Uint8Array() }
    }
    return { ret: wasi.ERRNO_AGAIN, data: new Uint8Array() }
  }
}

class LspStdout extends Fd {
  #buffer = new Uint8Array()

  override fd_fdstat_get() {
    const fdstat = new wasi.Fdstat(wasi.FILETYPE_CHARACTER_DEVICE, 0)
    fdstat.fs_rights_base = BigInt(wasi.RIGHTS_FD_WRITE)
    return { ret: wasi.ERRNO_SUCCESS, fdstat }
  }

  override fd_filestat_get() {
    return {
      ret: wasi.ERRNO_SUCCESS,
      filestat: new wasi.Filestat(
        Inode.issue_ino(),
        wasi.FILETYPE_CHARACTER_DEVICE,
        0n,
      ),
    }
  }

  override fd_write(data: Uint8Array) {
    const combined = new Uint8Array(this.#buffer.length + data.length)
    combined.set(this.#buffer)
    combined.set(data, this.#buffer.length)
    this.#buffer = combined
    this.#flushMessages()
    return { ret: wasi.ERRNO_SUCCESS, nwritten: data.length }
  }

  #flushMessages() {
    for (;;) {
      const headerEnd = findHeaderEnd(this.#buffer)
      if (headerEnd < 0) return
      const header = new TextDecoder().decode(this.#buffer.subarray(0, headerEnd))
      const match = /(?:^|\r\n)Content-Length:\s*(\d+)/i.exec(header)
      if (!match) {
        self.postMessage({ type: "error", message: `Invalid LSP header: ${header}` })
        this.#buffer = new Uint8Array()
        return
      }
      const contentLength = Number(match[1])
      const bodyStart = headerEnd + 4
      const bodyEnd = bodyStart + contentLength
      if (this.#buffer.length < bodyEnd) return
      const body = new TextDecoder().decode(this.#buffer.subarray(bodyStart, bodyEnd))
      try {
        self.postMessage({ type: "lsp", message: JSON.parse(body) })
      }
      catch (error) {
        self.postMessage({
          type: "error",
          message: `Invalid LSP JSON: ${String(error)}`,
        })
      }
      this.#buffer = this.#buffer.slice(bodyEnd)
    }
  }
}

class Stderr extends Fd {
  readonly #decoder = new TextDecoder()

  override fd_write(data: Uint8Array) {
    const message = this.#decoder.decode(data, { stream: true }).trim()
    if (message) self.postMessage({ type: "stderr", message })
    return { ret: wasi.ERRNO_SUCCESS, nwritten: data.length }
  }
}

function findHeaderEnd(data: Uint8Array) {
  for (let i = 0; i <= data.length - 4; i++) {
    if (
      data[i] === 13
      && data[i + 1] === 10
      && data[i + 2] === 13
      && data[i + 3] === 10
    ) {
      return i
    }
  }
  return -1
}

function installPollOneoff(wasiRuntime: WASI, state: Int32Array) {
  wasiRuntime.wasiImport.poll_oneoff = (
    inputPointer: number,
    outputPointer: number,
    subscriptionCount: number,
    eventCountPointer: number,
  ) => {
    const memory = new DataView(wasiRuntime.inst.exports.memory.buffer)
    const subscriptions = Array.from(
      { length: subscriptionCount },
      (_, index) =>
        wasi.Subscription.read_bytes(
          memory,
          inputPointer + index * subscriptionSize,
        ),
    )
    const clockDeadlines = new Map<wasi.Subscription, bigint>()
    for (const subscription of subscriptions) {
      if (subscription.eventtype !== wasi.EVENTTYPE_CLOCK) continue
      const clockNow = subscription.clockid === wasi.CLOCKID_REALTIME
        ? BigInt(Date.now()) * 1_000_000n
        : BigInt(Math.round(performance.now() * 1e6))
      clockDeadlines.set(
        subscription,
        (subscription.flags & wasi.SUBCLOCKFLAGS_SUBSCRIPTION_CLOCK_ABSTIME) !== 0
          ? subscription.timeout
          : clockNow + subscription.timeout,
      )
    }

    for (;;) {
      const now = {
        [wasi.CLOCKID_MONOTONIC]: BigInt(Math.round(performance.now() * 1e6)),
        [wasi.CLOCKID_REALTIME]: BigInt(Date.now()) * 1_000_000n,
      }
      const ready = subscriptions.filter(subscription => {
        if (subscription.eventtype === wasi.EVENTTYPE_FD_READ) {
          return Atomics.load(state, readPosition) !== Atomics.load(state, writePosition)
            || Atomics.load(state, closed) !== 0
        }
        if (subscription.eventtype === wasi.EVENTTYPE_FD_WRITE) return true
        if (subscription.eventtype !== wasi.EVENTTYPE_CLOCK) return false
        const clockNow = now[subscription.clockid as keyof typeof now] ?? 0n
        return (clockDeadlines.get(subscription) ?? 0n) <= clockNow
      })

      if (ready.length > 0) {
        ready.forEach((subscription, index) => {
          const eventPointer = outputPointer + index * eventSize
          new wasi.Event(
            subscription.userdata,
            wasi.ERRNO_SUCCESS,
            subscription.eventtype,
          ).write_bytes(memory, eventPointer)
          memory.setBigUint64(eventPointer + 16, 0n, true)
          memory.setUint16(eventPointer + 24, 0, true)
        })
        memory.setUint32(eventCountPointer, ready.length, true)
        return wasi.ERRNO_SUCCESS
      }

      const currentSignal = Atomics.load(state, signal)
      const nextDeadline = Math.min(
        50,
        ...subscriptions
          .filter(subscription => subscription.eventtype === wasi.EVENTTYPE_CLOCK)
          .map(subscription => {
            const clockNow = now[subscription.clockid as keyof typeof now] ?? 0n
            const remaining = (clockDeadlines.get(subscription) ?? clockNow) - clockNow
            return Math.max(1, Math.ceil(Number(remaining) / 1e6))
          }),
      )
      Atomics.wait(state, signal, currentSignal, nextDeadline)
    }
  }
}

type Tree = Map<string, string | Tree>

function createFileSystem(files: Record<string, string>) {
  const root: Tree = new Map([
    ["workspace", new Map()],
    ["tmp", new Map()],
    ["typescript", new Map([["lib", new Map()]])],
  ])
  for (const [filename, contents] of Object.entries(files)) {
    const parts = filename.replace(/^\/+/, "").split("/")
    const basename = parts.pop()!
    let current = root
    for (const part of parts) {
      let child = current.get(part)
      if (!(child instanceof Map)) {
        child = new Map()
        current.set(part, child)
      }
      current = child
    }
    current.set(basename, contents)
  }

  function build(tree: Tree): Directory {
    const contents = new Map<string, Inode>()
    for (const [name, value] of tree) {
      contents.set(
        name,
        typeof value === "string"
          ? new File(new TextEncoder().encode(value))
          : build(value),
      )
    }
    return new Directory(contents)
  }

  return new PreopenDirectory("/", build(root).contents)
}

async function start(message: InitMessage) {
  self.postMessage({ type: "status", status: "loading WebAssembly" })
  const libsResponse = await fetch(message.libsUrl)
  if (!libsResponse.ok) {
    throw new Error(
      `Could not load TypeScript libraries: ${libsResponse.status} ${libsResponse.statusText}`,
    )
  }
  const libraries = await libsResponse.json() as Record<string, string>
  const files = { ...message.files }
  for (const [name, contents] of Object.entries(libraries)) {
    const filename = name.slice(name.lastIndexOf("/") + 1)
    files[`/typescript/lib/${filename}`] = contents
  }

  const fds = [
    new BlockingStdin(message.stdin),
    new LspStdout(),
    new Stderr(),
    createFileSystem(files),
  ]
  const wasiRuntime = new WASI(
    ["tsc", "--lsp", "--stdio"],
    ["HOME=/workspace", "TMPDIR=/tmp"],
    fds,
    { debug: false },
  )
  installPollOneoff(wasiRuntime, new Int32Array(message.stdin, 0, headerWords))
  const instance = await WebAssembly.instantiate(message.module, {
    wasi_snapshot_preview1: wasiRuntime.wasiImport,
  })
  self.postMessage({ type: "status", status: "starting tsc.wasm" })
  try {
    wasiRuntime.start(instance as unknown as {
      exports: {
        memory: WebAssembly.Memory
        _start(): unknown
      }
    })
  }
  catch (error) {
    if (error instanceof WASIProcExit) {
      self.postMessage({
        type: "error",
        message: `tsc exited with status ${error.code}`,
      })
    }
    else {
      throw error
    }
  }
}

self.addEventListener("message", (event: MessageEvent<InitMessage>) => {
  if (event.data.type !== "init") return
  start(event.data).catch(error => {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.stack ?? error.message : String(error),
    })
  })
}, { once: true })
