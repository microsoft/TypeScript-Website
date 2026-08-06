import { runStructuralValidation } from "./validation.mjs"

const reports = runStructuralValidation({ writeEvidence: true })
const summary = Object.fromEntries(Object.entries(reports).map(([name, report]) => [name, report.status]))

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  summary,
}, null, 2))