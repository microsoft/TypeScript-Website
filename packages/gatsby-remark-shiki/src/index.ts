import { loadTheme, getHighlighter, getTheme } from 'shiki'
import { Highlighter } from 'shiki/dist/highlighter'
import { commonLangIds, commonLangAliases, otherLangIds, TLang } from 'shiki-languages'

import visit from 'unist-util-visit'

import { renderToHTML } from './renderer'
const languages = [...commonLangIds, ...commonLangAliases, ...otherLangIds]

/**
 * This gets filled in by the promise below, then should
 * hopefully be more or less synchronous access by each parse
 * of the highlighter
 */
let highlighter: Highlighter = null as any

const getHighlighterObj = (options: import('shiki/dist/highlighter').HighlighterOptions) => {
  if (highlighter) return highlighter

  var settings = options || {}
  var theme: any = settings.theme || 'nord'
  var shikiTheme

  try {
    shikiTheme = getTheme(theme)
  } catch (error) {
    try {
      shikiTheme = loadTheme(theme)
    } catch (error) {
      throw new Error('Unable to load theme: ' + theme + ' - ' + error.message)
    }
  }

  return getHighlighter({ theme: shikiTheme, langs: languages }).then(newHighlighter => {
    highlighter = newHighlighter
    return highlighter
  })
}

type RichNode = Node & {
  lang: TLang
  type: string
  restults: string
  children: Node[]
  value: string
  twoslash?: import('ts-twoslasher').TwoSlashReturn
}

/**
 * The function doing the work of transforming any codeblock samples
 * which have opted-in to the twoslash pattern.
 */
const visitor = (node: RichNode) => {
  let lang = node.lang
  const replacer = {
    json5: 'json',
  }

  // @ts-ignore
  if (replacer[lang]) lang = replacer[lang]

  const shouldHighlight = lang && languages.includes(lang)
  if (shouldHighlight && node.twoslash) {
    const originalCode = node.value
    const tokens = highlighter.codeToThemedTokens(node.value, lang)
    const results = renderToHTML(tokens, { langId: lang }, node.twoslash)
    node.type = 'html'
    node.value = results
    node.children = []

    if (process.env.NODE_ENV !== 'production') {
      const expected = node.twoslash.staticQuickInfos.length
      const foundLSP = node.value.split('lsp-result').length - 1
      const lspResults = node.value.split('lsp-result').map(r => r.split('<')[0])
      if (expected !== foundLSP) {
        console.error(`The amount of LSP results in the rendered code does not equal the amount of LSP results passed.

Expected: ${expected} but got ${foundLSP}. 

Code:
\`\`\`ts
${originalCode}
\`\`\`

Got results: 
  - "${lspResults.join('"\n - "')}
Expected results for: ${node.twoslash.staticQuickInfos.map((qi: any) => qi.targetString).join(', ')}`)
      }
    }
  }
}

/** The plugin API */
const remarkShiki = async function({ markdownAST }: any, settings: any) {
  await getHighlighterObj(settings)
  visit(markdownAST, 'code', visitor)
}

export default remarkShiki
