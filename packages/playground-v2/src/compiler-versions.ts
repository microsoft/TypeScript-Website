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

export function isDefaultNativeCompilerVersion(version: string | null) {
  return (
    version === null ||
    version === "" ||
    version === "native" ||
    version === "latest" ||
    version === "7" ||
    version === "7.1"
  )
}

export function isNativeCompilerVersion(version: string | null) {
  return (
    isDefaultNativeCompilerVersion(version) ||
    (version !== null &&
      (version === "next" ||
        version === "Nightly" ||
        isWasmCompilerVersion(version) ||
        isUnsupportedNativeCompilerVersion(version)))
  )
}

export async function loadPublishedCompilerVersions(): Promise<PublishedCompilerVersions> {
  const entries = await Promise.all(
    (["latest", "next", "beta", "rc"] as const).map(async tag => {
      const response = await fetch(`https://unpkg.com/typescript@${tag}/package.json`, {
        cache: "no-cache",
        signal: AbortSignal.timeout(15_000),
      })
      if (response.status === 404) return [tag, undefined] as const
      if (!response.ok) throw new Error(`Could not resolve TypeScript ${tag}: ${response.status}`)
      const metadata: unknown = await response.json()
      const version: unknown = metadata && typeof metadata === "object" ? Reflect.get(metadata, "version") : undefined
      if (
        !metadata ||
        typeof metadata !== "object" ||
        Reflect.get(metadata, "name") !== "typescript" ||
        typeof version !== "string" ||
        valid(version) === null
      ) {
        throw new Error(`Invalid TypeScript ${tag} package metadata`)
      }
      return [tag, version] as const
    })
  )
  return {
    versions: [...new Set(entries.flatMap(([, version]) => (version === undefined ? [] : [version])))],
    tags: Object.fromEntries(entries),
  }
}

export async function loadLegacyCompilerVersions(): Promise<string[]> {
  const response = await fetch("https://playgroundcdn.typescriptlang.org/indexes/releases.json", {
    cache: "no-cache",
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`Could not load historical TypeScript versions: ${response.status}`)
  const metadata: unknown = await response.json()
  const versions: unknown = metadata && typeof metadata === "object" ? Reflect.get(metadata, "versions") : undefined
  if (
    !Array.isArray(versions) ||
    versions.length === 0 ||
    !versions.every((version: unknown): version is string => typeof version === "string" && valid(version) !== null)
  ) {
    throw new Error("Invalid historical TypeScript versions")
  }
  return versions
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
  }
  return [...versions.values()].sort((left, right) => {
    const leftVersion = valid(left.version === "next" ? nightly : left.version)
    const rightVersion = valid(right.version === "next" ? nightly : right.version)
    if (!leftVersion) return rightVersion ? 1 : 0
    if (!rightVersion) return -1
    return rcompare(leftVersion, rightVersion)
  })
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
