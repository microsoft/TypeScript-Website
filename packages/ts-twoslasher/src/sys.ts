const AUDIT = false

type System = import('typescript').System
type CompilerOptions = import('typescript').CompilerOptions
type LanguageServiceHost = import('typescript').LanguageServiceHost
type CompilerHost = import('typescript').CompilerHost
type SourceFile = import('typescript').SourceFile
type TS = typeof import('typescript')

function notImplemented(methodName: string): any {
  throw new Error(`Method '${methodName}' is not implemented.`)
}

function audit<ArgsT extends any[], ReturnT>(
  name: string,
  fn: (...args: ArgsT) => ReturnT
): (...args: ArgsT) => ReturnT {
  return (...args) => {
    if (AUDIT) {
      // tslint:disable-next-line:no-console
      console.log(name, ...args)
    }
    return fn(...args)
  }
}

const defaultCompilerOptions = (ts: typeof import('typescript')) => {
  return {
    ...ts.getDefaultCompilerOptions(),
    jsx: ts.JsxEmit.React,
    strict: true,
    target: ts.ScriptTarget.ES2015,
    esModuleInterop: true,
    module: ts.ModuleKind.ESNext,
    suppressOutputPathCheck: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
  }
}

export function createSystem(files: Map<string, string>): System {
  files = new Map(files)
  return {
    args: [],
    createDirectory: () => notImplemented('createDirectory'),
    // TODO: could make a real file tree
    directoryExists: audit('directoryExists', directory => {
      return Array.from(files.keys()).some(path => path.startsWith(directory))
    }),
    exit: () => notImplemented('exit'),
    fileExists: audit('fileExists', fileName => files.has(fileName)),
    getCurrentDirectory: () => '/',
    getDirectories: () => [],
    getExecutingFilePath: () => notImplemented('getExecutingFilePath'),
    readDirectory: audit('readDirectory', directory => (directory === '/' ? Array.from(files.keys()) : [])),
    readFile: audit('readFile', fileName => files.get(fileName)),
    resolvePath: path => path,
    newLine: '\n',
    useCaseSensitiveFileNames: true,
    write: () => notImplemented('write'),
    writeFile: (fileName, contents) => {
      files.set(fileName, contents)
    },
  }
}

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
      getDefaultLibFileName: () => '/lib.es2015.d.ts',
      getDirectories: () => [],
      getNewLine: () => sys.newLine,
      getSourceFile: fileName => {
        return (
          sourceFiles.get(fileName) ||
          save(
            ts.createSourceFile(
              fileName,
              sys.readFile(fileName)!,
              compilerOptions.target || defaultCompilerOptions(ts).target,
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

export function createVirtualLanguageServiceHost(
  sys: System,
  rootFiles: string[],
  compilerOptions: CompilerOptions,
  ts: TS
) {
  const fileNames = [...rootFiles]
  const { compilerHost, updateFile } = createVirtualCompilerHost(sys, compilerOptions, ts)
  const fileVersions = new Map<string, string>()
  let projectVersion = 0
  const languageServiceHost: LanguageServiceHost = {
    ...compilerHost,
    getProjectVersion: () => projectVersion.toString(),
    getCompilationSettings: () => compilerOptions,
    getScriptFileNames: () => fileNames,
    getScriptSnapshot: fileName => {
      const contents = sys.readFile(fileName)
      if (contents) {
        return ts.ScriptSnapshot.fromString(contents)
      }
      return
    },
    getScriptVersion: fileName => {
      return fileVersions.get(fileName) || '0'
    },
    writeFile: sys.writeFile,
  }

  type Return = {
    languageServiceHost: LanguageServiceHost
    updateFile: (sourceFile: import('typescript').SourceFile) => void
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

export interface VirtualTypeScriptEnvironment {
  sys: System
  languageService: import('typescript').LanguageService
  createFile: (fileName: string, content: string) => void
  updateFile: (fileName: string, content: string, replaceTextSpan: import('typescript').TextSpan) => void
}

export function createVirtualTypeScriptEnvironment(
  sys: System,
  rootFiles: string[],
  ts: TS,
  compilerOptions: CompilerOptions = {}
): VirtualTypeScriptEnvironment {
  const mergedCompilerOptions = { ...defaultCompilerOptions(ts), ...compilerOptions }
  // prettier-ignore
  const { languageServiceHost, updateFile } = createVirtualLanguageServiceHost(sys, rootFiles, mergedCompilerOptions, ts)

  const languageService = ts.createLanguageService(languageServiceHost)
  const diagnostics = languageService.getCompilerOptionsDiagnostics()
  if (diagnostics.length) {
    throw new Error(
      ts.formatDiagnostics(diagnostics, {
        getCurrentDirectory: sys.getCurrentDirectory,
        getNewLine: () => sys.newLine,
        getCanonicalFileName: fileName => fileName,
      })
    )
  }

  return {
    sys,
    languageService,
    createFile: (fileName, content) => {
      updateFile(ts.createSourceFile(fileName, content, mergedCompilerOptions.target, false))
    },
    updateFile: (fileName, content, prevTextSpan) => {
      const prevSourceFile = languageService.getProgram()!.getSourceFile(fileName)!
      const prevFullContents = prevSourceFile.text
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
