type System = import("typescript").System
type CompilerOptions = import("typescript").CompilerOptions
type CustomTransformers = import("typescript").CustomTransformers
type LanguageServiceHost = import("typescript").LanguageServiceHost
type CompilerHost = import("typescript").CompilerHost
type SourceFile = import("typescript").SourceFile
type TS = typeof import("typescript")

let hasLocalStorage = false
try {
  hasLocalStorage = typeof localStorage !== `undefined`
} catch (error) { }

const hasProcess = typeof process !== `undefined`
const shouldDebug = (hasLocalStorage && localStorage.getItem("DEBUG")) || (hasProcess && process.env.DEBUG)
const debugLog = shouldDebug ? console.log : (_message?: any, ..._optionalParams: any[]) => ""

export interface VirtualTypeScriptEnvironment {
  sys: System
  languageService: import("typescript").LanguageService
  getSourceFile: (fileName: string) => import("typescript").SourceFile | undefined
  createFile: (fileName: string, content: string) => void
  updateFile: (fileName: string, content: string, replaceTextSpan?: import("typescript").TextSpan) => void
}

/**
 * Makes a virtual copy of the TypeScript environment. This is the main API you want to be using with
 * @typescript/vfs. A lot of the other exposed functions are used by this function to get set up.
 *
 * @param sys an object which conforms to the TS Sys (a shim over read/write access to the fs)
 * @param rootFiles a list of files which are considered inside the project
 * @param ts a copy pf the TypeScript module
 * @param compilerOptions the options for this compiler run
 * @param customTransformers custom transformers for this compiler run
 */

export function createVirtualTypeScriptEnvironment(
  sys: System,
  rootFiles: string[],
  ts: TS,
  compilerOptions: CompilerOptions = {},
  customTransformers?: CustomTransformers
): VirtualTypeScriptEnvironment {
  const mergedCompilerOpts = { ...defaultCompilerOptions(ts), ...compilerOptions }

  const { languageServiceHost, updateFile } = createVirtualLanguageServiceHost(
    sys,
    rootFiles,
    mergedCompilerOpts,
    ts,
    customTransformers
  )
  const languageService = ts.createLanguageService(languageServiceHost)
  const diagnostics = languageService.getCompilerOptionsDiagnostics()

  if (diagnostics.length) {
    const compilerHost = createVirtualCompilerHost(sys, compilerOptions, ts)
    throw new Error(ts.formatDiagnostics(diagnostics, compilerHost.compilerHost))
  }

  return {
    // @ts-ignore
    name: "vfs",
    sys,
    languageService,
    getSourceFile: fileName => languageService.getProgram()?.getSourceFile(fileName),

    createFile: (fileName, content) => {
      updateFile(ts.createSourceFile(fileName, content, mergedCompilerOpts.target!, false))
    },
    updateFile: (fileName, content, optPrevTextSpan) => {
      const prevSourceFile = languageService.getProgram()!.getSourceFile(fileName)
      if (!prevSourceFile) {
        throw new Error("Did not find a source file for " + fileName)
      }
      const prevFullContents = prevSourceFile.text

      // TODO: Validate if the default text span has a fencepost error?
      const prevTextSpan = optPrevTextSpan ?? ts.createTextSpan(0, prevFullContents.length)
      const newText =
        prevFullContents.slice(0, prevTextSpan.start) +
        content +
        prevFullContents.slice(prevTextSpan.start + prevTextSpan.length)
      const newSourceFile = ts.updateSourceFile(prevSourceFile, newText, {
        span: prevTextSpan,
        newLength: content.length,
      })

      updateFile(newSourceFile)
    },
  }
}

/**
 * Grab the list of lib files for a particular target, will return a bit more than necessary (by including
 * the dom) but that's OK
 *
 * @param target The compiler settings target baseline
 * @param ts A copy of the TypeScript module
 */
