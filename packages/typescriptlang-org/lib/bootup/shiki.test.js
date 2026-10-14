jest.mock("remark-shiki-twoslash", () => ({
  setupForFile: jest.fn(),
  remarkVisitor: jest.fn(),
}))

const { setupForFile, remarkVisitor } = require("remark-shiki-twoslash")
const plugin = require("gatsby-remark-shiki-twoslash")

const ast = (value = "const value = 1", lang = "ts", meta = undefined) => ({
  type: "root",
  children: [{ type: "code", value, lang, meta }],
})

let highlighter

beforeEach(() => {
  jest.clearAllMocks()
  highlighter = {
    codeToThemedTokens: jest.fn(() => [[{ content: "token", color: "#000" }]]),
  }
  setupForFile.mockImplementation(async settings => ({
    settings,
    highlighters: [highlighter],
  }))
  remarkVisitor.mockImplementation(highlighters => node => {
    const tokens = highlighters[0].codeToThemedTokens(node.value, node.lang)
    node.type = "html"
    node.value = `<div class='code-container'>${tokens[0][0].content}</div>`
    tokens[0][0].content = "mutated"
    node.children = []
  })
})

it("reuses highlighting without sharing mutable tokens or losing focusability", async () => {
  const first = ast()
  const second = ast()
  await plugin({ markdownAST: first }, {})
  await plugin({ markdownAST: second }, {})
  expect(highlighter.codeToThemedTokens).toHaveBeenCalledTimes(1)
  expect(highlighter.codeToThemedTokens).toHaveBeenCalledWith(
    "const value = 1",
    "ts",
    undefined,
    { includeExplanation: false }
  )
  expect(second).toEqual(first)
  expect(second.children[0].value).toContain("tabindex='0'>token")
  expect(setupForFile).toHaveBeenCalledTimes(2)
  expect(remarkVisitor).toHaveBeenCalledTimes(2)
})

it("keeps scopes for TSConfig property hovers", async () => {
  await plugin({ markdownAST: ast('{"strict": true}', "json", "tsconfig") }, {})
  expect(highlighter.codeToThemedTokens).toHaveBeenCalledWith(
    '{"strict": true}',
    "json",
    undefined,
    { includeExplanation: true }
  )
})

it("distinguishes languages and code", async () => {
  await plugin({ markdownAST: ast() }, {})
  await plugin({ markdownAST: ast("const value = 2") }, {})
  await plugin({ markdownAST: ast("const value = 1", "js") }, {})
  expect(highlighter.codeToThemedTokens).toHaveBeenCalledTimes(3)
})

it("does not cache highlighting failures", async () => {
  highlighter.codeToThemedTokens.mockImplementationOnce(() => {
    throw new Error("highlighting failed")
  })
  await expect(plugin({ markdownAST: ast() }, {})).rejects.toThrow(
    "highlighting failed"
  )
  await plugin({ markdownAST: ast() }, {})
  expect(highlighter.codeToThemedTokens).toHaveBeenCalledTimes(2)
})

it("isolates highlighter instances", async () => {
  const firstHighlighter = highlighter
  await plugin({ markdownAST: ast() }, {})
  highlighter = {
    codeToThemedTokens: jest.fn(() => [[{ content: "different theme" }]]),
  }
  const second = ast()
  await plugin({ markdownAST: second }, {})
  expect(firstHighlighter.codeToThemedTokens).toHaveBeenCalledTimes(1)
  expect(highlighter.codeToThemedTokens).toHaveBeenCalledTimes(1)
  expect(second.children[0].value).toContain("different theme")
})

it("bounds the highlighting cache", async () => {
  for (let i = 0; i < 257; i++) {
    await plugin({ markdownAST: ast(`const value = ${i}`) }, {})
  }
  await plugin({ markdownAST: ast("const value = 0") }, {})
  expect(highlighter.codeToThemedTokens).toHaveBeenCalledTimes(258)
})

