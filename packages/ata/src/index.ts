import {
  getDTSFileForModuleWithVersion,
  getFiletreeForModuleWithVersion,
  getNPMVersionForModuleReference,
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
    /** A callback indicating that ATA actually has work to do */
    started?: () => void
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

type ModuleMeta = { state: "loading" }

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

  let estimatedToDownload = 0
  let estimatedDownloaded = 0

  return (initialSourceFile: string) => {
    estimatedToDownload = 0
    estimatedDownloaded = 0

    return resolveDeps(initialSourceFile, 0).then(t => {
      if (estimatedDownloaded > 0) {
        config.delegate.finished?.(fsMap)
      }
    })
  }

  async function resolveDeps(initialSourceFile: string, depth: number) {
    const depsToGet = getNewDependencies(config, moduleMap, initialSourceFile)

    // Make it so it won't get re-downloaded
    depsToGet.forEach(dep => moduleMap.set(dep.module, { state: "loading" }))

    // Grab the module trees which gives us a list of files to download
    const trees = await Promise.all(depsToGet.map(f => getFileTreeForModuleWithTag(config, f.module, f.version)))
    const treesOnly = trees.filter(t => !("error" in t)) as NPMTreeMeta[]

    // These are the modules which we can grab directly
    const hasDTS = treesOnly.filter(t => t.files.find(f => isDtsFile(f.name)))
    const dtsFilesFromNPM = hasDTS.map(t => treeToDTSFiles(t, `/node_modules/${t.moduleName}`))

    // These are ones we need to look on DT for (which may not be there, who knows)
    const mightBeOnDT = treesOnly.filter(t => !hasDTS.includes(t))
    const dtTrees = await Promise.all(
      // TODO: Switch from 'latest' to the version from the original tree which is user-controlled
      mightBeOnDT.map(f => getFileTreeForModuleWithTag(config, `@types/${getDTName(f.moduleName)}`, "latest"))
    )

    const dtTreesOnly = dtTrees.filter(t => !("error" in t)) as NPMTreeMeta[]
    const dtsFilesFromDT = dtTreesOnly.map(t => treeToDTSFiles(t, `/node_modules/@types/${getDTName(t.moduleName).replace("types__", "")}`))

    // Collect all the npm and DT DTS requests and flatten their arrays
    const allDTSFiles = dtsFilesFromNPM.concat(dtsFilesFromDT).reduce((p, c) => p.concat(c), [])
    estimatedToDownload += allDTSFiles.length
    if (allDTSFiles.length && depth === 0) {
      config.delegate.started?.()
    }

    // Grab the package.jsons for each dependency
    for (const tree of treesOnly) {
      let prefix = `/node_modules/${tree.moduleName}`
      if (dtTreesOnly.includes(tree)) prefix = `/node_modules/@types/${getDTName(tree.moduleName).replace("types__", "")}`
      const path = prefix + "/package.json"
      const pkgJSON = await getDTSFileForModuleWithVersion(config, tree.moduleName, tree.version, "/package.json")

      if (typeof pkgJSON == "string") {
        fsMap.set(path, pkgJSON)
        config.delegate.receivedFile?.(pkgJSON, path)
      } else {
        config.logger?.error(`Could not download package.json for ${tree.moduleName}`)
      }
    }

    // Grab all dts files
    await Promise.all(
      allDTSFiles.map(async dts => {
        const dtsCode = await getDTSFileForModuleWithVersion(config, dts.moduleName, dts.moduleVersion, dts.path)
        estimatedDownloaded++
        if (dtsCode instanceof Error) {
          // TODO?
          config.logger?.error(`Had an issue getting ${dts.path} for ${dts.moduleName}`)
        } else {
          fsMap.set(dts.vfsPath, dtsCode)
          config.delegate.receivedFile?.(dtsCode, dts.vfsPath)

          // Send a progress note every 5 downloads
          if (config.delegate.progress && estimatedDownloaded % 5 === 0) {
            config.delegate.progress(estimatedDownloaded, estimatedToDownload)
          }

          // Recurse through deps
          await resolveDeps(dtsCode, depth + 1)
        }
      })
    )
  }
}

type ATADownload = {
  moduleName: string
  moduleVersion: string
  vfsPath: string
  path: string
}

function treeToDTSFiles(tree: NPMTreeMeta, vfsPrefix: string) {
  const dtsRefs: ATADownload[] = []

  for (const file of tree.files) {
    if (isDtsFile(file.name)) {
      dtsRefs.push({
        moduleName: tree.moduleName,
        moduleVersion: tree.version,
        vfsPath: `${vfsPrefix}${file.name}`,
        path: file.name,
      })
    }
  }
  return dtsRefs
}

/**
 * Pull out any potential references to other modules (including relatives) with their
 * npm versioning strat too if someone opts into a different version via an inline end of line comment
 */
export const getReferencesForModule = (ts: typeof import("typescript"), code: string) => {
  const meta = ts.preProcessFile(code)

  // Ensure we don't try download TypeScript lib references
  // @ts-ignore - private but likely to never change
  const libMap: Map<string, string> = ts.libMap || new Map()

  // TODO: strip /// <reference path='X' />?

  const references = meta.referencedFiles
    .concat(meta.importedFiles)
    .concat(meta.libReferenceDirectives)
    .filter(f => !isDtsFile(f.fileName))
    .filter(d => !libMap.has(d.fileName))

  return references
    .map(r => {
      let version = undefined
      if (!r.fileName.startsWith(".")) {
        version = "latest"
        const line = code.slice(r.end).split("\n")[0]!
        if (line.includes("// types:")) version = line.split("// types: ")[1]!.trim()
      }

      return {
        module: r.fileName,
        version,
      }
    })
    .filter((r, index, self) => self.findIndex(m => m.module === r.module && m.version === r.version) === index)
}

/** A list of modules from the current sourcefile which we don't have existing files for */
export function getNewDependencies(config: ATABootstrapConfig, moduleMap: Map<string, ModuleMeta>, code: string) {
  const refs = getReferencesForModule(config.typescript, code).map(ref => ({
    ...ref,
    module: mapModuleNameToModule(ref.module),
  }))

  // Drop relative paths because we're getting all the files
  const modules = refs.filter(f => !f.module.startsWith(".")).filter(m => !moduleMap.has(m.module))
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
    const response = await getNPMVersionForModuleReference(config, moduleName, toDownload)
    if (response instanceof Error) {
      return {
        error: response,
        userFacingMessage: `Could not go from a tag to version on npm for ${moduleName} - possible typo?`,
      }
    }

    const neededVersion = response.version
    if (!neededVersion) {
      const versions = await getNPMVersionsForModule(config, moduleName)
      if (versions instanceof Error) {
        return {
          error: response,
          userFacingMessage: `Could not get versions on npm for ${moduleName} - possible typo?`,
        }
      }

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

// Taken from dts-gen: https://github.com/microsoft/dts-gen/blob/master/lib/names.ts
function getDTName(s: string) {
  if (s.indexOf("@") === 0 && s.indexOf("/") !== -1) {
    // we have a scoped module, e.g. @bla/foo
    // which should be converted to   bla__foo
    s = s.substr(1).replace("/", "__")
  }
  return s
}

function isDtsFile(file: string) {
  return /\.d\.([^\.]+\.)?[cm]?ts$/i.test(file)
}
