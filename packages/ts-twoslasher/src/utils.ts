import { TwoslashError } from "./"

export function escapeHtml(text: string) {
  return text.replace(/</g, "&lt;")
}

export function strrep(text: string, count: number) {
  let s = ""
  for (let i = 0; i < count; i++) {
    s += text
  }
  return s
}

export function textToAnchorName(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/`|#|\//g, "")
}

export function fileNameToUrlName(s: string) {
  return s.replace(/ /g, "-").replace(/#/g, "sharp").toLowerCase()
}

export function parsePrimitive<T extends string>(
  value: string,
  type: T
): {
  number: number
  string: string
  boolean: boolean
  [type: string]: number | string | boolean
}[T] {
  switch (type) {
    case "number":
      return +value
    case "string":
      return value
    case "boolean":
      return value.toLowerCase() === "true" || value.length === 0
  }

  throw new TwoslashError(
    `Unknown primitive value in compiler flag`,
    `The only recognized primitives are number, string and boolean. Got ${type} with ${value}.`,
    `This is likely a typo.`
  )
}

export function parseObject(value: string, name: string) {
  try {
    return JSON.parse(value)
  } catch (e) {
    throw new TwoslashError(
      `Invalid inline compiler value`,
      `Got ${JSON.stringify(value)} for ${name} but could not parse the string as JSON.`,
      e instanceof Error ? e.message : ``
    )
  }
}

export function cleanMarkdownEscaped(code: string) {
  code = code.replace(/¨D/g, "$")
  code = code.replace(/¨T/g, "~")
  return code
}

export function typesToExtension(types: string) {
  const map: Record<string, string> = {
    js: "js",
    javascript: "js",
    ts: "ts",
    typescript: "ts",
    tsx: "tsx",
    jsx: "jsx",
    json: "json",
    jsn: "json",
  }

  if (map[types]) return map[types]

  throw new TwoslashError(
    `Unknown TypeScript extension given to Twoslash`,
    `Received ${types} but Twoslash only accepts: ${Object.keys(map)} `,
    ``
  )
}

export function getIdentifierTextSpans(ts: typeof import("typescript"), sourceFile: import("typescript").SourceFile) {
  const textSpans: { span: import("typescript").TextSpan; text: string }[] = []
  checkChildren(sourceFile)
  return textSpans

  function checkChildren(node: import("typescript").Node) {
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
    ">",
    string[index],
    "<",
    string[index + 1],
    string[index + 2],
    string[index + 3],
  ]
  return arr.filter(Boolean).join("")
}

/** Came from https://ourcodeworld.com/articles/read/223/how-to-retrieve-the-closest-word-in-a-string-with-a-given-index-in-javascript */
export function getClosestWord(str: string, pos: number) {
  // Make copies
  str = String(str)
  pos = Number(pos) >>> 0

  // Search for the word's beginning and end.
  var left = str.slice(0, pos + 1).search(/\S+$/),
    right = str.slice(pos).search(/\s/)

  // The last word in the string is a special case.
  if (right < 0) {
    return {
      word: str.slice(left),
      startPos: left,
    }
  }
  // Return the word, using the located bounds to extract it from the string.
  return {
    word: str.slice(left, right + pos),
    startPos: left,
  }
}
