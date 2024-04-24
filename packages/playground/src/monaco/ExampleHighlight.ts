/**
 * Allows inline clicking on internal URLs to get different example code
 */
export class ExampleHighlighter {
  provideLinks(model: import('monaco-editor').editor.IModel) {
    const text = model.getValue()

    // https://regex101.com/r/3uM4Fa/1
    const docRegexLink = /example:([^\s]+)/g

    const links = []

    let match
    while ((match = docRegexLink.exec(text)) !== null) {
      const start = match.index
      const end = match.index + match[0].length
      const startPos = model.getPositionAt(start)
      const endPos = model.getPositionAt(end)

      const range = {
        startLineNumber: startPos.lineNumber,
        startColumn: startPos.column,
        endLineNumber: endPos.lineNumber,
        endColumn: endPos.column,
      }

      const url = document.location.href.split('#')[0]
      links.push({
        url: url + '#example/' + match[1],
        range,
      })
    }

    return { links }
  }
}
