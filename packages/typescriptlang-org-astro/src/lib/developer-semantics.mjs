import developerSemantics from "../data/developer-semantics.json" with { type: "json" }

const escapeHtml = value => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")

export function getDeveloperSemanticPage(pathname) {
  const route = `/${String(pathname || "").replace(/^\/+|\/+$/g, "")}`
  return developerSemantics.content[route] || null
}

export function renderDeveloperSemanticHtml(pathname) {
  const page = getDeveloperSemanticPage(pathname)
  if (!page) throw new Error(`Missing extracted developer semantics for ${pathname}`)
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
        return `<img src="${escapeHtml(token.src)}" alt="${escapeHtml(token.alt || "")}">`
      case "code":
        return ` <pre${token.twoslash ? ' class="twoslash"' : ""}><code>${escapeHtml(token.text || "")}</code></pre> `
      case "text":
        return ` ${escapeHtml(token.text)} `
      default:
        throw new Error(`Unknown developer semantic token: ${token.type}`)
    }
  }).join("")
}

export const developerSemanticRouteCount = developerSemantics.routeCount
export const developerSemanticSourcePages = developerSemantics.sourcePages
export const developerSemanticCopiedAssets = developerSemantics.copiedAssets
