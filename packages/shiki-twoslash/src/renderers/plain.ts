import { escapeHtml } from "../utils"

type Options = import("shiki/dist/renderer").HtmlRendererOptions

/** You don't have a language which shiki twoslash can handle, make a DOM compatible version  */
export function plainTextRenderer(code: string, options: Options) {
  let html = ""

  html += `<pre class="shiki">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }

  html += `<div class='code-container'><code>`
  html += escapeHtml(code)

  html = html.replace(/\n*$/, "") // Get rid of final new lines
  html += `</code></div></pre>`
  return html
}
