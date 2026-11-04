import assert from "node:assert/strict"
import { test } from "node:test"
import { Directory, File, OpenDirectory, wasi } from "@bjorn3/browser_wasi_shim"
import {
  frameFileSystemUpdate,
  LspFileSystem,
  LspStdinRecords,
  normalizeWorkspaceEditUris,
  type FileSystemUpdate,
} from "./lsp-filesystem"
import { resolveSymlinks, validateProjectSymlinks } from "./symlinks"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

test("workspace edits resolve alias URIs and merge duplicate edits without changing the source response", () => {
  const alias = "file:///workspace/src/value.ts"
  const target = "file:///workspace/shared/value.ts"
  const edit = { range: { start: { line: 0, character: 13 }, end: { line: 0, character: 18 } }, newText: "renamed" }
  const original = {
    changes: { [alias]: [edit], [target]: [edit] },
    documentChanges: [{ textDocument: { uri: alias, version: null }, edits: [edit] }],
  }
  const normalized = normalizeWorkspaceEditUris(original, uri => (uri === alias ? target : uri))
  assert.deepEqual(normalized, {
    changes: { [target]: [edit] },
    documentChanges: [{ textDocument: { uri: target, version: null }, edits: [edit] }],
  })
  assert.equal(original.documentChanges[0].textDocument.uri, alias)
})

test("stdin forwards LSP frames and applies split filesystem records before the next message", () => {
  const updates: FileSystemUpdate[] = []
  const records = new LspStdinRecords(update => updates.push(update))
  const update = {
    id: 1,
    files: { "/workspace/node_modules/pkg/index.d.ts": "export const café: string;" },
    deleted: [],
  }
  const control = frameFileSystemUpdate(update)
  const frame = encoder.encode("Content-Length: 2\r\n\r\n{}")
  const input = new Uint8Array(control.length + frame.length)
  input.set(control)
  input.set(frame, control.length)
  for (let start = 0; start < input.length; start += 7) {
    records.push(input.subarray(start, start + 7))
  }
  assert.deepEqual(updates, [])
  assert.equal(records.readable, true)
  assert.equal(decoder.decode(records.read(5)), "Conte")
  assert.deepEqual(updates, [update])
  assert.equal(decoder.decode(records.read(100)), "nt-Length: 2\r\n\r\n{}")
  assert.equal(records.readable, false)
  assert.equal(records.read(1), undefined)
})

test("filesystem records can exceed the ring size without becoming LSP data", () => {
  let applied = 0
  const update = {
    id: 2,
    files: { "/workspace/node_modules/pkg/large.d.ts": "x".repeat(4 * 1024 * 1024 + 1) },
    deleted: [],
  }
  const records = new LspStdinRecords(result => {
    assert.deepEqual(result, update)
    applied++
  })
  const input = frameFileSystemUpdate(update)
  for (let start = 0; start < input.length; start += 64 * 1024) {
    records.push(input.subarray(start, start + 64 * 1024))
  }
  assert.equal(records.read(1), undefined)
  assert.equal(applied, 1)
  assert.equal(records.readable, false)
})

test("filesystem updates preserve ordering with preceding and following LSP messages", () => {
  const updates: number[] = []
  const records = new LspStdinRecords(update => updates.push(update.id))
  const before = encoder.encode("Content-Length: 2\r\n\r\n[]")
  const after = encoder.encode("Content-Length: 2\r\n\r\n{}")
  const update = frameFileSystemUpdate({ id: 3, files: {}, deleted: [] })
  const data = new Uint8Array(before.length + update.length + after.length)
  data.set(before)
  data.set(update, before.length)
  data.set(after, before.length + update.length)
  records.push(data)
  assert.deepEqual(updates, [])
  assert.equal(decoder.decode(records.read(before.length)), decoder.decode(before))
  assert.deepEqual(updates, [])
  assert.equal(decoder.decode(records.read(after.length)), decoder.decode(after))
  assert.deepEqual(updates, [3])
})

