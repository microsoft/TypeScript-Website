import { escapeHtml } from "../utils"

type Lines = import("shiki").IThemedToken[][]
type Options = import("shiki/dist/renderer").HtmlRendererOptions

export function defaultShikiRenderer(lines: Lines, options: Options) {
  let html = ""

  html += `<pre class="shiki">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }

  html += `<div class='code-container'><code>`

  lines.forEach(l => {
    if (l.length === 0) {
      html += `\n`
    } else {
      l.forEach(token => {
        html += `<span style="color: ${token.color}">${escapeHtml(token.content)}</span>`
      })
      html += `\n`
    }
  })

  html = html.replace(/\n*$/, "") // Get rid of final new lines
  html += `</code></div></pre>`
  return html
}
