type Lines = import("shiki").IThemedToken[][]

import type { IThemedToken } from "shiki"
import { escapeHtml } from "../utils"
import { tsconfig } from "../tsconfig-oneliners.generated"
import { HtmlRendererOptions } from "./plain"

/** Uses tmLanguage scopes to determine what the content of the token is */
const tokenIsJSONKey = (token: IThemedToken) => {
  if (!token.explanation) return false
  return token.explanation.find(e => e.scopes.find(s => s.scopeName.includes("support.type.property-name")))
}

/** Can you look up the token in the tsconfig reference? */
const isKeyInTSConfig = (token: IThemedToken) => {
  if (token.content === '"') return
  const name = token.content.slice(1, token.content.length - 1)
  return name in tsconfig
}

/**
 * Renders a TSConfig JSON object with additional LSP-ish information
 * @param lines the result of shiki highlighting
 * @param options shiki display options
 */
export function tsconfigJSONRenderer(lines: Lines, options: HtmlRendererOptions) {
  let html = ""

  const bg = options.bg || "#fff"
  const fg = options.fg || "black"

  html += `<pre class="shiki tsconfig lsp" style="background-color: ${bg}; color: ${fg}">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }

  html += `<div class='code-container'><code>`

  lines.forEach(l => {
    if (l.length === 0) {
      html += `<div class='line'></div>`
    } else {
      html += `<div class='line'>`
      l.forEach(token => {
        // This means we're looking at a token which could be '"module"', '"', '"compilerOptions"' etc
        if (tokenIsJSONKey(token) && isKeyInTSConfig(token)) {
          const key = token.content.slice(1, token.content.length - 1)
          const oneliner = (tsconfig as Record<string, string>)[key]
          // prettier-ignore
          html += `<span style="color: ${token.color}">"<a aria-hidden=true href='https://www.typescriptlang.org/tsconfig#${key}'><data-lsp lsp="${oneliner}">${escapeHtml(key)}</data-lsp></a>"</span>`
        } else {
          html += `<span style="color: ${token.color}">${escapeHtml(token.content)}</span>`
        }
      })
      html += `</div>`
    }
  })

  html = html.replace(/\n*$/, "") // Get rid of final new lines
  html += `</code></div></pre>`
  return html
}