export const knownLibFilesForCompilerOptions = (compilerOptions: CompilerOptions, ts: TS) => {
  const target = compilerOptions.target || ts.ScriptTarget.ES5
  const lib = compilerOptions.lib || []

  const files = [
    "lib.d.ts",
    "lib.dom.d.ts",
    "lib.dom.iterable.d.ts",
    "lib.webworker.d.ts",
    "lib.webworker.importscripts.d.ts",
    "lib.scripthost.d.ts",
    "lib.es5.d.ts",
    "lib.es6.d.ts",
    "lib.es2015.collection.d.ts",
    "lib.es2015.core.d.ts",
    "lib.es2015.d.ts",
    "lib.es2015.generator.d.ts",
    "lib.es2015.iterable.d.ts",
    "lib.es2015.promise.d.ts",
    "lib.es2015.proxy.d.ts",
    "lib.es2015.reflect.d.ts",
    "lib.es2015.symbol.d.ts",
    "lib.es2015.symbol.wellknown.d.ts",
    "lib.es2016.array.include.d.ts",
    "lib.es2016.d.ts",
    "lib.es2016.full.d.ts",
    "lib.es2017.d.ts",
    "lib.es2017.full.d.ts",
    "lib.es2017.intl.d.ts",
    "lib.es2017.object.d.ts",
    "lib.es2017.sharedmemory.d.ts",
    "lib.es2017.string.d.ts",
    "lib.es2017.typedarrays.d.ts",
    "lib.es2018.asyncgenerator.d.ts",
    "lib.es2018.asynciterable.d.ts",
    "lib.es2018.d.ts",
    "lib.es2018.full.d.ts",
    "lib.es2018.intl.d.ts",
    "lib.es2018.promise.d.ts",
    "lib.es2018.regexp.d.ts",
    "lib.es2019.array.d.ts",
    "lib.es2019.d.ts",
    "lib.es2019.full.d.ts",
    "lib.es2019.object.d.ts",
    "lib.es2019.string.d.ts",
    "lib.es2019.symbol.d.ts",
    "lib.es2020.d.ts",
    "lib.es2020.full.d.ts",
    "lib.es2020.string.d.ts",
    "lib.es2020.symbol.wellknown.d.ts",
    "lib.es2020.bigint.d.ts",
    "lib.es2020.promise.d.ts",
    "lib.es2020.sharedmemory.d.ts",
    "lib.es2020.intl.d.ts",
    "lib.es2021.d.ts",
    "lib.es2021.full.d.ts",
    "lib.es2021.promise.d.ts",
    "lib.es2021.string.d.ts",
    "lib.es2021.weakref.d.ts",
    "lib.esnext.d.ts",
    "lib.esnext.full.d.ts",
    "lib.esnext.intl.d.ts",
    "lib.esnext.promise.d.ts",
    "lib.esnext.string.d.ts",
    "lib.esnext.weakref.d.ts",
  ]

  const targetToCut = ts.ScriptTarget[target]
  const matches = files.filter(f => f.startsWith(`lib.${targetToCut.toLowerCase()}`))
  const targetCutIndex = files.indexOf(matches.pop()!)

  const getMax = (array: number[]) =>
    array && array.length ? array.reduce((max, current) => (current > max ? current : max)) : undefined

  // Find the index for everything in
  const indexesForCutting = lib.map(lib => {
    const matches = files.filter(f => f.startsWith(`lib.${lib.toLowerCase()}`))
    if (matches.length === 0) return 0

    const cutIndex = files.indexOf(matches.pop()!)
    return cutIndex
  })

  const libCutIndex = getMax(indexesForCutting) || 0

  const finalCutIndex = Math.max(targetCutIndex, libCutIndex)
  return files.slice(0, finalCutIndex + 1)
}

/**
 * Sets up a Map with lib contents by grabbing the necessary files from
 * the local copy of typescript via the file system.
 */
export const createDefaultMapFromNodeModules = (compilerOptions: CompilerOptions, ts?: typeof import("typescript"), tsLibDirectory?: string) => {
  const tsModule = ts || require("typescript")
  const path = requirePath()
  const fs = requireFS()

  const getLib = (name: string) => {
    const lib = tsLibDirectory || path.dirname(require.resolve("typescript"))
    return fs.readFileSync(path.join(lib, name), "utf8")
  }

  const libs = knownLibFilesForCompilerOptions(compilerOptions, tsModule)
  const fsMap = new Map<string, string>()
  libs.forEach(lib => {
    fsMap.set("/" + lib, getLib(lib))
  })
  return fsMap
}

/**
 * Adds recursively files from the FS into the map based on the folder
 */
