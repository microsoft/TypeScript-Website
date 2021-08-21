import { SandboxConfig } from "./"
import lzstring from "./vendor/lzstring.min"

const globalishObj: any = typeof globalThis !== "undefined" ? globalThis : window || {}
globalishObj.typeDefinitions = {}

/**
 * Type Defs we've already got, and nulls when something has failed.
 * This is to make sure that it doesn't infinite loop.
 */
export const acquiredTypeDefs: { [name: string]: string | null } = globalishObj.typeDefinitions

export type AddLibToRuntimeFunc = (code: string, path: string) => void

const moduleJSONURL = (name: string) =>
  // prettier-ignore
  `https://ofcncog2cu-dsn.algolia.net/1/indexes/npm-search/${encodeURIComponent(name)}?attributes=types&x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.27.1&x-algolia-application-id=OFCNCOG2CU&x-algolia-api-key=f54e21fa3a2a0160595bb058179bfb1e`

const unpkgURL = (name: string, path: string) => {
  if (!name) {
    const actualName = path.substring(0, path.indexOf("/"))
    const actualPath = path.substring(path.indexOf("/") + 1)
    return `https://www.unpkg.com/${encodeURIComponent(actualName)}/${encodeURIComponent(actualPath)}`
  }
  return `https://www.unpkg.com/${encodeURIComponent(name)}/${encodeURIComponent(path)}`
}

const packageJSONURL = (name: string) => unpkgURL(name, "package.json")

const errorMsg = (msg: string, response: any, config: ATAConfig) => {
  config.logger.error(`${msg} - will not try again in this session`, response.status, response.statusText, response)
}

/**
 * Grab any import/requires from inside the code and make a list of
 * its dependencies
 */
