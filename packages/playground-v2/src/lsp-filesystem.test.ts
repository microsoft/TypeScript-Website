import assert from "node:assert/strict"
import { test } from "node:test"
import { Directory, File } from "@bjorn3/browser_wasi_shim"
import { frameFileSystemUpdate, LspFileSystem, LspStdinRecords, type FileSystemUpdate } from "./lsp-filesystem"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

test("stdin forwards LSP frames and applies split filesystem records before the next message", () => {
  const updates: FileSystemUpdate[] = []
  const records = new LspStdinRecords(update => updates.push(update))
  const update = { id: 1, files: { "/workspace/node_modules/pkg/index.d.ts": "export const café: string;" }, deleted: [] }
  const control = frameFileSystemUpdate(update)
  const frame = encoder.encode('Content-Length: 2\r\n\r\n{}')
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
  const update = { id: 2, files: { "/workspace/node_modules/pkg/large.d.ts": "x".repeat(4 * 1024 * 1024 + 1) }, deleted: [] }
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
  root.update({
    "/workspace/node_modules/pkg/index.d.ts": "export const value: string;",
    "/workspace/node_modules/pkg/package.json": '{"types":"index.d.ts"}',
  }, [])
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
