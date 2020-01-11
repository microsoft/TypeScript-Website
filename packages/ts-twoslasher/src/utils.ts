export function escapeHtml(text: string) {
  return text.replace(/</g, '&lt;')
}

export function strrep(text: string, count: number) {
  let s = ''
  for (let i = 0; i < count; i++) {
    s += text
  }
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
  throw new Error(`Unknown primitive type ${type} with - ${value}`)
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

export function getIdentifierTextSpans(ts: typeof import('typescript'), sourceFile: import('typescript').SourceFile) {
  const textSpans: { span: import('typescript').TextSpan; text: string }[] = []
  checkChildren(sourceFile)
  return textSpans

  function checkChildren(node: import('typescript').Node) {
    ts.forEachChild(node, child => {
      if (ts.isIdentifier(child)) {
        const start = child.getStart(sourceFile, false)
        textSpans.push({ span: ts.createTextSpan(start, child.end - start), text: child.getText(sourceFile) })
      }
      checkChildren(child)
    })
  }
}

export function stringAroundIndex(string: string, index: number) {
  const arr = [
    string[index - 3],
    string[index - 2],
    string[index - 1],
    '>',
    string[index],
    '<',
    string[index + 1],
    string[index + 2],
    string[index + 3],
  ]
  return arr.filter(Boolean).join('')
}