describe("persistent Twoslash cache", () => {
  const fs = require("fs")
  const shikiTwoslash = require("shiki-twoslash")
  const { runTwoSlashOnNode } = jest.requireActual("remark-shiki-twoslash")
  const fence = lang => ({ lang, meta: { twoslash: true } })
  let runTwoSlash

  beforeEach(() => {
    const files = new Map()
    const existsSync = fs.existsSync
    const readFileSync = fs.readFileSync
    const writeFileSync = fs.writeFileSync
    const utimesSync = fs.utimesSync
    const isCache = path =>
      typeof path === "string" &&
      (path.includes(".cache/twoslash") || path.includes(".cache\\twoslash"))
    jest
      .spyOn(fs, "existsSync")
      .mockImplementation(path =>
        isCache(path) ? files.has(path) : existsSync(path)
      )
    const mkdirSync = fs.mkdirSync
    jest
      .spyOn(fs, "mkdirSync")
      .mockImplementation((path, ...args) =>
        isCache(path) ? undefined : mkdirSync(path, ...args)
      )
    jest
      .spyOn(fs, "readFileSync")
      .mockImplementation((path, ...args) =>
        isCache(path) ? files.get(path) : readFileSync(path, ...args)
      )
    jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation((path, data, ...args) => {
        if (isCache(path)) files.set(path, data)
        else writeFileSync(path, data, ...args)
      })
    jest.spyOn(fs, "utimesSync").mockImplementation((path, ...args) => {
      if (!isCache(path)) return utimesSync(path, ...args)
    })
    runTwoSlash = jest
      .spyOn(shikiTwoslash, "runTwoSlash")
      .mockImplementation((code, lang, { tsModule, ...settings }) => ({
        code, lang, settings,
      }))
  })

  afterEach(() => jest.restoreAllMocks())

  it("reuses identical semantic inputs", () => {
    const first = runTwoSlashOnNode("const value = 1", fence("ts"), {})
    const second = runTwoSlashOnNode("const value = 1", fence("ts"), {})
    expect(second).toEqual(first)
    expect(runTwoSlash).toHaveBeenCalledTimes(1)
    expect(fs.utimesSync).toHaveBeenCalledTimes(1)
    expect(fs.utimesSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Date),
      expect.any(Date)
    )
  })

  it("distinguishes TypeScript from JavaScript", () => {
    runTwoSlashOnNode("const value = 1", fence("ts"), {})
    runTwoSlashOnNode("const value = 1", fence("js"), {})
    expect(runTwoSlash).toHaveBeenCalledTimes(2)
  })

  it("invalidates changed examples without discarding other examples", () => {
    runTwoSlashOnNode("const value = 1", fence("ts"), {})
    runTwoSlashOnNode("const other = 1", fence("ts"), {})
    runTwoSlashOnNode("const value = 2", fence("ts"), {})
    runTwoSlashOnNode("const other = 1", fence("ts"), {})
    expect(runTwoSlash).toHaveBeenCalledTimes(3)
  })

  it("invalidates results when compiler or Twoslash options change", () => {
    runTwoSlashOnNode("const value = 1", fence("ts"), {})
    runTwoSlashOnNode("const value = 1", fence("ts"), {
      defaultCompilerOptions: { strict: true },
    })
    runTwoSlashOnNode("const value = 1", fence("ts"), {
      defaultOptions: { noErrors: true },
    })
    expect(runTwoSlash).toHaveBeenCalledTimes(3)
  })

  it("does not save failed compilations", () => {
    runTwoSlash.mockImplementationOnce(() => {
      throw new Error("compilation failed")
    })
    expect(() => runTwoSlashOnNode("bad code", fence("ts"), {})).toThrow(
      "compilation failed"
    )
    runTwoSlashOnNode("bad code", fence("ts"), {})
    expect(runTwoSlash).toHaveBeenCalledTimes(2)
  })

  it("does not hide errors recording cache usage", () => {
    runTwoSlashOnNode("const value = 1", fence("ts"), {})
    fs.utimesSync.mockImplementationOnce(() => {
      throw new Error("access time update failed")
    })
    expect(() => runTwoSlashOnNode("const value = 1", fence("ts"), {})).toThrow(
      "access time update failed"
    )
  })

  it.each(["runtime", "manifest"])("invalidates changed compiler %s without a version bump", kind => {
    const freshCache = () => {
      let cache
      jest.isolateModules(() => {
        cache = jest.requireActual("remark-shiki-twoslash/dist/twoslash-cache.js")
      })
      return cache
    }
    freshCache()("const value = 1", "ts", {}, runTwoSlash)
    freshCache()("const value = 1", "ts", {}, runTwoSlash)
    expect(runTwoSlash).toHaveBeenCalledTimes(1)
    const readFileSync = fs.readFileSync.getMockImplementation()
    fs.readFileSync.mockImplementation((filename, ...args) => {
      const contents = readFileSync(filename, ...args)
      if (typeof filename === "string" && filename.replace(/\\/g, "/").includes("ts-twoslasher/")) {
        if (kind === "runtime" && filename.endsWith(".js")) {
          return Buffer.concat([Buffer.from(contents), Buffer.from("\n// compiler rebuild\n")])
        }
        if (kind === "manifest" && filename.endsWith("package.json")) {
          return Buffer.from(JSON.stringify({ ...JSON.parse(contents), main: "./dist/changed-compiler.js" }))
        }
      }
      return contents
    })
    freshCache()("const value = 1", "ts", {}, runTwoSlash)
    expect(runTwoSlash).toHaveBeenCalledTimes(2)
  })

  it.each([
    { tsModule: { version: "custom compiler" } },
    { fsMap: new Map() },
    { customTransformers: { before: [] } },
    { lzstringModule: { compressToEncodedURIComponent: () => "custom" } },
  ])("does not reuse non-serializable compiler inputs: %p", settings => {
    runTwoSlashOnNode("const value = 1", fence("ts"), settings)
    runTwoSlashOnNode("const value = 1", fence("ts"), settings)
    expect(runTwoSlash).toHaveBeenCalledTimes(2)
    expect(fs.writeFileSync).not.toHaveBeenCalled()
  })

  describe("filesystem inputs", () => {
    const os = require("os")
    const path = require("path")
    let directory

    beforeEach(() => {
      directory = fs.mkdtempSync(path.join(os.tmpdir(), "website-twoslash-input-"))
    })

    afterEach(() => fs.rmSync(directory, { recursive: true, force: true }))

    it("invalidates changed declarations", () => {
      const filename = path.join(directory, "dependency.d.ts")
      fs.writeFileSync(filename, "export const value: number")
      runTwoSlash.mockImplementation((code, lang, settings) => ({
        declaration: settings.tsModule.sys.readFile(filename),
      }))
      const first = runTwoSlashOnNode("import 'dependency'", fence("ts"), {})
      expect(runTwoSlashOnNode("import 'dependency'", fence("ts"), {})).toEqual(first)
      expect(runTwoSlash).toHaveBeenCalledTimes(1)
      fs.writeFileSync(filename, "export const value: string")
      const second = runTwoSlashOnNode("import 'dependency'", fence("ts"), {})
      expect(second.declaration).toBe("export const value: string")
      expect(runTwoSlash).toHaveBeenCalledTimes(2)
      expect(runTwoSlashOnNode("import 'dependency'", fence("ts"), {})).toEqual(second)
      expect(runTwoSlash).toHaveBeenCalledTimes(2)
    })

    it("recompiles real imports when their declarations change", () => {
      runTwoSlash.mockRestore()
      runTwoSlash = jest.spyOn(shikiTwoslash, "runTwoSlash")
      const filename = path.join(directory, "dependency.d.ts")
      const code = 'import { value } from "./dependency"\nconst answer = value\n//    ^?'
      const settings = { vfsRoot: directory, defaultCompilerOptions: { types: [] } }
      fs.writeFileSync(filename, "export const value: number")
      const first = runTwoSlashOnNode(code, fence("ts"), settings)
      expect(first.queries[0].text).toBe("const answer: number")
      expect(runTwoSlashOnNode(code, fence("ts"), settings)).toEqual(first)
      expect(runTwoSlash).toHaveBeenCalledTimes(1)
      fs.writeFileSync(filename, "export const value: string")
      const second = runTwoSlashOnNode(code, fence("ts"), settings)
      expect(second.queries[0].text).toBe("const answer: string")
      expect(runTwoSlashOnNode(code, fence("ts"), settings)).toEqual(second)
      expect(runTwoSlash).toHaveBeenCalledTimes(2)
    })

    it("invalidates missing imports when a file becomes available", () => {
      const filename = path.join(directory, "dependency.d.ts")
      runTwoSlash.mockImplementation((code, lang, settings) => ({
        exists: settings.tsModule.sys.fileExists(filename),
      }))
      expect(runTwoSlashOnNode("import 'dependency'", fence("ts"), {}).exists).toBe(false)
      runTwoSlashOnNode("import 'dependency'", fence("ts"), {})
      expect(runTwoSlash).toHaveBeenCalledTimes(1)
      fs.writeFileSync(filename, "export const value: number")
      expect(runTwoSlashOnNode("import 'dependency'", fence("ts"), {}).exists).toBe(true)
      expect(runTwoSlash).toHaveBeenCalledTimes(2)
    })

    it("invalidates removed declarations", () => {
      const filename = path.join(directory, "dependency.d.ts")
      fs.writeFileSync(filename, "export const value: number")
      runTwoSlash.mockImplementation((code, lang, settings) => ({
        declaration: settings.tsModule.sys.readFile(filename),
      }))
      runTwoSlashOnNode("import 'dependency'", fence("ts"), {})
      fs.unlinkSync(filename)
      expect(runTwoSlashOnNode("import 'dependency'", fence("ts"), {}).declaration).toBeUndefined()
      expect(runTwoSlash).toHaveBeenCalledTimes(2)
    })

    it("validates directory listings and preserves omitted arguments", () => {
      runTwoSlash.mockImplementation((code, lang, settings) => ({
        files: settings.tsModule.sys.readDirectory(directory, undefined, undefined, ["**/*"])
          .map(filename => path.resolve(filename)),
      }))
      expect(runTwoSlashOnNode("import 'dependency'", fence("ts"), {}).files).toEqual([])
      runTwoSlashOnNode("import 'dependency'", fence("ts"), {})
      expect(runTwoSlash).toHaveBeenCalledTimes(1)
      const filename = path.join(directory, "dependency.d.ts")
      fs.writeFileSync(filename, "export const value: number")
      expect(runTwoSlashOnNode("import 'dependency'", fence("ts"), {}).files).toEqual([filename])
      expect(runTwoSlash).toHaveBeenCalledTimes(2)
    })

    it("surfaces errors validating dependencies", () => {
      const filename = path.join(directory, "dependency.d.ts")
      fs.writeFileSync(filename, "export const value: number")
      runTwoSlash.mockImplementation((code, lang, settings) => ({
        declaration: settings.tsModule.sys.readFile(filename),
      }))
      runTwoSlashOnNode("import 'dependency'", fence("ts"), {})
      jest.spyOn(fs, "statSync").mockImplementation(() => {
        throw new Error("dependency access failed")
      })
      expect(() => runTwoSlashOnNode("import 'dependency'", fence("ts"), {})).toThrow(
        "dependency access failed"
      )
    })
  })
})

