import { normalizeVirtualPath, resolveSymlinks, type Symlinks } from "./symlinks"

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
    realpath: (path: string) => string,
    directoryExists: (path: string) => boolean
  ): string[]
}

function hasFileMatcher(compiler: Compiler): compiler is CompilerWithFileMatcher {
  return "matchFiles" in compiler && typeof compiler.matchFiles === "function"
}

export const normalizeStradaPath = normalizeVirtualPath

export function parseStradaConfig(
  compiler: Compiler,
  filesystem: ReturnType<typeof createStradaFileSystem>,
  configFileName = "/workspace/tsconfig.json"
) {
  const config = compiler.parseConfigFileTextToJson(configFileName, filesystem.readFile(configFileName) ?? "{}")
  const parsed = compiler.parseJsonConfigFileContent(
    config.config ?? {},
    filesystem,
    configFileName.slice(0, configFileName.lastIndexOf("/")),
    undefined,
    configFileName
  )
  return {
    errors: [...(config.error ? [config.error] : []), ...parsed.errors],
    options: parsed.options,
    rootNames: parsed.fileNames,
    projectReferences: parsed.projectReferences,
  }
}

export function createStradaFileSystem(
  compiler: Compiler,
  fileNames: () => Iterable<string>,
  readFile: (fileName: string) => string | undefined,
  symlinks: Symlinks = {}
) {
  if (!hasFileMatcher(compiler)) throw new Error("The selected compiler does not provide directory matching")
  const matchFiles = compiler.matchFiles
  const realpath = (path: string) => resolveSymlinks(path, symlinks) ?? normalizeVirtualPath(path)
  function directoryExists(directory: string) {
    const resolved = resolveSymlinks(directory, symlinks)
    if (!resolved) return false
    const prefix = `${resolved.replace(/\/$/, "")}/`
    return [...fileNames(), ...Object.keys(symlinks)].some(path => path.startsWith(prefix))
  }
  function entries(directory: string) {
    const prefix = `${realpath(directory).replace(/\/$/, "")}/`
    const files = new Set<string>()
    const directories = new Set<string>()
    for (const name of [...fileNames(), ...Object.keys(symlinks)]) {
      const path = normalizeStradaPath(name)
      if (!path.startsWith(prefix)) continue
      const relative = path.slice(prefix.length)
      const slash = relative.indexOf("/")
      if (slash < 0 && symlinks[path] !== undefined && directoryExists(path)) directories.add(relative)
      else if (slash < 0) files.add(relative)
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
      realpath,
      directoryExists
    )
  return {
    useCaseSensitiveFileNames: true,
    fileExists: (fileName: string) => {
      const path = resolveSymlinks(fileName, symlinks)
      return path !== undefined && readFile(path) !== undefined
    },
    readFile: (fileName: string) => {
      const path = resolveSymlinks(fileName, symlinks)
      return path === undefined ? undefined : readFile(path)
    },
    readDirectory,
    directoryExists,
    getDirectories: (directory: string) => entries(directory).directories,
    realpath,
  }
}
