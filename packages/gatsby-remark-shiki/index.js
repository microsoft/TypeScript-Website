// @ts-enable

const shiki = require('shiki')
const visit = require('unist-util-visit')

const { commonLangIds, commonLangAliases, otherLangIds } = require('shiki-languages')
const languages = [...commonLangIds, ...commonLangAliases, ...otherLangIds]

/** 
 * This gets filled in by the promise below, then should 
 * hopefully be more or less synchronous access by each parse
 * of the highlighter
 */
let highlighter = null

const getHighlighter = options => {
  if (highlighter) return highlighter

  var settings = options || {}
  var theme = settings.theme || 'nord'
  var shikiTheme

  try {
    shikiTheme = shiki.getTheme(theme)
  } catch (error) {
    try {
      shikiTheme = shiki.loadTheme(theme)
    } catch (error) {
      throw new Error('Unable to load theme: ' + theme)
    }
  }

  return shiki.getHighlighter({ theme: shikiTheme, langs: languages }).then(newHighlighter => {
    highlighter = newHighlighter
    return highlighter
  })
}

/**
 * The function doing the work of transforming any codeblock samples
 * which have opted-in to the twoslash pattern.
 *
 * @param {Node} node
 */
const visitor = node => {
  let lang = node.lang
  const replacer = {
    "json5": "json"
  }
  
  if (replacer[lang]) lang = replacer[lang]
  
  const shouldHighlight = lang && languages.includes(lang)
  if (shouldHighlight) {
    const results = highlighter.codeToHtml(node.value, lang)
    node.type = "html"
    node.value = results
    node.children = []
  }
}

/** The plugin API */
module.exports = async ({ markdownAST }) => {
  await getHighlighter()
  visit(markdownAST, 'code', visitor)
}
