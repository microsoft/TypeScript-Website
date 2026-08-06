import fs from "node:fs"
import path from "node:path"

const output = path.resolve("../typescriptlang-org/.tsupgrader/framework-migration/evidence/playwright/navigation-search/docsearch-network.json")
fs.mkdirSync(path.dirname(output), { recursive: true })
const url = "https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"
const started = Date.now()
let result
try {
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
  const body = await response.text()
  result = { captured: new Date().toISOString(), url, status: response.status, ok: response.ok, bytes: body.length, elapsedMs: Date.now() - started, viable: response.ok && body.includes("docsearch") }
} catch (error) {
  result = { captured: new Date().toISOString(), url, ok: false, elapsedMs: Date.now() - started, viable: false, blocker: String(error) }
}
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`)
console.log(JSON.stringify(result, null, 2))
if (!result.viable) process.exitCode = 2