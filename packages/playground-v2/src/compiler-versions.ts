import { gte, prerelease, rcompare, valid } from "semver"

export type PublishedCompilerVersions = {
  versions: string[]
  tags: { next?: string; beta?: string; rc?: string }
}

export type CompilerVersionChoice = {
  version: string
  label: string
}

export function isWasmCompilerVersion(version: string) {
  return valid(version) !== null && gte(version, "7.1.0-dev.20261030.1")
}

export async function loadPublishedCompilerVersions(): Promise<PublishedCompilerVersions> {
  const response = await fetch("https://data.jsdelivr.com/v1/package/npm/typescript", {
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`Could not load published TypeScript versions: ${response.status}`)
  const metadata: unknown = await response.json()
  if (!metadata || typeof metadata !== "object") throw new Error("Invalid published TypeScript versions")
  const versions: unknown = Reflect.get(metadata, "versions")
  const tags: unknown = Reflect.get(metadata, "tags")
  if (
    !Array.isArray(versions) ||
    versions.length === 0 ||
    !versions.every((version: unknown): version is string => typeof version === "string" && valid(version) !== null) ||
    !tags ||
    typeof tags !== "object" ||
    Array.isArray(tags)
  ) {
    throw new Error("Invalid published TypeScript versions")
  }
  const indexTags = tags
  function tag(name: "next" | "beta" | "rc") {
    const value: unknown = Reflect.get(indexTags, name)
    if (value === undefined) return undefined
    if (typeof value !== "string" || valid(value) === null) {
      throw new Error(`Invalid published TypeScript tag: ${name}`)
    }
    return value
  }
  return { versions, tags: { next: tag("next"), beta: tag("beta"), rc: tag("rc") } }
}

export function compilerVersionChoices(
  defaultVersion: string,
  legacyVersions: readonly string[],
  published?: PublishedCompilerVersions
): CompilerVersionChoice[] {
  const versions = new Map<string, CompilerVersionChoice>()
  function add(version: string, label = version) {
    versions.set(version, { version, label })
  }
  add(defaultVersion)
  const nativeReleases =
    published?.versions.filter(version => isWasmCompilerVersion(version) && !prerelease(version)) ?? []
  for (const version of latestMinorVersions(nativeReleases)) add(version)
  for (const [tag, label] of [
    ["next", "Nightly"],
    ["beta", "Beta"],
    ["rc", "RC"],
  ] as const) {
    const version = published?.tags[tag]
    if (version && isWasmCompilerVersion(version) && published?.versions.includes(version)) {
      add(version, `${label} (${version})`)
    }
  }
  const unsupported = new Set(["3.1.6", "3.0.1", "2.8.1", "2.7.2", "2.4.1"])
  for (const version of latestMinorVersions(legacyVersions.filter(version => !unsupported.has(version)))) {
    if (!versions.has(version)) add(version)
  }
  return [...versions.values()]
}

function latestMinorVersions(versions: readonly string[]) {
  const minors = new Set<string>()
  return [...versions].sort(rcompare).filter(version => {
    const minor = version.split(".").slice(0, 2).join(".")
    if (minors.has(minor)) return false
    minors.add(minor)
    return true
  })
}
