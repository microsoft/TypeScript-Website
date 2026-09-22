type TS = typeof import("typescript")

/** How long user code may synchronously block the page before its loops are exited */
export const loopProtectionBudgetMS = 1000

/** The global the instrumented JS uses to reach the guard, set up before each run */
export const loopProtectionGlobalName = "__tsPlaygroundLoopProtection"

/**
 * Creates the runtime side of loop protection. A "burst" is a stretch of
 * synchronous work which never yields back to the event loop: starting a
 * burst arms a zero-delay timeout, and until that timeout gets to run every
 * guard check belongs to the same burst. Once a burst has blocked the page
 * for longer than the budget, every guarded loop is told to break.
 */
export const createLoopProtection = (
  budgetMS: number,
  onLoopExited: (line: number, isFirstInBurst: boolean) => void
) => {
  const scheduleEndOfBurst = setTimeout.bind(globalThis)
  let inBurst = true
  let burstStartedAt = Date.now()
  let exitedLoopIDs: number[] = []
  // The first burst is primed here, at creation just before the run's eval,
  // rather than on the first guard check: that queues the reset timer ahead of
  // any timers the user's main script registers, so their callbacks always
  // start a fresh burst. (A callback which itself blows the budget can still
  // leak its burst into callbacks that were already queued behind it.)
  scheduleEndOfBurst(() => (inBurst = false), 0)

  return {
    hit(loopID: number, line: number): boolean {
      const now = Date.now()
      if (!inBurst) {
        inBurst = true
        burstStartedAt = now
        exitedLoopIDs = []
        scheduleEndOfBurst(() => (inBurst = false), 0)
      }
      if (now - burstStartedAt <= budgetMS) return false

      if (!exitedLoopIDs.includes(loopID)) {
        exitedLoopIDs.push(loopID)
        onLoopExited(line, exitedLoopIDs.length === 1)
      }
      return true
    },
  }
}

/**
 * Adds a guard call to the top of every for/while/do loop body, so that code
 * like `while (true) {}` breaks out after the time budget instead of freezing
 * the browser tab. Guards are only inserted into loop bodies (unbraced bodies
 * get wrapped in a block), never in front of the loop itself, which keeps
 * `if (x) while (y) z()`, labelled loops etc valid. No newlines are added, so
 * runtime error positions still line up with the JS the user can see.
 */
export const insertLoopProtection = (ts: TS, code: string): string => {
  try {
    const sourceFile = ts.createSourceFile("run.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
    // Code which doesn't parse should run (and fail) exactly as it does today
    if (((sourceFile as any).parseDiagnostics || []).length > 0) return code

    const inserts: Array<{ pos: number; text: string }> = []
    let loopID = 0
    let hasIllegalLoopBody = false

    const visit = (node: import("typescript").Node) => {
      if (
        ts.isWhileStatement(node) ||
        ts.isDoStatement(node) ||
        ts.isForStatement(node) ||
        ts.isForInStatement(node) ||
        ts.isForOfStatement(node)
      ) {
        loopID += 1
        const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
        const guard = `if (${loopProtectionGlobalName}.hit(${loopID}, ${line})) break; `
        const body = node.statement
        if (ts.isBlock(body)) {
          inserts.push({ pos: body.getStart(sourceFile) + 1, text: " " + guard })
        } else if (
          ts.isFunctionDeclaration(body) ||
          ts.isClassDeclaration(body) ||
          (ts.isVariableStatement(body) && (body.declarationList.flags & ts.NodeFlags.BlockScoped) !== 0)
        ) {
          // `while (true) let x = 1` is a SyntaxError at run time which the
          // parser tolerates; wrapping it in a block would make it legal, so
          // leave the whole file untouched and let it throw like it does today
          hasIllegalLoopBody = true
        } else {
          inserts.push({ pos: body.getStart(sourceFile), text: "{ " + guard })
          inserts.push({ pos: body.getEnd(), text: " }" })
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(sourceFile)
    if (hasIllegalLoopBody) return code

    // Apply highest position first so earlier offsets stay valid. The sort is
    // stable, and inserts which share a position are all identical closing
    // braces, so ties cannot reorder meaningfully.
    inserts.sort((a, b) => a.pos - b.pos)
    let result = code
    for (let index = inserts.length - 1; index >= 0; index--) {
      const insert = inserts[index]
      result = result.slice(0, insert.pos) + insert.text + result.slice(insert.pos)
    }
    return result
  } catch (error) {
    // Loop protection should never be the reason a run doesn't happen
    return code
  }
}
