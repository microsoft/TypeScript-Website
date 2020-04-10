import { loadTheme, getHighlighter, getTheme } from 'shiki'
import { Highlighter } from 'shiki/dist/highlighter'
import { commonLangIds, commonLangAliases, otherLangIds, TLang } from 'shiki-languages'
import { twoslasher } from '@typescript/twoslash'

import visit from 'unist-util-visit'
import { Node } from 'unist'

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

  return getHighlighter({ theme: shikiTheme, langs: languages }).then((newHighlighter) => {
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
  meta?: string[]
  twoslash?: import('@typescript/twoslash').TwoSlashReturn
}

/**
 * The function doing the work of transforming any codeblock samples
 * which have opted-in to the twoslash pattern.
 */
const visitor = (node: RichNode) => {
  let lang = node.lang

  runTwoSlashOnNode(node)

  // Shiki doesn't respect json5 as an input, so switch it
  // to json, which can handle comments in the syntax highlight
  const replacer = {
    json5: 'json',
  }

  // @ts-ignore
  if (replacer[lang]) lang = replacer[lang]

  // Check we can highlight and render
  const shouldHighlight = lang && languages.includes(lang)

  if (shouldHighlight) {
    const tokens = highlighter.codeToThemedTokens(node.value, lang)
    const results = renderToHTML(tokens, { langId: lang }, node.twoslash)
    node.type = 'html'
    node.value = results
    node.children = []
  }
}

/** The plugin API */
const remarkShiki = async function ({ markdownAST }: any, settings: any) {
  await getHighlighterObj(settings)
  visit(markdownAST, 'code', visitor)
}

export const runTwoSlashOnNode = (node: RichNode) => {
  // Run twoslash and replace the main contents if
  // the ``` has 'twoslash' after it
  if (node.meta && node.meta.includes('twoslash')) {
    const results = twoslasher(node.value, node.lang)
    node.value = results.code
    node.lang = results.extension as TLang
    node.twoslash = results
  }
}

/** Does a twoslash  */
export const runTwoSlashAcrossDocument = ({ markdownAST }: any) => visit(markdownAST, 'code', runTwoSlashOnNode)

export default remarkShiki
