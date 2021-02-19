import { escapeHtml } from "../utils"

// C&P'd from shiki
export interface HtmlRendererOptions {
  langId?: string
  fg?: string
  bg?: string
}

/** You don't have a language which shiki twoslash can handle, make a DOM compatible version  */
export function plainTextRenderer(code: string, options: HtmlRendererOptions) {
  let html = ""
  const bg = options.bg || "#fff"
  const fg = options.fg || "black"

  html += `<pre class="shiki" style="background-color: ${bg}; color: ${fg}">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }

  html += `<div class='code-container'><code>`
  html += escapeHtml(code)

  html = html.replace(/\n*$/, "") // Get rid of final new lines
  html += `</code></div></pre>`
  return html
}
