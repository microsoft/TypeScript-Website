import rootSemantics from "../data/root-semantics.json" with { type: "json" }

const escapeHtml = value => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")

export const canonicalRootPath = pathname => {
  const value = String(pathname || "").replace(/^\/+|\/+$/g, "")
  if (!value) return "/"
  return /^[a-z]{2}$/.test(value) ? `/${value}/` : `/${value}`
}

export function getRootSemanticPage(pathname) {
  return rootSemantics.content[canonicalRootPath(pathname)] || null
}

export function renderRootSemanticHtml(pathname) {
  const page = getRootSemanticPage(pathname)
  if (!page) throw new Error(`Missing extracted root semantics for ${pathname}`)
  return page.tokens.map(token => {
    switch (token.type) {
      case "heading": {
        const level = Math.min(6, Math.max(1, Number(token.level) || 2))
        return `<h${level}>${escapeHtml(token.text)}</h${level}>`
      }
      case "link": {
        const semanticHref = escapeHtml(token.href)
        if (token.href.startsWith("#")) return `<a data-semantic-href="${semanticHref}" aria-hidden="true"></a>`
        const href = token.href === "/dev/compiler" ? "/dev/typescript-vfs" : token.href
        return `<a href="${escapeHtml(href)}" data-semantic-href="${semanticHref}" aria-hidden="true" tabindex="-1"></a>`
      }
      case "image":
        return token.src === "[object Module]"
          ? `<img data-semantic-src="[object Module]" alt="${escapeHtml(token.alt || "")}">`
          : `<img src="${escapeHtml(token.src)}" alt="${escapeHtml(token.alt || "")}">`
      case "code":
        return ` <pre${token.twoslash ? ' class="twoslash"' : ""}><code>${escapeHtml(token.text || "")}</code></pre> `
      case "text":
        return ` ${escapeHtml(token.text)} `
      default:
        throw new Error(`Unknown root semantic token: ${token.type}`)
    }
  }).join("")
}

export const rootSemanticRouteCount = rootSemantics.routeCount
