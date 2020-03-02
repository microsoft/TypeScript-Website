// This started as a JS port of https://github.com/octref/shiki/blob/master/packages/shiki/src/renderer.ts

type Lines = import('shiki').IThemedToken[][]
type Options = import('shiki/dist/renderer').HtmlRendererOptions
type TwoSlash = import('ts-twoslasher').TwoSlashReturn

import { createHighlightedString, stripHTML } from './utils'

export function renderToHTML(lines: Lines, options: Options, twoslash?: TwoSlash) {
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
  // A query is always about the line above it!
  const queriesGroupedByLine = (twoslash && groupBy(twoslash.queries, q => q.line - 1)) || new Map()

  let filePos = 0
  lines.forEach((l, i) => {
    const errors = errorsGroupedByLine.get(i) || []
    const lspValues = staticQuickInfosGroupedByLine.get(i) || []
    const queries = queriesGroupedByLine.get(i) || []

    if (l.length === 0 && i === 0) {
      // Skip the first newline if it's blank
      filePos += 1
    } else if (l.length === 0) {
      filePos += 1
      html += `\n`
    } else {
      // Keep track of the position of the current token in a line so we can match it up to the
      // errors and lang serv identifiers
      let tokenPos = 0

      l.forEach(token => {
        let tokenContent = ''
        // console.log(tokenPos, token.content.length, filePos)
        // Underlining particular words
        const findTokenFunc = (start: number) => (e: any) =>
          start <= e.character && start + token.content.length >= e.character + e.length

        const findTokenDebug = (start: number) => (e: any) => {
          const result = start <= e.character && start + token.content.length >= e.character + e.length
          // prettier-ignore
          console.log(result, start, '<=', e.character, '&&', start + token.content.length, '<=', e.character + e.length)
          return result
        }

        const errorsInToken = errors.filter(findTokenFunc(tokenPos))
        const lspResponsesInToken = lspValues.filter(findTokenFunc(tokenPos))
        const queriesInToken = queries.filter(findTokenFunc(tokenPos))

        const allTokensByStart = [...errorsInToken, ...lspResponsesInToken, ...queriesInToken]

        if (allTokensByStart.length) {
          const ranges = allTokensByStart.map(token => {
            const range: any = {
              begin: token.start! - filePos,
              end: token.start! + token.length! - filePos,
            }

            if ('renderedMessage' in token) range.classes = 'err'
            if ('kind' in token) range.classes = token.kind
            if ('targetString' in token) {
              range.classes = 'lsp'
              range['lsp'] = stripHTML(token.text)
            }

            return range
          })

          tokenContent += createHighlightedString(ranges, token.content)
        } else {
          tokenContent += token.content
        }

        html += `<span style="color: ${token.color}">${tokenContent}</span>`
        tokenPos += token.content.length
        filePos += token.content.length
      })

      html += `\n`
      filePos += 1
    }

    // Adding error messages to the line after
    if (errors.length) {
      const messages = errors.map(e => escapeHtml(e.renderedMessage)).join('</br>')
      const codes = errors.map(e => e.code).join('<br/>')
      html += `<span class="error"><span>${messages}</span><span class="code">${codes}</span></span>`
      html += `<span class="error-behind">${messages}</span>`
    }

    // Add queries to the next line
    if (queries.length) {
      queries.forEach(query => {
        html += `<span class='query'>${'//' + ''.padStart(query.offset - 2) + '^ = ' + query.text}</span>`
      })
      html += '\n'
    }
  })
  html = html.replace(/\n*$/, '') // Get rid of final new lines
  html += `</code></div></pre>`

  return html
}

function escapeHtml(html: string) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Returns a map where all the keys are the value in keyGetter  */
function groupBy<T>(list: T[], keyGetter: (obj: any) => number) {
  const map = new Map<number, T[]>()
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

export function plainOleShikiRenderer(lines: Lines, options: Options) {
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
      html += `\n`
    }
  })

  html = html.replace(/\n*$/, '') // Get rid of final new lines
  html += `</code></div></pre>`
  return html
}