export const addAllFilesFromFolder = (map: Map<string, string>, workingDir: string): void => {
  const path = requirePath()
  const fs = requireFS()

  const walk = function (dir: string) {
    let results: string[] = []
    const list = fs.readdirSync(dir)
    list.forEach(function (file: string) {
      file = path.join(dir, file)
      const stat = fs.statSync(file)
      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */
        results = results.concat(walk(file))
      } else {
        /* Is a file */
        results.push(file)
      }
    })
    return results
  }

  const allFiles = walk(workingDir)

  allFiles.forEach(lib => {
    const fsPath = "/node_modules/@types" + lib.replace(workingDir, "")
    const content = fs.readFileSync(lib, "utf8")
    const validExtensions = [".ts", ".tsx"]

    if (validExtensions.includes(path.extname(fsPath))) {
      map.set(fsPath, content)
    }
  })
}

/** Adds all files from node_modules/@types into the FS Map */
export const addFilesForTypesIntoFolder = (map: Map<string, string>) =>
  addAllFilesFromFolder(map, "node_modules/@types")

/**
 * Create a virtual FS Map with the lib files from a particular TypeScript
 * version based on the target, Always includes dom ATM.
 *
 * @param options The compiler target, which dictates the libs to set up
 * @param version the versions of TypeScript which are supported
 * @param cache should the values be stored in local storage
 * @param ts a copy of the typescript import
 * @param lzstring an optional copy of the lz-string import
 * @param fetcher an optional replacement for the global fetch function (tests mainly)
 * @param storer an optional replacement for the localStorage global (tests mainly)
 */
export const createDefaultMapFromCDN = (
  options: CompilerOptions,
  version: string,
  cache: boolean,
  ts: TS,
  lzstring?: typeof import("lz-string"),
  fetcher?: typeof fetch,
  storer?: typeof localStorage
) => {
  const fetchlike = fetcher || fetch
  const fsMap = new Map<string, string>()
  const files = knownLibFilesForCompilerOptions(options, ts)
  const prefix = `https://typescript.azureedge.net/cdn/${version}/typescript/lib/`

  function zip(str: string) {
    return lzstring ? lzstring.compressToUTF16(str) : str
  }

  function unzip(str: string) {
    return lzstring ? lzstring.decompressFromUTF16(str) : str
  }

  // Map the known libs to a node fetch promise, then return the contents
  function uncached() {
    return Promise.all(files.map(lib => fetchlike(prefix + lib).then(resp => resp.text()))).then(contents => {
      contents.forEach((text, index) => fsMap.set("/" + files[index], text))
    })
  }

  // A localstorage and lzzip aware version of the lib files
  function cached() {
    const storelike = storer || localStorage

    const keys = Object.keys(storelike)
    keys.forEach(key => {
      // Remove anything which isn't from this version
      if (key.startsWith("ts-lib-") && !key.startsWith("ts-lib-" + version)) {
        storelike.removeItem(key)
      }
    })

    return Promise.all(
      files.map(lib => {
        const cacheKey = `ts-lib-${version}-${lib}`
        const content = storelike.getItem(cacheKey)

        if (!content) {
          // Make the API call and store the text concent in the cache
          return fetchlike(prefix + lib)
            .then(resp => resp.text())
            .then(t => {
              storelike.setItem(cacheKey, zip(t))
              return t
            })
        } else {
          return Promise.resolve(unzip(content))
        }
      })
    ).then(contents => {
      contents.forEach((text, index) => {
        const name = "/" + files[index]
        fsMap.set(name, text)
      })
    })
  }

  const func = cache ? cached : uncached
  return func().then(() => fsMap)
}

function notImplemented(methodName: string): any {
  throw new Error(`Method '${methodName}' is not implemented.`)
}

function audit<ArgsT extends any[], ReturnT>(
  name: string,
  fn: (...args: ArgsT) => ReturnT
): (...args: ArgsT) => ReturnT {
  return (...args) => {
    const res = fn(...args)

    const smallres = typeof res === "string" ? res.slice(0, 80) + "..." : res
    debugLog("> " + name, ...args)
    debugLog("< " + smallres)

    return res
  }
}

