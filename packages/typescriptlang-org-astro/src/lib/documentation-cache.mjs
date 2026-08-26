import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"))
export const documentationCacheRoot = path.resolve(here, "../../.generated/documentation-html")
export const documentationManifestPath = path.join(documentationCacheRoot, "manifest.json")

const cacheFilename = pathname => `${crypto.createHash("sha256").update(pathname).digest("hex")}.html`

export function writeDocumentationCache(entries, root = documentationCacheRoot) {
  fs.rmSync(root, { recursive: true, force: true })
  fs.mkdirSync(root, { recursive: true })

  const manifest = {}
  for (const [pathname, html] of entries) {
    const filename = cacheFilename(pathname)
    fs.writeFileSync(path.join(root, filename), html)
    manifest[pathname] = filename
  }

  fs.writeFileSync(path.join(root, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)
  return manifest
}

export function updateDocumentationCache(entries, root = documentationCacheRoot) {
  fs.mkdirSync(root, { recursive: true })
  const manifestPath = path.join(root, "manifest.json")
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {}

  for (const [pathname, html] of entries) {
    const filename = cacheFilename(pathname)
    fs.writeFileSync(path.join(root, filename), html)
    manifest[pathname] = filename
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  return manifest
}

export function readDocumentationCache(pathname, root = documentationCacheRoot) {
  const manifestPath = path.join(root, "manifest.json")
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `Documentation cache is missing. Run the documentation precompiler before building: ${manifestPath}`
    )
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  const filename = manifest[pathname]
  if (!filename) throw new Error(`Documentation cache has no entry for ${pathname}`)
  return fs.readFileSync(path.join(root, filename), "utf8")
}