test("virtual package files are created, changed, and removed without replacing existing directory handles", () => {
  const root = new LspFileSystem({ "/workspace/src/index.ts": 'import "pkg";' })
  const workspace = root.preopen.dir.contents.get("workspace")
  assert(workspace instanceof Directory)
  root.update(
    {
      "/workspace/node_modules/pkg/index.d.ts": "export const value: string;",
      "/workspace/node_modules/pkg/package.json": '{"types":"index.d.ts"}',
    },
    []
  )
  const modules = workspace.contents.get("node_modules")
  assert(modules instanceof Directory)
  const pkg = modules.contents.get("pkg")
  assert(pkg instanceof Directory)
  const file = pkg.contents.get("index.d.ts")
  assert(file instanceof File)
  root.update({ "/workspace/node_modules/pkg/index.d.ts": "export const value: number;" }, [])
  assert.equal(pkg.contents.get("index.d.ts"), file)
  assert.equal(decoder.decode(file.data), "export const value: number;")
  root.update({}, ["/workspace/node_modules/pkg/index.d.ts", "/workspace/node_modules/pkg/package.json"])
  assert.equal(pkg.contents.size, 0)
  assert.equal(root.preopen.dir.contents.get("workspace"), workspace)
  assert.throws(() => root.update({ "/workspace/../bad.ts": "" }, []), /Invalid/)
})

test("stdin rejects malformed and oversized record headers explicitly", () => {
  const records = () => new LspStdinRecords(() => {})
  assert.throws(() => records().push(encoder.encode("Unknown: 2\r\n\r\n{}")), /Invalid/)
  assert.throws(() => records().push(encoder.encode("Content-Length: 50331649\r\n\r\n")), /Invalid/)
  assert.throws(() => records().push(encoder.encode("x".repeat(257))), /header/)
})

test("symbolic links resolve relative targets before parent components and reject conflicting project paths", () => {
  const links = { "/workspace/node_modules/pkg": "../packages/pkg", "/workspace/src/value.ts": "../shared/value.ts" }
  assert.equal(resolveSymlinks("/workspace/node_modules/pkg/../other", links), "/workspace/packages/other")
  assert.equal(resolveSymlinks("/workspace/src/value.ts", links, false), "/workspace/src/value.ts")
  assert.equal(resolveSymlinks("/workspace/src/value.ts", links), "/workspace/shared/value.ts")
  validateProjectSymlinks({}, links)
  assert.throws(() => validateProjectSymlinks({ "/workspace/src/value.ts": "" }, links), /conflicts/)
  assert.throws(() => validateProjectSymlinks({}, { "/workspace/link": "../../outside" }), /inside/)
  assert.throws(() => validateProjectSymlinks({}, { "/workspace/a": "b", "/workspace/b": "a" }), /cycle/)
})

test("WASI follows file and directory symlinks, exposes readlink and lstat, and preserves open target handles", () => {
  const root = new LspFileSystem(
    { "/workspace/packages/pkg/pkg/index.ts": "before" },
    {
      "/workspace/node_modules/pkg": "../packages/pkg",
      "/workspace/source.ts": "packages/pkg/pkg/index.ts",
      "/workspace/dangling": "missing",
      "/workspace/loop": "loop",
    }
  )
  assert.equal(
    root.preopen.path_filestat_get(0, "workspace/node_modules/pkg").filestat?.filetype,
    wasi.FILETYPE_SYMBOLIC_LINK
  )
  assert.equal(
    root.preopen.path_filestat_get(1, "workspace/node_modules/pkg").filestat?.filetype,
    wasi.FILETYPE_DIRECTORY
  )
  assert.equal(root.preopen.path_readlink("workspace/node_modules/pkg").data, "../packages/pkg")
  assert.equal(root.preopen.path_readlink("workspace/source.ts").data, "packages/pkg/pkg/index.ts")
  const opened = root.preopen.path_open(1, "workspace/node_modules/pkg/pkg", wasi.OFLAGS_DIRECTORY, 0n, 0n, 0).fd_obj
  assert(opened instanceof OpenDirectory)
  assert.equal(
    opened.path_lookup("index.ts", 1).inode_obj,
    root.preopen.path_lookup("workspace/source.ts", 1).inode_obj
  )
  const changes = root.update({ "/workspace/packages/pkg/pkg/index.ts": "after" }, [])
  assert(changes.some(change => change.path === "/workspace/source.ts" && change.type === 2))
  assert(changes.some(change => change.path === "/workspace/node_modules/pkg/pkg/index.ts" && change.type === 2))
  const file = opened.path_lookup("index.ts", 1).inode_obj
  assert(file instanceof File)
  assert.equal(decoder.decode(file.data), "after")
  assert.equal(root.preopen.path_filestat_get(1, "workspace/dangling").ret, wasi.ERRNO_NOENT)
  assert.equal(root.preopen.path_filestat_get(1, "workspace/loop").ret, wasi.ERRNO_LOOP)
})