const parseFileForModuleReferences = (sourceCode: string) => {
  // https://regex101.com/r/Jxa3KX/4
  const requirePattern = /(const|let|var)(.|\n)*? require\(('|")(.*)('|")\);?$/gm
  // this handle ths 'from' imports  https://regex101.com/r/hdEpzO/4
  const es6Pattern = /(import|export)((?!from)(?!require)(.|\n))*?(from|require\()\s?('|")(.*)('|")\)?;?$/gm
  // https://regex101.com/r/hdEpzO/8
  const es6ImportOnly = /import\s+?\(?('|")(.*)('|")\)?;?/gm

  const foundModules = new Set<string>()
  var match

  while ((match = es6Pattern.exec(sourceCode)) !== null) {
    if (match[6]) foundModules.add(match[6])
  }

  while ((match = requirePattern.exec(sourceCode)) !== null) {
    if (match[5]) foundModules.add(match[5])
  }

  while ((match = es6ImportOnly.exec(sourceCode)) !== null) {
    if (match[2]) foundModules.add(match[2])
  }

  return Array.from(foundModules)
}

/** Converts some of the known global imports to node so that we grab the right info */
const mapModuleNameToModule = (name: string) => {
  // in node repl:
  // > require("module").builtinModules
  const builtInNodeMods = [
    "assert",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "constants",
    "crypto",
    "dgram",
    "dns",
    "domain",
    "events",
    "fs",
    "fs/promises",
    "http",
    "http2",
    "https",
    "inspector",
    "module",
    "net",
    "os",
    "path",
    "perf_hooks",
    "process",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "stream",
    "string_decoder",
    "sys",
    "timers",
    "tls",
    "trace_events",
    "tty",
    "url",
    "util",
    "v8",
    "vm",
    "wasi",
    "worker_threads",
    "zlib",
  ]

  if (builtInNodeMods.includes(name)) {
    return "node"
  }
  return name
}

//** A really simple version of path.resolve */
const mapRelativePath = (moduleDeclaration: string, currentPath: string) => {
  // https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
  function absolute(base: string, relative: string) {
    if (!base) return relative

    const stack = base.split("/")
    const parts = relative.split("/")
    stack.pop() // remove current file name (or empty string)

    for (var i = 0; i < parts.length; i++) {
      if (parts[i] == ".") continue
      if (parts[i] == "..") stack.pop()
      else stack.push(parts[i])
    }
    return stack.join("/")
  }

  return absolute(currentPath, moduleDeclaration)
}

const convertToModuleReferenceID = (outerModule: string, moduleDeclaration: string, currentPath: string) => {
  const modIsScopedPackageOnly = moduleDeclaration.indexOf("@") === 0 && moduleDeclaration.split("/").length === 2
  const modIsPackageOnly = moduleDeclaration.indexOf("@") === -1 && moduleDeclaration.split("/").length === 1
  const isPackageRootImport = modIsPackageOnly || modIsScopedPackageOnly

  if (isPackageRootImport) {
    return moduleDeclaration
  } else {
    return `${outerModule}-${mapRelativePath(moduleDeclaration, currentPath)}`
  }
}

/**
 * Takes an initial module and the path for the root of the typings and grab it and start grabbing its
 * dependencies then add those the to runtime.
 */
const addModuleToRuntime = async (mod: string, path: string, config: ATAConfig) => {
  const isDeno = path && path.indexOf("https://") === 0

  let actualMod = mod
  let actualPath = path

  if (!mod) {
    actualMod = path.substring(0, path.indexOf("/"))
    actualPath = path.substring(path.indexOf("/") + 1)
  }

  const dtsFileURL = isDeno ? path : unpkgURL(actualMod, actualPath)

  let content = await getCachedDTSString(config, dtsFileURL)
  if (!content) {
    const isDeno = actualPath && actualPath.indexOf("https://") === 0
    const indexPath = `${actualPath.replace(".d.ts", "")}/index.d.ts`

    const dtsFileURL = isDeno ? actualPath : unpkgURL(actualMod, indexPath)
    content = await getCachedDTSString(config, dtsFileURL)

    if (!content) {
      return errorMsg(`Could not get root d.ts file for the module '${actualMod}' at ${actualPath}`, {}, config)
    }

    if (!isDeno) {
      actualPath = indexPath
    }
  }

  // Now look and grab dependent modules where you need the
  await getDependenciesForModule(content, actualMod, actualPath, config)

  if (isDeno) {
    const wrapped = `declare module "${actualPath}" { ${content} }`
    config.addLibraryToRuntime(wrapped, actualPath)
  } else {
    config.addLibraryToRuntime(content, `file:///node_modules/${actualMod}/${actualPath}`)
  }
}

/**
 * Takes a module import, then uses both the algolia API and the the package.json to derive
 * the root type def path.
 *
 * @param {string} packageName
 * @returns {Promise<{ mod: string, path: string, packageJSON: any }>}
 */
const getModuleAndRootDefTypePath = async (packageName: string, config: ATAConfig) => {
  const url = moduleJSONURL(packageName)

  const response = await config.fetcher(url)
  if (!response.ok) {
    return errorMsg(`Could not get Algolia JSON for the module '${packageName}'`, response, config)
  }

  const responseJSON = await response.json()
  if (!responseJSON) {
    return errorMsg(`Could not get the Algolia JSON was un-parsable for the module '${packageName}'`, response, config)
  }

  if (!responseJSON.types) {
    return config.logger.log(`There were no types for '${packageName}' - will not try again in this session`)
  }
  if (!responseJSON.types.ts) {
    return config.logger.log(`There were no types for '${packageName}' - will not try again in this session`)
  }

  acquiredTypeDefs[packageName] = responseJSON

  if (responseJSON.types.ts === "included") {
    const modPackageURL = packageJSONURL(packageName)

    const response = await config.fetcher(modPackageURL)
    if (!response.ok) {
      return errorMsg(`Could not get Package JSON for the module '${packageName}'`, response, config)
    }

    const responseJSON = await response.json()
    if (!responseJSON) {
      return errorMsg(`Could not get Package JSON for the module '${packageName}'`, response, config)
    }

    config.addLibraryToRuntime(
      JSON.stringify(responseJSON, null, "  "),
      `file:///node_modules/${packageName}/package.json`
    )

    // Get the path of the root d.ts file

    // non-inferred route
    let rootTypePath = responseJSON.typing || responseJSON.typings || responseJSON.types

    // package main is custom
    if (!rootTypePath && typeof responseJSON.main === "string" && responseJSON.main.indexOf(".js") > 0) {
      rootTypePath = responseJSON.main.replace(/js$/, "d.ts")
    }

    // Final fallback, to have got here it must have passed in algolia
    if (!rootTypePath) {
      rootTypePath = "index.d.ts"
    }

    return { mod: packageName, path: rootTypePath, packageJSON: responseJSON }
  } else if (responseJSON.types.ts === "definitely-typed") {
    return { mod: responseJSON.types.definitelyTyped, path: "index.d.ts", packageJSON: responseJSON }
  } else {
    throw "This shouldn't happen"
  }
}

const getCachedDTSString = async (config: ATAConfig, url: string) => {
  const cached = localStorage.getItem(url)
  if (cached) {
    const [dateString, text] = cached.split("-=-^-=-")
    const cachedDate = new Date(dateString)
    const now = new Date()

    const cacheTimeout = 604800000 // 1 week
    // const cacheTimeout = 60000 // 1 min

    if (now.getTime() - cachedDate.getTime() < cacheTimeout) {
      return lzstring.decompressFromUTF16(text)
    } else {
      config.logger.log("Skipping cache for ", url)
    }
  }

  const response = await config.fetcher(url)
  if (!response.ok) {
    return errorMsg(`Could not get DTS response for the module at ${url}`, response, config)
  }

  // TODO: handle checking for a resolve to index.d.ts whens someone imports the folder
  let content = await response.text()
  if (!content) {
    return errorMsg(`Could not get text for DTS response at ${url}`, response, config)
  }

  const now = new Date()
  const cacheContent = `${now.toISOString()}-=-^-=-${lzstring.compressToUTF16(content)}`
  localStorage.setItem(url, cacheContent)
  return content
}

const getReferenceDependencies = async (sourceCode: string, mod: string, path: string, config: ATAConfig) => {
  var match
  if (sourceCode.indexOf("reference path") > 0) {
    // https://regex101.com/r/DaOegw/1
    const referencePathExtractionPattern = /<reference path="(.*)" \/>/gm
    while ((match = referencePathExtractionPattern.exec(sourceCode)) !== null) {
      const relativePath = match[1]
      if (relativePath) {
        let newPath = mapRelativePath(relativePath, path)
        if (newPath) {
          const dtsRefURL = unpkgURL(mod, newPath)

          const dtsReferenceResponseText = await getCachedDTSString(config, dtsRefURL)
          if (!dtsReferenceResponseText) {
            return errorMsg(`Could not get root d.ts file for the module '${mod}' at ${path}`, {}, config)
          }

          await getDependenciesForModule(dtsReferenceResponseText, mod, newPath, config)
          const representationalPath = `file:///node_modules/${mod}/${newPath}`
          config.addLibraryToRuntime(dtsReferenceResponseText, representationalPath)
        }
      }
    }
  }
}

interface ATAConfig {
  sourceCode: string
  addLibraryToRuntime: AddLibToRuntimeFunc
  fetcher: typeof fetch
  logger: SandboxConfig["logger"]
}

/**
 * Pseudo in-browser type acquisition tool, uses a
 */
export const detectNewImportsToAcquireTypeFor = async (
  sourceCode: string,
  userAddLibraryToRuntime: AddLibToRuntimeFunc,
  fetcher = fetch,
  playgroundConfig: SandboxConfig
) => {
  // Wrap the runtime func with our own side-effect for visibility
  const addLibraryToRuntime = (code: string, path: string) => {
    globalishObj.typeDefinitions[path] = code
    userAddLibraryToRuntime(code, path)
  }

  // Basically start the recursion with an undefined module
  const config: ATAConfig = { sourceCode, addLibraryToRuntime, fetcher, logger: playgroundConfig.logger }
  const results = getDependenciesForModule(sourceCode, undefined, "playground.ts", config)
  return results
}

/**
 * Looks at a JS/DTS file and recurses through all the dependencies.
 * It avoids
 */
const getDependenciesForModule = (
  sourceCode: string,
  moduleName: string | undefined,
  path: string,
  config: ATAConfig
) => {
  // Get all the import/requires for the file
  const filteredModulesToLookAt = parseFileForModuleReferences(sourceCode)
  filteredModulesToLookAt.forEach(async name => {
    // Support grabbing the hard-coded node modules if needed
    const moduleToDownload = mapModuleNameToModule(name)

    if (!moduleName && moduleToDownload.startsWith(".")) {
      return config.logger.log("[ATA] Can't resolve relative dependencies from the playground root")
    }

    const moduleID = convertToModuleReferenceID(moduleName!, moduleToDownload, moduleName!)
    if (acquiredTypeDefs[moduleID] || acquiredTypeDefs[moduleID] === null) {
      return
    }

    config.logger.log(`[ATA] Looking at ${moduleToDownload}`)

    const modIsScopedPackageOnly = moduleToDownload.indexOf("@") === 0 && moduleToDownload.split("/").length === 2
    const modIsPackageOnly = moduleToDownload.indexOf("@") === -1 && moduleToDownload.split("/").length === 1
    const isPackageRootImport = modIsPackageOnly || modIsScopedPackageOnly
    const isDenoModule = moduleToDownload.indexOf("https://") === 0

    if (isPackageRootImport) {
      // So it doesn't run twice for a package
      acquiredTypeDefs[moduleID] = null

      // E.g. import danger from "danger"
      const packageDef = await getModuleAndRootDefTypePath(moduleToDownload, config)

      if (packageDef) {
        acquiredTypeDefs[moduleID] = packageDef.packageJSON
        await addModuleToRuntime(packageDef.mod, packageDef.path, config)
      }
    } else if (isDenoModule) {
      // E.g. import { serve } from "https://deno.land/std@v0.12/http/server.ts";
      await addModuleToRuntime(moduleToDownload, moduleToDownload, config)
    } else {
      // E.g. import {Component} from "./MyThing"
      if (!moduleToDownload || !path) throw `No outer module or path for a relative import: ${moduleToDownload}`

      const absolutePathForModule = mapRelativePath(moduleToDownload, path)

      // So it doesn't run twice for a package
      acquiredTypeDefs[moduleID] = null

      const resolvedFilepath = absolutePathForModule.endsWith(".ts")
        ? absolutePathForModule
        : absolutePathForModule + ".d.ts"

      await addModuleToRuntime(moduleName!, resolvedFilepath, config)
    }
  })

  // Also support the
  getReferenceDependencies(sourceCode, moduleName!, path!, config)
}
