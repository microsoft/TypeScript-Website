import { applyEdits, findNodeAtLocation, modify, parse, parseTree, type Node, type ParseError } from "jsonc-parser"

export type CompilerOverride = {
  applied: boolean
  end: number
  fileName: string
  lineNumber: number
  option: string
  rawValue: string
  start: number
  tsconfigValue: unknown
  value: unknown
}

export type OverrideDiagnostic = {
  end: number
  fileName: string
  message: string
  start: number
}

export type CompilerOverrideState = {
  diagnostics: OverrideDiagnostic[]
  effectiveConfigText: string
  overrides: CompilerOverride[]
}

const reservedDirectives = new Set([
  "errors",
  "filename",
  "noerrors",
  "showemit",
  "showemittedfile",
  "showoutput",
  "ts-check",
  "ts-expect-error",
  "ts-ignore",
  "ts-nocheck",
])
const directivePattern = /^(\s*\/\/\s*)@([A-Za-z][\w-]*):\s*(.*?)\s*$/
const stringListOptions = new Set(["lib", "rootDirs", "typeRoots", "types", "moduleSuffixes", "customConditions"])
const formattingOptions = {
  insertSpaces: true,
  tabSize: 2,
}

export function computeCompilerOverrides(
  files: ReadonlyMap<string, string>,
  configText: string
): CompilerOverrideState {
  const configErrors: ParseError[] = []
  const config = parse(configText, configErrors, { allowTrailingComma: true, disallowComments: false }) ?? {}
  const compilerOptions =
    config.compilerOptions && typeof config.compilerOptions === "object" ? config.compilerOptions : {}
  const overrides: CompilerOverride[] = []
  const diagnostics: OverrideDiagnostic[] = []

  for (const [fileName, text] of [...files].sort(([left], [right]) => left.localeCompare(right))) {
    if (!/\.[cm]?[jt]sx?$/i.test(fileName)) continue
    let lineNumber = 0
    for (const lineMatch of text.matchAll(/[^\r\n]*(?:\r\n|\r|\n|$)/g)) {
      if (lineMatch[0] === "") break
      lineNumber++
      const offset = lineMatch.index
      const line = lineMatch[0].replace(/\r\n$|\r$|\n$/, "")
      const match = directivePattern.exec(line)
      const lineEnd = offset + line.length
      if (match) {
        const option = match[2]
        if (!reservedDirectives.has(option.toLowerCase())) {
          const rawValue = match[3]
          if (rawValue === "") {
            diagnostics.push({
              end: lineEnd,
              fileName,
              message: `Compiler override @${option} requires a value.`,
              start: offset,
            })
          } else {
            overrides.push({
              applied: false,
              end: lineEnd,
              fileName,
              lineNumber,
              option,
              rawValue,
              start: offset,
              tsconfigValue: compilerOptions[option],
              value: parseDirectiveValue(option, rawValue),
            })
          }
        }
      }
    }
  }

  const byOption = new Map<string, CompilerOverride[]>()
  for (const override of overrides) {
    const key = override.option.toLowerCase()
    const entries = byOption.get(key) ?? []
    entries.push(override)
    byOption.set(key, entries)
  }
  let effectiveConfigText = configText
  for (const duplicates of byOption.values()) {
    if (duplicates.length > 1) {
      for (const duplicate of duplicates) {
        diagnostics.push({
          end: duplicate.end,
          fileName: duplicate.fileName,
          message: `Compiler option @${duplicate.option} is overridden in multiple files. Keep only one project-wide directive.`,
          start: duplicate.start,
        })
      }
      continue
    }

    const override = duplicates[0]
    try {
      effectiveConfigText = setCompilerOption(effectiveConfigText, override.option, override.value)
      override.applied = true
    } catch {
      diagnostics.push({
        end: override.end,
        fileName: override.fileName,
        message: `Compiler override @${override.option} cannot be applied while tsconfig.json is invalid.`,
        start: override.start,
      })
    }
  }

  return {
    diagnostics,
    effectiveConfigText,
    overrides,
  }
}

export function setCompilerOption(configText: string, option: string, value: unknown) {
  return applyEdits(
    configText,
    modify(configText, ["compilerOptions", option], value, {
      formattingOptions,
    })
  )
}

export function configOptionNode(configText: string, option: string): Node | undefined {
  const tree = parseTree(configText, [], { allowTrailingComma: true, disallowComments: false })
  return tree ? findNodeAtLocation(tree, ["compilerOptions", option]) : undefined
}

