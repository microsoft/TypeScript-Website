import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import {
  readDocumentationCache,
  updateDocumentationCache,
  writeDocumentationCache,
} from "../src/lib/documentation-cache.mjs"

test("writes and reads documentation HTML by route without embedding routes in filenames", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "documentation-cache-"))
  try {
    const manifest = writeDocumentationCache(
      [
        ["/docs/handbook/intro.html", "<h1>Intro</h1>"],
        ["/fr/docs/handbook/intro.html", "<h1>Introduction</h1>"],
      ],
      root
    )

    assert.equal(Object.keys(manifest).length, 2)
    assert.match(manifest["/docs/handbook/intro.html"], /^[a-f0-9]{64}\.html$/)
    assert.equal(readDocumentationCache("/fr/docs/handbook/intro.html", root), "<h1>Introduction</h1>")
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test("fails when a documentation route is absent from the generated cache", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "documentation-cache-"))
  try {
    writeDocumentationCache([], root)
    assert.throws(() => readDocumentationCache("/docs/missing.html", root), /no entry/)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test("updates one documentation route without replacing the cache", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "documentation-cache-"))
  try {
    writeDocumentationCache(
      [
        ["/docs/handbook/intro.html", "<h1>Intro</h1>"],
        ["/docs/handbook/basics.html", "<h1>Basics</h1>"],
      ],
      root
    )

    updateDocumentationCache([["/docs/handbook/intro.html", "<h1>Updated Intro</h1>"]], root)

    assert.equal(readDocumentationCache("/docs/handbook/intro.html", root), "<h1>Updated Intro</h1>")
    assert.equal(readDocumentationCache("/docs/handbook/basics.html", root), "<h1>Basics</h1>")
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
