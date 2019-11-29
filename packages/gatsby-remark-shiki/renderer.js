// This started as a JS port of https://github.com/octref/shiki/blob/master/packages/shiki/src/renderer.ts

/**
 * 
 * @param {{ content: string, color?: string }[][]} lines 
 * @param {{ langId: string }} options 
 * @param { import("ts-twoslasher").TwoSlashReturn } twoslash 
 */

function renderToHTML(lines, options, twoslash) {
  const bg = options.bg || '#f8f8f8'

  let html = ''

  html += `<pre class="shiki">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }
  html += `<div class='code-container'><code>`

  lines.forEach((l, i) => {
    const errors = twoslash && twoslash.errors.filter(e => e.line === i)  || []
   
    if (l.length === 0) {
      html += `\n`
    } else {
      // Keep track of the position of the current token in a line so we can match it up to the errors and
      // lang serv identifiers
      let pos = 0

      l.forEach(token => {
        const isError = errors.find(e => {
          return e.character <= pos && e.character + e.length >= pos + token.content.length
        })
        const className = isError ? "class = 'err'" : ""
        html += `<span ${className} style="color: ${token.color}">${escapeHtml(token.content)}</span>`
        pos += token.content.length
      })

      html += `\n`
    }

    if (errors.length) {
      const messages = errors.map(e => escapeHtml(e.renderedMessage)).join("</br>")
      const codes = errors.map(e => e.code).join("<br/>")
      html += `<span class="error"><span>${messages}</span><span class="code">${codes}</span></span>`
      html += '\n'
    }

  })
  html = html.replace(/\n*$/, '') // Get rid of final new lines
  html += `</code></div></pre>`

  return html
}

function escapeHtml(html) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

module.exports = {
  renderToHTML
}
