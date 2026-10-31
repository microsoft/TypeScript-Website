import { parse, type ParseError } from "jsonc-parser"
import type { AcquisitionOptions } from "./types"

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

export function acquisitionOptions(configText: string, globalEnable: boolean): AcquisitionOptions {
  if (!globalEnable) return { enable: false }
  const errors: ParseError[] = []
  const config: unknown = parse(configText, errors, { allowTrailingComma: true, disallowComments: false })
  if (errors.length) throw new Error("Fix TSConfig syntax errors before acquiring package types")
  if (!object(config)) {
    throw new Error("TSConfig must be an object")
  }
  const value: unknown = "typeAcquisition" in config ? config.typeAcquisition : undefined
  if (value === undefined || value === null) return {}
  if (!object(value)) {
    throw new Error("typeAcquisition must be an object")
  }
  const enable = "enable" in value ? value.enable : undefined
  if (enable !== undefined && enable !== null && typeof enable !== "boolean") {
    throw new Error("typeAcquisition.enable must be a boolean")
  }
  const list = (name: "include" | "exclude"): string[] | undefined => {
    const items: unknown = name in value ? value[name] : undefined
    if (items === undefined || items === null) return undefined
    if (!Array.isArray(items) || items.some(item => typeof item !== "string")) {
      throw new Error(`typeAcquisition.${name} must be an array of package names`)
    }
    return items
  }
  return {
    enable: typeof enable === "boolean" ? enable : undefined,
    include: list("include"),
    exclude: list("exclude"),
  }
}
