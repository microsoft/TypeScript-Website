import { gte, prerelease, rcompare, valid } from "semver"

export type PublishedCompilerVersions = {
  versions: string[]
  tags: { latest?: string; next?: string; beta?: string; rc?: string }
}

export type CompilerVersionChoice = {
  version: string
  label: string
}

export function isWasmCompilerVersion(version: string) {
  return valid(version) !== null && gte(version, "7.1.0-dev.20261030.1")
}

export function isUnsupportedNativeCompilerVersion(version: string) {
  return valid(version) !== null && gte(version, "7.0.0-0") && !isWasmCompilerVersion(version)
}

export async function loadPublishedCompilerVersions(): Promise<PublishedCompilerVersions> {
  const response = await fetch("https://data.jsdelivr.com/v1/package/npm/typescript", {
    cache: "no-cache",
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
  function tag(name: "latest" | "next" | "beta" | "rc") {
    const value: unknown = Reflect.get(indexTags, name)
    if (value === undefined) return undefined
    if (typeof value !== "string" || valid(value) === null) {
      throw new Error(`Invalid published TypeScript tag: ${name}`)
    }
    return value
  }
  return { versions, tags: { latest: tag("latest"), next: tag("next"), beta: tag("beta"), rc: tag("rc") } }
}

export function publishedNativeCompilerSelection(published: PublishedCompilerVersions, channel: "default" | "nightly") {
  const stable = published.tags.latest
  const useStable = channel === "default" && stable && isWasmCompilerVersion(stable) && !prerelease(stable)
  const version = useStable ? stable : published.tags.next
  if (!version || !isWasmCompilerVersion(version) || !published.versions.includes(version)) {
    throw new Error(`No published TypeScript version supports the native ${channel} channel`)
  }
  return { version, channel: useStable ? ("stable" as const) : ("nightly" as const) }
}

export function compilerVersionChoices(
  pinnedVersion: string,
  legacyVersions: readonly string[],
  published?: PublishedCompilerVersions,
  selectedVersion?: string
): CompilerVersionChoice[] {
  const versions = new Map<string, CompilerVersionChoice>()
  function add(version: string, label = version) {
    versions.set(version, { version, label })
  }
  const unsupported = new Set(["3.1.6", "3.0.1", "2.8.1", "2.7.2", "2.4.1"])
  const legacyReleases = legacyVersions.filter(
    version =>
      valid(version) !== null &&
      !prerelease(version) &&
      !isUnsupportedNativeCompilerVersion(version) &&
      !unsupported.has(version)
  )
  const nativeReleases =
    published?.versions.filter(version => isWasmCompilerVersion(version) && !prerelease(version)) ?? []
  const releases = latestMinorVersions([...nativeReleases, ...legacyReleases])
  const stableChoices = new Set(releases)
  if (
    selectedVersion &&
    valid(selectedVersion) !== null &&
    !prerelease(selectedVersion) &&
    !isUnsupportedNativeCompilerVersion(selectedVersion) &&
    !unsupported.has(selectedVersion)
  ) {
    stableChoices.add(selectedVersion)
  }
  for (const version of [...stableChoices].sort(rcompare)) add(version)
  const candidates: CompilerVersionChoice[] = []
  for (const [tag, label] of [
    ["rc", "RC"],
    ["beta", "Beta"],
  ] as const) {
    const version = published?.tags[tag]
    if (
      version &&
      valid(version) !== null &&
      !isUnsupportedNativeCompilerVersion(version) &&
      prerelease(version) &&
      published?.versions.includes(version) &&
      (!releases[0] || rcompare(version, releases[0]) < 0)
    ) {
      candidates.push({ version, label: `${label} (${version})` })
    }
  }
  const candidate = candidates.sort((a, b) => rcompare(a.version, b.version))[0]
  if (candidate) add(candidate.version, candidate.label)
  if (
    selectedVersion &&
    selectedVersion !== "next" &&
    !isUnsupportedNativeCompilerVersion(selectedVersion) &&
    !unsupported.has(selectedVersion) &&
    !versions.has(selectedVersion)
  ) {
    add(selectedVersion)
  }
  const nightly = published?.tags.next
  if (nightly && isWasmCompilerVersion(nightly) && published?.versions.includes(nightly)) {
    add("next", `Nightly (${nightly})`)
  } else if (!published) {
    add(pinnedVersion, `${pinnedVersion} (pinned)`)
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
