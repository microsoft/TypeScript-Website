type Compiler = typeof import("typescript")

type CompilerWithFileMatcher = Compiler & {
  matchFiles(
    path: string,
    extensions: readonly string[] | undefined,
    excludes: readonly string[] | undefined,
    includes: readonly string[] | undefined,
    useCaseSensitiveFileNames: boolean,
    currentDirectory: string,
    depth: number | undefined,
    getFileSystemEntries: (path: string) => { files: string[]; directories: string[] },
    realpath: (path: string) => string
  ): string[]
}

function hasFileMatcher(compiler: Compiler): compiler is CompilerWithFileMatcher {
  return "matchFiles" in compiler && typeof compiler.matchFiles === "function"
}

export function normalizeStradaPath(fileName: string) {
  let path = fileName.replaceAll("\\", "/").replace(/^file:\/\//, "")
  if (!path.startsWith("/")) path = `/workspace/${path}`
  const parts: string[] = []
  for (const part of path.split("/")) {
    if (part === "..") parts.pop()
    else if (part && part !== ".") parts.push(part)
  }
  return `/${parts.join("/")}`
}

export function createStradaFileSystem(
  compiler: Compiler,
  fileNames: () => Iterable<string>,
  readFile: (fileName: string) => string | undefined
) {
  if (!hasFileMatcher(compiler)) throw new Error("The selected compiler does not provide directory matching")
  const matchFiles = compiler.matchFiles
  function entries(directory: string) {
    const prefix = `${normalizeStradaPath(directory).replace(/\/$/, "")}/`
    const files = new Set<string>()
    const directories = new Set<string>()
    for (const name of fileNames()) {
      const path = normalizeStradaPath(name)
      if (!path.startsWith(prefix)) continue
      const relative = path.slice(prefix.length)
      const slash = relative.indexOf("/")
      if (slash < 0) files.add(relative)
      else directories.add(relative.slice(0, slash))
    }
    return { files: [...files].sort(), directories: [...directories].sort() }
  }
  const readDirectory = (
    directory: string,
    extensions?: readonly string[],
    excludes?: readonly string[],
    includes?: readonly string[],
    depth?: number
  ): string[] =>
    matchFiles(
      normalizeStradaPath(directory),
      extensions,
      excludes,
      includes,
      true,
      "/workspace",
      depth,
      entries,
      normalizeStradaPath
    )
  return {
    useCaseSensitiveFileNames: true,
    fileExists: (fileName: string) => readFile(normalizeStradaPath(fileName)) !== undefined,
    readFile: (fileName: string) => readFile(normalizeStradaPath(fileName)),
    readDirectory,
    directoryExists(directory: string) {
      const result = entries(directory)
      return result.files.length > 0 || result.directories.length > 0
    },
    getDirectories: (directory: string) => entries(directory).directories,
    realpath: normalizeStradaPath,
  }
}
