const booleanConfigRegexp = /^\/\/\s?@(\w+)$/

// https://regex101.com/r/8B2Wwh/1
const valuedConfigRegexp = /^\/\/\s?@(\w+):\s?(.+)$/

type Sandbox = ReturnType<typeof import('.').createTypeScriptSandbox>
type TS = typeof import('typescript')
type CompilerOptions = import('typescript').CompilerOptions

/**
 * This is a port of the twoslash bit which grabs compiler options
 * from the source code
 */

export const extractTwoSlashComplierOptions = (ts: TS) => (code: string) => {
  const codeLines = code.split('\n')
  const options = {} as any

  codeLines.forEach(line => {
    let match
    if ((match = booleanConfigRegexp.exec(line))) {
      options[match[1]] = true
      setOption(match[1], 'true', options, ts)
    } else if ((match = valuedConfigRegexp.exec(line))) {
      setOption(match[1], match[2], options, ts)
    }
  })
  return options
}

function setOption(name: string, value: string, opts: CompilerOptions, ts: TS) {
  // @ts-ignore - optionDeclarations is not public API
  for (const opt of ts.optionDeclarations) {
    if (opt.name.toLowerCase() === name.toLowerCase()) {
      switch (opt.type) {
        case 'number':
        case 'string':
        case 'boolean':
          opts[opt.name] = parsePrimitive(value, opt.type)
          break

        case 'list':
          opts[opt.name] = value.split(',').map(v => parsePrimitive(v, opt.element!.type as string))
          break

        default:
          opts[opt.name] = opt.type.get(value.toLowerCase())

          if (opts[opt.name] === undefined) {
            const keys = Array.from(opt.type.keys() as any)
            throw new Error(`Invalid value ${value} for ${opt.name}. Allowed values: ${keys.join(',')}`)
          }
          break
      }
      return
    }
  }

  throw new Error(`No compiler setting named '${name}' exists!`)
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
  console.log(`Unknown primitive type ${type} with - ${value}`)
}