/** The default compiler options if TypeScript could ever change the compiler options */
const defaultCompilerOptions = (ts: typeof import("typescript")): CompilerOptions => {
  return {
    ...ts.getDefaultCompilerOptions(),
    jsx: ts.JsxEmit.React,
    strict: true,
    esModuleInterop: true,
    module: ts.ModuleKind.ESNext,
    suppressOutputPathCheck: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
  }
}

// "/DOM.d.ts" => "/lib.dom.d.ts"
const libize = (path: string) => path.replace("/", "/lib.").toLowerCase()

/**
 * Creates an in-memory System object which can be used in a TypeScript program, this
 * is what provides read/write aspects of the virtual fs
 */
export function createSystem(files: Map<string, string>): System {
  return {
    args: [],
    createDirectory: () => notImplemented("createDirectory"),
    // TODO: could make a real file tree
    directoryExists: audit("directoryExists", directory => {
      return Array.from(files.keys()).some(path => path.startsWith(directory))
    }),
    exit: () => notImplemented("exit"),
    fileExists: audit("fileExists", fileName => files.has(fileName) || files.has(libize(fileName))),
    getCurrentDirectory: () => "/",
    getDirectories: () => [],
    getExecutingFilePath: () => notImplemented("getExecutingFilePath"),
    readDirectory: audit("readDirectory", directory => (directory === "/" ? Array.from(files.keys()) : [])),
    readFile: audit("readFile", fileName => files.get(fileName) || files.get(libize(fileName))),
    resolvePath: path => path,
    newLine: "\n",
    useCaseSensitiveFileNames: true,
    write: () => notImplemented("write"),
    writeFile: (fileName, contents) => {
      files.set(fileName, contents)
    },
  }
}

/**
 * Creates a file-system backed System object which can be used in a TypeScript program, you provide
 * a set of virtual files which are prioritised over the FS versions, then a path to the root of your
 * project (basically the folder your node_modules lives)
 */
export function createFSBackedSystem(files: Map<string, string>, _projectRoot: string, ts: TS, tsLibDirectory?: string): System {
  // We need to make an isolated folder for the tsconfig, but also need to be able to resolve the
  // existing node_modules structures going back through the history
  const root = _projectRoot + "/vfs"
  const path = requirePath()

  // The default System in TypeScript
  const nodeSys = ts.sys
  const tsLib = tsLibDirectory ?? path.dirname(require.resolve("typescript"))

  return {
    // @ts-ignore
    name: "fs-vfs",
    root,
    args: [],
    createDirectory: () => notImplemented("createDirectory"),
    // TODO: could make a real file tree
    directoryExists: audit("directoryExists", directory => {
      return Array.from(files.keys()).some(path => path.startsWith(directory)) || nodeSys.directoryExists(directory)
    }),
    exit: nodeSys.exit,
    fileExists: audit("fileExists", fileName => {
      if (files.has(fileName)) return true
      // Don't let other tsconfigs end up touching the vfs
      if (fileName.includes("tsconfig.json") || fileName.includes("tsconfig.json")) return false
      if (fileName.startsWith("/lib")) {
        const tsLibName = `${tsLib}/${fileName.replace("/", "")}`
        return nodeSys.fileExists(tsLibName)
      }
      return nodeSys.fileExists(fileName)
    }),
    getCurrentDirectory: () => root,
    getDirectories: nodeSys.getDirectories,
    getExecutingFilePath: () => notImplemented("getExecutingFilePath"),
    readDirectory: audit("readDirectory", (...args) => {
      if (args[0] === "/") {
        return Array.from(files.keys())
      } else {
        return nodeSys.readDirectory(...args)
      }
    }),
    readFile: audit("readFile", fileName => {
      if (files.has(fileName)) return files.get(fileName)
      if (fileName.startsWith("/lib")) {
        const tsLibName = `${tsLib}/${fileName.replace("/", "")}`
        const result = nodeSys.readFile(tsLibName)
        if (!result) {
          const libs = nodeSys.readDirectory(tsLib)
          throw new Error(
            `TSVFS: A request was made for ${tsLibName} but there wasn't a file found in the file map. You likely have a mismatch in the compiler options for the CDN download vs the compiler program. Existing Libs: ${libs}.`
          )
        }
        return result
      }
      return nodeSys.readFile(fileName)
    }),
    resolvePath: path => {
      if (files.has(path)) return path
      return nodeSys.resolvePath(path)
    },
    newLine: "\n",
    useCaseSensitiveFileNames: true,
    write: () => notImplemented("write"),
    writeFile: (fileName, contents) => {
      files.set(fileName, contents)
    },
  }
}

