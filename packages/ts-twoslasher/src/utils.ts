import ts from 'typescript'

export function escapeHtml(text: string) {
  return text.replace(/</g, '&lt;')
}

export function strrep(text: string, count: number) {
  let s = ''
  for (let i = 0; i < count; i++) { s += text }
  return s
}

export function textToAnchorName(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/`|#|\//g, '')
}

export function fileNameToUrlName(s: string) {
  return s
    .replace(/ /g, '-')
    .replace(/#/g, 'sharp')
    .toLowerCase()
}

export function parsePrimitive(value: string, type: string): any {
  switch (type) {
    case 'number':
      return +value
    case 'string':
      return value
    case 'boolean':
      return value.toLowerCase() === 'true' || value.length === 0
  }
  throw new Error(`Unknown primitive type ${type}`)
}

export function cleanMarkdownEscaped(code: string) {
  code = code.replace(/¨D/g, '$')
  code = code.replace(/¨T/g, '~')
  return code
}

export function typesToExtension(types: string) {
  switch (types) {
    case 'js':
      return 'js'
    case 'javascript':
      return 'js'
    case 'ts':
      return 'ts'
    case 'typescript':
      return 'ts'
    case 'tsx':
      return 'tsx'
    case 'jsn':
      return 'json'
  }
  throw new Error('Cannot handle the file extension:' + types)
}

export function getIdentifierTextSpans(sourceFile: ts.SourceFile) {
  const textSpans: ts.TextSpan[] = []
  checkChildren(sourceFile)
  return textSpans

  function checkChildren(node: ts.Node) {
    ts.forEachChild(node, child => {
      if (ts.isIdentifier(child)) {
        const start = child.getStart(sourceFile, false)
        textSpans.push(ts.createTextSpan(start, child.end - start))
      }
      checkChildren(child)
    })
  }
}
