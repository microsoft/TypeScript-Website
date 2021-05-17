import { escapeHtml } from "../utils"

// C&P'd from shiki
export interface HtmlRendererOptions {
  langId?: string
  fg?: string
  bg?: string
  themeName?: string
}

/** A func for setting a consistent <pre> */
export const preOpenerFromRenderingOptsWithExtras = (opts: HtmlRendererOptions, fence?: any, classes?: string[]) => {
  const bg = opts.bg || "#fff"
  const fg = opts.fg || "black"
  const theme = opts.themeName || ""
  const fenceClass = (fence && fence.class) || ""
  const extras = (classes && classes.join(" ")) || ""
  return `<pre class="shiki ${fenceClass} ${theme} ${extras}" style="background-color: ${bg}; color: ${fg}">`
}

/** You don't have a language which shiki twoslash can handle, make a DOM compatible version  */
export function plainTextRenderer(code: string, options: HtmlRendererOptions, codefenceMeta: any) {
  let html = ""

  html += preOpenerFromRenderingOptsWithExtras(options, codefenceMeta, [])
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }

  html += `<div class='code-container'><code>`
  html += escapeHtml(code)

  html = html.replace(/\n*$/, "") // Get rid of final new lines
  html += `</code></div></pre>`
  return html
}
