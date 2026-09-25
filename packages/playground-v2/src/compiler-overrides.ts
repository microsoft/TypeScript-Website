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

const reservedDirectives = new Set(["errors", "filename", "noerrors", "showemit", "showemittedfile", "showoutput"])
const directivePattern = /^(\s*\/\/\s*)@([A-Za-z][\w-]*):\s*(.*?)\s*$/
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
              value: parseDirectiveValue(rawValue),
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

function parseDirectiveValue(rawValue: string) {
  if (/^(?:true|false|null|-?\d+(?:\.\d+)?)$/.test(rawValue) || /^["[{]/.test(rawValue)) {
    try {
      return JSON.parse(rawValue)
    } catch {
      // Treat invalid JSON-like values as compiler option strings so the selected compiler reports them.
    }
  }
  return rawValue
}
