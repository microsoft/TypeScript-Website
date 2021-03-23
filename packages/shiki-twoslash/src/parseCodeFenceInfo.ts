// Based on https://github.com/andrewbranch/gatsby-remark-vscode/blob/7bf5c036a58652c1f45d27c5874557f7b531102c/src/index.js
// which is MIT https://github.com/andrewbranch/gatsby-remark-vscode/blob/7bf5c036a58652c1f45d27c5874557f7b531102c/LICENSE
// Only difference is conversion to TypeScript, and a replace at the top

const identifierPattern = /[a-z0-9-–—_+#]/i
const triviaPattern = /\s/
const startOfNumberPattern = /[0-9-.]/
const numberPattern = /[0-9-.e]/

function testRegex(input: string, pattern: RegExp) {
  if (input === undefined) return false
  return pattern.test(input)
}

/** Takes the language and a meta-string and offers a useful object for looking at params */
export function parseCodeFenceInfo(lang: string, fullMetaString: string) {
  // Heh
  const metaString = fullMetaString.replace("twoslash", "")
  let pos = 0
  let meta = {}
  let languageName = ""
  const input = [lang, metaString].filter(Boolean).join(" ")
  skipTrivia()
  if (!isEnd() && current() !== "{") {
    languageName = parseIdentifier()
  }
  const languageNameEnd = pos
  skipTrivia()
  if (!isEnd() && current() === "{") {
    meta = parseObject()
  }

  if (!isEnd() && languageNameEnd === pos) {
    return fail(`Invalid character in language name: '${current()}'`)
  }

  return { languageName, meta }

  function current(): string {
    if (isEnd()) {
      return fail("Unexpected end of input")
    }
    return input[pos]
  }

  function isEnd() {
    return pos >= input.length
  }

  function fail(message: string): never {
    throw new Error(`Failed parsing code fence header '${input}' at position ${pos}: ${message}`)
  }

  function scanExpected(expected: string): void {
    if (isEnd() || current() !== expected) {
      return fail(`Expected '${expected}'`)
    }
    pos++
  }

  function parseIdentifier(errorMessage = "Expected identifier, but got nothing") {
    let identifier = ""
    while (!isEnd() && testRegex(current(), identifierPattern)) {
      identifier += current()
      pos++
    }
    if (!identifier) {
      return fail(errorMessage)
    }
    return identifier
  }

  function skipTrivia() {
    while (!isEnd() && testRegex(current(), triviaPattern)) pos++
  }

  function parseChar() {
    let char = current()
    if (char === "\\") {
      pos++
      char += current()
    }
    pos++
    return char
  }

  function parseString() {
    let str = ""
    const quote = current()
    pos++
    while (true) {
      const char = parseChar()
      if (char === quote) break
      str += char.replace(/\\/, "")
    }
    return str
  }

  function parseNumber() {
    let numStr = current()
    pos++
    while (!isEnd() && testRegex(current(), numberPattern)) {
      numStr += current()
      pos++
    }
    return parseFloat(numStr)
  }

  function parseBoolean() {
    const identifier = parseIdentifier("Expected expression, but got nothing")
    switch (identifier) {
      case "true":
        return true
      case "false":
        return false
      case "":
        return fail("Expected expression, but got nothing")
      default:
        return fail(`Unrecognized input '${identifier}'`)
    }
  }

  function parseExpression() {
    switch (current()) {
      case "{":
        return parseObject()
      case `'`:
      case '"':
        return parseString()
    }
    if (testRegex(current(), startOfNumberPattern)) {
      return parseNumber()
    }
    return parseBoolean()
  }

  function parseObject() {
    let obj: any = {}
    scanExpected("{")
    skipTrivia()
    while (!isEnd() && current() !== "}") {
      const key = parseIdentifier()

      let value: any = true
      skipTrivia()
      if (current() === ":") {
        pos++
        skipTrivia()
        value = parseExpression()
        skipTrivia()
      }
      obj[key] = value
      if (current() === ",") pos++
      skipTrivia()
    }
    scanExpected("}")
    return obj
  }
}

/** Does anything in the object imply that we should highlight any lines? */
export const shouldBeHighlightable = (meta: any) => {
  return !!Object.keys(meta).find(key => {
    if (key.includes("-")) return true
    if (parseInt(key) !== NaN) return true
    return false
  })
}

/** Returns a func for figuring out if this line should be highlighted */
export const shouldHighlightLine = (meta: any) => {
  const lines: number[] = []
  Object.keys(meta).find(key => {
    if (parseInt(key) !== NaN) lines.push(parseInt(key))
    if (key.includes("-")) {
      const [first, last] = key.split("-")
      const lastIndex = parseInt(last) + 1
      for (let i = parseInt(first); i < lastIndex; i++) {
        lines.push(i)
      }
    }
  })

  return (line: number) => lines.includes(line)
}
