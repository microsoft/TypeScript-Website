/**
 * Type Defs we've already got, and nulls when something has failed.
 * This is to make sure that it doesn't infinite loop.
 */
export const acquiredTypeDefs: { [name: string]: string | null } = {}

export type AddLibToRuntimeFunc = (code: string, path: string) => void

/**
 * Pseudo in-browser type acquisition
 *
 * @param sourceCode the root source code to look at
 * @param addLibraryToRuntime
 */

export const detectNewImportsToAcquireTypeFor = async (
  sourceCode: string,
  addLibraryToRuntime: AddLibToRuntimeFunc
) => {
  const getTypeDependenciesForSourceCode = async (
    sourceCode: string,
    mod: string | undefined,
    path: string | undefined
  ) => {
    // TODO: debounce
    //
    // TODO: This needs to be replaced by the AST - it still works in comments
    // blocked by https://github.com/microsoft/monaco-typescript/pull/38
    //
    // https://regex101.com/r/Jxa3KX/4
    const requirePattern = /(const|let|var)(.|\n)*? require\(('|")(.*)('|")\);?$/
    //  https://regex101.com/r/hdEpzO/4
    const es6Pattern = /(import|export)((?!from)(?!require)(.|\n))*?(from|require\()\s?('|")(.*)('|")\)?;?$/gm

    const foundModules = new Set<string>()
    var match

    while ((match = es6Pattern.exec(sourceCode)) !== null) {
      if (match[6]) foundModules.add(match[6])
    }

    while ((match = requirePattern.exec(sourceCode)) !== null) {
      if (match[5]) foundModules.add(match[5])
    }

    const moduleJSONURL = (name: string) =>
      `https://ofcncog2cu-dsn.algolia.net/1/indexes/npm-search/${name}?attributes=types&x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.27.1&x-algolia-application-id=OFCNCOG2CU&x-algolia-api-key=f54e21fa3a2a0160595bb058179bfb1e`
    const unpkgURL = (name: string, path: string) =>
      `https://www.unpkg.com/${encodeURIComponent(name)}/${encodeURIComponent(path)}`
    const packageJSONURL = (name: string) => unpkgURL(name, 'package.json')
    const errorMsg = (msg: string, response: any) => {
      console.error(`${msg} - will not try again in this session`, response.status, response.statusText, response)
      debugger
    }

    //  const addLibraryToRuntime = (code:string, path:string) => {
    //    const defaults = monacoLanguageDefaults({ isJS: path.endsWith("js") })
    //    defaults.addExtraLib(code, path);
    //    console.log(`Adding ${path} to runtime`)
    //  }

    const getReferenceDependencies = async (sourceCode: string, mod: string, path: string) => {
      if (sourceCode.indexOf('reference path') > 0) {
        // https://regex101.com/r/DaOegw/1
        const referencePathExtractionPattern = /<reference path="(.*)" \/>/gm
        while ((match = referencePathExtractionPattern.exec(sourceCode)) !== null) {
          const relativePath = match[1]
          if (relativePath) {
            let newPath = mapRelativePath(mod, relativePath, path)
            if (newPath) {
              const dtsRefURL = unpkgURL(mod, newPath)
              const dtsReferenceResponse = await fetch(dtsRefURL)
              if (!dtsReferenceResponse.ok) {
                return errorMsg(
                  `Could not get ${newPath} for a reference link in the module '${mod}' from ${path}`,
                  dtsReferenceResponse
                )
              }

              let dtsReferenceResponseText = await dtsReferenceResponse.text()
              if (!dtsReferenceResponseText) {
                return errorMsg(
                  `Could not get ${newPath} for a reference link for the module '${mod}' from ${path}`,
                  dtsReferenceResponse
                )
              }

              await getTypeDependenciesForSourceCode(dtsReferenceResponseText, mod, newPath)
              const representationalPath = `node_modules/${mod}/${newPath}`
              addLibraryToRuntime(dtsReferenceResponseText, representationalPath)
            }
          }
        }
      }
    }

    /**
     * Takes an initial module and the path for the root of the typings and grab it and start grabbing its
     * dependencies then add those the to runtime.
     *
     * @param {string} mod The module name
     * @param {string} path  The path to the root def type
     */
    const addModuleToRuntime = async (mod: string, path: string) => {
      const isDeno = path && path.indexOf('https://') === 0

      const dtsFileURL = isDeno ? path : unpkgURL(mod, path)
      const dtsResponse = await fetch(dtsFileURL)
      if (!dtsResponse.ok) {
        return errorMsg(`Could not get root d.ts file for the module '${mod}' at ${path}`, dtsResponse)
      }

      // TODO: handle checking for a resolve to index.d.ts whens someone imports the folder
      let content = await dtsResponse.text()
      if (!content) {
        return errorMsg(`Could not get root d.ts file for the module '${mod}' at ${path}`, dtsResponse)
      }

      // Now look and grab dependent modules where you need the
      //
      await getTypeDependenciesForSourceCode(content, mod, path)

      if (isDeno) {
        const wrapped = `declare module "${path}" { ${content} }`
        addLibraryToRuntime(wrapped, path)
      } else {
        const typelessModule = mod.split('@types/').slice(-1)
        const wrapped = `declare module "${typelessModule}" { ${content} }`
        addLibraryToRuntime(wrapped, `node_modules/${mod}/${path}`)
      }
    }

    /**
     * Takes a module import, then uses both the algolia API and the the package.json to derive
     * the root type def path.
     *
     * @param {string} packageName
     * @returns {Promise<{ mod: string, path: string, packageJSON: any }>}
     */
    const getModuleAndRootDefTypePath = async (packageName: string) => {
      // For modules
      const url = moduleJSONURL(packageName)

      const response = await fetch(url)
      if (!response.ok) {
        return errorMsg(`Could not get Algolia JSON for the module '${packageName}'`, response)
      }

      const responseJSON = await response.json()
      if (!responseJSON) {
        return errorMsg(`Could not get Algolia JSON for the module '${packageName}'`, response)
      }

      if (!responseJSON.types) {
        return console.log(`There were no types for '${packageName}' - will not try again in this session`)
      }

      if (!responseJSON.types.ts) {
        return console.log(`There were no types for '${packageName}' - will not try again in this session`)
      }

      acquiredTypeDefs[packageName] = responseJSON

      if (responseJSON.types.ts === 'included') {
        const modPackageURL = packageJSONURL(packageName)

        const response = await fetch(modPackageURL)
        if (!response.ok) {
          return errorMsg(`Could not get Package JSON for the module '${packageName}'`, response)
        }

        const responseJSON = await response.json()
        if (!responseJSON) {
          return errorMsg(`Could not get Package JSON for the module '${packageName}'`, response)
        }

        // Get the path of the root d.ts file

        // non-inferred route
        let rootTypePath = responseJSON.typing || responseJSON.typings || responseJSON.types

        // package main is custom
        if (!rootTypePath && typeof responseJSON.main === 'string' && responseJSON.main.indexOf('.js') > 0) {
          rootTypePath = responseJSON.main.replace(/js$/, 'd.ts')
        }

        // Final fallback, to have got here it must have passed in algolia
        if (!rootTypePath) {
          rootTypePath = 'index.d.ts'
        }

        return { mod: packageName, path: rootTypePath, packageJSON: responseJSON }
      } else if (responseJSON.types.ts === 'definitely-typed') {
        return { mod: responseJSON.types.definitelyTyped, path: 'index.d.ts', packageJSON: responseJSON }
      } else {
        throw "This shouldn't happen"
      }
    }

    const mapModuleNameToModule = (name: string) => {
      // in node repl:
      // > require("module").builtinModules
      const builtInNodeMods = [
        'assert',
        'async_hooks',
        'base',
        'buffer',
        'child_process',
        'cluster',
        'console',
        'constants',
        'crypto',
        'dgram',
        'dns',
        'domain',
        'events',
        'fs',
        'globals',
        'http',
        'http2',
        'https',
        'index',
        'inspector',
        'module',
        'net',
        'os',
        'path',
        'perf_hooks',
        'process',
        'punycode',
        'querystring',
        'readline',
        'repl',
        'stream',
        'string_decoder',
        'timers',
        'tls',
        'trace_events',
        'tty',
        'url',
        'util',
        'v8',
        'vm',
        'worker_threads',
        'zlib',
      ]
      if (builtInNodeMods.includes(name)) {
        return 'node'
      }
      return name
    }

    //** A really dumb version of path.resolve */
    const mapRelativePath = (_outerModule: string, moduleDeclaration: string, currentPath: string) => {
      // https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
      function absolute(base: string, relative: string) {
        if (!base) return relative

        const stack = base.split('/')
        const parts = relative.split('/')
        stack.pop() // remove current file name (or empty string)

        for (var i = 0; i < parts.length; i++) {
          if (parts[i] == '.') continue
          if (parts[i] == '..') stack.pop()
          else stack.push(parts[i])
        }
        return stack.join('/')
      }

      return absolute(currentPath, moduleDeclaration)
    }

    const convertToModuleReferenceID = (outerModule: string, moduleDeclaration: string, currentPath: string) => {
      const modIsScopedPackageOnly = moduleDeclaration.indexOf('@') === 0 && moduleDeclaration.split('/').length === 2
      const modIsPackageOnly = moduleDeclaration.indexOf('@') === -1 && moduleDeclaration.split('/').length === 1
      const isPackageRootImport = modIsPackageOnly || modIsScopedPackageOnly

      if (isPackageRootImport) {
        return moduleDeclaration
      } else {
        return `${outerModule}-${mapRelativePath(outerModule, moduleDeclaration, currentPath)}`
      }
    }

    /** @type {string[]} */
    const filteredModulesToLookAt = Array.from(foundModules)

    filteredModulesToLookAt.forEach(async name => {
      // Support grabbing the hard-coded node modules if needed
      const moduleToDownload = mapModuleNameToModule(name)

      if (!mod && moduleToDownload.startsWith('.')) {
        return console.log("Can't resolve local relative dependencies")
      }

      const moduleID = convertToModuleReferenceID(mod!, moduleToDownload, path!)
      if (acquiredTypeDefs[moduleID] || acquiredTypeDefs[moduleID] === null) {
        return
      }

      const modIsScopedPackageOnly = moduleToDownload.indexOf('@') === 0 && moduleToDownload.split('/').length === 2
      const modIsPackageOnly = moduleToDownload.indexOf('@') === -1 && moduleToDownload.split('/').length === 1
      const isPackageRootImport = modIsPackageOnly || modIsScopedPackageOnly
      const isDenoModule = moduleToDownload.indexOf('https://') === 0

      if (isPackageRootImport) {
        // So it doesn't run twice for a package
        acquiredTypeDefs[moduleID] = null

        // E.g. import danger from "danger"
        const packageDef = await getModuleAndRootDefTypePath(moduleToDownload)

        if (packageDef) {
          acquiredTypeDefs[moduleID] = packageDef.packageJSON
          await addModuleToRuntime(packageDef.mod, packageDef.path)
        }
      } else if (isDenoModule) {
        // E.g. import { serve } from "https://deno.land/std@v0.12/http/server.ts";
        await addModuleToRuntime(moduleToDownload, moduleToDownload)
      } else {
        // E.g. import {Component} from "./MyThing"
        if (!moduleToDownload || !path) throw `No outer module or path for a relative import: ${moduleToDownload}`

        const absolutePathForModule = mapRelativePath(mod!, moduleToDownload, path)
        // So it doesn't run twice for a package
        acquiredTypeDefs[moduleID] = null
        const resolvedFilepath = absolutePathForModule.endsWith('.ts')
          ? absolutePathForModule
          : absolutePathForModule + '.d.ts'
        await addModuleToRuntime(mod!, resolvedFilepath)
      }
    })
    getReferenceDependencies(sourceCode, mod!, path!)
  }

  // Start diving into the root
  getTypeDependenciesForSourceCode(sourceCode, undefined, undefined)
}
