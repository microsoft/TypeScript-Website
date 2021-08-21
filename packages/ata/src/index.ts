import {
  getDTSFileForModuleWithVersion,
  getFiletreeForModuleWithVersion,
  getNPMVersionsForModule,
  NPMTreeMeta,
} from "./apis"
import { mapModuleNameToModule } from "./edgeCases"

export interface ATABootstrapConfig {
  /** A object you pass in to get callbacks */
  delegate: {
    /** The callback which gets called when ATA decides a file needs to be written to your VFS  */
    receivedFile?: (code: string, path: string) => void
    /** A way to display progress */
    progress?: (downloaded: number, estimatedTotal: number) => void
    /** Note: An error message does not mean ATA has stopped! */
    errorMessage?: (userFacingMessage: string, error: Error) => void
    /** The callback when all ATA has finished */
    finished?: (files: Map<string, string>) => void
  }
  /** Passed to fetch as the user-agent */
  projectName: string
  /** Your local copy of typescript */
  typescript: typeof import("typescript")
  /** If you need a custom version of fetch */
  fetcher?: typeof fetch
  /** If you need a custom logger instead of the console global */
  logger?: Logger
}

type ModuleMeta = { state: "loading" } | { state: "downloaded" }

/**
 * The function which starts up type acquisition,
 * returns a function which you then pass the initial
 * source code for the app with.
 *
 * This is effectively the main export, everything else is
 * basically exported for tests and should be considered
 * implementation details by consumers.
 */
export const setupTypeAcquisition = (config: ATABootstrapConfig) => {
  const moduleMap = new Map<string, ModuleMeta>()
  const fsMap = new Map<string, string>()

  return (initialSourceFile: string) => {
    resolveDeps(initialSourceFile)
  }

  let estimatedToDownload = 0
  let estimatedDownloaded = 0
  async function resolveDeps(initialSourceFile: string) {
    const depsToGet = getNewDependencies(config, moduleMap, initialSourceFile)

    // Make it so it won't get re-downloaded
    depsToGet.forEach(dep => moduleMap.set(dep.module, { state: "loading" }))

    // Grab the module trees which gives us a list of files to download
    const trees = await Promise.all(depsToGet.map(f => getFileTreeForModuleWithTag(config, f.module, f.version)))
    const treesOnly = trees.filter(t => !("error" in t)) as NPMTreeMeta[]

    // These are the modules which we can grab directly
    const hasDTS = treesOnly.filter(t => t.files.find(f => f.name.endsWith(".d.ts")))

    // These are ones we need to look on DT for (which may not be there, who knows)
    const mightBeOnDT = treesOnly.filter(t => !hasDTS.includes(t))

    hasDTS.forEach(tree => {
      tree.files.forEach(f => {
        if (f.name.endsWith(".d.ts")) {
          estimatedToDownload += 1
          getDTSFileForModuleWithVersion(config, tree.moduleName, tree.version, f.name).then(text => {
            estimatedDownloaded += 1
            if (text instanceof Error) {
              //
            } else {
              config.delegate.receivedFile?.(text, f.name)
            }
          })
        }
      })
    })
  }
}

/**
 * Pull out any potential references to other modules (including relatives) with their
 * npm versioning strat too if someone opts into a different version via an inline end of line comment
 */
export const getReferencesForModule = (ts: typeof import("typescript"), code: string) => {
  const meta = ts.preProcessFile(code)
  const references = meta.referencedFiles.concat(meta.importedFiles).concat(meta.libReferenceDirectives)
  return references.map(r => {
    let version = undefined
    if (!r.fileName.startsWith(".")) {
      version = "latest"
      const line = code.slice(r.end).split("\n")[0]!
      if (line.includes("// version:")) version = line.split("// version: ")[1]!.trim()
    }

    return {
      module: r.fileName,
      version,
    }
  })
}

/** A list of modules from the current sourcefile which we don't have existing files for */
export function getNewDependencies(config: ATABootstrapConfig, moduleMap: Map<string, ModuleMeta>, code: string) {
  const refs = getReferencesForModule(config.typescript, code).map(ref => ({
    ...ref,
    module: mapModuleNameToModule(ref.module),
  }))

  // Drop relative paths because we're getting all the files
  const modules = refs.filter(f => !f.module.startsWith(".")).filter(m => moduleMap.has(m.module))
  return modules
}

/** The bulk load of the work in getting the filetree based on how people think about npm names and versions */
export const getFileTreeForModuleWithTag = async (
  config: ATABootstrapConfig,
  moduleName: string,
  tag: string | undefined
) => {
  let toDownload = tag || "latest"

  // I think having at least 2 dots is a reasonable approx for being a semver and not a tag,
  // we can skip an API request, TBH this is probably rare
  if (toDownload.split(".").length < 2) {
    // The jsdelivr API needs a _version_ not a tag. So, we need to switch out
    // the tag to the version via an API request.
    const versions = await getNPMVersionsForModule(config, moduleName)
    if (versions instanceof Error) {
      return { error: versions, userFacingMessage: `Could not get versions on npm for ${moduleName} - possible typo?` }
    }
    const neededVersion = versions.tags[toDownload]
    if (!neededVersion) {
      const tags = Object.entries(versions.tags).join(", ")
      return {
        error: new Error("Could not find tag for module"),
        userFacingMessage: `Could not find a tag for ${moduleName} called ${tag}. Did find ${tags}`,
      }
    }

    toDownload = neededVersion
  }

  const res = await getFiletreeForModuleWithVersion(config, moduleName, toDownload)
  if (res instanceof Error) {
    return {
      error: res,
      userFacingMessage: `Could not get the files for ${moduleName}@${toDownload}. Is it possibly a typo?`,
    }
  }

  return res
}

interface Logger {
  log: (...args: any[]) => void
  error: (...args: any[]) => void
  groupCollapsed: (...args: any[]) => void
  groupEnd: (...args: any[]) => void
}
