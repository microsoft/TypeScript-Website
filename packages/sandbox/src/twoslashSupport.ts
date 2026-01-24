const booleanConfigRegexp = /^\/\/\s?@(\w+)$/

// https://regex101.com/r/8B2Wwh/1
const valuedConfigRegexp = /^\/\/\s?@(\w+):\s?(.+)$/

type TS = typeof import("typescript")
type CompilerOptions = import("monaco-editor").languages.typescript.CompilerOptions
type CommandLineOption = import("typescript").CommandLineOption

/**
 * This is a port of the twoslash bit which grabs compiler options
 * from the source code
 */

export const extractTwoSlashCompilerOptions = (ts: TS) => {
  const optMap = new Map<string, CommandLineOption>()

  if (!("optionDeclarations" in ts)) {
    console.error("Could not get compiler options from ts.optionDeclarations - skipping twoslash support.")
  } else {
    for (const opt of ts.optionDeclarations) {
      optMap.set(opt.name.toLowerCase(), opt)
    }
  }

  return (code: string) => {
    const codeLines = code.split("\n")
    const options: CompilerOptions = {}

    codeLines.forEach(_line => {
      let match
      const line = _line.trim()
      if ((match = booleanConfigRegexp.exec(line))) {
        if (optMap.has(match[1].toLowerCase())) {
          options[match[1]] = true
          setOption(match[1], "true", options, optMap)
        }
      } else if ((match = valuedConfigRegexp.exec(line))) {
        if (optMap.has(match[1].toLowerCase())) {
          setOption(match[1], match[2], options, optMap)
        }
      }
    })
    return options
  }
}

function setOption(name: string, value: string, opts: CompilerOptions, optMap: Map<string, CommandLineOption>) {
  const opt = optMap.get(name.toLowerCase())

  if (!opt) return
  switch (opt.type) {
    case "number":
    case "string":
    case "boolean":
      opts[opt.name] = parsePrimitive(value, opt.type)
      break

    case "list":
    case "listOrElement":
      const elementType = opt.element.type
      const strings = value.split(",")
      switch (elementType) {
        case "string":
        case "number":
          opts[opt.name] = strings.map(v => parsePrimitive(v, elementType))
          break
        case "object":
          opts[opt.name] = strings.map(v => parseObject(v, opt.name))
          break
        case "boolean":
          console.log(`List of ${elementType} is not yet supported.`)
          break
        default:
          opts[opt.name] = strings
            .map(v => getOptionValueFromMap(opt.name, v, elementType))
            .filter(v => v !== undefined)
      }
      break

    case "object":
      opts[opt.name] = parseObject(value, opt.name)
      break
    default: // It's a map!
      const optMap = opt.type
      opts[opt.name] = getOptionValueFromMap(opt.name, value, optMap)
  }

  if (opts[opt.name] === undefined && opt.type instanceof Map) {
    const keys = Array.from(opt.type.keys())
    console.log(`Invalid value ${value} for ${opt.name}. Allowed values: ${keys.join(",")}`)
  }
}

export function parsePrimitive<T extends string>(
  value: string,
  type: T
): {
  number: number
  string: string
  boolean: boolean
  [type: string]: number | string | boolean | undefined
}[T] {
  switch (type) {
    case "number":
      return +value
    case "string":
      return value
    case "boolean":
      return value.toLowerCase() === "true" || value.length === 0
  }
  console.log(`Unknown primitive type ${type} with - ${value}`)
}

function parseObject(value: string, name: string) {
  try {
    return JSON.parse(value)
  } catch {
    console.log(`Invalid JSON value ${value} for ${name}.`)
  }
}

function getOptionValueFromMap(name: string, key: string, optMap: Map<string, string | number>) {
  const result = optMap.get(key.toLowerCase())
  if (result === undefined) {
    const keys = Array.from(optMap.keys())

    console.error(
      `Invalid inline compiler value`,
      `Got ${key} for ${name} but it is not a supported value by the TS compiler.`,
      `Allowed values: ${keys.join(",")}`
    )
  }
  return result
}

// Function to generate autocompletion results
export const twoslashCompletions = (ts: TS, monaco: typeof import("monaco-editor")) => (
  model: import("monaco-editor").editor.ITextModel,
  position: import("monaco-editor").Position,
  _token: any
): import("monaco-editor").languages.CompletionList => {
  const result: import("monaco-editor").languages.CompletionItem[] = []

  // Split everything the user has typed on the current line up at each space, and only look at the last word
  const thisLine = model.getValueInRange({
    startLineNumber: position.lineNumber,
    startColumn: 0,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  })

  // Not a comment
  if (!thisLine.startsWith("//")) {
    return { suggestions: [] }
  }

  const words = thisLine.replace("\t", "").split(" ")

  // Not the right amount of
  if (words.length !== 2) {
    return { suggestions: [] }
  }

  const word = words[1]
  if (word.startsWith("-")) {
    return {
      suggestions: [
        {
          label: "---cut---",
          kind: 14,
          detail: "Twoslash split output",
          insertText: "---cut---".replace(word, ""),
        } as any,
      ],
    }
  }

  // Not a @ at the first word
  if (!word.startsWith("@")) {
    return { suggestions: [] }
  }

  const knowns = [
    "noErrors",
    "errors",
    "showEmit",
    "showEmittedFile",
    "noStaticSemanticInfo",
    "emit",
    "noErrorValidation",
    "filename",
  ]
  const optsNames = ts.optionDeclarations.map(o => o.name)
  knowns.concat(optsNames).forEach(name => {
    if (name.startsWith(word.slice(1))) {
      // somehow adding the range seems to not give autocomplete results?
      result.push({
        label: name,
        kind: 14,
        detail: "Twoslash comment",
        insertText: name,
      } as any)
    }
  })

  return {
    suggestions: result,
  }
}