export function compilerOptionsNode(configText: string): Node | undefined {
  const tree = parseTree(configText, [], { allowTrailingComma: true, disallowComments: false })
  return tree ? findNodeAtLocation(tree, ["compilerOptions"]) : undefined
}

export function compilerOverrideForDiagnostic(
  state: CompilerOverrideState,
  diagnostic: { fileName?: string; pos: number; end: number; text: string },
  configFileName: string
) {
  if (diagnostic.fileName !== undefined && diagnostic.fileName !== configFileName) return undefined
  return state.overrides.find(override => {
    if (!override.applied) return false
    const node = configOptionNode(state.effectiveConfigText, override.option)
    if (
      diagnostic.fileName === configFileName &&
      node &&
      diagnostic.pos <= node.offset + node.length &&
      diagnostic.end >= node.offset
    )
      return true
    if (!/^(?:compiler )?option\b|^unknown compiler option\b|^argument for\b/i.test(diagnostic.text)) return false
    return (
      diagnostic.text.toLowerCase().includes(`'${override.option.toLowerCase()}'`) ||
      diagnostic.text.toLowerCase().includes(`'--${override.option.toLowerCase()}'`) ||
      diagnostic.text.toLowerCase().includes(`"--${override.option.toLowerCase()}"`)
    )
  })
}
export function canSetCompilerOptions(configText: string) {
  const errors: ParseError[] = []
  const root = parseTree(configText, errors, { allowTrailingComma: true, disallowComments: false })
  const options = root && findNodeAtLocation(root, ["compilerOptions"])
  return errors.length === 0 && root?.type === "object" && (!options || options.type === "object")
}

export function applyLegacyCompilerOptions(configText: string, search: string, optionNames: Iterable<string>) {
  if (!canSetCompilerOptions(configText)) return configText
  const params = new URLSearchParams(search)
  const allowed = new Set(optionNames)
  const snapshot = params.has("tsconfig")
  for (const [key, rawValue] of params) {
    if (!allowed.has(key) || (snapshot && configOptionNode(configText, key))) continue
    configText = setCompilerOption(configText, key, parseLegacyCompilerOption(key, rawValue))
  }
  if (params.has("useJavaScript") || params.get("filetype")?.startsWith("js")) {
    configText = setCompilerOption(configText, "allowJs", true)
    configText = setCompilerOption(configText, "checkJs", true)
  }
  return configText
}

function parseLegacyCompilerOption(key: string, rawValue: string): unknown {
  if (rawValue === "") return true
  if (rawValue === "true") return true
  if (rawValue === "false") return false
  if (stringListOptions.has(key) || /^[{[]/.test(rawValue)) return parseDirectiveValue(key, rawValue)
  const number = Number(rawValue)
  if (!Number.isFinite(number)) return rawValue
  const enumMaps: Record<string, Record<number, string>> = {
    jsx: {
      1: "preserve",
      2: "react",
      3: "react-native",
      4: "react-jsx",
      5: "react-jsxdev",
    },
    module: {
      0: "none",
      1: "commonjs",
      2: "amd",
      3: "umd",
      4: "system",
      5: "es2015",
      6: "es2020",
      7: "es2022",
      99: "esnext",
      100: "node16",
      101: "node18",
      102: "node20",
      199: "nodenext",
      200: "preserve",
    },
    moduleResolution: { 1: "classic", 2: "node", 3: "node16", 99: "nodenext", 100: "bundler" },
    newLine: { 0: "crlf", 1: "lf" },
    target: {
      0: "es3",
      1: "es5",
      2: "es2015",
      3: "es2016",
      4: "es2017",
      5: "es2018",
      6: "es2019",
      7: "es2020",
      8: "es2021",
      9: "es2022",
      10: "es2023",
      11: "es2024",
      12: "es2025",
      99: "esnext",
    },
  }
  if (key === "jsx" && number === 0) return undefined
  return enumMaps[key]?.[number] ?? number
}

function parseDirectiveValue(option: string, rawValue: string) {
  if (/^(?:true|false|null|-?\d+(?:\.\d+)?)$/.test(rawValue) || /^["[{]/.test(rawValue)) {
    try {
      return JSON.parse(rawValue)
    } catch {
      // Treat invalid JSON-like values as compiler option strings so the selected compiler reports them.
    }
  }
  if (stringListOptions.has(option)) return rawValue.split(",").map(value => value.trim())
  return rawValue
}
