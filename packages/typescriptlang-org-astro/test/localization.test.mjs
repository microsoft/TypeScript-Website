import assert from "node:assert/strict"
import test from "node:test"
import { createLocalizedHref, localeVersionOfPath, stripLocale } from "../src/lib/localization.mjs"

const paths = new Set(["/", "/fr", "/download", "/fr/download", "/docs/handbook/intro.html", "/fr/docs/handbook/intro.html", "/play", "/fr/play"])

test("localized links prefer an available same-language route and preserve fragments", () => {
  assert.equal(createLocalizedHref("fr", "/download", paths), "/fr/download")
  assert.equal(createLocalizedHref("fr", "/docs/handbook/intro.html#intro", paths), "/fr/docs/handbook/intro.html#intro")
  assert.equal(createLocalizedHref("fr", "/missing", paths), "/missing")
  assert.equal(createLocalizedHref("en", "/download", paths), "/download")
})

test("locale recommendations replace an existing locale and require a real route", () => {
  assert.equal(stripLocale("/ja/download/"), "/download")
  assert.equal(localeVersionOfPath("/ja/download/", "fr", paths), "/fr/download")
  assert.equal(localeVersionOfPath("/ja/missing", "fr", paths), undefined)
  assert.equal(localeVersionOfPath("/fr/download", "en", paths), "/download")
})
