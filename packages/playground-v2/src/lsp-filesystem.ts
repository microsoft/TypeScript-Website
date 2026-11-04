import { Directory, File, Inode, OpenDirectory, wasi } from "@bjorn3/browser_wasi_shim"
import { normalizeVirtualPath, resolveSymlinks, type Symlinks } from "./symlinks"

export type FileSystemUpdate = {
  id: number
  files: Record<string, string>
  deleted: string[]
}

export function normalizeWorkspaceEditUris(value: unknown, normalize: (uri: string) => string): unknown {
  if (!value || typeof value !== "object") return value
  const edit = value as { changes?: Record<string, unknown[]>; documentChanges?: unknown[] }
  const changes: Record<string, unknown[]> = {}
  if (edit.changes) {
    for (const [uri, edits] of Object.entries(edit.changes)) {
      const target = normalize(uri)
      const existing = (changes[target] ??= [])
      for (const item of edits) {
        if (!existing.some(previous => JSON.stringify(previous) === JSON.stringify(item))) existing.push(item)
      }
    }
  }
  return {
    ...edit,
    ...(edit.changes ? { changes } : {}),
    ...(edit.documentChanges
      ? {
          documentChanges: edit.documentChanges.map(change => {
            if (!change || typeof change !== "object" || !("textDocument" in change)) return change
            const document = change.textDocument
            if (!document || typeof document !== "object" || !("uri" in document) || typeof document.uri !== "string")
              return change
            return { ...change, textDocument: { ...document, uri: normalize(document.uri) } }
          }),
        }
      : {}),
  }
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const maxRecordBytes = 48 * 1024 * 1024
const filesHeader = "Playground-Files-Length"
// The shim does not export WASI's lookupflags.SYMLINK_FOLLOW constant.
const symlinkFollow = 1

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
        )
          continue
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
  readonly preopen: OpenDirectory
  private readonly aliases = new Map<string, Set<string>>()

  constructor(files: Record<string, string>, private readonly symlinks: Symlinks = {}) {
    this.preopen = new LspOpenDirectory(new Directory(new Map()), this, "/")
    for (const parts of [["workspace"], ["tmp"], ["typescript", "lib"]]) this.directory(parts, true)
    this.update(files, [])
    for (const [path, target] of Object.entries(symlinks)) {
      const parts = this.parts(path)
      this.directory(parts.slice(0, -1), true)!.contents.set(parts.at(-1)!, new Symlink(target))
    }
  }

  lookup(path: string, followFinal: boolean): { ret: number; inode_obj: Inode | null } {
    const resolved = resolveSymlinks(path, this.symlinks, followFinal)
    if (resolved === undefined) return { ret: wasi.ERRNO_LOOP, inode_obj: null }
    const original = normalizeVirtualPath(path)
    if (original !== resolved) {
      let aliases = this.aliases.get(resolved)
      if (!aliases) this.aliases.set(resolved, (aliases = new Set()))
      aliases.add(original)
    }
    let inode: Inode = this.preopen.dir
    for (const part of resolved.split("/").filter(Boolean)) {
      if (!(inode instanceof Directory)) return { ret: wasi.ERRNO_NOTDIR, inode_obj: null }
      const child = inode.contents.get(part)
      if (!child) return { ret: wasi.ERRNO_NOENT, inode_obj: null }
      inode = child
    }
    return { ret: wasi.ERRNO_SUCCESS, inode_obj: inode }
  }

  update(files: Record<string, string>, deleted: readonly string[]) {
    const aliases: Array<{ path: string; type: number }> = []
    const entries = Object.entries(files).map(([path, text]) => ({ parts: this.parts(path), text }))
    const removed = deleted.map(path => this.parts(path))
    for (const { parts, text } of entries) {
      const parent = this.directory(parts.slice(0, -1), true)!
      const name = parts.at(-1)!
      const file = parent.contents.get(name)
      for (const path of this.aliases.get(`/${parts.join("/")}`) ?? []) {
        aliases.push({ path, type: file instanceof File ? 2 : 1 })
      }
      if (file instanceof File) file.data = encoder.encode(text)
      else parent.contents.set(name, new File(encoder.encode(text)))
    }
    for (const parts of removed) {
      this.directory(parts.slice(0, -1), false)?.contents.delete(parts.at(-1)!)
      for (const path of this.aliases.get(`/${parts.join("/")}`) ?? []) aliases.push({ path, type: 3 })
    }
    return aliases
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

class Symlink extends Inode {
  constructor(readonly target: string) {
    super()
  }

  path_open() {
    return { ret: wasi.ERRNO_LOOP, fd_obj: null }
  }

  stat() {
    return new wasi.Filestat(this.ino, wasi.FILETYPE_SYMBOLIC_LINK, BigInt(encoder.encode(this.target).length))
  }
}

class LspOpenDirectory extends OpenDirectory {
  constructor(dir: Directory, private readonly filesystem: LspFileSystem, private readonly path: string) {
    super(dir)
  }

  override fd_prestat_get() {
    return this.path === "/" ? { ret: wasi.ERRNO_SUCCESS, prestat: wasi.Prestat.dir("/") } : super.fd_prestat_get()
  }

  override path_lookup(path: string, flags: number) {
    return this.filesystem.lookup(`${this.path}/${path}`, (flags & symlinkFollow) !== 0)
  }

  override path_filestat_get(flags: number, path: string) {
    const result = this.path_lookup(path, flags)
    return { ret: result.ret, filestat: result.inode_obj?.stat() ?? null }
  }

  override path_readlink(path: string) {
    const result = this.path_lookup(path, 0)
    if (!result.inode_obj) return { ret: result.ret, data: null }
    return result.inode_obj instanceof Symlink
      ? { ret: wasi.ERRNO_SUCCESS, data: result.inode_obj.target }
      : { ret: wasi.ERRNO_INVAL, data: null }
  }

  override path_open(
    flags: number,
    path: string,
    oflags: number,
    rights: bigint,
    inheritedRights: bigint,
    fdflags: number
  ) {
    const result = this.path_lookup(path, flags)
    if (!result.inode_obj) {
      if (result.ret === wasi.ERRNO_NOENT && (oflags & wasi.OFLAGS_CREAT) !== 0) {
        return super.path_open(flags, path, oflags, rights, inheritedRights, fdflags)
      }
      return { ret: result.ret, fd_obj: null }
    }
    if ((oflags & wasi.OFLAGS_EXCL) !== 0) return { ret: wasi.ERRNO_EXIST, fd_obj: null }
    if ((oflags & wasi.OFLAGS_DIRECTORY) !== 0 && !(result.inode_obj instanceof Directory)) {
      return { ret: wasi.ERRNO_NOTDIR, fd_obj: null }
    }
    if (result.inode_obj instanceof Directory) {
      return {
        ret: wasi.ERRNO_SUCCESS,
        fd_obj: new LspOpenDirectory(result.inode_obj, this.filesystem, `${this.path}/${path}`),
      }
    }
    return result.inode_obj.path_open(oflags, rights, fdflags)
  }
}
