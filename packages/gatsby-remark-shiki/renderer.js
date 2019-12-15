// @ts-check
// This started as a JS port of https://github.com/octref/shiki/blob/master/packages/shiki/src/renderer.ts

/**
 *
 * @param {{ content: string, color?: string, explanation?: any[] }[][]} lines
 * @param {{ langId: string }} options
 * @param { import("ts-twoslasher").TwoSlashReturn } twoslash
 */
function renderToHTML(lines, options, twoslash) {
  const bg = options.bg || '#f8f8f8'
  if (!twoslash) {
    return plainOleShikiRenderer(lines, options)
  }
  let html = ''

  html += `<pre class="shiki twoslash">`
  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }
  html += `<div class='code-container'><code>`

  const errorsGroupedByLine = (twoslash && groupBy(twoslash.errors, e => e.line)) || new Map()
  const staticQuickInfosGroupedByLine = (twoslash && groupBy(twoslash.staticQuickInfos, q => q.line)) || new Map()
  const queriesGroupedByLine = (twoslash && groupBy(twoslash.queries, q => q.line)) || new Map()

  lines.forEach((l, i) => {
    const errors = errorsGroupedByLine.get(i) || []
    const lspValues = staticQuickInfosGroupedByLine.get(i) || []

    if (l.length === 0) {
      html += `\n`
    } else {
      // Keep track of the position of the current token in a line so we can match it up to the
      // errors and lang serv identifiers
      let pos = 0

      l.forEach(token => {
        // Underlining particular words
        const findTokenFunc = start => e =>
          start <= e.character && start + token.content.length <= e.character + e.length

        const isTokenFunc = start => e =>
          start === e.character && start + token.content.length === e.character + e.length

        const isInsideTokenDebug = start => e => {
          const result = start <= e.character && start + token.content.length <= e.character + e.length
          // prettier-ignore
          console.log(result, start, '<=', e.character, '&&', start + token.content.length, '<=', e.character + e.length)
          return result
        }

        const errorsInToken = errors.filter(findTokenFunc(pos))
        const lspResponsesInToken = lspValues.filter(findTokenFunc(pos))

        // The explanation is all of the token which make up this "meta token"
        // these meta tokens are just the consolidation of many tokens which share the same color

        const subtokens = token.explanation || [{ content: token.content }]
        let subpos = pos
        subtokens.forEach(subtoken => {
          // If there are errors or LSP results (or TODO: highlights) then wrap the token with a
          // span which has the right classes and LSP results
          const classes = []
          const extras = []

          const errorsInSubToken = errorsInToken.find(isTokenFunc(subpos))
          if (errorsInSubToken) {
            classes.push('err')
          }

          const lspResponsesInSubToken = lspResponsesInToken.find(isTokenFunc(subpos))
          if (lspResponsesInSubToken) {
            classes.push('lsp')
            extras.push(`data-lsp='${encodeURIComponent(lspResponsesInSubToken.text)}'`)
          }

          // We want to move the subpos along by the real content because we're about to manipulate that
          // this needs to happen after the finds above
          subpos += subtoken.content.length

          const content = escapeHtml(subtoken.content)
          if (classes.length === 0) {
            subtoken.content = content
          } else {
            subtoken.content = `<span a class='${classes.join(' ')}' ${extras.join(' ')}>${content}</span>`
          }
        })

        const content = subtokens.map(t => t.content).join('')
        html += `<span style="color: ${token.color}">${content}</span>`

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

/**
 *
 * @param {{ content: string, color?: string, explanation?: any[]  }[][]} lines
 * @param {{ langId: string }} options
 */
function plainOleShikiRenderer(lines, options) {
  let html = ''

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
    }
  })

  html += `</code></div></pre>`
  return html
}

module.exports = {
  renderToHTML,
  plainOleShikiRenderer,
}