/**
 * Creates an in-memory CompilerHost -which is essentially an extra wrapper to System
 * which works with TypeScript objects - returns both a compiler host, and a way to add new SourceFile
 * instances to the in-memory file system.
 */
export function createVirtualCompilerHost(sys: System, compilerOptions: CompilerOptions, ts: TS) {
  const sourceFiles = new Map<string, SourceFile>()
  const save = (sourceFile: SourceFile) => {
    sourceFiles.set(sourceFile.fileName, sourceFile)
    return sourceFile
  }

  type Return = {
    compilerHost: CompilerHost
    updateFile: (sourceFile: SourceFile) => boolean
  }

  const vHost: Return = {
    compilerHost: {
      ...sys,
      getCanonicalFileName: fileName => fileName,
      getDefaultLibFileName: () => "/" + ts.getDefaultLibFileName(compilerOptions), // '/lib.d.ts',
      // getDefaultLibLocation: () => '/',
      getDirectories: () => [],
      getNewLine: () => sys.newLine,
      getSourceFile: fileName => {
        return (
          sourceFiles.get(fileName) ||
          save(
            ts.createSourceFile(
              fileName,
              sys.readFile(fileName)!,
              compilerOptions.target || defaultCompilerOptions(ts).target!,
              false
            )
          )
        )
      },
      useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames,
    },
    updateFile: sourceFile => {
      const alreadyExists = sourceFiles.has(sourceFile.fileName)
      sys.writeFile(sourceFile.fileName, sourceFile.text)
      sourceFiles.set(sourceFile.fileName, sourceFile)
      return alreadyExists
    },
  }
  return vHost
}

/**
 * Creates an object which can host a language service against the virtual file-system
 */
export function createVirtualLanguageServiceHost(
  sys: System,
  rootFiles: string[],
  compilerOptions: CompilerOptions,
  ts: TS,
  customTransformers?: CustomTransformers
) {
  const fileNames = [...rootFiles]
  const { compilerHost, updateFile } = createVirtualCompilerHost(sys, compilerOptions, ts)
  const fileVersions = new Map<string, string>()
  let projectVersion = 0
  const languageServiceHost: LanguageServiceHost = {
    ...compilerHost,
    getProjectVersion: () => projectVersion.toString(),
    getCompilationSettings: () => compilerOptions,
    getCustomTransformers: () => customTransformers,
    // A couple weeks of 4.8 TypeScript nightlies had a bug where the Program's
    // list of files was just a reference to the array returned by this host method,
    // which means mutations by the host that ought to result in a new Program being
    // created were not detected, since the old list of files and the new list of files
    // were in fact a reference to the same underlying array. That was fixed in
    // https://github.com/microsoft/TypeScript/pull/49813, but since the twoslash runner
    // is used in bisecting for changes, it needs to guard against being busted in that
    // couple-week period, so we defensively make a slice here.
    getScriptFileNames: () => fileNames.slice(),
    getScriptSnapshot: fileName => {
      const contents = sys.readFile(fileName)
      if (contents) {
        return ts.ScriptSnapshot.fromString(contents)
      }
      return
    },
    getScriptVersion: fileName => {
      return fileVersions.get(fileName) || "0"
    },
    writeFile: sys.writeFile,
  }

  type Return = {
    languageServiceHost: LanguageServiceHost
    updateFile: (sourceFile: import("typescript").SourceFile) => void
  }

  const lsHost: Return = {
    languageServiceHost,
    updateFile: sourceFile => {
      projectVersion++
      fileVersions.set(sourceFile.fileName, projectVersion.toString())
      if (!fileNames.includes(sourceFile.fileName)) {
        fileNames.push(sourceFile.fileName)
      }
      updateFile(sourceFile)
    },
  }
  return lsHost
}

const requirePath = () => {
  return require(String.fromCharCode(112, 97, 116, 104)) as typeof import("path")
}

const requireFS = () => {
  return require(String.fromCharCode(102, 115)) as typeof import("fs")
}
