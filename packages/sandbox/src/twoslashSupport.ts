const booleanConfigRegexp = /^\/\/\s?@(\w+)$/

// https://regex101.com/r/8B2Wwh/1
const valuedConfigRegexp = /^\/\/\s?@(\w+):\s?(.+)$/

type TS = typeof import("typescript")
type CompilerOptions = import("typescript").CompilerOptions

/**
 * This is a port of the twoslash bit which grabs compiler options
 * from the source code
 */

export const extractTwoSlashComplierOptions = (ts: TS) => {
  let optMap = new Map<string, any>()

  // @ts-ignore - optionDeclarations is not public API
  for (const opt of ts.optionDeclarations) {
    optMap.set(opt.name.toLowerCase(), opt)
  }

  return (code: string) => {
    const codeLines = code.split("\n")
    const options = {} as any

    codeLines.forEach(line => {
      let match
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

function setOption(name: string, value: string, opts: CompilerOptions, optMap: Map<string, any>) {
  const opt = optMap.get(name.toLowerCase())
  if (!opt) return
  switch (opt.type) {
    case "number":
    case "string":
    case "boolean":
      opts[opt.name] = parsePrimitive(value, opt.type)
      break

    case "list":
      opts[opt.name] = value.split(",").map(v => parsePrimitive(v, opt.element!.type as string))
      break

    default:
      opts[opt.name] = opt.type.get(value.toLowerCase())

      if (opts[opt.name] === undefined) {
        const keys = Array.from(opt.type.keys() as any)
        console.log(`Invalid value ${value} for ${opt.name}. Allowed values: ${keys.join(",")}`)
      }
  }
}

export function parsePrimitive(value: string, type: string): any {
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
