import { escapeHtml } from "../utils"
import { HtmlRendererOptions } from "./plain"

type Lines = import("shiki").IThemedToken[][]

export function defaultShikiRenderer(lines: Lines, options: HtmlRendererOptions) {
  let html = ""

  const bg = options.bg || "#fff"
  const fg = options.fg || "black"

  html += `<pre class="shiki" style="background-color: ${bg}; color: ${fg}}">`
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
        html += `<span style="color: ${token.color}">${escapeHtml(token.content)}</span>`
      })
      html += `</div>`
    }
  })

  html = html.replace(/\n*$/, "") // Get rid of final new lines
  html += `</code></div></pre>`
  return html
}
