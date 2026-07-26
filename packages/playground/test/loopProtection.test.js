const fs = require("fs")
const path = require("path")
const ts = require("typescript")

// The playground's jest setup has no TypeScript transform, so compile the
// module under test on the fly instead
const loadLoopProtection = () => {
  const sourcePath = path.join(__dirname, "..", "src", "sidebar", "loopProtection.ts")
  const source = fs.readFileSync(sourcePath, "utf8")
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 },
  }).outputText
  const moduleExports = {}
  new Function("exports", "require", "module", js)(moduleExports, require, { exports: moduleExports })
  return moduleExports
}

const { insertLoopProtection, createLoopProtection, loopProtectionGlobalName } = loadLoopProtection()

// Executes instrumented code with the real guard, wrapped in a hard deadline
// which throws: if protection ever regresses, the throw breaks the loop and
// fails the test instead of hanging jest (a synchronous loop would block
// jest's own testTimeout timers forever)
const runInstrumented = (code, budgetMS = 80) => {
  const exitedLines = []
  const instrumented = insertLoopProtection(ts, code)
  expect(instrumented).toContain(".hit(")
  const realGuard = createLoopProtection(budgetMS, line => exitedLines.push(line))
  const startedAt = Date.now()
  global[loopProtectionGlobalName] = {
    hit: (id, line) => {
      if (Date.now() - startedAt > 5000) throw new Error("loop protection failed to break the loop")
      return realGuard.hit(id, line)
    },
  }
  new Function(instrumented)()
  return { exitedLines, elapsedMS: Date.now() - startedAt, instrumented }
}

describe("insertLoopProtection", () => {
  it("returns code without loops untouched", () => {
    const code = `const a = 1\nconsole.log(a)`
    expect(insertLoopProtection(ts, code)).toEqual(code)
  })

  it("returns code which does not parse untouched", () => {
    const code = `while (true {`
    expect(insertLoopProtection(ts, code)).toEqual(code)
  })

  it("returns declaration-bodied loops untouched so they still throw", () => {
    // Wrapping these bodies in a block would silently legalize a SyntaxError
    const samples = [
      `while (true) let x = 1;`,
      `for (let i = 0; i < 2; i++) const x = i;`,
      `while (true) class C {}`,
      `while (true) function f() {}`,
    ]
    for (const code of samples) {
      expect(insertLoopProtection(ts, code)).toEqual(code)
    }
  })

  it("does not change the number of lines", () => {
    const code = `let i = 0\nwhile (true) {\n  i++\n}\nfor (;;) i++\n`
    const instrumented = insertLoopProtection(ts, code)
    expect(instrumented.split("\n").length).toEqual(code.split("\n").length)
  })

  it("reports the loop's one-based line number", () => {
    const instrumented = insertLoopProtection(ts, `\n\nwhile (true) {}`)
    expect(instrumented).toContain(".hit(1, 3)")
  })
})

describe("running instrumented code", () => {
  it("exits while (true) {} instead of running forever", () => {
    const { exitedLines, elapsedMS } = runInstrumented(`while (true) {}`)
    expect(exitedLines).toEqual([1])
    expect(elapsedMS).toBeLessThan(2000)
  })

  it("exits a for loop with an empty statement body", () => {
    const { exitedLines } = runInstrumented(`for (;;);`)
    expect(exitedLines).toEqual([1])
  })

  it("exits a do-while with an unbraced body", () => {
    const { exitedLines } = runInstrumented(`let i = 0\ndo i++; while (true)`)
    expect(exitedLines).toEqual([2])
  })

  it("exits nested loops, reporting each one once", () => {
    const { exitedLines } = runInstrumented(`while (true) { while (true) {} }`)
    expect(exitedLines).toContain(1)
    expect(exitedLines.length).toBeLessThanOrEqual(2)
  })

  it("keeps a loop in single-statement position valid", () => {
    const { exitedLines } = runInstrumented(`let i = 0\nif (i === 0) while (true) i++;`)
    expect(exitedLines).toEqual([2])
  })

  it("keeps unbraced loop-as-loop-body valid", () => {
    const { exitedLines } = runInstrumented(`let i = 0\nwhile (true) while (true) i++;`)
    expect(exitedLines.length).toBeGreaterThan(0)
  })

  it("exits labelled loops without breaking the label", () => {
    const { exitedLines } = runInstrumented(`outer: while (true) { continue outer }`)
    expect(exitedLines).toEqual([1])
  })

  it("exits a for-of over an endless generator", () => {
    const code = `function* gen() { while (true) yield 1 }\nlet n = 0\nfor (const v of gen()) n += v`
    const { exitedLines } = runInstrumented(code)
    expect(exitedLines.length).toBeGreaterThan(0)
  })

  it("leaves loops which finish within the budget alone", () => {
    const code = `let n = 0\nfor (let i = 0; i < 1000; i++) n++\nglobalThis.__loopProtectionTestResult = n`
    const { exitedLines } = runInstrumented(code, 500)
    expect(exitedLines).toEqual([])
    expect(global.__loopProtectionTestResult).toEqual(1000)
    delete global.__loopProtectionTestResult
  })

  it("flags only the first exited loop in a burst as possibly infinite", () => {
    const reports = []
    const realGuard = createLoopProtection(80, (line, isFirstInBurst) => {
      reports.push([line, isFirstInBurst])
    })
    const startedAt = Date.now()
    global[loopProtectionGlobalName] = {
      hit: (id, line) => {
        if (Date.now() - startedAt > 5000) throw new Error("loop protection failed to break the loop")
        return realGuard.hit(id, line)
      },
    }
    const code = `while (true) {}\nlet n = 0\nfor (let i = 0; i < 3; i++) n++`
    new Function(insertLoopProtection(ts, code))()
    expect(reports).toEqual([
      [1, true],
      [3, false],
    ])
  })

  it("does not break finite loops in timer callbacks queued behind an over-budget script", async () => {
    const exitedLines = []
    const code = [
      `globalThis.__loopProtectionTestPromise = new Promise(resolve => {`,
      `  setTimeout(() => { let n = 0; for (let i = 0; i < 3; i++) n++; resolve(n) }, 0)`,
      `})`,
      `const end = Date.now() + 250`,
      `while (Date.now() < end) {}`,
    ].join("\n")
    const instrumented = insertLoopProtection(ts, code)
    expect(instrumented).toContain(".hit(")
    // Created right before execution, matching the runtime's ordering, so the
    // burst-reset timer is queued ahead of the user's setTimeout
    global[loopProtectionGlobalName] = createLoopProtection(100, line => exitedLines.push(line))
    new Function(instrumented)()
    const n = await global.__loopProtectionTestPromise
    delete global.__loopProtectionTestPromise
    expect(n).toEqual(3)
    expect(exitedLines).toEqual([5])
  })

  it("does not exit loops which yield to the event loop", async () => {
    const exitedLines = []
    const code =
      `globalThis.__loopProtectionTestPromise = (async () => {` +
      ` for (let i = 0; i < 5; i++) { await new Promise(r => setTimeout(r, 30)) }` +
      ` globalThis.__loopProtectionTestDone = true })()`
    const instrumented = insertLoopProtection(ts, code)
    expect(instrumented).toContain(".hit(")
    global[loopProtectionGlobalName] = createLoopProtection(50, line => exitedLines.push(line))
    new Function(instrumented)()
    await global.__loopProtectionTestPromise
    expect(exitedLines).toEqual([])
    expect(global.__loopProtectionTestDone).toEqual(true)
    delete global.__loopProtectionTestPromise
    delete global.__loopProtectionTestDone
  })
})