describe("Twoslash LRU pruning", () => {
  const fs = require("fs")
  const os = require("os")
  const path = require("path")
  const {
    MAX_BYTES,
    pruneTwoslashCache,
  } = require("../../../../.github/actions/website-cache/prune-twoslash-cache")
  let directory

  beforeEach(() => {
    directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "website-twoslash-cache-")
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  const entry = (id, bytes, accessed) => {
    const filename = path.join(
      directory,
      id.toString(16).padStart(40, "0") + ".json"
    )
    fs.writeFileSync(filename, "")
    fs.truncateSync(filename, bytes)
    fs.utimesSync(filename, accessed, accessed)
    return filename
  }

  it("keeps an empty or absent cache", () => {
    const empty = { bytes: 0, removed: 0, removedBytes: 0 }
    expect(pruneTwoslashCache(directory)).toEqual(empty)
    expect(pruneTwoslashCache(path.join(directory, "missing"))).toEqual(empty)
  })

  it("retains exactly 64 MiB without pruning", () => {
    const file = entry(1, MAX_BYTES, 1)
    expect(pruneTwoslashCache(directory)).toEqual({
      bytes: MAX_BYTES,
      removed: 0,
      removedBytes: 0,
    })
    expect(fs.existsSync(file)).toBe(true)
  })

  it("evicts least-recently-used entries rather than oldest creations", () => {
    const oldest = entry(1, MAX_BYTES / 2, 1)
    const middle = entry(2, MAX_BYTES / 2, 2)
    const newest = entry(3, MAX_BYTES / 2, 3)
    fs.utimesSync(oldest, 4, 4)
    expect(pruneTwoslashCache(directory)).toEqual({
      bytes: MAX_BYTES,
      removed: 1,
      removedBytes: MAX_BYTES / 2,
    })
    expect(fs.existsSync(oldest)).toBe(true)
    expect(fs.existsSync(middle)).toBe(false)
    expect(fs.existsSync(newest)).toBe(true)
  })

  it("evicts as many entries as needed and drops oversized entries", () => {
    const oldest = entry(1, MAX_BYTES, 1)
    const middle = entry(2, MAX_BYTES, 2)
    const newest = entry(3, MAX_BYTES + 1, 3)
    expect(pruneTwoslashCache(directory)).toEqual({
      bytes: 0,
      removed: 3,
      removedBytes: 3 * MAX_BYTES + 1,
    })
    expect([oldest, middle, newest].some(file => fs.existsSync(file))).toBe(
      false
    )
  })

  it("breaks timestamp ties deterministically", () => {
    const first = entry(1, MAX_BYTES / 2, 1)
    const second = entry(2, MAX_BYTES / 2, 1)
    const third = entry(3, MAX_BYTES / 2, 1)
    pruneTwoslashCache(directory)
    expect(fs.existsSync(first)).toBe(false)
    expect(fs.existsSync(second)).toBe(true)
    expect(fs.existsSync(third)).toBe(true)
  })

  it("preserves usage timestamps across repeated pruning", () => {
    const first = entry(1, MAX_BYTES / 2, 1)
    entry(2, MAX_BYTES / 2, 2)
    pruneTwoslashCache(directory)
    expect(fs.statSync(first).mtimeMs).toBe(1000)
    entry(3, MAX_BYTES / 2, 3)
    pruneTwoslashCache(directory)
    expect(fs.existsSync(first)).toBe(false)
  })

  it("rejects unexpected entries instead of deleting unrelated files", () => {
    const filename = path.join(directory, "unexpected.txt")
    fs.writeFileSync(filename, "preserve")
    expect(() => pruneTwoslashCache(directory)).toThrow(
      "Unexpected Twoslash cache entry"
    )
    expect(fs.readFileSync(filename, "utf8")).toBe("preserve")
  })

  it("surfaces filesystem failures", () => {
    entry(1, MAX_BYTES + 1, 1)
    jest.spyOn(fs, "unlinkSync").mockImplementationOnce(() => {
      throw new Error("cannot prune cache")
    })
    expect(() => pruneTwoslashCache(directory)).toThrow("cannot prune cache")
  })
})
