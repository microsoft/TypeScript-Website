const canonicalOrigin = "https://www.typescriptlang.org"
const trimTrailingSlash = value => value.length > 1 ? value.replace(/\/+$/, "") : value
const decodeEntities = value => value
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&amp;/g, "&")

export const normalizePlaygroundExampleCacheBuster = (routePath, rawValue) => {
  const current = new URL(routePath, canonicalOrigin)
  const basePath = routePath.endsWith(".html") || routePath === "/" ? routePath : `${routePath}/`
  const resolved = new URL(decodeEntities(rawValue), `${canonicalOrigin}${basePath}`)
  const isSamePlaygroundPage = /^\/(?:[a-z]{2}\/)?play$/i.test(current.pathname)
    && trimTrailingSlash(resolved.pathname) === trimTrailingSlash(current.pathname)
  if (!isSamePlaygroundPage || !resolved.hash.startsWith("#example/")) return rawValue

  for (const [key, value] of resolved.searchParams) {
    const cleaned = value.replace(/q=\d+$/, "")
    if (cleaned !== value) resolved.searchParams.set(key, cleaned)
  }
  if (/^\d+$/.test(resolved.searchParams.get("q") || "")) resolved.searchParams.delete("q")
  return `${resolved.pathname}${resolved.search}${resolved.hash}`
}