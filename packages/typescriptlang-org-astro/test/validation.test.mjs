import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import { runStructuralValidation, validationPaths } from "../scripts/validation.mjs"

test("structural validation inventories built outputs and classifies parity gaps", { skip: !fs.existsSync(validationPaths.distRoot) }, () => {
  const reports = runStructuralValidation({ writeEvidence: false })
  assert.equal(reports.generatedAssets.expectedApplicationRoutes, 920)
  assert.equal(reports.linkCheck.htmlPageCount, 952)
  assert.equal(reports.metadataParity.routeCount, 920)
  assert.equal(reports.contentParity.matchedCount + reports.contentParity.mismatchCount + reports.contentParity.missingBaselineCount, 920)
  assert.equal(reports.contentParity.mismatches.length, reports.contentParity.mismatchCount)
  assert.equal(reports.contentParity.matched.length, reports.contentParity.matchedCount)
  assert.equal(Object.values(reports.contentParity.distribution.byFamily).reduce((sum, family) => sum + family.routes, 0), 920)
  assert.equal(Object.values(reports.contentParity.distribution.byFamily).reduce((sum, family) => sum + family.mismatched, 0), reports.contentParity.mismatchCount)
  assert.deepEqual(reports.contentParity.distribution.byFamily.documentation, { routes: 283, matched: 283, mismatched: 0 })
  assert.equal(reports.contentParity.distribution.byFamilyAndField.documentation.headingTexts, undefined)
  assert.deepEqual(reports.contentParity.distribution.byFamily.glossary, { routes: 1, matched: 1, mismatched: 0 })
  assert.deepEqual(reports.contentParity.distribution.byFamily["playground-handbook"], { routes: 14, matched: 14, mismatched: 0 })
  assert.deepEqual(reports.contentParity.distribution.byFamily.tsconfig, { routes: 10, matched: 10, mismatched: 0 })
  assert.deepEqual(reports.contentParity.distribution.byFamily["tsconfig-option"], { routes: 135, matched: 135, mismatched: 0 })
  assert.equal(reports.contentParity.distribution.byFamily["playground-example"].matched, 361)
  assert.deepEqual(reports.contentParity.distribution.byFamily.root, { routes: 100, matched: 100, mismatched: 0 })
  assert.deepEqual(reports.contentParity.distribution.byFamily.developer, { routes: 6, matched: 6, mismatched: 0 })
  assert.deepEqual(reports.contentParity.distribution.byFamily.playground, { routes: 10, matched: 10, mismatched: 0 })
  assert.deepEqual(reports.contentParity.distribution.byFamilyAndField.developer, {})
  assert.deepEqual(reports.contentParity.distribution.byFamilyAndField.playground, {})
  assert.equal(reports.contentParity.matchedCount, 920)
  assert.equal(reports.contentParity.status, "passed")
  assert.equal(reports.generatedAssets.status, "passed")
  assert.ok(["passed", "failed"].includes(reports.contentParity.status))
  assert.ok(["passed", "failed"].includes(reports.metadataParity.status))
})

test("structural validation preserves the extracted manifest and static-asset contract", { skip: !fs.existsSync(validationPaths.distRoot) }, () => {
  const reports = runStructuralValidation({ writeEvidence: false })
  assert.equal(reports.siteArtifacts.status, "passed")
  assert.equal(reports.staticAssets.status, "passed")
  assert.equal(reports.siteArtifacts.manifest.matchesBaseline, true)
  assert.deepEqual(reports.staticAssets.brokenReferencedAssets, [])
})