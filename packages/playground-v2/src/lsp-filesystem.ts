import { Directory, File, Inode, PreopenDirectory } from "@bjorn3/browser_wasi_shim"

export type FileSystemUpdate = {
  id: number
  files: Record<string, string>
  deleted: string[]
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const maxRecordBytes = 48 * 1024 * 1024
const filesHeader = "Playground-Files-Length"

export function frameFileSystemUpdate(update: FileSystemUpdate) {
  const body = encoder.encode(JSON.stringify(update))
  if (body.length > maxRecordBytes) throw new Error("Package filesystem update exceeds the 48 MiB stdin limit")
  const header = encoder.encode(`${filesHeader}: ${body.length}\r\n\r\n`)
  const record = new Uint8Array(header.length + body.length)
  record.set(header)
  record.set(body, header.length)
  return record
}

// Filesystem control records share stdin because WASI blocks the worker's event loop.
export class LspStdinRecords {
  private readonly header: number[] = []
  private current: { data: Uint8Array; offset: number; headerLength: number; files: boolean } | undefined
  private readonly output: Array<{ data: Uint8Array } | { files: FileSystemUpdate }> = []
  private outputOffset = 0

  constructor(private readonly onFiles: (update: FileSystemUpdate) => void) {}

  get readable() {
    return this.output.length > 0
  }

  push(data: Uint8Array) {
    let offset = 0
    while (offset < data.length) {
      if (!this.current) {
        this.header.push(data[offset++])
        const length = this.header.length
        if (length > 256) throw new Error("Invalid playground stdin record header")
        if (
          length < 4 ||
          this.header[length - 4] !== 13 ||
          this.header[length - 3] !== 10 ||
          this.header[length - 2] !== 13 ||
          this.header[length - 1] !== 10
        ) continue
        const header = new Uint8Array(this.header)
        const match = /^(Content-Length|Playground-Files-Length): (\d+)\r\n\r\n$/i.exec(decoder.decode(header))
        if (!match) throw new Error("Invalid playground stdin record")
        const size = Number(match[2])
        if (!Number.isSafeInteger(size) || size < 1 || size > maxRecordBytes) {
          throw new Error("Invalid playground stdin record length")
        }
        const record = new Uint8Array(header.length + size)
        record.set(header)
        this.current = {
          data: record,
          offset: header.length,
          headerLength: header.length,
          files: match[1].toLowerCase() === filesHeader.toLowerCase(),
        }
        this.header.length = 0
      }
      const current = this.current
      const length = Math.min(data.length - offset, current.data.length - current.offset)
      current.data.set(data.subarray(offset, offset + length), current.offset)
      current.offset += length
      offset += length
      if (current.offset !== current.data.length) continue
      this.current = undefined
      if (current.files) {
        const update: FileSystemUpdate = JSON.parse(decoder.decode(current.data.subarray(current.headerLength)))
        this.output.push({ files: update })
      } else {
        this.output.push({ data: current.data })
      }
    }
  }

  read(size: number) {
    let next = this.output[0]
    while (next && "files" in next) {
      this.onFiles(next.files)
      this.output.shift()
      next = this.output[0]
    }
    if (!next || !("data" in next)) return undefined
    const data = next.data
    const result = data.subarray(this.outputOffset, this.outputOffset + size)
    this.outputOffset += result.length
    if (this.outputOffset === data.length) {
      this.output.shift()
      this.outputOffset = 0
    }
    return result
  }
}

export class LspFileSystem {
  readonly preopen = new PreopenDirectory("/", new Map<string, Inode>([
    ["workspace", new Directory(new Map())],
    ["tmp", new Directory(new Map())],
    ["typescript", new Directory(new Map([["lib", new Directory(new Map())]]))],
  ]))

  constructor(files: Record<string, string>) {
    this.update(files, [])
  }

  update(files: Record<string, string>, deleted: readonly string[]) {
    const entries = Object.entries(files).map(([path, text]) => ({ parts: this.parts(path), text }))
    const removed = deleted.map(path => this.parts(path))
    for (const { parts, text } of entries) {
      const parent = this.directory(parts.slice(0, -1), true)!
      const name = parts.at(-1)!
      const file = parent.contents.get(name)
      if (file instanceof File) file.data = encoder.encode(text)
      else parent.contents.set(name, new File(encoder.encode(text)))
    }
    for (const parts of removed) {
      this.directory(parts.slice(0, -1), false)?.contents.delete(parts.at(-1)!)
    }
  }

  private parts(path: string) {
    const parts = path.slice(1).split("/")
    if (!path.startsWith("/") || parts.some(part => !part || part === "." || part === ".." || /[\\\0]/.test(part))) {
      throw new Error(`Invalid language-server filesystem path: ${path}`)
    }
    return parts
  }

  private directory(parts: readonly string[], create: boolean) {
    let current = this.preopen.dir
    for (const part of parts) {
      let child = current.contents.get(part)
      if (!child) {
        if (!create) return undefined
        child = new Directory(new Map())
        current.contents.set(part, child)
      }
      if (!(child instanceof Directory)) throw new Error(`Filesystem path component is not a directory: ${part}`)
      current = child
    }
    return current
  }
}
