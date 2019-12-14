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

  const errorsGroupedByLine = (twoslash && groupBy(twoslash.errors, e => e.line)) || new Set()
  const staticQuickInfosGroupedByLine = (twoslash && groupBy(twoslash.staticQuickInfos, q => q.line)) || new Set()
  const queriesGroupedByLine = (twoslash && groupBy(twoslash.queries, q => q.line)) || new Set()

  lines.forEach((l, i) => {
    const errors = errorsGroupedByLine.get(i) || []
    const lspValues = staticQuickInfosGroupedByLine.get(i) || []

    if (l.length === 0) {
      html += `\n`
    } else {
      // Keep track of the position of the current token in a line so we can match it up to the errors and
      // lang serv identifiers
      let pos = 0

      l.forEach(token => {
        // Underlining particular words
        const findTokenFunc = e => e.character <= pos && e.character + e.length >= pos + token.content.length
        // const debugLoggingTokenFunc = e => {
        //   console.log(e.character, '<=', pos, '&&', e.character + e.length, '>=', pos + token.content.length)
        //   return e.character <= pos && e.character + e.length >= pos + token.content.length
        // }

        const isError = errors.find(findTokenFunc)
        const tokenLSPResponse = lspValues.find(findTokenFunc)

        const className = isError ? "class='err'" : ''
        const tokenLSPResponseString = tokenLSPResponse ? `data-lsp='${tokenLSPResponse.text}'` : ''

        const content = escapeHtml(token.content)
        html += `<span ${className} style="color: ${token.color}" ${tokenLSPResponseString}>${content}</span>`
        pos += token.content.length
      })

      html += `\n`
    }

    // Adding error messages to the line after
    if (errors.length) {
      const messages = errors.map(e => escapeHtml(e.renderedMessage)).join('</br>')
      const codes = errors.map(e => e.code).join('<br/>')
      html += `<span class="error"><span>${messages}</span><span class="code">${codes}</span></span>`
      html += `<span class="error-behind">${messages}</span>`
    }
  })
  html = html.replace(/\n*$/, '') // Get rid of final new lines
  html += `</code></div></pre>`

  return html
}

function escapeHtml(html) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Returns a map where all the keys are the value in keyGetter  */
function groupBy(list, keyGetter) {
  const map = new Map()
  list.forEach(item => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

module.exports = {
  renderToHTML,
}
